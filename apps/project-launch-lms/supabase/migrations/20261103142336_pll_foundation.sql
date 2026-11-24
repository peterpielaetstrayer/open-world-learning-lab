-- Project Launch Lab | migration 1 | foundational learning records and RLS
-- Project: wjormscrikzocelbjxvc (dedicated OWLL Supabase project)
-- No auth accounts, file buckets or public reviewer access created here.
-- All public tables RLS protected and no anonymous grants.
create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create type public.pll_member_role as enum ('learner', 'facilitator');

create table public.pll_courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  title text not null check (length(title) between 3 and 180),
  description text not null default '',
  created_at timestamptz not null default now()
);

create table public.pll_memberships (
  course_id uuid not null references public.pll_courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role public.pll_member_role not null,
  enrolled_at timestamptz not null default now(),
  primary key (course_id, user_id)
);
create index pll_memberships_by_user on public.pll_memberships(user_id);

-- Private, non-Data-API privilege check. Explicitly verifies an authenticated identity.
-- Avoids recursive membership policies. Do not move into public or change its search_path.
create function private.pll_is_member(p_course_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select (select auth.uid()) is not null
     and exists (
       select 1 from public.pll_memberships as m
       where m.course_id = p_course_id and m.user_id = (select auth.uid())
     );
$$;
create function private.pll_has_role(p_course_id uuid, p_role public.pll_member_role)
returns boolean language sql stable security definer set search_path = ''
as $$
  select (select auth.uid()) is not null
     and exists (
       select 1 from public.pll_memberships as m
       where m.course_id = p_course_id
         and m.user_id = (select auth.uid())
         and m.member_role = p_role
     );
$$;
revoke all on function private.pll_is_member(uuid) from public, anon;
revoke all on function private.pll_has_role(uuid, public.pll_member_role) from public, anon;
grant execute on function private.pll_is_member(uuid) to authenticated;
grant execute on function private.pll_has_role(uuid, public.pll_member_role) to authenticated;

create table public.pll_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.pll_courses(id) on delete cascade,
  module_number smallint not null check (module_number between 1 and 20),
  title text not null,
  is_published boolean not null default false,
  unique(course_id, module_number),
  unique(id, course_id)
);
create table public.pll_activities (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null,
  module_id uuid not null,
  slug text not null check (slug ~ '^[a-z0-9-]{3,80}$'),
  title text not null,
  instructions text not null default '',
  due_at timestamptz,
  is_published boolean not null default false,
  foreign key (module_id, course_id) references public.pll_modules(id, course_id) on delete cascade,
  unique(course_id, slug),
  unique(id, course_id)
);
create table public.pll_rubric_criteria (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null,
  course_id uuid not null,
  position smallint not null check (position >= 1),
  title text not null,
  description text not null default '',
  maximum_points numeric(7,2) not null check (maximum_points > 0),
  foreign key (activity_id, course_id) references public.pll_activities(id, course_id) on delete cascade,
  unique(activity_id, position)
);

create table public.pll_drafts (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null,
  course_id uuid not null,
  learner_id uuid not null references auth.users(id) on delete cascade,
  response_text text not null default '' check (length(response_text) <= 20000),
  updated_at timestamptz not null default now(),
  foreign key (activity_id, course_id) references public.pll_activities(id, course_id) on delete cascade,
  unique(activity_id, learner_id)
);
create index pll_drafts_by_learner on public.pll_drafts(learner_id);

create table public.pll_submissions (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null,
  course_id uuid not null,
  learner_id uuid not null references auth.users(id) on delete cascade,
  response_text text not null check (length(trim(response_text)) between 1 and 20000),
  submitted_at timestamptz not null default now(),
  foreign key (activity_id, course_id) references public.pll_activities(id, course_id) on delete cascade,
  unique(activity_id, learner_id),
  unique(id, course_id)
);
create index pll_submissions_by_course on public.pll_submissions(course_id, submitted_at desc);
create index pll_submissions_by_learner on public.pll_submissions(learner_id);

create table public.pll_feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null,
  course_id uuid not null,
  evaluator_id uuid not null references auth.users(id),
  summary text not null check (length(trim(summary)) between 1 and 12000),
  percentage_score numeric(5,2) check (percentage_score between 0 and 100),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  foreign key (submission_id, course_id) references public.pll_submissions(id, course_id) on delete cascade,
  unique(submission_id)
);

-- Every exposed table explicitly enables row-level security.
alter table public.pll_courses enable row level security;
alter table public.pll_memberships enable row level security;
alter table public.pll_modules enable row level security;
alter table public.pll_activities enable row level security;
alter table public.pll_rubric_criteria enable row level security;
alter table public.pll_drafts enable row level security;
alter table public.pll_submissions enable row level security;
alter table public.pll_feedback enable row level security;

-- By default, SQL-created objects may inherit PUBLIC grants. Remove before scoped grants.
revoke all on public.pll_courses, public.pll_memberships, public.pll_modules,
  public.pll_activities, public.pll_rubric_criteria, public.pll_drafts,
  public.pll_submissions, public.pll_feedback from public, anon, authenticated;

-- Anonymous visitors see no learner or course data.
grant select on public.pll_courses, public.pll_memberships, public.pll_modules,
  public.pll_activities, public.pll_rubric_criteria, public.pll_drafts,
  public.pll_submissions, public.pll_feedback to authenticated;
grant insert (activity_id, course_id, learner_id, response_text) on public.pll_drafts to authenticated;
grant update (response_text, updated_at) on public.pll_drafts to authenticated;
grant insert (activity_id, course_id, learner_id, response_text) on public.pll_submissions to authenticated;
grant insert (submission_id, course_id, evaluator_id, summary, percentage_score, published_at)
  on public.pll_feedback to authenticated;
grant update (summary, percentage_score, published_at, updated_at)
  on public.pll_feedback to authenticated;

create policy "pll_course_member_read" on public.pll_courses for select to authenticated
  using (private.pll_is_member(id));
create policy "pll_membership_self_read" on public.pll_memberships for select to authenticated
  using (user_id = (select auth.uid()));
create policy "pll_module_member_read" on public.pll_modules for select to authenticated
  using (private.pll_has_role(course_id, 'facilitator') or
    (is_published and private.pll_has_role(course_id, 'learner')));
create policy "pll_activity_member_read" on public.pll_activities for select to authenticated
  using (private.pll_has_role(course_id, 'facilitator') or
    (is_published and private.pll_has_role(course_id, 'learner')));
create policy "pll_rubric_read" on public.pll_rubric_criteria for select to authenticated
  using (exists(select 1 from public.pll_activities a
       where a.id = activity_id and a.course_id = pll_rubric_criteria.course_id));

create policy "pll_draft_owner_read" on public.pll_drafts for select to authenticated
  using (learner_id = (select auth.uid()) and private.pll_has_role(course_id, 'learner'));
create policy "pll_draft_owner_insert" on public.pll_drafts for insert to authenticated
  with check (learner_id = (select auth.uid()) and private.pll_has_role(course_id, 'learner') and
   exists(select 1 from public.pll_activities a
     where a.id = activity_id and a.course_id = pll_drafts.course_id and a.is_published));
create policy "pll_draft_owner_update" on public.pll_drafts for update to authenticated
  using (learner_id = (select auth.uid()) and private.pll_has_role(course_id, 'learner'))
  with check (learner_id = (select auth.uid()) and private.pll_has_role(course_id, 'learner'));

create policy "pll_submission_member_read" on public.pll_submissions for select to authenticated
  using ((learner_id = (select auth.uid()) and private.pll_has_role(course_id, 'learner'))
        or private.pll_has_role(course_id, 'facilitator'));
create policy "pll_submission_learner_insert" on public.pll_submissions for insert to authenticated
  with check (learner_id = (select auth.uid()) and private.pll_has_role(course_id, 'learner') and
   exists (select 1 from public.pll_activities a where a.id = activity_id
     and a.course_id = pll_submissions.course_id and a.is_published));
-- Final submissions are immutable: no UPDATE or DELETE grants/policies for learners.

create policy "pll_feedback_read" on public.pll_feedback for select to authenticated
  using (private.pll_has_role(course_id, 'facilitator') or
    (published_at is not null and exists (
     select 1 from public.pll_submissions s
     where s.id = submission_id and s.course_id = pll_feedback.course_id
       and s.learner_id = (select auth.uid()))));
create policy "pll_feedback_facilitator_insert" on public.pll_feedback for insert to authenticated
  with check (evaluator_id = (select auth.uid()) and
    private.pll_has_role(course_id, 'facilitator'));
create policy "pll_feedback_facilitator_update" on public.pll_feedback for update to authenticated
  using (evaluator_id = (select auth.uid()) and private.pll_has_role(course_id, 'facilitator'))
  with check (evaluator_id = (select auth.uid()) and private.pll_has_role(course_id, 'facilitator'));

-- The course outline is seeded in draft/unpublished state. No learner identities or user data.
insert into public.pll_courses(slug,title,description)
values ('project-launch-lab','Project Launch Lab: From Curiosity to Action',
        'A two-module introductory learning experience in the proposed Open World Studio Pathway.');
insert into public.pll_modules(course_id,module_number,title,is_published)
select c.id, m.module_number, m.title, false
from public.pll_courses c
cross join (values (1,'Discover & Define'),(2,'Plan & Launch')) as m(module_number,title)
where c.slug='project-launch-lab';
insert into public.pll_activities(course_id,module_id,slug,title,instructions,is_published)
select c.id,m.id,v.slug,v.title,'Draft instructions pending Capstone alignment and rubric.',false
from public.pll_courses c
join public.pll_modules m on m.course_id=c.id
join (values (1,'project-direction-brief','Project Direction Brief'),
             (2,'launch-portfolio','Launch Portfolio')) as v(module_number,slug,title)
  on v.module_number=m.module_number
where c.slug='project-launch-lab';
