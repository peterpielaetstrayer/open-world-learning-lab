begin;
set local lock_timeout = '3s';
set local statement_timeout = '15s';

create temporary table expected_launch_activities (slug text primary key) on commit drop;
insert into expected_launch_activities values
  ('module-one-introduction'), ('entry-diagnostic'), ('project-direction-lesson'),
  ('gauntlet-practice'), ('direction-comparison'), ('project-direction-brief'),
  ('module-one-conclusion'), ('module-two-introduction'), ('first-step-mini-lesson'),
  ('maya-garden-model'), ('first-step-checks'), ('first-move-studio'),
  ('first-move-card'), ('first-move-revision'), ('first-move-evidence'),
  ('launch-portfolio'), ('module-two-conclusion'), ('your-next-move-reflection');

do $inventory$
declare
  target_course uuid;
  test_learner uuid;
begin
  select id into strict target_course from public.pll_courses where slug = 'project-launch-lab';
  select user_id into strict test_learner from public.pll_memberships
  where course_id = target_course and member_role = 'learner' order by enrolled_at limit 1;
  if (select count(*) from public.pll_activities where course_id = target_course) <> 18
    or (select count(*) from public.pll_activities where course_id = target_course and is_published) <> 4
    or (select count(*) from public.pll_activities
        where course_id = target_course and slug in (select slug from expected_launch_activities)) <> 18
    or (select count(*) from public.pll_modules where course_id = target_course and is_published) <> 2 then
    raise exception 'Unexpected course inventory or publication status.';
  end if;

  update public.pll_activities a
  set is_published = true
  where a.course_id = target_course and not a.is_published
    and a.slug in (select slug from expected_launch_activities);

  perform set_config('request.jwt.claims',
    jsonb_build_object('sub', test_learner, 'role', 'authenticated')::text, true);
  perform set_config('request.jwt.claim.sub', test_learner::text, true);
  perform set_config('pll.qa_course', target_course::text, true);
end
$inventory$;

set local role authenticated;
do $visibility$
declare
  target_course uuid := current_setting('pll.qa_course')::uuid;
begin
  if (select count(*) from public.pll_activities where course_id = target_course) <> 18 then
    raise exception 'Rehearsal learner could not see the complete published sequence.';
  end if;
  if (select count(*) from public.pll_activities a
      join public.pll_rubric_criteria r on r.activity_id = a.id
      where a.course_id = target_course and a.slug = 'launch-portfolio' and r.maximum_points = 15) <> 4 then
    raise exception 'Rehearsal learner could not read the four academic criterion records.';
  end if;
  if not exists (select 1 from public.pll_activities
      where course_id = target_course and slug = 'your-next-move-reflection'
        and instructions like '%[[level-two-exit-check]]%') then
    raise exception 'Rehearsal learner could not read the Level 2 exit activity.';
  end if;
end
$visibility$;
rollback;
