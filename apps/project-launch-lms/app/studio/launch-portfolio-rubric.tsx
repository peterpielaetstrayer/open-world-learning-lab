/**
 * Review-only transcription of Peter's November 16 LDT 560 LA4.1 academic
 * Launch Portfolio rubric. This is not a published LMS grading definition.
 */
export const academicLaunchPortfolioRubric = [
  {
    title: "Purpose and planning coherence",
    maximumPoints: 15,
    evidence: "Project purpose, three ordered milestones, and the relationship among plan, constraints, and intended evidence.",
    bands: [
      "Clear purpose; at least three coherent, ordered milestones; meaningful links among plan, constraints, and intended evidence.",
      "Purpose and milestones are mostly coherent, but some links or decisions need further justification.",
      "Purpose or sequence is unclear, with limited connection to evidence.",
      "Required evidence for this criterion is absent.",
    ],
  },
  {
    title: "Resources, constraints, and feasibility",
    maximumPoints: 15,
    evidence: "Relevant resources, a meaningful constraint and response, a safe bounded first action, and a completed first-action checklist.",
    bands: [
      "Identifies relevant resources, a meaningful constraint and response, and a safe, bounded first action; the checklist supports the decision.",
      "Resources and constraints are identified, but the response or first action needs refinement.",
      "Resources, constraints, or action feasibility are weak or underspecified.",
      "Required evidence for this criterion is absent.",
    ],
  },
  {
    title: "First action and evidence interpretation",
    maximumPoints: 15,
    evidence: "Inspectable evidence of a real bounded attempt OR a credible documented obstacle, interpretation, and at least one limitation.",
    bands: [
      "Provides inspectable evidence of an attempt or credible documented obstacle, interprets what it suggests, and recognizes at least one limit.",
      "Provides action/obstacle evidence and partial interpretation; limitations are underdeveloped.",
      "Evidence or obstacle is thin, unclear, or weakly interpreted.",
      "Required evidence for this criterion is absent.",
    ],
  },
  {
    title: "Feedback, revision, and next decision",
    maximumPoints: 15,
    evidence: "Received feedback, a justified change or retention of the plan, a credible next step, and a remaining uncertainty.",
    bands: [
      "Uses specific feedback and evidence to justify a change or reasoned retention, identifying a credible next step and uncertainty.",
      "Considers feedback and evidence, but the decision or next step is only partly justified.",
      "Mentions feedback or evidence without a meaningful explanation of the next decision.",
      "Required evidence for this criterion is absent.",
    ],
  },
] as const;

export const academicLaunchPortfolioPointBands = [15, 10, 5, 0] as const;

export function compareLaunchPortfolioRubric(rows: ReadonlyArray<{ title: string; maximum_points: number | string }>) {
  const expected = academicLaunchPortfolioRubric;
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
  const actualTotal = rows.reduce((sum, row) => sum + Number(row.maximum_points), 0);
  const problems: string[] = [];

  if (rows.length !== expected.length) problems.push(`Expected four criteria; found ${rows.length}.`);
  for (let i = 0; i < expected.length; i++) {
    const row = rows[i];
    if (!row) { problems.push(`Criterion ${i + 1} is missing.`); continue; }
    if (normalize(row.title) !== normalize(expected[i].title))
      problems.push(`Criterion ${i + 1} title differs from the academic draft.`);
    if (Number(row.maximum_points) !== expected[i].maximumPoints)
      problems.push(`Criterion ${i + 1} should have a 15-point maximum.`);
  }
  if (actualTotal !== 60) problems.push(`Current total is ${actualTotal}; academic draft total is 60.`);
  return { matchesAcademicDraft: problems.length === 0, actualTotal, academicTotal: 60, problems };
}

export function LaunchPortfolioPreparation({ review = false }: { review?: boolean }) {
  return <section className="launch-model" aria-labelledby="portfolio-preparation-heading">
    <h3 id="portfolio-preparation-heading">Assemble your Launch Portfolio</h3>
    <p>Bring together the work you have already developed. Use the structure below to organize one portfolio; do not invent new observations or feedback to fill a section.</p>
    <details>
      <summary>Open the portfolio outline and evidence checklist</summary>
      <ol>
        <li><strong>Purpose:</strong> your direction, why it matters, and the question carried forward from Module 1.</li>
        <li><strong>Milestones:</strong> three ordered steps and the checkpoint where you reconsider the plan.</li>
        <li><strong>Resources:</strong> materials, time, information, permission and trusted support.</li>
        <li><strong>Constraints:</strong> a meaningful limitation and your safe response.</li>
        <li><strong>First action:</strong> the bounded attempt, or the genuine barrier and preparation you completed.</li>
        <li><strong>Evidence:</strong> what you actually observed or documented, what it suggests, and one thing it cannot establish.</li>
      </ol>
      <p>Include your completed first-action checklist and identify actual feedback, your reasoned revision or retention, a credible next step, and one remaining uncertainty. If feedback is pending, save a working draft and request help rather than inventing feedback.</p>
      <p><a className="back-link" href={review ? "/review-materials/project-launch-worksheets.txt" : "/resources/project-launch-worksheets.txt"} download>Download project worksheets and first-action checklist (plain text)</a></p>
      <p className="form-note">This outline helps you organize the existing assignment; it adds no scoring criteria. For an equivalent accessible format or private artifact submission, coordinate with the facilitator.</p>
    </details>
  </section>;
}

export function LaunchPortfolioRubricReview({ onHold = true }: { onHold?: boolean }) {
  const bands = ["Proficient", "Developing", "Beginning", "Missing"] as const;
  return <section className="launch-model" aria-labelledby="launch-rubric-heading">
    <p className="eyebrow">{onHold ? "Academic rubric review" : "Academic rubric"}</p>
    <h3 id="launch-rubric-heading">{onHold ? "Proposed Launch Portfolio assessment — 60 points" : "Launch Portfolio assessment — 60 points"}</h3>
    <p>Four criteria, each with four performance levels from the submitted November 16 LA 4.1 academic rubric.</p>
    <p>Each criterion values honest reasoning and evidence. An authentic, documented obstacle can qualify; successful completion of the project is not required. The examples below describe the evidence reviewers should look for.</p>
    {academicLaunchPortfolioRubric.map((criterion, index) => <details key={criterion.title}>
      <summary>Criterion {index + 1}: {criterion.title} — 15 points</summary>
      <p><strong>Look for:</strong> {criterion.evidence}</p>
      <dl>
        {academicLaunchPortfolioPointBands.map((points, band) => <div key={points}>
          <dt>{bands[band]} ({points} points)</dt>
          <dd>{criterion.bands[band]}</dd>
        </div>)}
      </dl>
    </details>)}
    <p className="form-note">The academic rubric specifies 15, 10, 5, and 0 point levels. {onHold && "Final submissions and scoring require release approval."}</p>
  </section>;
}
