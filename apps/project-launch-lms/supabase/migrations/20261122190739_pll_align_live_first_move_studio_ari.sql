-- Correct a single non-scoring learner-facing character reference to match
-- the approved separate Ari rhythm-guide transfer scenario. This does not
-- change the widget, rubric, course access, activity publication or grade.
DO $$
DECLARE v_course uuid; v_activity uuid; v_count integer;
BEGIN
  SELECT id INTO v_course FROM public.pll_courses WHERE slug='project-launch-lab';
  IF v_course IS NULL THEN RAISE EXCEPTION 'Expected course not found'; END IF;
  SELECT id INTO v_activity FROM public.pll_activities
    WHERE course_id=v_course AND slug='first-move-studio' AND is_published=true;
  IF v_activity IS NULL THEN RAISE EXCEPTION 'Expected published activity not found'; END IF;
  IF EXISTS (SELECT 1 FROM public.pll_submissions WHERE activity_id=v_activity)
    OR EXISTS (SELECT 1 FROM public.pll_drafts WHERE activity_id=v_activity) THEN
    RAISE EXCEPTION 'Existing learner work requires separate editorial review';
  END IF;
  IF (SELECT count(*) FROM public.pll_activities WHERE id=v_activity
      AND instructions LIKE '%Work through Maya’s three decisions.%'
      AND instructions NOT LIKE '%Work through Ari’s three decisions.%') <> 1 THEN
    RAISE EXCEPTION 'Published instructions changed; manual review needed';
  END IF;
  UPDATE public.pll_activities SET instructions =
    replace(instructions,
      'Work through Maya’s three decisions.',
      'Work through Ari’s three decisions.')
    WHERE id=v_activity AND is_published=true;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  IF v_count <> 1 THEN RAISE EXCEPTION 'Unexpected update count: %',v_count; END IF;
END $$;
