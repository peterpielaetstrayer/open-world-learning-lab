"use client";

import { useCallback, useId, useState } from "react";
import type { LessonProgressIdentity } from "./project-direction-lesson";
import { usePrivateLessonDraft } from "./use-private-lesson-draft";
import type { FirstMovePlan } from "./first-move-card";

type FeedbackState = "received" | "pending" | null;
type ResponseDecision = "revised" | "retained" | null;

type SavedWork = { version: 1; originalAction: string; receivedFeedback: string; pendingQuestion: string; decisionReason: string; revisedAction: string; stillUnknown: string; nextCheckpoint: string; feedbackState: "received" | "pending" | null; responseDecision: "revised" | "retained" | null;  };
function normalizeWork(raw: unknown): SavedWork | null {
  if (!raw || typeof raw !== "object" || !("version" in raw) || raw.version !== 1) return null;
  const value = raw as Partial<SavedWork>;
  const asText = (text: unknown) => typeof text === "string" ? text.slice(0, 1200) : "";
  
  return { version: 1, originalAction: asText(value.originalAction), receivedFeedback: asText(value.receivedFeedback), pendingQuestion: asText(value.pendingQuestion), decisionReason: asText(value.decisionReason), revisedAction: asText(value.revisedAction), stillUnknown: asText(value.stillUnknown), nextCheckpoint: asText(value.nextCheckpoint), feedbackState: value.feedbackState === "received" || value.feedbackState === "pending" ? value.feedbackState : null, responseDecision: value.responseDecision === "revised" || value.responseDecision === "retained" ? value.responseDecision : null };
}

export function FirstMoveRevision({ plan, onPrepareResponse, progress, onStructuredDirty }: {
  progress?: LessonProgressIdentity;
  onStructuredDirty?: (dirty: boolean) => void;
  plan?: FirstMovePlan;
  onPrepareResponse?: (text: string) => boolean;
}) {
  const id = useId();
  const [originalAction, setOriginalAction] = useState("");
  const [feedbackState, setFeedbackState] = useState<FeedbackState>(null);
  const [receivedFeedback, setReceivedFeedback] = useState("");
  const [pendingQuestion, setPendingQuestion] = useState("");
  const feedbackText = feedbackState === "received" ? receivedFeedback : pendingQuestion;
  const setFeedbackText = feedbackState === "received" ? setReceivedFeedback : setPendingQuestion;
  const [responseDecision, setResponseDecision] = useState<ResponseDecision>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [revisedAction, setRevisedAction] = useState("");
  const [stillUnknown, setStillUnknown] = useState("");
  const [nextCheckpoint, setNextCheckpoint] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [preparedText, setPreparedText] = useState("");
  const restore = useCallback((value: SavedWork) => {
    setOriginalAction(value.originalAction); setReceivedFeedback(value.receivedFeedback); setPendingQuestion(value.pendingQuestion); setDecisionReason(value.decisionReason); setRevisedAction(value.revisedAction); setStillUnknown(value.stillUnknown); setNextCheckpoint(value.nextCheckpoint); setFeedbackState(value.feedbackState); setResponseDecision(value.responseDecision);
    setReviewed(false); setPreparedText("");
  }, []);
  const draft = usePrivateLessonDraft({ progress, lessonKey: "first-move-revision-v1", snapshot: { version: 1, originalAction, receivedFeedback, pendingQuestion, decisionReason, revisedAction, stillUnknown, nextCheckpoint, feedbackState, responseDecision } as SavedWork, restore, normalize: normalizeWork, onDirty: onStructuredDirty });
  const canEdit = draft.status === "ready" || draft.status === "preview";
  const status = draft.status === "loading" ? "Loading saved work…" : draft.status === "saving" ? "Saving your work…" : draft.status === "error" ? "Could not load saved work. Refresh before editing." : draft.dirty ? "Unsaved revision changes" : draft.savedOnce ? "Your revision is saved privately" : "No saved revision yet";
  const saveButton = <button type="button" className="secondary-button" disabled={draft.status !== "ready" || (!draft.dirty && draft.savedOnce)} onClick={() => void draft.save()}>Save revision draft</button>;

  const original = originalAction.trim() || plan?.firstAction.trim() || "";
  const complete = Boolean(
    original && feedbackState === "received" && feedbackText.trim()
    && responseDecision && decisionReason.trim()
    && (responseDecision === "retained" || revisedAction.trim())
    && stillUnknown.trim() && nextCheckpoint.trim()
  );
  const summary = [
    "PROJECT LAUNCH LAB · FIRST MOVE FEEDBACK & REVISION RECORD",
    "Ungraded formative follow-up · separate from the original First Move Card.",
    !complete ? "INCOMPLETE WORKING COPY — feedback and a reasoned decision are required before sharing final." : "",
    "",
    "Original First Move Card action (learner-supplied reference): " + (original || "(not provided)"),
    "Feedback status: " + (feedbackState === "received" ? "Actual feedback received" : feedbackState === "pending" ? "Awaiting feedback" : "Not recorded"),
    feedbackState === "received" ? "Actual feedback received (quote or paraphrase): " + feedbackText.trim() : "Question or note while awaiting feedback: " + feedbackText.trim(),
    feedbackState === "received"
      ? "My response: " + (responseDecision === "revised" ? "Revised the plan" : responseDecision === "retained" ? "Retained the plan with reasons" : "Not decided")
      : "No claim of revision or retention after feedback.",
    feedbackState === "received" ? "Why: " + decisionReason.trim() : "",
    feedbackState === "received" && responseDecision === "revised" ? "Revised safe first action or relevant planning change: " + revisedAction.trim() : "",
    "What still needs testing: " + stillUnknown.trim(),
    "Next safe step or checkpoint: " + nextCheckpoint.trim(),
    "",
    "The referenced original plan remains a separate record. This response does not overwrite or verify its submitted content.",
    "A revised plan is not proof that an action was attempted. Actual attempts or genuine obstacles belong in a later evidence record.",
  ].filter(Boolean).join("\n");

  function invalidate() {
    setReviewed(false);
    setPreparedText("");
  }

  return <section className="launch-card" aria-labelledby={id + "-heading"}>
    <header className="diagnostic-intro">
      <p className="eyebrow">Module 2 · First Move Studio & Feedback · Ungraded follow-up</p>
      <h3 id={id + "-heading"}>Show what feedback changed—or why you kept your plan</h3>
      <p>Keep your original First Move Card intact. Use this <strong>separate revision record</strong> to explain the feedback you actually received and the decision you made afterward.</p>
      <p className="form-note">Return to your original card and published comments in Feedback. This activity keeps your original submission intact. Enter the feedback you actually received; it is not copied automatically.</p>
      <p className="form-note">Do not invent feedback, name another learner, include private information, or attempt an unsafe action. If feedback has not arrived, keep a working copy and wait to claim a feedback-informed revision.</p>
    </header>

    {progress && <div className="comparison-save-bar"><div><p className="eyebrow">Private workspace</p><p className="form-note" role="status">{status}</p></div>{saveButton}</div>}
    {draft.error && <p role="alert" className="form-error">{draft.error}</p>}
    {progress && <p className="form-note">Save at any point, even while waiting for feedback. Your fields will be restored when you return. Saving does not share your work.</p>}
    <fieldset className="launch-form comparison-work-fields" aria-label="Your revision" disabled={!canEdit}>
      {plan?.firstAction.trim() && <div className="launch-plan-context">
        <strong>Current in-page plan for reference (not a verified submitted card):</strong> {plan.firstAction}
      </div>}
      <div className="launch-field">
        <label htmlFor={id + "-original"}>Original First Move Card action or relevant excerpt</label>
        <p className="form-note">Refer to your previously shared card. Copy only the relevant action or excerpt; your original card remains unchanged.</p>
        <textarea id={id + "-original"} rows={3} maxLength={1200} value={originalAction}
          onChange={event => { setOriginalAction(event.target.value); invalidate(); }}
          placeholder="In my first card, I planned to…" />
      </div>

      <fieldset className="launch-route-choice">
        <legend>Have you actually received feedback on the First Move Card?</legend>
        <label><input type="radio" name={id + "-feedback"} checked={feedbackState === "received"}
          onChange={() => { setFeedbackState("received"); invalidate(); }} />
          <span>Yes, feedback has arrived</span></label>
        <label><input type="radio" name={id + "-feedback"} checked={feedbackState === "pending"}
          onChange={() => { setFeedbackState("pending"); invalidate(); }} />
          <span>Not yet; I am still waiting</span></label>
      </fieldset>

      {feedbackState && <div className="launch-field">
        <label htmlFor={id + "-feedback-text"}>{feedbackState === "received"
          ? "What feedback did you actually receive? (quote or accurate paraphrase)"
          : "What question are you waiting to have answered?"}</label>
        <p className="form-note">Focus on useful guidance, not the feedback provider&apos;s name or personal details.</p>
        <textarea id={id + "-feedback-text"} rows={3} maxLength={1200} value={feedbackText}
          onChange={event => { setFeedbackText(event.target.value); invalidate(); }} />
      </div>}
      {feedbackState === "pending" && <div className="direction-insight" role="status">
        <strong>Feedback pending.</strong> You can copy a working note below, but you cannot
        prepare a final revision record until you have real feedback and can explain
        what you decided. Keep your earlier First Move Card unchanged.
      </div>}

      {feedbackState === "received" && <>
        <fieldset className="launch-route-choice">
          <legend>What did you decide after considering that feedback?</legend>
          <label><input type="radio" name={id + "-decision"} checked={responseDecision === "revised"}
            onChange={() => { setResponseDecision("revised"); invalidate(); }} />
            <span>I revised my plan</span></label>
          <label><input type="radio" name={id + "-decision"} checked={responseDecision === "retained"}
            onChange={() => { setResponseDecision("retained"); invalidate(); }} />
            <span>I kept the plan and can explain why</span></label>
        </fieldset>
        {responseDecision && <div className="launch-field">
          <label htmlFor={id + "-reason"}>{responseDecision === "revised"
            ? "What did the feedback change in your reasoning?"
            : "Why is keeping the original plan still justified?"}</label>
          <p className="form-note">Name the constraint, evidence or assumption that supports your decision. Agreement with feedback is not automatic.</p>
          <textarea id={id + "-reason"} rows={3} maxLength={1200} value={decisionReason}
            onChange={event => { setDecisionReason(event.target.value); invalidate(); }} />
        </div>}
        {responseDecision === "revised" && <div className="launch-field">
          <label htmlFor={id + "-revision"}>My revised safe first action or changed planning step</label>
          <p className="form-note">Be specific about what is different. The earlier card is preserved as the before version.</p>
          <textarea id={id + "-revision"} rows={3} maxLength={1200} value={revisedAction}
            onChange={event => { setRevisedAction(event.target.value); invalidate(); }} />
        </div>}
      </>}

      <div className="launch-field">
        <label htmlFor={id + "-unknown"}>What remains uncertain or untested?</label>
        <textarea id={id + "-unknown"} rows={3} maxLength={1200} value={stillUnknown}
          onChange={event => { setStillUnknown(event.target.value); invalidate(); }} />
      </div>
      <div className="launch-field">
        <label htmlFor={id + "-checkpoint"}>My next safe step or feedback checkpoint</label>
        <textarea id={id + "-checkpoint"} rows={3} maxLength={1200} value={nextCheckpoint}
          onChange={event => { setNextCheckpoint(event.target.value); invalidate(); }} />
      </div>

      {progress && saveButton}
      <button type="button" className="feedback-button" disabled={!complete}
        onClick={() => { setReviewed(true); setPreparedText(""); }}>Review my feedback decision</button>
      {!complete && <p className="form-note" role="status">
        A final revision record requires the original action, actual feedback, a revised
        or retained decision with reasons, and an honest remaining question and checkpoint.
        Until then, you can copy your incomplete note below.
      </p>}
      {!complete && <div className="launch-working-copy">
        <label htmlFor={id + "-working-copy"}>Working note (copy if you need to leave)</label>
        <textarea id={id + "-working-copy"} rows={10} readOnly value={summary} />
      </div>}
    </fieldset>

    {reviewed && complete && <section className="launch-review" aria-live="polite">
      <p className="eyebrow">Before/after rationale · No score</p>
      <h4>{responseDecision === "revised" ? "You explained what changed" : "You explained why you retained your decision"}</h4>
      <p>This record makes your response to feedback inspectable. It does not certify the feedback&apos;s accuracy or show that an action has been performed.</p>
      <label htmlFor={id + "-copy"}>Your separate feedback and revision record</label>
      <textarea id={id + "-copy"} rows={13} readOnly value={summary} />
      {progress && draft.dirty && <div className="comparison-save-bar"><p className="form-note">Save your structured draft before sharing.</p>{saveButton}</div>}
      {onPrepareResponse ? <>
        <button type="button" className="secondary-button"
          onClick={() => { const prepared = onPrepareResponse(summary); setPreparedText(prepared ? summary : ""); if (prepared) document.getElementById("learner-response")?.focus(); }}>
          Use my revision record in this course activity
        </button>
        {preparedText === summary && <p className="form-success" role="status">
          Your revision record is in the course response area below. It is <strong>not saved or shared yet</strong>.
          Select Save draft or Share with facilitator (final) only when ready.
        </p>}
      </> : <p className="form-note">This view cannot share a response. Copy your work if useful.</p>}
      <p><strong>Next:</strong> Try the revised or retained first step only when it is safe and permitted, or honestly document a genuine barrier. The later evidence record must distinguish what happened from what was only planned.</p>
    </section>}
  </section>;
}
