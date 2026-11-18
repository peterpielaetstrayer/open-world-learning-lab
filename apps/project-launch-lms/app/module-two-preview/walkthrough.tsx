"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FirstMoveStudio } from "../studio/first-move-studio";
import { FirstMoveCard, type FirstMovePlan } from "../studio/first-move-card";
import { FirstMoveEvidence } from "../studio/first-move-evidence";

const steps = ["Welcome", "Learn from Maya", "First Move Card", "Feedback", "Action or obstacle", "Portfolio & transfer"] as const;

export function ModuleTwoWalkthrough() {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<FirstMovePlan | undefined>();
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) heading.current?.focus();
    else mounted.current = true;
  }, [step]);

  return <main id="main-content" className="page-wrap studio-container">
    <p className="eyebrow">Private course review · Module 2 · fictional learner</p>
    <h1>From direction to first move</h1>
    <p className="lead">Plan one bounded action, learn from feedback and actual conditions, and decide what to do next. A documented obstacle can be just as informative as a completed attempt.</p>
    <p><Link className="back-link" href="/module-one-preview">Review Module 1: From curiosity to direction</Link></p>
    <div className="preview-banner" role="note">
      <strong>Synthetic design review.</strong> This is not the live course. No real enrollment, backend save, submission, grading or facilitator message occurs here.
      Your typed answers remain in this open page while navigating its steps; copy any work you want to retain. The existing published Module 2 activity and rubric are unchanged.
    </div>
    <nav className="module-one-tabs" aria-label="Module 2 learning sequence">
      {steps.map((label, index) => <button key={label} type="button" aria-current={index === step ? "step" : undefined}
        onClick={() => setStep(index)}>{String(index + 1).padStart(2, "0")} · {label}</button>)}
    </nav>

    <div className="module-one-panel">
      <h2 ref={heading} tabIndex={-1}>{steps[step]}</h2>
      <div hidden={step !== 0}>
        <p>You have a direction, not a promise to succeed. In Module 2, the quality of your thinking comes from a feasible plan, honest evidence or a real obstacle, and a reasoned next move.</p>
        <ol>
          <li><strong>Plan:</strong> name what you will learn from one small, safe attempt.</li>
          <li><strong>Critique:</strong> consider whether feedback changes the plan—or whether evidence supports keeping it.</li>
          <li><strong>Observe:</strong> report what actually happened, or why a genuine constraint prevented the attempt.</li>
          <li><strong>Decide:</strong> distinguish what is known from what remains uncertain and choose a next step.</li>
        </ol>
        <div className="direction-insight">A safe stop, a changed plan and an honest barrier are all legitimate learning outcomes. No purchase, public post, travel, AI use, contact with strangers, sensitive disclosure or fabricated success is required.</div>
      </div>

      <div hidden={step !== 1}>
        <p>Maya wants to make a short rhythm guide. Before recording a full track, she can test whether a short count-in gives a clear starting cue. Follow her three decisions and read the explanations after each choice.</p>
        <FirstMoveStudio />
        <div className="launch-model">
          <h3>Debrief: what could Maya actually claim?</h3>
          <ul>
            <li>Her first check tested the clarity of the opening cue—not the quality of an entire music lesson.</li>
            <li>Two missed entries describe the observation under those conditions, not how every future learner will perform.</li>
            <li>Background noise is evidence about test conditions. It does not prove the direction is unworthy.</li>
          </ul>
          <p>The audio has a written description in the decision activity. Independent screen-reader, keyboard and media acceptance remain pending.</p>
        </div>
      </div>

      <div hidden={step !== 2}><FirstMoveCard onPlanChange={setPlan} /></div>

      <div hidden={step !== 3}>
        <p>In the actual signed-in course, an ungraded First Move Card can be saved as a draft or deliberately shared with a facilitator for feedback <em>if the instructional marker is published into an appropriate activity</em>. This protected preview does not share anything.</p>
        <h3>A four-part feedback conversation</h3>
        <ol className="launch-critique-list">
          <li>“I can see your plan aims to learn …”</li>
          <li>“The proposed first step seems feasible or difficult because …”</li>
          <li>“A condition or constraint you might account for is …”</li>
          <li>“One question that could sharpen your evidence is …”</li>
        </ol>
        <div className="direction-insight"><strong>After receiving feedback:</strong> You can improve the plan or explain why you kept it. Neither automatic agreement nor a polished-looking result is the goal. The next screen lets you honestly record whether feedback has actually arrived.</div>
        <p className="form-note">A final shared course response is currently immutable. Revisions after that point need a separate follow-up activity or an explicitly designed versioning workflow; the present LMS does not silently reopen final submissions.</p>
      </div>

      <div hidden={step !== 4}><FirstMoveEvidence plan={plan} /></div>

      <div hidden={step !== 5}>
        <p className="direction-lead">The Launch Portfolio brings the work together: purpose, first-move plan, authentic evidence or a genuine barrier, feedback response, limitations and the next decision.</p>
        <h3>What the portfolio should make visible</h3>
        <ol>
          <li>My project purpose and how my first action connects to it.</li>
          <li>A feasible plan with checkpoints, resources and safe alternatives.</li>
          <li>An honest observation or real obstacle, clearly distinguished from assumptions.</li>
          <li>What feedback I received—or what is still pending—and a reasoned decision to revise or retain.</li>
          <li>One strategy I could use in a different project and my next safe action.</li>
        </ol>
        <div className="preview-banner" role="note">
          <strong>Rubric mismatch not resolved:</strong> The academic storyboard proposes four criteria worth 15 points each (60 total), but the currently published database rubric has three 10-point criteria (30 total). The actual scoring interface must be reconciled against the authoritative faculty assignment before use. This preview does not simulate a grade.
        </div>
        <h3>Exit and transfer</h3>
        <p>Before completing the real course, the learner should take the existing ten-item scenario quiz, revisit the entry confidence question (1–5), name a transferable strategy, and choose a safe next move. Confidence change is self-report, <strong>not</strong> proof of competence.</p>
        <p className="form-note">The quiz and Level 1 course evaluation exist as separate authenticated studio features; this preview does not duplicate or claim to verify them.</p>
        <p className="direction-closing">A thoughtful launch is not just what you did. It is what you learned—and the next choice you can justify.</p>
      </div>
    </div>

    <div className="module-one-nav">
      <button type="button" className="direction-back" disabled={step === 0}
        onClick={() => setStep(previous => Math.max(0, previous - 1))}>Previous step</button>
      <button type="button" className="direction-primary" disabled={step === steps.length - 1}
        onClick={() => setStep(previous => Math.min(steps.length - 1, previous + 1))}>Continue to {steps[Math.min(steps.length - 1, step + 1)].toLowerCase()}</button>
    </div>
  </main>;
}
