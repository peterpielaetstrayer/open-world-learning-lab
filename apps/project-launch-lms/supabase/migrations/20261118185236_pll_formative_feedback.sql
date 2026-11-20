-- Extend the existing feedback publication gate to allow genuine ungraded,
-- score-free formative reviews. Graded submissions still require every rubric score.
create or replace function private.pll_check_complete_feedback()
returns trigger language plpgsql security invoker set search_path=''
as $$
declare
  v_activity uuid;
  v_expected integer;
  v_scored integer;
begin
  if new.published_at is null then return new; end if;
  select s.activity_id into v_activity
    from public.pll_submissions s
    where s.id=new.submission_id and s.course_id=new.course_id;
  if v_activity is null then raise exception 'Submission not found'; end if;

  select count(*) into v_expected from public.pll_rubric_criteria r where r.activity_id=v_activity;
  select count(*) into v_scored from public.pll_rubric_scores sc
    where sc.submission_id=new.submission_id and sc.activity_id=v_activity;

  if v_expected=0 then
    if v_scored<>0 or new.percentage_score is not null then
      raise exception 'Ungraded feedback cannot publish scores';
    end if;
  elsif v_scored<>v_expected then
    raise exception 'Cannot publish feedback without all rubric criteria scored';
  end if;
  return new;
end;
$$;

-- A separate invoker-rights RPC for feedback without grades. It cannot be used
-- for rubric-scored assignments or to review a learner in another course.
create function public.pll_publish_formative_feedback(
  p_submission_id uuid,
  p_summary text
) returns uuid
language plpgsql security invoker set search_path=''
as $$
declare
  v_course uuid;
  v_activity uuid;
  v_user uuid;
  v_feedback_id uuid;
begin
  v_user := auth.uid();
  select s.course_id,s.activity_id into v_course,v_activity
    from public.pll_submissions s where s.id=p_submission_id;
  if v_user is null or v_course is null
    or not private.pll_has_role(v_course,'facilitator') then
    raise exception 'Not authorized to review this submission' using errcode='42501';
  end if;
  if p_summary is null or length(trim(p_summary))<1 or length(p_summary)>12000 then
    raise exception 'Provide written feedback (1-12000 characters)';
  end if;
  if exists (select 1 from public.pll_rubric_criteria r where r.activity_id=v_activity)
    or exists (select 1 from public.pll_rubric_scores sc where sc.submission_id=p_submission_id) then
    raise exception 'A scored assignment requires a complete rubric review';
  end if;

  insert into public.pll_feedback(
    submission_id,course_id,evaluator_id,summary,percentage_score,published_at
  ) values(p_submission_id,v_course,v_user,p_summary,null,now())
  on conflict (submission_id) do update set
    summary=excluded.summary,percentage_score=null,published_at=now(),updated_at=now()
  returning id into v_feedback_id;
  return v_feedback_id;
end;
$$;
revoke all on function public.pll_publish_formative_feedback(uuid,text) from public,anon;
grant execute on function public.pll_publish_formative_feedback(uuid,text) to authenticated;
