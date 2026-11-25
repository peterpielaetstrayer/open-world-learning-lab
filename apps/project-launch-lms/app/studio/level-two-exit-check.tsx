"use client";

import { useCallback, useId, useState } from "react";
import type { LessonProgressIdentity } from "./project-direction-lesson";
import { usePrivateLessonDraft } from "./use-private-lesson-draft";

const commitmentOptions = [
  "Try one safe, bounded first action",
  "Ask a trusted person for feedback or permission",
  "Identify a resource or barrier before acting",
  "Pause and reconsider my direction",
] as const;

type ReflectionSnapshot = { version: 1; confidenceReason: string; revisionBarrier: string; nextStep: string; transfer: string; commitment: string; confidence: number | null; willingness: number | null;  };
function normalizeReflection(raw: unknown): ReflectionSnapshot | null {
  if (!raw || typeof raw !== "object" || !("version" in raw) || raw.version !== 1) return null;
  const value = raw as Partial<ReflectionSnapshot>;
  const text = (input: unknown, max = 2500) => typeof input === "string" ? input.slice(0, max) : "";
  const rating = (input: unknown) => typeof input === "number" && Number.isInteger(input) && input >= 1 && input <= 5 ? input : null;
  return { version: 1, confidenceReason: text(value.confidenceReason, 2000), revisionBarrier: text(value.revisionBarrier, 2000), nextStep: text(value.nextStep), transfer: text(value.transfer), commitment: commitmentOptions.find(option => option === value.commitment) ?? "", confidence: rating(value.confidence), willingness: rating(value.willingness) };
}
export function LevelTwoExitCheck({ onPrepareResponse, progress, onStructuredDirty }: {
  onPrepareResponse?: (text: string) => boolean;
  progress?: LessonProgressIdentity;
  onStructuredDirty?: (dirty: boolean) => void;
}) {
  const id = useId();
  const [confidence, setConfidence] = useState<number | null>(null);
  const [confidenceReason, setConfidenceReason] = useState("");
  const [willingness, setWillingness] = useState<number | null>(null);
  const [revisionBarrier, setRevisionBarrier] = useState("");
  const [commitment, setCommitment] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [transfer, setTransfer] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const restore = useCallback((value: ReflectionSnapshot) => {
    setConfidenceReason(value.confidenceReason); setRevisionBarrier(value.revisionBarrier); setNextStep(value.nextStep); setTransfer(value.transfer); setCommitment(value.commitment); setConfidence(value.confidence); setWillingness(value.willingness); setReviewed(false); setPrepared(false);
  }, []);
  const draft = usePrivateLessonDraft({ progress, lessonKey: "level-two-exit-check-v1", snapshot: { version: 1, confidenceReason, revisionBarrier, nextStep, transfer, commitment, confidence, willingness } as ReflectionSnapshot, restore, normalize: normalizeReflection, onDirty: onStructuredDirty });
  const canEdit = draft.status === "ready" || draft.status === "preview";
  const status = draft.status === "loading" ? "Loading saved reflection…" : draft.status === "saving" ? "Saving reflection…" : draft.status === "error" ? "Could not load saved work. Refresh before editing." : draft.dirty ? "Unsaved reflection changes" : draft.savedOnce ? "Reflection saved privately" : "No saved reflection yet";
  const saveButton = <button type="button" className="secondary-button" disabled={draft.status !== "ready" || (!draft.dirty && draft.savedOnce)} onClick={() => void draft.save()}>Save reflection draft</button>;

  const complete = confidence !== null && willingness !== null && commitment.length > 0 &&
    [confidenceReason, revisionBarrier, nextStep, transfer].every(value => value.trim().length > 0);
  const summary = [
    "Project Launch Lab — Your Next Move (ungraded exit reflection)",
    `1. Confidence in narrowing an idea to a feasible first action (1–5): ${confidence ?? "Not answered"}`,
    `Reason: ${confidenceReason.trim()}`,
    `2. Willingness to reconsider a plan after unexpected evidence (1–5): ${willingness ?? "Not answered"}`,
    `What might make revision difficult: ${revisionBarrier.trim()}`,
    `3. Intended next step: ${commitment || "Not answered"}`,
    `Small action or honest barrier: ${nextStep.trim()}`,
    `4. New-context transfer: ${transfer.trim()}`,
    "Interpretation: Ratings and intention are self-reports, not proof of behavior or learning gains.",
  ].join("\n\n");
  function changed() { setReviewed(false); setPrepared(false); }

  return <section className="entry-diagnostic" aria-labelledby={id + "-heading"}>
    <div className="diagnostic-intro">
      <p className="eyebrow">After your project work · 5–8 minutes</p>
      <h3 id={id + "-heading"}>Your Next Move</h3>
      <p>This short reflection helps you notice how prepared you feel to use your project-planning skills beyond this course. There are no right or wrong ratings. This reflection is not graded and does not replace the knowledge check, Project Direction Brief or Launch Portfolio. Those assessments provide separate evidence of learning; the course evaluation asks about your experience of the course.</p>
      <p className="form-note">Choose a safe, low-resource next step or describe a genuine barrier. You do not need to take an action, use an AI tool, identify another person or share private information to complete this reflection.</p>
    </div>
    {progress && <div className="comparison-save-bar"><div><p className="eyebrow">Private workspace</p><p className="form-note" role="status">{status}</p></div>{saveButton}</div>}
    {draft.error && <p className="form-error" role="alert">{draft.error}</p>}
    {progress && <p className="form-note">Save any time and return to your previous answers. Saving is private; it does not share your reflection.</p>}
    <fieldset className="diagnostic-form comparison-work-fields" disabled={!canEdit} aria-label="Your exit reflection">
      <fieldset className="diagnostic-confidence">
        <legend><span className="diagnostic-number">01</span> How confident are you that you could narrow a big idea to one first action that fits your time and resources?</legend>
        <div className="diagnostic-scale">
          {[1, 2, 3, 4, 5].map(number => <label key={number}>
            <input type="radio" name={id + "-confidence"} checked={confidence === number}
              onChange={() => { setConfidence(number); changed(); }} />
            <span>{number}</span>
          </label>)}
        </div>
        <p className="form-note">1 = Not yet confident · 5 = Very confident. This is your judgment about readiness, not a skill score.</p>
        <label htmlFor={id + "-confidence-reason"}>What is one reason for your rating?</label>
        <textarea id={id + "-confidence-reason"} rows={2} maxLength={2000}
          value={confidenceReason} onChange={event => { setConfidenceReason(event.target.value); changed(); }} />
      </fieldset>

      <fieldset className="diagnostic-confidence">
        <legend><span className="diagnostic-number">02</span> If a small test gives an unexpected result, how willing would you be to revisit your plan rather than treat that result as failure?</legend>
        <div className="diagnostic-scale">
          {[1, 2, 3, 4, 5].map(number => <label key={number}>
            <input type="radio" name={id + "-willingness"} checked={willingness === number}
              onChange={() => { setWillingness(number); changed(); }} />
            <span>{number}</span>
          </label>)}
        </div>
        <p className="form-note">1 = Not willing yet · 5 = Very willing. This is how you feel; it does not demonstrate how you will act.</p>
        <label htmlFor={id + "-revision-barrier"}>What might make revising a plan difficult?</label>
        <textarea id={id + "-revision-barrier"} rows={2} maxLength={2000}
          value={revisionBarrier} onChange={event => { setRevisionBarrier(event.target.value); changed(); }} />
      </fieldset>

      <fieldset className="diagnostic-confidence">
        <legend><span className="diagnostic-number">03</span> Which next move feels realistic for you within the next week?</legend>
        {commitmentOptions.map(option => <label className="option" key={option}>
          <input type="radio" name={id + "-commitment"} checked={commitment === option}
            onChange={() => { setCommitment(option); changed(); }} />
          <span>{option}</span>
        </label>)}
        <label htmlFor={id + "-next-step"}>Name the smallest possible step or explain a genuine barrier. This is a plan, not a promise or a claim that you already acted.</label>
        <textarea id={id + "-next-step"} rows={3} maxLength={2500}
          value={nextStep} onChange={event => { setNextStep(event.target.value); changed(); }} />
      </fieldset>

      <div className="diagnostic-question">
        <label htmlFor={id + "-transfer"}><span className="diagnostic-number">04</span> Try the approach in a new setting</label>
        <p>Imagine a club wants to create a huge community mural next week but has only one hour and no permission to paint a wall. What would you check first to find a relevant, feasible and focused way to learn something? You can propose a different safe example if you prefer.</p>
        <textarea id={id + "-transfer"} rows={3} maxLength={2500}
          value={transfer} onChange={event => { setTransfer(event.target.value); changed(); }} />
        <p className="form-note">This is a practice explanation, not a graded performance claim. You do not need to actually organize a mural.</p>
      </div>

      {progress && saveButton}
      <button type="button" className="feedback-button" disabled={!complete}
        onClick={() => { setReviewed(true); setPrepared(false); }}>Review my next move</button>
      {!complete && <p className="form-note">Choose both ratings, one next-move option, and write brief responses to review your reflection.</p>}
    </fieldset>

    {reviewed && <section className="diagnostic-feedback" aria-live="polite" aria-labelledby={id + "-feedback"}>
      <h4 id={id + "-feedback"}>You can change your direction when you learn something new.</h4>
      <p>Your confidence and willingness ratings describe how you feel now. Your proposed next action describes an intention. Neither proves that you have already taken the step. Your new-setting explanation is a chance to practice checking relevance, feasibility and scope.</p>
      <p>Before you continue, ask yourself: Is the first move safe and genuinely possible with the permissions and resources available? What evidence could change your thinking?</p>
      {progress && draft.dirty && <div className="comparison-save-bar"><p className="form-note">Save your reflection before sharing.</p>{saveButton}</div>}
      {onPrepareResponse ? <>
        <button type="button" className="secondary-button" onClick={() => { const accepted = onPrepareResponse(summary); setPrepared(accepted); if (accepted) document.getElementById("learner-response")?.focus(); }}>
          Use these answers in my course response
        </button>
        {prepared && <p role="status" className="form-success">Your reflection was placed in the course response box. It is <strong>not saved or submitted yet</strong>. Choose Save draft or Share with facilitator separately.</p>}
      </> : <>
        <label htmlFor={id + "-summary"}>Your reflection (select and copy if you want to keep it)</label>
        <textarea id={id + "-summary"} readOnly rows={10} value={summary} />
        <p className="form-note">{progress ? "This view cannot share a response. Copy your reflection if useful." : "This preview does not save answers to a learner account. Copy your reflection if useful."}</p>
      </>}
    </section>}
  </section>;
}
