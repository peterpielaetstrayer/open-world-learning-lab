"use client";

import { useEffect, useRef, useState } from "react";
import { EntryDiagnostic } from "../studio/entry-diagnostic";
import { ProjectDirectionLesson } from "../studio/project-direction-lesson";
import { DirectionComparison } from "../studio/direction-comparison";
import Link from "next/link";

const steps = ["Welcome", "Starting point", "Learn the lenses", "Compare ideas", "Direction Brief"] as const;

export function ModuleOneWalkthrough() {
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) heading.current?.focus();
    else mounted.current = true;
  }, [step]);

  return <main id="main-content" className="page-wrap studio-container">
    <p className="eyebrow">Private course review · Module 1 · fictional learner</p>
    <h1>From curiosity to direction</h1>
    <p className="lead">Walk through the instructional sequence as a high-school learner would: notice your starting point, learn the three lenses, compare two ideas, and prepare a defensible Direction Brief.</p>
    <div className="preview-banner" role="note">
      <strong>Review prototype only.</strong> This route is not the live course. It has no authenticated learner account, automatic scoring or database writes.
      Your text stays in the page only while this preview remains open. You can copy or download drafts.
      The actual Module 1 activities have <strong>not</strong> been replaced or published with this sequence.
    </div>
    <nav className="module-one-tabs" aria-label="Module 1 learning sequence">
      {steps.map((label, index) => <button key={label} type="button" aria-current={index === step ? "step" : undefined}
        onClick={() => setStep(index)}>{String(index + 1).padStart(2, "0")} · {label}</button>)}
    </nav>

    <div className="module-one-panel">
      <h2 ref={heading} tabIndex={-1}>{steps[step]}</h2>
      <div hidden={step !== 0}>
        <p>You do not need a perfect idea to begin. You will explore two directions, choose a manageable first investigation, and explain how evidence or feedback could change your thinking.</p>
        <ol>
          <li><strong>Discover.</strong> Notice questions, interests and needs that matter to you.</li>
          <li><strong>Evaluate.</strong> Consider relevance, feasibility and scope—not just excitement.</li>
          <li><strong>Define.</strong> Make a tentative choice and justify a safe, focused first test.</li>
        </ol>
        <p>Module 2 later helps you plan and try one safe move, or document an authentic obstacle and choose what to do next.</p>
        <p>You can revise your direction. You do not have to purchase materials, contact strangers, use AI, post publicly, or reveal sensitive information.</p>
      </div>
      <div hidden={step !== 1}><EntryDiagnostic /></div>
      <div hidden={step !== 2}><ProjectDirectionLesson /></div>
      <div hidden={step !== 3}><DirectionComparison /></div>
      <div hidden={step !== 4}>
        <p className="direction-lead">The Project Direction Brief is a separate, graded assignment. Use the questions and comparison you developed—along with any facilitator feedback—to show the reasoning behind your choice.</p>
        <h3>What to include</h3>
        <ol>
          <li>Two candidate directions and the direction you are choosing for now.</li>
          <li>Why the direction is meaningful to you without disclosing private details.</li>
          <li>Time, resources, permissions, constraints and a low-resource or safe alternative.</li>
          <li>A focused first question or deliverable small enough to investigate.</li>
          <li>The tradeoff you accepted, relevant feedback, and one open question.</li>
          <li>What evidence could make you revisit the decision.</li>
        </ol>
        <h3>How your reasoning is evaluated</h3>
        <table className="module-one-rubric"><thead><tr><th scope="col">Criterion</th><th scope="col">Points</th></tr></thead><tbody>
          <tr><td>Personal relevance and learner ownership</td><td>10</td></tr>
          <tr><td>Feasibility, constraints and safe alternatives</td><td>10</td></tr>
          <tr><td>Scope, comparison and defensible reasoning</td><td>10</td></tr>
          <tr><th scope="row">Total</th><th>30</th></tr>
        </tbody></table>
        <p className="form-note">This preview shows the proposed assignment structure; it does not accept, score or submit a Direction Brief. Complete the real assignment only through the instructor-approved course workflow.</p>
        <div className="direction-insight">
          <strong>Bridge to Module 2:</strong> You have a direction, not a lifetime commitment. What is the biggest unknown in this direction? Carry that question into your First Move Plan.
        </div>
        <p><Link className="back-link" href="/module-two-preview">Preview Module 2: From direction to first move</Link></p>
      </div>
    </div>
    <div className="module-one-nav">
      <button className="direction-back" type="button" disabled={step === 0} onClick={() => setStep(previous => Math.max(0, previous - 1))}>Previous step</button>
      <button className="direction-primary" type="button" disabled={step === steps.length - 1}
        onClick={() => setStep(previous => Math.min(steps.length - 1, previous + 1))}>Continue to {steps[Math.min(steps.length - 1, step + 1)].toLowerCase()}</button>
    </div>
  </main>;
}
