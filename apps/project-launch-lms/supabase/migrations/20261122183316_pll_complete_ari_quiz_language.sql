-- Final Ari rhythm-guide pronoun continuity. Applied OWLL Supabase 2026-11-22.
-- Only item 8 explanatory prose changes; key/point values are untouched.
DO $$
DECLARE c uuid;
BEGIN
  SELECT id INTO c FROM public.pll_courses WHERE slug='project-launch-lab';
  IF c IS NULL OR EXISTS (SELECT 1 FROM public.pll_quiz_attempts WHERE course_id=c)
    THEN RAISE EXCEPTION 'Existing learner attempts or missing course require review'; END IF;
  IF (SELECT count(*) FROM public.pll_quiz_questions
     WHERE course_id=c AND position=8 AND explanation LIKE '%result she cares about%')<>1
     THEN RAISE EXCEPTION 'Expected item eight text not found'; END IF;
  UPDATE public.pll_quiz_questions
     SET explanation=replace(explanation,'result she cares about','result they care about')
  WHERE course_id=c AND position=8;
END $$;
