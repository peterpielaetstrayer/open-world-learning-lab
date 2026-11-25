"use client";

import { useCallback, useId, useState } from "react";
import type { LessonProgressIdentity } from "./project-direction-lesson";
import { usePrivateLessonDraft } from "./use-private-lesson-draft";
import { PrivateDraftReceipt } from "./private-draft-receipt";
import type { FirstMovePlan } from "./first-move-card";

type Route = "attempt" | "obstacle";
type Evidence = {
  attempted: string; observed: string; unexpected: string; limits: string; evidenceNote: string;
  barrier: string; safetyChoice: string; barrierLearning: string; alternative: string; untested: string;
};

const initialEvidence: Evidence = {
  attempted: "", observed: "", unexpected: "", limits: "", evidenceNote: "",
  barrier: "", safetyChoice: "", barrierLearning: "", alternative: "", untested: "",
};

const routes: Record<Route, { title: string; description: string; prompts: { key: keyof Evidence; label: string; hint: string }[] }> = {
  attempt: {
    title: "I safely tried a small first move",
    description: "Use this route only if you actually attempted something safe. Report what happened, even if the outcome was disappointing or ambiguous.",
    prompts: [
      { key: "attempted", label: "What I actually did", hint: "Describe the bounded action, without names, addresses or identifiable details." },
      { key: "observed", label: "What I observed—not what I assumed", hint: "Describe a count, note, sketch or other authentic observation. Do not claim more than you saw." },
      { key: "unexpected", label: "What differed from my prediction", hint: "A surprise or no change is useful information too." },
      { key: "limits", label: "What this single attempt cannot tell me", hint: "Identify uncertainty, sample size, setting or another limitation." },
      { key: "evidenceNote", label: "My non-sensitive evidence record", hint: "Describe the private notes or safe artifact you kept. No public upload or photo of a person is required." },
    ],
  },
  obstacle: {
    title: "A genuine obstacle prevented the first move",
    description: "Use this route when an actual access, time, permission, safety or other barrier stopped the planned attempt. You are not expected to force an unsafe action or invent an outcome.",
    prompts: [
      { key: "barrier", label: "What actually blocked the planned action", hint: "Describe the actual barrier, when it occurred, and what preparation you completed. Keep a dated note or non-identifying artifact if useful. Do not share sensitive details." },
      { key: "safetyChoice", label: "Why I did not push past the barrier", hint: "Explain the practical, ethical, safety or permission decision." },
      { key: "barrierLearning", label: "What I learned about the conditions", hint: "Distinguish a limitation in your test conditions from a conclusion about the whole idea." },
      { key: "alternative", label: "A safer or lower-resource alternative", hint: "Consider a paper model, desk-based comparison, permission request, different time, or smaller inquiry." },
      { key: "untested", label: "What remains genuinely untested", hint: "Name the original question that you still cannot answer from this obstacle." },
    ],
  },
};

type SavedWork = { version: 1; direction: string; route: Route | null; evidence: Evidence; feedbackStatus: "received" | "pending" | null; receivedFeedback: string; pendingQuestion: string; decision: "revised" | "retained" | null; decisionReason: string; nextMove: string };
function normalizeWork(raw: unknown): SavedWork | null {
  if (!raw || typeof raw !== "object" || !("version" in raw) || raw.version !== 1) return null;
  const value = raw as Partial<SavedWork>;
  const asText = (text: unknown) => typeof text === "string" ? text.slice(0, 1200) : "";
  const evidence = { ...initialEvidence };
  for (const key of Object.keys(evidence) as (keyof Evidence)[]) evidence[key] = asText(value.evidence?.[key]);
  return { version: 1, direction: asText(value.direction), route: value.route === "attempt" || value.route === "obstacle" ? value.route : null, evidence, feedbackStatus: value.feedbackStatus === "received" || value.feedbackStatus === "pending" ? value.feedbackStatus : null, receivedFeedback: asText(value.receivedFeedback), pendingQuestion: asText(value.pendingQuestion), decision: value.decision === "revised" || value.decision === "retained" ? value.decision : null, decisionReason: asText(value.decisionReason), nextMove: asText(value.nextMove) };
}
export function FirstMoveEvidence({ plan, onPrepareResponse, progress, onStructuredDirty }: {
  progress?: LessonProgressIdentity;
  onStructuredDirty?: (dirty: boolean) => void;
  plan?: FirstMovePlan;
  onPrepareResponse?: (text: string) => boolean;
}) {
  const id = useId();
  const [direction, setDirection] = useState("");
  const [route, setRoute] = useState<Route | null>(null);
  const [evidence, setEvidence] = useState<Evidence>(initialEvidence);
  const [feedbackStatus, setFeedbackStatus] = useState<"received" | "pending" | null>(null);
  const [receivedFeedback, setReceivedFeedback] = useState("");
  const [pendingQuestion, setPendingQuestion] = useState("");
  const feedbackText = feedbackStatus === "received" ? receivedFeedback : pendingQuestion;
  const setFeedbackText = feedbackStatus === "received" ? setReceivedFeedback : setPendingQuestion;
  const [decision, setDecision] = useState<"revised" | "retained" | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [nextMove, setNextMove] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [preparedText, setPreparedText] = useState("");
  const restore = useCallback((value: SavedWork) => {
    setDirection(value.direction); setRoute(value.route); setEvidence(value.evidence); setFeedbackStatus(value.feedbackStatus); setReceivedFeedback(value.receivedFeedback); setPendingQuestion(value.pendingQuestion); setDecision(value.decision); setDecisionReason(value.decisionReason); setNextMove(value.nextMove); setReviewed(false); setPreparedText("");
  }, []);
  const draft = usePrivateLessonDraft({ progress, lessonKey: "first-move-evidence-v1", snapshot: { version: 1, direction, route, evidence, feedbackStatus, receivedFeedback, pendingQuestion, decision, decisionReason, nextMove } as SavedWork, restore, normalize: normalizeWork, onDirty: onStructuredDirty });
  const canEdit = draft.status === "ready" || draft.status === "preview";
  const status = draft.status === "loading" ? "Loading saved work…" : draft.status === "saving" ? "Saving your work…" : draft.status === "error" ? "Could not load saved work. Refresh before editing." : draft.dirty ? "Unsaved evidence changes" : draft.savedOnce ? "Your evidence record is saved privately" : "No saved evidence record yet";
  const saveButton = <button type="button" className="secondary-button" disabled={draft.status !== "ready" || (!draft.dirty && draft.savedOnce)} onClick={() => void draft.save()}>Save evidence draft</button>;
  const projectDirection = direction.trim() || plan?.direction.trim() || "";
  const activePrompts = route ? routes[route].prompts : [];
  const routeComplete = route !== null && activePrompts.every(prompt => evidence[prompt.key].trim());
  const feedbackComplete = feedbackStatus === "received"
    ? Boolean(feedbackText.trim() && decision && decisionReason.trim())
    : feedbackStatus === "pending" && Boolean(feedbackText.trim());
  const complete = Boolean(projectDirection && routeComplete && feedbackComplete && nextMove.trim());
  const hasWorkingContent = Boolean(direction.trim() || route || Object.values(evidence).some(value => value.trim())
    || feedbackStatus || feedbackText.trim() || nextMove.trim());
  const summary = [
    "PROJECT LAUNCH LAB · FIRST MOVE EVIDENCE & NEXT DECISION (ungraded)",
    ...(!complete ? ["INCOMPLETE WORKING COPY — do not share as a final response yet."] : []),
    `Direction: ${projectDirection}`,
    plan?.firstAction.trim() ? `Original First Move Card action: ${plan.firstAction.trim()}` : "Original plan: see previously shared First Move Card.",
    "",
    `Honest evidence route: ${route ? routes[route].title : "Not selected"}`,
    ...(route ? routes[route].prompts.flatMap(prompt => [prompt.label, evidence[prompt.key].trim(), ""]) : []),
    `Feedback status: ${feedbackStatus === "received" ? "Actual feedback received" : feedbackStatus === "pending" ? "Not received yet" : "Not recorded"}`,
    feedbackStatus === "received" ? `Actual feedback: ${feedbackText.trim()}` : `Feedback question / pending note: ${feedbackText.trim()}`,
    feedbackStatus === "received" ? `My response to feedback: ${decision === "revised" ? "Revised the plan" : decision === "retained" ? "Retained the plan with reasons" : "Not selected"}` : "No feedback decision claimed yet.",
    feedbackStatus === "received" ? `Reasoning behind that decision: ${decisionReason.trim()}` : "",
    `Next safe project move: ${nextMove.trim()}`,
    "",
    "This record reports an actual action or genuine obstacle, not a guaranteed success or an invented result.",
    "Next: carry the evidence, limitations, feedback state, and reasoned next step into a separately graded Launch Portfolio.",
  ].filter(Boolean).join("\n");

  function update(key: keyof Evidence, value: string) {
    setEvidence(previous => ({ ...previous, [key]: value }));
    setReviewed(false); setPreparedText("");
  }
  function invalidate() { setReviewed(false); setPreparedText(""); }

  return <section className="launch-card" aria-labelledby={`${id}-title`}>
    <header className="diagnostic-intro">
      <p className="eyebrow">Module 2 · Action, evidence & reflection · variable time</p>
      <h3 id={`${id}-title`}>What actually happened?</h3>
      <p>An informative first move may produce a useful observation—or it may reveal a real barrier. Both paths matter when you explain what you know, what remains unknown, and what you would try next.</p>
      <p className="form-note">Only report an attempt you truly made or an obstacle that actually occurred. If you have not tried anything and have not encountered a genuine barrier, return to your First Move Card and save your plan. You do not need to fabricate evidence or take an unsafe action.</p>
    </header>

    {progress && <div className="comparison-save-bar"><div><p className="eyebrow">Private workspace</p><p className="form-note" role="status">{status}</p></div>{saveButton}</div>}
    {draft.error && <p role="alert" className="form-error">{draft.error}</p>}
    {progress && <p className="form-note">Save at any point, even while waiting for feedback. Your fields will be restored when you return. Saving does not share your work.</p>}
    <fieldset className="launch-form comparison-work-fields" aria-label="Your evidence record" disabled={!canEdit}>
      {plan?.direction.trim() && <div className="launch-plan-context"><strong>Your draft direction from this preview:</strong> {plan.direction}</div>}
      <div className="launch-field">
        <label htmlFor={`${id}-direction`}>Project direction (or a change to your earlier choice)</label>
        <p className="form-note">Your First Move Card remains a separate draft or course activity. If this field is blank, the current in-page plan direction is used when available.</p>
        <textarea id={`${id}-direction`} rows={2} maxLength={1200} value={direction}
          onChange={event => { setDirection(event.target.value); invalidate(); }} placeholder="The direction I am investigating…" />
      </div>

      <fieldset className="launch-route-choice">
        <legend>Choose the route that truthfully describes your experience</legend>
        {(["attempt", "obstacle"] as const).map(value => <label key={value}>
          <input type="radio" name={`${id}-route`} checked={route === value}
            onChange={() => { setRoute(value); invalidate(); }} />
          <span>{routes[value].title}</span>
        </label>)}
      </fieldset>
      {route && <div className="launch-route-panel">
        <h4>{routes[route].title}</h4>
        <p>{routes[route].description}</p>
        {activePrompts.map((prompt, index) => <div key={prompt.key} className="launch-field">
          <label htmlFor={`${id}-${prompt.key}`}>{index + 1}. {prompt.label}</label>
          <p className="form-note" id={`${id}-${prompt.key}-hint`}>{prompt.hint}</p>
          <textarea aria-describedby={`${id}-${prompt.key}-hint`} id={`${id}-${prompt.key}`} rows={3} maxLength={1200}
            value={evidence[prompt.key]} onChange={event => update(prompt.key, event.target.value)} />
        </div>)}
      </div>}

      <details className="launch-model">
        <summary>How to ask for useful feedback</summary>
        <ol>
          <li>“I can see that your plan aims to learn…”</li>
          <li>“Your first step seems feasible or difficult because…”</li>
          <li>“A condition or constraint worth planning for is…”</li>
          <li>“One question that might sharpen your evidence is…”</li>
        </ol>
        <p>You may ask a facilitator privately. Peer comments are optional; do not share personal details to request help.</p>
      </details>

      <fieldset className="launch-route-choice">
        <legend>Have you actually received feedback on this plan?</legend>
        <label><input type="radio" name={`${id}-feedback-status`} checked={feedbackStatus === "received"}
          onChange={() => { setFeedbackStatus("received"); invalidate(); }} /> <span>Yes, I can describe what someone said</span></label>
        <label><input type="radio" name={`${id}-feedback-status`} checked={feedbackStatus === "pending"}
          onChange={() => { setFeedbackStatus("pending"); setDecision(null); setDecisionReason(""); invalidate(); }} /> <span>Not yet—I will record a question instead</span></label>
      </fieldset>
      {feedbackStatus && <div className="launch-field">
        <label htmlFor={`${id}-feedback`}>{feedbackStatus === "received" ? "What feedback did you actually receive?" : "What question is still waiting for feedback?"}</label>
        <textarea id={`${id}-feedback`} rows={3} maxLength={1200} value={feedbackText}
          onChange={event => { setFeedbackText(event.target.value); invalidate(); }} />
      </div>}
      {feedbackStatus === "received" && <>
        <fieldset className="launch-route-choice">
          <legend>What did you decide after considering the feedback?</legend>
          <label><input type="radio" name={`${id}-feedback-decision`} checked={decision === "revised"}
            onChange={() => { setDecision("revised"); invalidate(); }} /> <span>I revised my plan</span></label>
          <label><input type="radio" name={`${id}-feedback-decision`} checked={decision === "retained"}
            onChange={() => { setDecision("retained"); invalidate(); }} /> <span>I kept the plan for a reason</span></label>
        </fieldset>
        <div className="launch-field">
          <label htmlFor={`${id}-decision-reason`}>Explain the change or why you kept the original plan</label>
          <p className="form-note">Judgment matters more than agreeing automatically. Name the evidence or condition behind your decision.</p>
          <textarea id={`${id}-decision-reason`} rows={3} maxLength={1200} value={decisionReason}
            onChange={event => { setDecisionReason(event.target.value); invalidate(); }} />
        </div>
      </>}
      <div className="launch-field">
        <label htmlFor={`${id}-next`}>My next safe move, based on what I now know</label>
        <textarea id={`${id}-next`} rows={3} maxLength={1200} value={nextMove}
          onChange={event => { setNextMove(event.target.value); invalidate(); }} />
      </div>
      {progress && <div className="private-draft-actions">{saveButton}<PrivateDraftReceipt draft={draft} /></div>}
      <button type="button" className="feedback-button" disabled={!complete}
        onClick={() => { setReviewed(true); setPreparedText(""); }}>Review my evidence and decision</button>
      {!complete && <p role="status" className="form-note">Choose an honest route, explain its five prompts, describe actual feedback or an unanswered feedback question, and name a safe next move. You can keep this page open while working, but nothing is autosaved.</p>}
      {!progress && onPrepareResponse && !reviewed && <div className="launch-working-copy">
        <p className="form-note">You can pause with an incomplete working copy. Preparing a course response does not write anything; select <strong>Save draft</strong> below afterward. These form fields do not automatically reload from a saved response.</p>
        <button type="button" className="secondary-button" disabled={!hasWorkingContent}
          onClick={() => setPreparedText(onPrepareResponse(summary) ? summary : "")}>Prepare working evidence for Save draft</button>
        {preparedText === summary && <p role="status" className="form-success">Working copy prepared, <strong>not saved or shared</strong>. Select Save draft below.</p>}
      </div>}
    </fieldset>

    {reviewed && <section className="launch-review" aria-live="polite">
      <p className="eyebrow">Evidence and next-step check · no score</p>
      <h4>{route === "obstacle" ? "A barrier is legitimate evidence about conditions" : "A small attempt can produce informative evidence"}</h4>
      <p>{route === "obstacle"
        ? "Your record distinguishes the real barrier from the project’s larger potential. You have named what remains untested and a safer alternative to consider."
        : "Your record describes a bounded action and observations. Think about whether your conclusion stays within what that one attempt can actually show."}</p>
      <p className="form-note">This is explanatory guidance, not a judgment that your evidence is authentic or your plan is safe. A facilitator can review your reasoning after you deliberately share the response.</p>
      <label htmlFor={`${id}-copy`}>Your evidence and reflection (select and copy if useful)</label>
      <textarea id={`${id}-copy`} rows={14} readOnly value={summary} />
      {progress && <div className="comparison-save-bar"><div><p className="form-note">Keep your structured work before sharing.</p><PrivateDraftReceipt draft={draft} /></div>{saveButton}</div>}
      {onPrepareResponse ? <>
        <button type="button" className="secondary-button"
          onClick={() => { const prepared = onPrepareResponse(summary); setPreparedText(prepared ? summary : ""); if (prepared) document.getElementById("learner-response")?.focus(); }}>Use this record in my course response</button>
        {preparedText === summary && <p role="status" className="form-success">Your evidence record is in the course response box. It is <strong>not saved or shared yet</strong>. Save a draft or share it with your facilitator when ready.</p>}
      </> : <p className="form-note">This view cannot share a response. Keep a private copy if useful.</p>}
      <p><strong>Next:</strong> Use your plan, genuine observation or barrier, feedback status and next decision in the separately graded Launch Portfolio. Never invent a successful test to fill a portfolio.</p>
    </section>}
  </section>;
}
