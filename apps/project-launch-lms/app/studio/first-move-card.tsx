"use client";

import { useId, useState } from "react";

export type FirstMovePlan = {
  direction: string;
  purpose: string;
  firstAction: string;
  learningQuestion: string;
  checkpoint: string;
  resources: string;
  constraint: string;
  evidence: string;
  usefulInformation: string;
  facilitatorQuestion: string;
};

const initialPlan: FirstMovePlan = {
  direction: "", purpose: "", firstAction: "", learningQuestion: "", checkpoint: "",
  resources: "", constraint: "", evidence: "", usefulInformation: "", facilitatorQuestion: "",
};

const fields: { key: keyof FirstMovePlan; title: string; hint: string }[] = [
  { key: "direction", title: "My project direction", hint: "Use your Module 1 direction or a thoughtful revision." },
  { key: "purpose", title: "My purpose and who or what it serves", hint: "Explain why the direction matters without naming or identifying another person." },
  { key: "firstAction", title: "The smallest safe first action", hint: "What can you investigate, sketch, compare or test without unsafe or costly requirements?" },
  { key: "learningQuestion", title: "What I want to learn", hint: "Name information the attempt could reveal, not simply a finished product you hope to make." },
  { key: "checkpoint", title: "Three ordered milestones and my first checkpoint", hint: "List three realistic, ordered steps toward the direction. Which short checkpoint helps you pause and assess what you learned?" },
  { key: "resources", title: "Materials, permission, trusted support and low-resource alternative", hint: "What do you already have? If you need help or permission, what can you do safely before getting it?" },
  { key: "constraint", title: "One possible constraint and a safe substitute", hint: "Consider access, time, physical safety, privacy, tools or support. A barrier is not a failure." },
  { key: "evidence", title: "Non-sensitive evidence I could collect", hint: "For example, a private observation note, an anonymized tally or a sketch. No identifiable photos or public posts required." },
  { key: "usefulInformation", title: "What I could learn even if my attempt does not work", hint: "A test can be informative when the result differs from your hope." },
  { key: "facilitatorQuestion", title: "One specific question for facilitator feedback", hint: "Ask about feasibility, safety, evidence or scope—not just 'Is this good?'" },
];

export function FirstMoveCard({ onPrepareResponse, onPlanChange }: {
  onPrepareResponse?: (text: string) => boolean;
  onPlanChange?: (plan: FirstMovePlan) => void;
}) {
  const id = useId();
  const [plan, setPlan] = useState<FirstMovePlan>(initialPlan);
  const [reviewed, setReviewed] = useState(false);
  const [preparedText, setPreparedText] = useState("");
  const complete = fields.every(field => plan[field.key].trim());
  const hasWorkingContent = fields.some(field => plan[field.key].trim());
  const summary = [
    "PROJECT LAUNCH LAB · FIRST MOVE CARD (ungraded formative plan)",
    "This is a plan, not proof that an action has happened.",
    ...(!complete ? ["INCOMPLETE WORKING COPY — do not share as a final response yet."] : []),
    "",
    ...fields.flatMap((field, index) => [`${index + 1}. ${field.title}`, plan[field.key].trim() || "(not answered yet)", ""]),
    "Next: seek feedback, improve or justify the plan, then attempt a safe step or honestly document a real obstacle.",
  ].join("\n");

  function update(key: keyof FirstMovePlan, value: string) {
    const next = { ...plan, [key]: value };
    setPlan(next);
    onPlanChange?.(next);
    setReviewed(false);
    setPreparedText("");
  }

  return <section className="launch-card" aria-labelledby={`${id}-title`}>
    <header className="diagnostic-intro">
      <p className="eyebrow">Module 2 · Plan & Launch · 10–15 minutes</p>
      <h3 id={`${id}-title`}>Design a first move worth learning from</h3>
      <p>A First Move Card connects a project direction to one bounded, safe way to gather information. An action does not have to succeed for you to learn from it.</p>
      <p className="form-note">This planning activity is ungraded. You never need to buy anything, leave home, post publicly, contact strangers, share private details, or use AI. Permission and accessibility matter more than speed.</p>
    </header>

    <details className="launch-model">
      <summary>See a second worked plan: the rhythm guide</summary>
      <dl>
        <dt>Direction and purpose</dt><dd>Make a short rhythm guide that helps someone understand when a musical phrase begins.</dd>
        <dt>First test and learning question</dt><dd>Make a brief count-in cue and check whether the timing is understandable, before making a full track.</dd>
        <dt>Milestones and checkpoint</dt><dd>1. Write the opening cue. 2. Make a brief count-in if recording is permitted. 3. Review notes about the cue and decide what to revise. Use an available phone and quiet period only if permitted; otherwise check the written timing silently.</dd>
        <dt>Evidence and next decision</dt><dd>Keep private notes from a few playbacks; distinguish what Ari observed from what other learners might experience.</dd>
      </dl>
      <p>The school-garden model taught the planning framework; this different rhythm-guide example shows how that framework transfers. You do not need to choose a music project.</p>
    </details>

    <div className="launch-form">
      <h4>Purpose and a manageable test</h4>
      {fields.slice(0, 5).map((field, index) => <div key={field.key} className="launch-field">
        <label htmlFor={`${id}-${field.key}`}><span className="diagnostic-number">{String(index + 1).padStart(2, "0")}</span> {field.title}</label>
        <p className="form-note">{field.hint}</p>
        <textarea id={`${id}-${field.key}`} rows={3} maxLength={1200} value={plan[field.key]}
          onChange={event => update(field.key, event.target.value)} placeholder="My current thinking…" />
      </div>)}

      <h4>Conditions, evidence and feedback</h4>
      {fields.slice(5).map((field, index) => <div key={field.key} className="launch-field">
        <label htmlFor={`${id}-${field.key}`}><span className="diagnostic-number">{String(index + 6).padStart(2, "0")}</span> {field.title}</label>
        <p className="form-note">{field.hint}</p>
        <textarea id={`${id}-${field.key}`} rows={3} maxLength={1200} value={plan[field.key]}
          onChange={event => update(field.key, event.target.value)} placeholder="My current thinking…" />
      </div>)}

      <button type="button" className="feedback-button" disabled={!complete}
        onClick={() => { setReviewed(true); setPreparedText(""); }}>Review my First Move Card</button>
      {!complete && <p className="form-note" role="status">Complete all ten short prompts to review the card. If a resource or permission is unavailable, you can name that obstacle and propose a safe alternative.</p>}
      {onPrepareResponse && !reviewed && <div className="launch-working-copy">
        <p className="form-note">Need to pause? Prepare an incomplete working copy in the course response box, then select <strong>Save draft</strong>. It will not automatically save or share. You can continue editing the saved text later; these form fields do not automatically reload from that draft.</p>
        <button type="button" className="secondary-button" disabled={!hasWorkingContent}
          onClick={() => setPreparedText(onPrepareResponse(summary) ? summary : "")}>Prepare working copy for Save draft</button>
        {preparedText === summary && <p role="status" className="form-success">Working copy prepared, <strong>not saved or submitted</strong>. Select Save draft in your course response area below.</p>}
      </div>}
    </div>

    {reviewed && <section className="launch-review" aria-live="polite">
      <p className="eyebrow">Private planning review · no score</p>
      <h4>Your plan is ready for a feasibility conversation</h4>
      <ul>
        <li><strong>Purpose → action:</strong> Does your smallest action tell you something useful about the purpose?</li>
        <li><strong>Conditions → safety:</strong> If time, access or permission changes, will your substitute still be safe?</li>
        <li><strong>Evidence → decision:</strong> Could your notes reveal a limit, surprise or next question—even without a success?</li>
      </ul>
      <p className="form-note">This check confirms the prompts are filled in; it does not determine whether your plan is good, safe or feasible. That judgment needs you and, where appropriate, a trusted facilitator.</p>
      <label htmlFor={`${id}-copy`}>Your First Move Card (select and copy if useful)</label>
      <textarea id={`${id}-copy`} rows={13} readOnly value={summary} />
      {onPrepareResponse ? <>
        <button type="button" className="secondary-button"
          onClick={() => setPreparedText(onPrepareResponse(summary) ? summary : "")}>Use this card in my course response</button>
        {preparedText === summary && <p role="status" className="form-success">Your plan is in the course response box. It is <strong>not saved or shared yet</strong>. Choose Save draft or Share with facilitator (final) when ready.</p>}
      </> : <p className="form-note">Preview only: the card is not stored or sent. Copy it if you want to keep a working version.</p>}
      <p><strong>Next:</strong> Ask for feedback. If you share a final response, it becomes an immutable course record; later revisions should be documented in a separate follow-up, not silently overwrite it.</p>
    </section>}
  </section>;
}
