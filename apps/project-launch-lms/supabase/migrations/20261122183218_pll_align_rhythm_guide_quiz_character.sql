-- Project Launch Lab editorial continuity: Maya = garden worked example;
-- Ari = independent rhythm-guide transfer case. Applied 2026-11-22.
-- Do not change the correct answer indexes or the grading rubric.
DO $$
DECLARE v_course uuid;
BEGIN
  SELECT id INTO v_course FROM public.pll_courses WHERE slug='project-launch-lab';
  IF v_course IS NULL THEN RAISE EXCEPTION 'Project Launch Lab course not found'; END IF;
  IF EXISTS (SELECT 1 FROM public.pll_quiz_attempts WHERE course_id=v_course) THEN
    RAISE EXCEPTION 'Cannot revise quiz names after learner attempts';
  END IF;
  IF (SELECT count(*) FROM public.pll_quiz_questions q
      WHERE q.course_id=v_course AND q.position IN (1,6,8)
      AND q.prompt LIKE '%Maya%') <> 3 THEN
    RAISE EXCEPTION 'Quiz wording changed; review before updating';
  END IF;
  UPDATE public.pll_quiz_questions q SET
    prompt=replace(q.prompt, 'Maya', 'Ari'),
    explanation=replace(replace(q.explanation, 'Maya’s', 'Ari’s'), 'Maya', 'Ari'),
    options=CASE WHEN q.position=6
      THEN array_replace(q.options,
        'The cue needs revision in her current test setup',
        'The cue needs revision in the current test setup')
      ELSE q.options END
  WHERE q.course_id=v_course AND q.position IN (1,6,8);
END $$;
