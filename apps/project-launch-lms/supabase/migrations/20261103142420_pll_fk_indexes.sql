-- Project Launch Lab: indexes identified by Supabase performance advisor
create index if not exists pll_activities_module_course_fk on public.pll_activities(module_id, course_id);
create index if not exists pll_drafts_activity_course_fk on public.pll_drafts(activity_id, course_id);
create index if not exists pll_submissions_activity_course_fk on public.pll_submissions(activity_id, course_id);
create index if not exists pll_feedback_submission_course_fk on public.pll_feedback(submission_id, course_id);
create index if not exists pll_feedback_evaluator_fk on public.pll_feedback(evaluator_id);
create index if not exists pll_rubric_activity_course_fk on public.pll_rubric_criteria(activity_id, course_id);
