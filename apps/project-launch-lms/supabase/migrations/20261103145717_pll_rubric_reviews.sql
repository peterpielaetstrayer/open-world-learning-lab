-- Project Launch Lab: rubric criterion grades + atomic facilitator review publishing
-- Complements existing RLS-protected course and submission tables.
alter table public.pll_submissions
  add constraint pll_submissions_id_course_activity_uniq unique (id, course_id, activity_id);
alter table public.pll_rubric_criteria
  add constraint pll_rubric_id_course_activity_uniq unique (id, course_id, activity_id);

create table public.pll_rubric_scores (
 id uuid primary key default gen_random_uuid(),
 submission_id uuid not null,
 course_id uuid not null,
 activity_id uuid not null,
 criterion_id uuid not null,
 evaluator_id uuid not null references auth.users(id),
 awarded_points numeric(7,2) not null check (awarded_points >= 0),
 criterion_note text not null default '' check (length(criterion_note) <= 4000),
 updated_at timestamptz not null default now(),
 foreign key (submission_id, course_id, activity_id)
   references public.pll_submissions(id, course_id, activity_id) on delete cascade,
 foreign key (criterion_id, course_id, activity_id)
   references public.pll_rubric_criteria(id, course_id, activity_id),
 unique (submission_id, criterion_id)
);
create index pll_scores_by_submission on public.pll_rubric_scores(submission_id, course_id, activity_id);
create index pll_scores_by_criterion on public.pll_rubric_scores(criterion_id, course_id, activity_id);
create index pll_scores_by_evaluator on public.pll_rubric_scores(evaluator_id);
alter table public.pll_rubric_scores enable row level security;
revoke all on public.pll_rubric_scores from public, anon, authenticated;
grant select on public.pll_rubric_scores to authenticated;
grant insert (submission_id,course_id,activity_id,criterion_id,evaluator_id,awarded_points,criterion_note)
  on public.pll_rubric_scores to authenticated;
grant update (awarded_points,criterion_note,updated_at) on public.pll_rubric_scores to authenticated;

create policy "pll_score_read_authorized" on public.pll_rubric_scores
for select to authenticated
using (
 private.pll_has_role(course_id,'facilitator')
 or (
   private.pll_has_role(course_id,'learner')
   and exists (
     select 1 from public.pll_submissions s
     join public.pll_feedback f on f.submission_id = s.id
     where s.id = pll_rubric_scores.submission_id
       and s.course_id = pll_rubric_scores.course_id
       and s.learner_id = (select auth.uid())
       and f.published_at is not null
   )
 )
);
create policy "pll_score_insert_facilitator" on public.pll_rubric_scores
for insert to authenticated
with check (
 evaluator_id = (select auth.uid())
 and private.pll_has_role(course_id,'facilitator')
 and exists (
   select 1 from public.pll_rubric_criteria r
   where r.id=criterion_id and r.course_id=pll_rubric_scores.course_id
     and r.activity_id=pll_rubric_scores.activity_id
     and awarded_points <= r.maximum_points
 )
);
create policy "pll_score_update_facilitator" on public.pll_rubric_scores
for update to authenticated
using (evaluator_id=(select auth.uid()) and private.pll_has_role(course_id,'facilitator'))
with check (
 evaluator_id=(select auth.uid())
 and private.pll_has_role(course_id,'facilitator')
 and exists (
   select 1 from public.pll_rubric_criteria r
   where r.id=criterion_id and r.course_id=pll_rubric_scores.course_id
     and r.activity_id=pll_rubric_scores.activity_id
     and awarded_points <= r.maximum_points
 )
);

-- An explicit final-publication constraint, including attempts to bypass the UI.
-- Invoker obeys RLS, so facilitator must be authorized to see the full rubric.
create function private.pll_check_complete_feedback()
returns trigger language plpgsql security invoker set search_path=''
as $$
declare v_activity uuid; v_expected integer; v_scored integer;
begin
 if new.published_at is null then return new; end if;
 select s.activity_id into v_activity from public.pll_submissions s
 where s.id=new.submission_id and s.course_id=new.course_id;
 if v_activity is null then raise exception 'Submission not found'; end if;

 select count(*) into v_expected from public.pll_rubric_criteria r where r.activity_id=v_activity;
 select count(*) into v_scored from public.pll_rubric_scores sc
 where sc.submission_id=new.submission_id and sc.activity_id=v_activity;
 if v_expected=0 or v_scored<>v_expected then
  raise exception 'Cannot publish feedback without all rubric criteria scored';
 end if;
 return new;
end;
$$;
revoke all on function private.pll_check_complete_feedback() from public, anon, authenticated;
create trigger pll_feedback_complete_before_publish
before insert or update of published_at on public.pll_feedback
for each row execute function private.pll_check_complete_feedback();

-- Atomic single-request write. SECURITY INVOKER keeps regular grants/RLS in force.
create function public.pll_publish_review(
 p_submission_id uuid, p_summary text, p_scores jsonb
) returns uuid
language plpgsql security invoker set search_path=''
as $$
declare
 v_course uuid; v_activity uuid; v_user uuid;
 v_expected integer; v_provided integer; v_distinct integer;
 v_score record; v_feedback_id uuid;
begin
 v_user := auth.uid();
 select s.course_id,s.activity_id into v_course,v_activity
 from public.pll_submissions s where s.id=p_submission_id;
 if v_user is null or v_course is null
   or not private.pll_has_role(v_course,'facilitator') then
   raise exception 'Not authorized to review this submission' using errcode='42501';
 end if;
 if p_summary is null or length(trim(p_summary))<1 or length(p_summary)>12000 then
   raise exception 'Provide concise written feedback (1–12000 characters)';
 end if;
 if p_scores is null or jsonb_typeof(p_scores)<>'array' then
   raise exception 'Scores must be an array of criterion grades';
 end if;
 select count(*) into v_expected from public.pll_rubric_criteria r where r.activity_id=v_activity;
 select count(*),count(distinct x.criterion_id)
   into v_provided,v_distinct
 from jsonb_to_recordset(p_scores) as x(criterion_id uuid, points numeric, note text);
 if v_expected=0 or v_provided<>v_expected or v_distinct<>v_expected then
   raise exception 'Provide exactly one score for each rubric criterion';
 end if;
 if exists (
  select 1
  from jsonb_to_recordset(p_scores) as x(criterion_id uuid, points numeric, note text)
  left join public.pll_rubric_criteria r
    on r.id=x.criterion_id and r.activity_id=v_activity and r.course_id=v_course
  where r.id is null or x.points is null or x.points<0 or x.points>r.maximum_points
    or length(coalesce(x.note,''))>4000
 ) then
   raise exception 'Invalid rubric criterion or score';
 end if;

 for v_score in
   select x.criterion_id,x.points,x.note
   from jsonb_to_recordset(p_scores) as x(criterion_id uuid, points numeric, note text)
 loop
   insert into public.pll_rubric_scores(
     submission_id,course_id,activity_id,criterion_id,evaluator_id,
     awarded_points,criterion_note
   ) values(
     p_submission_id,v_course,v_activity,v_score.criterion_id,v_user,
     v_score.points,coalesce(v_score.note,'')
   )
   on conflict (submission_id,criterion_id) do update set
      awarded_points=excluded.awarded_points,
      criterion_note=excluded.criterion_note,
      updated_at=now();
 end loop;
 insert into public.pll_feedback(submission_id,course_id,evaluator_id,summary,published_at)
 values(p_submission_id,v_course,v_user,p_summary,now())
 on conflict (submission_id) do update set
    summary=excluded.summary,
    published_at=now(),
    updated_at=now()
 returning id into v_feedback_id;
 return v_feedback_id;
end;
$$;
revoke all on function public.pll_publish_review(uuid,text,jsonb) from public, anon;
grant execute on function public.pll_publish_review(uuid,text,jsonb) to authenticated;

-- Demonstration rubrics are DRAFT. No module or assignment has been published.
insert into public.pll_rubric_criteria(activity_id,course_id,position,title,description,maximum_points)
select a.id,a.course_id,r.position,r.title,r.description,r.maximum_points
from public.pll_activities a
join (
 values
 ('project-direction-brief',1,'Personal relevance','Explains why the chosen idea matters to the learner.',10::numeric),
 ('project-direction-brief',2,'Feasibility','Considers realistic time, resources, constraints and support.',10::numeric),
 ('project-direction-brief',3,'Scope and reasoning','Justifies an actionable, focused project direction.',10::numeric),
 ('launch-portfolio',1,'Feasible plan','Presents coherent steps, resources and constraints.',10::numeric),
 ('launch-portfolio',2,'First-action evidence','Documents a safe bounded attempt or a genuine obstacle and observed evidence.',10::numeric),
 ('launch-portfolio',3,'Evidence-informed next step','Explains how feedback and experience shape the next decision.',10::numeric)
) as r(slug,position,title,description,maximum_points)
on a.slug=r.slug;
