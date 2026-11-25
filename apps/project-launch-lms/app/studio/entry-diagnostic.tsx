"use client";

import { useCallback, useId, useState } from "react";
import type { LessonProgressIdentity } from "./project-direction-lesson";
import { usePrivateLessonDraft } from "./use-private-lesson-draft";

const prompts = [
  {
    label: "Two interests, questions, or problems",
    help: "These can be small. Choose things you can discuss without revealing sensitive information.",
    question: "List two interests, questions, or problems you are curious about.",
  },
  {
    label: "Something you tried to learn or do",
    help: "Think about a project, skill, or everyday task that needed more than one step.",
    question: "What helped you begin? What got in the way?",
  },
  {
    label: "A more testable direction",
    help: "Compare “Make something that helps everyone” with “Create a two-minute guide showing a beginner how to repair a loose bicycle chain with a trusted adult’s help.” You may use an equivalently safe topic instead.",
    question: "Which could you test more easily this week? Name one constraint.",
  },
  {
    label: "A tiny first move",
    help: "This is only a starting thought, not a promise to do the action.",
    question: "If you chose one of your interests, what is one small, safe first move you might try?",
  },
] as const;

type ReflectionSnapshot = { version: 1;  confidence: number | null; answers: string[]; };
function normalizeReflection(raw: unknown): ReflectionSnapshot | null {
  if (!raw || typeof raw !== "object" || !("version" in raw) || raw.version !== 1) return null;
  const value = raw as Partial<ReflectionSnapshot>;
  const text = (input: unknown, max = 2500) => typeof input === "string" ? input.slice(0, max) : "";
  const rating = (input: unknown) => typeof input === "number" && Number.isInteger(input) && input >= 1 && input <= 5 ? input : null;
  return { version: 1, confidence: rating(value.confidence), answers: prompts.map((_, index) => text(value.answers?.[index])) };
}
export function EntryDiagnostic({ onPrepareResponse, progress, onStructuredDirty }: {
  onPrepareResponse?: (text: string) => boolean;
  progress?: LessonProgressIdentity;
  onStructuredDirty?: (dirty: boolean) => void;
}) {
  const id = useId();
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const restore = useCallback((value: ReflectionSnapshot) => {
    setConfidence(value.confidence); setAnswers(value.answers); setReviewed(false); setPrepared(false);
  }, []);
  const draft = usePrivateLessonDraft({ progress, lessonKey: "entry-diagnostic-v1", snapshot: { version: 1, confidence, answers } as ReflectionSnapshot, restore, normalize: normalizeReflection, onDirty: onStructuredDirty });
  const canEdit = draft.status === "ready" || draft.status === "preview";
  const status = draft.status === "loading" ? "Loading saved reflection…" : draft.status === "saving" ? "Saving reflection…" : draft.status === "error" ? "Could not load saved work. Refresh before editing." : draft.dirty ? "Unsaved reflection changes" : draft.savedOnce ? "Reflection saved privately" : "No saved reflection yet";
  const saveButton = <button type="button" className="secondary-button" disabled={draft.status !== "ready" || (!draft.dirty && draft.savedOnce)} onClick={() => void draft.save()}>Save reflection draft</button>;
  const complete = answers.every(answer => answer.trim().length > 0) && confidence !== null;
  const summary = [
    "Project Launch Lab — Entry diagnostic (ungraded)",
    ...prompts.map((prompt, index) => `${index + 1}. ${prompt.question}\nContext: ${prompt.help}\nResponse: ${answers[index].trim()}`),
    `5. Starting confidence (1 = not yet confident, 5 = very confident): ${confidence ?? "Not answered"}`,
  ].join("\n\n");

  return (
    <section className="entry-diagnostic" aria-labelledby={id + "-heading"}>
      <div className="diagnostic-intro">
        <p className="eyebrow">Before Module 1 · 5–8 minutes</p>
        <h3 id={id + "-heading"}>Where are you starting?</h3>
        <p>These five questions help you notice your current thinking. This is not a test of whether you already know how to launch a project. There are no right answers or scores.</p>
        <p className="form-note">Avoid names, addresses, private stories, identifiable photos or other sensitive details. You can revise your ideas later. You do not need an AI tool.</p>
      </div>
      {progress && <div className="comparison-save-bar"><div><p className="eyebrow">Private workspace</p><p className="form-note" role="status">{status}</p></div>{saveButton}</div>}
      {draft.error && <p className="form-error" role="alert">{draft.error}</p>}
      {progress && <p className="form-note">Save any time and return to your previous answers. Saving is private; it does not share your reflection.</p>}
      <fieldset className="diagnostic-form comparison-work-fields" disabled={!canEdit} aria-label="Your starting reflection">
        {prompts.map((prompt, index) => (
          <div className="diagnostic-question" key={prompt.label}>
            <label htmlFor={id + "-answer-" + index}><span className="diagnostic-number">0{index + 1}</span> {prompt.label}</label>
            <p>{prompt.help}</p>
            <textarea id={id + "-answer-" + index} rows={3} maxLength={2500}
              value={answers[index]} onChange={event => {
                const value = event.target.value;
                setAnswers(previous => previous.map((answer, position) => position === index ? value : answer));
                setReviewed(false); setPrepared(false);
              }} placeholder={index === 0 ? "I wonder about… and I care about…" : "My starting thought is…"} />
          </div>
        ))}
        <fieldset className="diagnostic-confidence">
          <legend><span className="diagnostic-number">05</span> How confident are you that you could narrow a big idea to one first action that fits your time and resources?</legend>
          <div className="diagnostic-scale">
            {[1, 2, 3, 4, 5].map(number => <label key={number}>
              <input type="radio" name={id + "-confidence"} checked={confidence === number}
                onChange={() => { setConfidence(number); setReviewed(false); setPrepared(false); }} />
              <span>{number}</span>
            </label>)}
          </div>
          <p className="form-note">1 = not yet confident · 5 = very confident. This is how you feel, not a grade or proof of skill.</p>
        </fieldset>
        {progress && saveButton}
        <button type="button" className="feedback-button" disabled={!complete}
          onClick={() => { setReviewed(true); setPrepared(false); }}>Review my starting point</button>
        {!complete && <p className="form-note">Answer all five questions to see the explanatory feedback. Short notes are fine.</p>}
      </fieldset>
      {reviewed && <section className="diagnostic-feedback" aria-live="polite" aria-labelledby={id + "-feedback"}>
        <p className="eyebrow">Your starting-point feedback</p>
        <h4 id={id + "-feedback"}>A focused first question creates a path to learning.</h4>
        <p>A direction usually becomes easier to test when you can describe whom or what it is for, what you can safely try, and what resources or permissions you actually have. A small first step is a way to gather information, not a smaller ambition.</p>
        <p>Look back at your comparison. Does the more focused direction name a realistic test? If you identified a barrier, that is useful evidence about feasibility—not a reason to abandon the interest.</p>
        <p className="form-note">You are not graded on your starting point. You can compare your confidence with the same question at the end of the lab. A confidence change is self-report, not proof of competence.</p>
        {progress && draft.dirty && <div className="comparison-save-bar"><p className="form-note">Save your reflection before sharing.</p>{saveButton}</div>}
        {onPrepareResponse && <button type="button" className="secondary-button" onClick={() => {
          const accepted = onPrepareResponse(summary); setPrepared(accepted); if (accepted) document.getElementById("learner-response")?.focus();
        }}>Use these answers in my course response</button>}
        {prepared && <p role="status" className="form-success">Your answers are now in the course response box below. They are <strong>not saved or submitted yet</strong>. Choose Save draft, or share them with your facilitator when you are ready.</p>}
        {!onPrepareResponse && <>
          <label htmlFor={id + "-summary"}>Your responses (select and copy if you want to keep them)</label>
          <textarea id={id + "-summary"} readOnly rows={10} value={summary} />
          <p className="form-note">This view cannot share a response. Copy your answers if useful.</p>
        </>}
      </section>}
    </section>
  );
}
