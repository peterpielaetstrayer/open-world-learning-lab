-- Private work-in-progress for non-graded interactive lessons. Kept separate
-- from final submissions and rubric reviews; never visible to facilitators.
create table public.pll_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null,
  activity_id uuid not null,
  learner_id uuid not null references auth.users(id) on delete cascade,
  lesson_key text not null check (lesson_key ~ '^[a-z0-9-]{3,80}$'),
  state jsonb not null check (jsonb_typeof(state) = 'object' and octet_length(state::text) <= 50000),
  updated_at timestamptz not null default now(),
  foreign key (activity_id,course_id) references public.pll_activities(id,course_id) on delete cascade,
  unique (course_id,activity_id,learner_id,lesson_key)
);
create index pll_lesson_progress_by_learner on public.pll_lesson_progress(learner_id,updated_at desc);

alter table public.pll_lesson_progress enable row level security;
revoke all on public.pll_lesson_progress from public,anon,authenticated;
grant select on public.pll_lesson_progress to authenticated;
grant insert (course_id,activity_id,learner_id,lesson_key,state) on public.pll_lesson_progress to authenticated;
grant update (state,updated_at) on public.pll_lesson_progress to authenticated;

create policy "pll_lesson_progress_owner_read" on public.pll_lesson_progress
  for select to authenticated
  using (learner_id = (select auth.uid()) and private.pll_has_role(course_id,'learner'));
create policy "pll_lesson_progress_owner_insert" on public.pll_lesson_progress
  for insert to authenticated
  with check (
    learner_id = (select auth.uid()) and private.pll_has_role(course_id,'learner')
    and exists(select 1 from public.pll_activities a
      join public.pll_modules m on m.id=a.module_id and m.course_id=a.course_id
      where a.id=activity_id and a.course_id=pll_lesson_progress.course_id
        and a.is_published and m.is_published)
  );
create policy "pll_lesson_progress_owner_update" on public.pll_lesson_progress
  for update to authenticated
  using (learner_id = (select auth.uid()) and private.pll_has_role(course_id,'learner'))
  with check (learner_id = (select auth.uid()) and private.pll_has_role(course_id,'learner'));
