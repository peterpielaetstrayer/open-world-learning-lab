-- Cover the composite activity/course FK used by delete checks and joins.
-- The separate learner index supports private owner lookups.
create index pll_lesson_progress_activity_course_fk
  on public.pll_lesson_progress(activity_id,course_id);
