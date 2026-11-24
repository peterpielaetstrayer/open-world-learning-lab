
-- Learner copy QA on four unpublished Project Launch Lab activities.
-- Exact-match preconditions; no grading, accounts, dates or publication changes.
DO $$
DECLARE v_course uuid; v_id uuid; v_count integer;
BEGIN
  SELECT id INTO v_course FROM public.pll_courses WHERE slug='project-launch-lab';
  IF v_course IS NULL THEN RAISE EXCEPTION 'Expected course missing'; END IF;

  SELECT id INTO v_id FROM public.pll_activities
   WHERE course_id=v_course AND slug='module-one-introduction' AND NOT is_published
     AND instructions LIKE '%This text is an **original written instructional companion**.%';
  IF v_id IS NULL OR EXISTS(SELECT 1 FROM public.pll_submissions WHERE activity_id=v_id)
     OR EXISTS(SELECT 1 FROM public.pll_drafts WHERE activity_id=v_id) THEN
    RAISE EXCEPTION 'Module 1 introduction not safe to revise';
  END IF;
  UPDATE public.pll_activities
   SET instructions=replace(instructions,
     'This text is an **original written instructional companion**. It does not replace the ten-screen worked lesson, independent multimedia requirement, Gauntlet, feedback activity or graded Brief.',
     'Use this reading to revisit the three decision lenses. The interactive lesson and Gauntlet will give you practice, and the Project Direction Brief will show how you use the lenses for your own idea.')
   WHERE id=v_id AND NOT is_published;
  GET DIAGNOSTICS v_count=ROW_COUNT;
  IF v_count<>1 THEN RAISE EXCEPTION 'Module 1 introduction update failed'; END IF;

  SELECT id INTO v_id FROM public.pll_activities
   WHERE course_id=v_course AND slug='direction-comparison' AND NOT is_published
     AND instructions LIKE '%Sharing is final; do not overwrite evidence of your original decision.%';
  IF v_id IS NULL OR EXISTS(SELECT 1 FROM public.pll_submissions WHERE activity_id=v_id)
     OR EXISTS(SELECT 1 FROM public.pll_drafts WHERE activity_id=v_id) THEN
    RAISE EXCEPTION 'Direction comparison not safe to revise';
  END IF;
  UPDATE public.pll_activities
   SET instructions=replace(instructions,
     'This is ungraded formative work. Prepare a response, Save draft, and share it for facilitator feedback when ready. Sharing is final; do not overwrite evidence of your original decision.',
     'This practice is ungraded. Prepare your response, choose Save draft to keep working, then share with your facilitator when ready. Your shared version stays as a record of your original choice; you can explain later changes in another activity.')
   WHERE id=v_id AND NOT is_published;
  GET DIAGNOSTICS v_count=ROW_COUNT;
  IF v_count<>1 THEN RAISE EXCEPTION 'Direction comparison update failed'; END IF;

  SELECT id INTO v_id FROM public.pll_activities
   WHERE course_id=v_course AND slug='first-move-card' AND NOT is_published
     AND instructions LIKE '%a final shared card is not silently editable.%';
  IF v_id IS NULL OR EXISTS(SELECT 1 FROM public.pll_submissions WHERE activity_id=v_id)
     OR EXISTS(SELECT 1 FROM public.pll_drafts WHERE activity_id=v_id) THEN
    RAISE EXCEPTION 'First Move Card not safe to revise';
  END IF;
  UPDATE public.pll_activities
   SET instructions=replace(instructions,
     'Prepare your card and explicitly Save draft. Share it when ready for formative feedback; a final shared card is not silently editable.',
     'Prepare your card and choose Save draft while you are still working. When you share it, that version is kept as your starting plan. Use the later Feedback and Revision activity to explain changes.')
   WHERE id=v_id AND NOT is_published;
  GET DIAGNOSTICS v_count=ROW_COUNT;
  IF v_count<>1 THEN RAISE EXCEPTION 'First Move Card update failed'; END IF;

  SELECT id INTO v_id FROM public.pll_activities
   WHERE course_id=v_course AND slug='your-next-move-reflection' AND NOT is_published
     AND instructions LIKE '%self-reports, not proof of behavioral change.%';
  IF v_id IS NULL OR EXISTS(SELECT 1 FROM public.pll_submissions WHERE activity_id=v_id)
     OR EXISTS(SELECT 1 FROM public.pll_drafts WHERE activity_id=v_id) THEN
    RAISE EXCEPTION 'Closing reflection not safe to revise';
  END IF;
  UPDATE public.pll_activities SET instructions=replace(
    replace(instructions,
      'Reflect on how confident and willing you feel to use project decisions again. Your stated confidence and intention are self-reports, not proof of behavioral change. This activity is ungraded.',
      'Reflect on how ready and willing you feel to make project decisions again. Your ratings describe how you feel now, not what you have already done. This activity is ungraded.'),
    'Prepare the response, then deliberately Save draft or Share with your facilitator. This is separate from the graded ten-question knowledge quiz and the Level 1 course reaction survey.',
    'Prepare your response, then choose Save draft or Share with your facilitator. This is separate from the ten-question knowledge quiz and the course-experience survey.'
  ) WHERE id=v_id AND NOT is_published;
  GET DIAGNOSTICS v_count=ROW_COUNT;
  IF v_count<>1 THEN RAISE EXCEPTION 'Closing reflection update failed'; END IF;
END $$;
