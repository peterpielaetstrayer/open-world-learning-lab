-- Manual release: obtain explicit Portfolio approval after authenticated acceptance.
-- This project orders the publication and Portfolio decisions independently.
begin;
set local lock_timeout = '3s';
lock table public.pll_rubric_criteria, public.pll_activities in share row exclusive mode;
do $grading$
declare target_course uuid;
begin
  select id into strict target_course from public.pll_courses where slug='project-launch-lab';
  if (select count(*) from public.pll_activities where slug='launch-portfolio')<>1
    or (select count(*) from public.pll_activities where course_id=target_course and is_published)<>18
    or not exists (
      select 1 from public.pll_activities a
      join public.pll_rubric_criteria c on c.activity_id=a.id and c.course_id=a.course_id
      where a.course_id=target_course and a.slug='launch-portfolio' and a.is_published
      group by a.id having count(*)=4 and bool_and(c.maximum_points=15)
        and array_agg(c.title::text order by c.position)=array[
          'Purpose and planning coherence','Resources, constraints, and feasibility',
          'First action and evidence interpretation','Feedback, revision, and next decision'
        ]::text[]
    )
    or not exists (
      select 1 from pg_catalog.pg_trigger
      where tgrelid='public.pll_rubric_scores'::pg_catalog.regclass
        and tgname='pll_portfolio_score_band' and tgenabled='O'
    )
  then raise exception 'Portfolio release preconditions failed.'; end if;
end
$grading$;
drop policy pll_launch_portfolio_submission_hold on public.pll_submissions;
drop policy pll_launch_portfolio_score_insert_hold on public.pll_rubric_scores;
drop policy pll_launch_portfolio_score_update_hold on public.pll_rubric_scores;
commit;
