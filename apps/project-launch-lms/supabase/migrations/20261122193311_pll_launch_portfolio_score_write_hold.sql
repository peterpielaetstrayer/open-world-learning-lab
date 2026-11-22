-- Prevent direct API / rubric RPC writes against the academically unreconciled
-- Launch Portfolio. This holds score INSERT and UPDATE only; published review
-- remains blocked in the studio. Other assignments remain scoreable.
-- Drop these two policies only in a separately accepted 60-point release.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class WHERE oid='public.pll_rubric_scores'::regclass AND relrowsecurity
  ) THEN
    RAISE EXCEPTION 'Rubric-score RLS must be enabled';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.pll_rubric_scores rs
    JOIN public.pll_activities a ON a.id=rs.activity_id AND a.course_id=rs.course_id
    WHERE a.slug='launch-portfolio'
  ) OR EXISTS (
    SELECT 1 FROM public.pll_submissions s
    JOIN public.pll_activities a ON a.id=s.activity_id AND a.course_id=s.course_id
    WHERE a.slug='launch-portfolio'
  ) THEN
    RAISE EXCEPTION 'Historical Launch Portfolio work requires separate review';
  END IF;
END $$;

CREATE POLICY pll_launch_portfolio_score_insert_hold
  ON public.pll_rubric_scores AS RESTRICTIVE
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pll_activities a
      WHERE a.id=pll_rubric_scores.activity_id
        AND a.course_id=pll_rubric_scores.course_id
        AND a.slug <> 'launch-portfolio'
    )
  );

CREATE POLICY pll_launch_portfolio_score_update_hold
  ON public.pll_rubric_scores AS RESTRICTIVE
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pll_activities a
      WHERE a.id=pll_rubric_scores.activity_id
        AND a.course_id=pll_rubric_scores.course_id
        AND a.slug <> 'launch-portfolio'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pll_activities a
      WHERE a.id=pll_rubric_scores.activity_id
        AND a.course_id=pll_rubric_scores.course_id
        AND a.slug <> 'launch-portfolio'
    )
  );
