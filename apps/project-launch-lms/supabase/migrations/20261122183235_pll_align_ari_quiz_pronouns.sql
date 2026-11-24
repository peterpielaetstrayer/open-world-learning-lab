-- Align the Ari rhythm-guide quiz scenario with the source's they/their
-- pronouns. Applied on OWLL Supabase 2026-11-22. Scoring unchanged.
DO $$
DECLARE v_course uuid;
BEGIN
  SELECT id INTO v_course FROM public.pll_courses WHERE slug='project-launch-lab';
  IF v_course IS NULL OR EXISTS (
    SELECT 1 FROM public.pll_quiz_attempts WHERE course_id=v_course
  ) THEN
    RAISE EXCEPTION 'Quiz identity or existing attempts require manual review';
  END IF;
  IF (SELECT count(*) FROM public.pll_quiz_questions
      WHERE course_id=v_course AND position IN (1,6)
        AND prompt LIKE '%she%') <> 2 THEN
    RAISE EXCEPTION 'Question text changed; review before applying pronoun correction';
  END IF;
  UPDATE public.pll_quiz_questions
  SET prompt=replace(prompt,'she','they')
  WHERE course_id=v_course AND position IN (1,6);
END $$;
