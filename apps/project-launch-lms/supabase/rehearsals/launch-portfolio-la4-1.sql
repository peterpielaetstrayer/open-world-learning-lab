-- REVIEW ONLY. This script rehearses the LA 4.1 Portfolio replacement and
-- rolls back. It is not an automatic migration or a grading release.
-- Source: the submitted November 16 LA 4.1 (directions and all 16 rubric anchors).
begin;
set local lock_timeout = '3s';
set local statement_timeout = '15s';
lock table public.pll_submissions, public.pll_rubric_scores in share row exclusive mode;

do $rehearsal$
declare
  portfolio_id uuid;
  course_id_value uuid;
  matching_hold_count integer;
begin
  select a.id, a.course_id into strict portfolio_id, course_id_value
  from public.pll_activities a
  join public.pll_courses c on c.id = a.course_id
  join public.pll_modules m on m.id = a.module_id and m.course_id = a.course_id
  where c.slug = 'project-launch-lab' and m.module_number = 2
    and a.slug = 'launch-portfolio' and a.is_published
  for update of a;

  select count(*) into matching_hold_count
  from pg_policies
  where schemaname = 'public' and permissive = 'RESTRICTIVE' and (
    (tablename = 'pll_submissions' and cmd = 'INSERT' and policyname = 'pll_launch_portfolio_submission_hold')
    or (tablename = 'pll_rubric_scores' and cmd = 'INSERT' and policyname = 'pll_launch_portfolio_score_insert_hold')
    or (tablename = 'pll_rubric_scores' and cmd = 'UPDATE' and policyname = 'pll_launch_portfolio_score_update_hold')
  );
  if matching_hold_count <> 3 then
    raise exception 'Portfolio submission and score holds must all be active.';
  end if;

  if exists (select 1 from public.pll_submissions where activity_id = portfolio_id)
    or exists (select 1 from public.pll_rubric_scores where activity_id = portfolio_id) then
    raise exception 'Portfolio has assessment history. Preserve its rubric and stop.';
  end if;

  if (select array_agg(title order by position)
      from public.pll_rubric_criteria where activity_id = portfolio_id)
      is distinct from array['Feasible plan', 'First-action evidence', 'Evidence-informed next step']::text[]
    or (select array_agg(maximum_points order by position)
        from public.pll_rubric_criteria where activity_id = portfolio_id)
      is distinct from array[10, 10, 10]::numeric[] then
    raise exception 'Existing Portfolio criteria changed. Reverify before replacing.';
  end if;

  -- The rubric-authoring trigger requires draft status. This temporary
  -- transition is visible only inside the rolled-back transaction.
  update public.pll_activities set is_published = false where id = portfolio_id;
  delete from public.pll_rubric_criteria where activity_id = portfolio_id;

  insert into public.pll_rubric_criteria
    (activity_id, course_id, position, title, description, maximum_points)
  values
    (portfolio_id, course_id_value, 1, 'Purpose and planning coherence', 'Proficient (15 points): Clear purpose; at least three coherent, ordered milestones; meaningful links among plan, constraints, and intended evidence.
Developing (10 points): Purpose and milestones are mostly coherent, but some links or decisions need further justification.
Beginning (5 points): Purpose or sequence is unclear, with limited connection to evidence.
Missing (0 points): Required evidence for this criterion is absent.', 15),
    (portfolio_id, course_id_value, 2, 'Resources, constraints, and feasibility', 'Proficient (15 points): Identifies relevant resources, a meaningful constraint and response, and a safe, bounded first action; the checklist supports the decision.
Developing (10 points): Resources and constraints are identified, but the response or first action needs refinement.
Beginning (5 points): Resources, constraints, or action feasibility are weak or underspecified.
Missing (0 points): Required evidence for this criterion is absent.', 15),
    (portfolio_id, course_id_value, 3, 'First action and evidence interpretation', 'Proficient (15 points): Provides inspectable evidence of an attempt or credible documented obstacle, interprets what it suggests, and recognizes at least one limit.
Developing (10 points): Provides action/obstacle evidence and partial interpretation; limitations are underdeveloped.
Beginning (5 points): Evidence or obstacle is thin, unclear, or weakly interpreted.
Missing (0 points): Required evidence for this criterion is absent.', 15),
    (portfolio_id, course_id_value, 4, 'Feedback, revision, and next decision', 'Proficient (15 points): Uses specific feedback and evidence to justify a change or reasoned retention, identifying a credible next step and uncertainty.
Developing (10 points): Considers feedback and evidence, but the decision or next step is only partly justified.
Beginning (5 points): Mentions feedback or evidence without a meaningful explanation of the next decision.
Missing (0 points): Required evidence for this criterion is absent.', 15);

  update public.pll_activities
  set instructions = '### Launch Portfolio

Your Launch Portfolio brings together your project direction, a workable plan, your first action or an authentic obstacle, the evidence you gathered, and what you learned. You are not graded on having a perfect project or guaranteed success. You are graded on how clearly you reason, use evidence, consider feedback, and justify what to do next.

### Prepare your portfolio

1. State the project direction you chose in Module 1 and why it matters to you or a community you care about.

2. Present a launch plan with at least three ordered milestones, relevant resources, one meaningful constraint, and how you will address it.

3. Describe one safe, bounded first action and the evidence that would help you judge its value. Attempt it when safe and feasible. If you cannot attempt it, document the authentic obstacle, the preparation you completed, and a realistic alternative or next opportunity.

4. Provide inspectable evidence of your attempt or obstacle: for example, a brief observation log, dated draft, sketch, non-identifying photograph, or a dated account of a barrier. Respect others'' privacy.

5. Explain how evidence and feedback from your First Move Card informed a revision—or why retaining your original plan is reasonable. Identify a credible next step and one remaining uncertainty.

6. Label the major planning components in your portfolio (purpose, milestones, resources, constraints, first action, and evidence) and include your completed first-action checklist. Explain at least one limit of what the available evidence or feedback can establish.

### Submission

Submit one organized portfolio as text or an accessible document. Include the six labeled components described above, your evidence, and your feedback-based next-step reasoning. Equivalent formats may be coordinated with the facilitator.'
  where id = portfolio_id;

  if not exists (
    select 1 from public.pll_rubric_criteria where activity_id = portfolio_id
    having count(*) = 4 and sum(maximum_points) = 60
      and bool_and(maximum_points = 15 and description like '%(15 points):%'
        and description like '%(10 points):%' and description like '%(5 points):%'
        and description like '%(0 points):%')
  ) then
    raise exception 'Portfolio reconciliation did not validate all rubric anchors.';
  end if;
end
$rehearsal$;
rollback;
