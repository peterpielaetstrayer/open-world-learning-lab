-- Project Launch Lab — server-side academic rubric release hold
-- Applied to OWLL Supabase project wjormscrikzocelbjxvc on 2026-11-22.
-- Supabase migration history version 20261122182642.
--
-- Purpose: the learner UI correctly prevents final Launch Portfolio submission
-- until faculty approves the academic 4×15=60 rubric, but client-side checks
-- alone do not prevent direct Data API inserts while the live rubric is 3×10=30.
--
-- This RESTRICTIVE INSERT policy composes with existing owner + published-
-- activity RLS. It blocks only launch-portfolio final submissions, preserves
-- working drafts, and leaves M1 Direction Brief and formative submissions open.
-- Releasing this gate requires a separately reviewed migration after the
-- correct rubric and authentic grading flow are approved and tested.
CREATE POLICY pll_launch_portfolio_submission_hold
  ON public.pll_submissions
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1
      FROM public.pll_activities AS activity
      WHERE activity.id = pll_submissions.activity_id
        AND activity.course_id = pll_submissions.course_id
        AND activity.slug = 'launch-portfolio'
    )
  );
