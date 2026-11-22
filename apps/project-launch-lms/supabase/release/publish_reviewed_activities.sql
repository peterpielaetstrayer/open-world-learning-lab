-- Manual release: run only after acceptance and explicit publication approval.
-- This intentionally leaves all Portfolio submission/scoring policies intact.
begin;
set local lock_timeout = '3s';
lock table public.pll_activities in share row exclusive mode;
do $publication$
declare
  target_course uuid;
  expected_drafts text[] := array[
    'module-one-introduction','entry-diagnostic','project-direction-lesson',
    'direction-comparison','module-one-conclusion','module-two-introduction',
    'first-step-mini-lesson','maya-garden-model','first-step-checks','first-move-card',
    'first-move-revision','first-move-evidence','module-two-conclusion','your-next-move-reflection'
  ];
  changed integer;
begin
  select id into strict target_course from public.pll_courses where slug='project-launch-lab';
  if (select count(*) from public.pll_modules where course_id=target_course and is_published) <> 2
    or (select count(*) from public.pll_activities where course_id=target_course and is_published) <> 4
    or (select count(*) from public.pll_activities where course_id=target_course and not is_published) <> 14
    or (select count(*) from pg_catalog.pg_policy where polname in (
      'pll_launch_portfolio_submission_hold','pll_launch_portfolio_score_insert_hold','pll_launch_portfolio_score_update_hold')) <> 3
  then
    raise exception 'Publication inventory or Portfolio holds changed. Reverify before release.';
  end if;
  update public.pll_activities set is_published=true
  where course_id=target_course and not is_published and slug=any(expected_drafts);
  get diagnostics changed=row_count;
  if changed<>cardinality(expected_drafts) then raise exception 'Expected drafts changed. No publication was committed.'; end if;
end
$publication$;
commit;
