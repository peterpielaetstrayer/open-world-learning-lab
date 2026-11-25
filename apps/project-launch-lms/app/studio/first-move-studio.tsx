"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { LessonProgressIdentity } from "./project-direction-lesson";
import { usePrivateLessonDraft } from "./use-private-lesson-draft";
import { PrivateDraftReceipt } from "./private-draft-receipt";

const decisions = [
  {
    title: "Choose what to test",
    context: "Ari wants to make a 30-second practice track for someone learning to enter on beat one. They have a phone and 20 minutes in a quiet room. Their first plan is to record the whole track.",
    prompt: "Which action would tell Ari whether the count-in gives them enough time to enter?",
    options: [
      { label: "Record the whole track and play it back with the guide.", feedback: "That could show how the complete exercise flows. It also means recording material Ari may redo if the opening cue changes." },
      { label: "Record just the count-in and first beat, then try it with the guide.", feedback: "This checks the audible cue against the guide and gives Ari a short sample they can easily revise and replay." },
      { label: "Tap through the timing in the written guide.", feedback: "A silent check can expose an unclear instruction. It leaves open whether the cue is audible and gives Ari enough time to enter." },
    ],
  },
  {
    title: "Use the result",
    context: "A peer asks what Ari needs to learn before recording the whole track. Ari tests just the opening. They follow the guide on two playbacks and miss beat one both times.",
    prompt: "What is a reasonable next move based on those two playbacks?",
    options: [
      { label: "Add a clearer spoken count-in and repeat the same check.", feedback: "The missed entries give Ari a reason to revise the cue. Repeating the same check offers a useful comparison. A later test with beginners can show how they respond." },
      { label: "Conclude that the guide fails for all beginners.", feedback: "The two playbacks describe Ari’s own experience under those conditions. They would need observations from beginners to make a claim about them." },
      { label: "Record the full track before changing the cue.", feedback: "Recording more would not resolve what Ari already observed about the opening. They can revise and retest the cue while the rest of the track is still flexible." },
    ],
  },
  {
    title: "Respond when the test is blocked",
    context: "Imagine a different outcome. Ari tries to record, but background noise makes the cue impossible to hear clearly.",
    prompt: "What can Ari do with the information they have?",
    options: [
      { label: "Mark the count-in as successful and move on.", feedback: "The recording did not let Ari evaluate the cue. Record the obstacle so the next decision reflects what they actually learned." },
      { label: "Note the obstacle, check the written timing silently, and plan another recording.", feedback: "The silent check can improve the instructions. Ari still needs a usable recording to check the audible cue, and the notes explain why that test remains open." },
      { label: "Give up the project and choose a different idea.", feedback: "The obstacle concerns where and when Ari can record. They can adjust the test conditions and keep the project direction." },
    ],
  },
];

const checklistPrompts = [
  { label: "Purpose and learning question", hint: "What does Ari want to find out about the count-in?" },
  { label: "Resources and permission", hint: "What is available, and what conditions must be respected?" },
  { label: "Safe, bounded action", hint: "Which small test would you choose, and why?" },
  { label: "Observable evidence and its limit", hint: "What could Ari observe, and what would that not establish?" },
  { label: "Constraint and fallback", hint: "If noise prevents the recording, what could Ari do instead?" },
  { label: "Privacy and sharing", hint: "How could Ari document the test without sharing identifying information?" },
] as const;

type StudioSnapshot = { version: 1; step: number; choices: (number | null)[]; reveals: boolean[]; checklist: string[] };
function normalizeStudio(raw: unknown): StudioSnapshot | null {
  if (!raw || typeof raw !== "object" || !("version" in raw) || raw.version !== 1) return null;
  const value = raw as Partial<StudioSnapshot>;
  const choices = decisions.map((decision, index) => {
    const choice = value.choices?.[index];
    return typeof choice === "number" && Number.isInteger(choice) && choice >= 0 && choice < decision.options.length ? choice : null;
  });
  return {
    version: 1,
    step: typeof value.step === "number" && Number.isInteger(value.step) && value.step >= 0 && value.step < decisions.length ? value.step : 0,
    choices,
    reveals: decisions.map((_, index) => choices[index] !== null && value.reveals?.[index] === true),
    checklist: checklistPrompts.map((_, index) => typeof value.checklist?.[index] === "string" ? value.checklist[index].slice(0, 1000) : ""),
  };
}
export function FirstMoveStudio({ review = false, onPrepareResponse, progress, onStructuredDirty }: {
  progress?: LessonProgressIdentity;
  onStructuredDirty?: (dirty: boolean) => void;
  review?: boolean;
  onPrepareResponse?: (text: string) => boolean;
}) {
  const id = useId();
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<(number | null)[]>([null, null, null]);
  const [reveals, setReveals] = useState<boolean[]>([false, false, false]);
  const choice = choices[step];
  const revealed = reveals[step];
  const decision = decisions[step];
  const heading = useRef<HTMLHeadingElement>(null);
  const focusHeading = useRef(false);
  const [checklist, setChecklist] = useState<string[]>(() => checklistPrompts.map(() => ""));
  const [prepared, setPrepared] = useState(false);
  const restore = useCallback((value: StudioSnapshot) => {
    setStep(value.step); setChoices(value.choices); setReveals(value.reveals); setChecklist(value.checklist); setPrepared(false);
  }, []);
  const draft = usePrivateLessonDraft({ progress, lessonKey: "first-move-studio-v1", snapshot: { version: 1, step, choices, reveals, checklist } as StudioSnapshot, restore, normalize: normalizeStudio, onDirty: onStructuredDirty });
  const canEdit = draft.status === "ready" || draft.status === "preview";
  const status = draft.status === "loading" ? "Loading your scenario…" : draft.status === "saving" ? "Saving your scenario…" : draft.status === "error" ? "Could not load saved work. Refresh before editing." : draft.dirty ? "Unsaved scenario changes" : draft.savedOnce ? "Scenario draft saved privately" : "No saved scenario yet";
  const saveButton = <button type="button" className="secondary-button" disabled={draft.status !== "ready" || (!draft.dirty && draft.savedOnce)} onClick={() => void draft.save()}>Save scenario draft</button>;
  const checklistComplete = checklist.every(value => value.trim());
  const summary = [
    "PROJECT LAUNCH LAB · ARI FIRST-ACTION CHECKLIST",
    "Ungraded scenario reasoning — not evidence of my own project attempt.",
    ...decisions.map((item, index) => `${item.title}: ${choices[index] === null ? "Not selected" : item.options[choices[index]!].label}`),
    ...checklistPrompts.map((item, index) => `${item.label}: ${checklist[index].trim() || "(not answered)"}`),
  ].join("\n");
  const ready = checklistComplete && reveals.every(Boolean);

  useEffect(() => {
    if (focusHeading.current) {
      heading.current?.focus();
      focusHeading.current = false;
    }
  }, [step]);

  function goTo(nextStep: number) {
    focusHeading.current = true;
    setStep(nextStep);
  }

  return (
    <section className="lab-card" aria-labelledby={`${id}-heading`}>
      {progress && <div className="comparison-save-bar"><div><p className="eyebrow">Private workspace</p><p className="form-note" role="status">{status}</p></div>{saveButton}</div>}
      {draft.error && <p className="form-error" role="alert">{draft.error}</p>}
      <fieldset className="comparison-work-fields" disabled={!canEdit} aria-label="Scenario and first-action checklist">
      <div className="lab-body">
        <p className="form-note">Decision {step + 1} of {decisions.length}</p>
        <h4 id={`${id}-heading`} tabIndex={-1} ref={heading}>{decision.title}</h4>
        <p>{decision.context}</p>
        {step === 1 && <figure className="playback-example">
          <figcaption id={`${id}-playback`}>Illustrative playback from Ari’s first test</figcaption>
          {review ? <p className="form-note">In this read-only review, use the equivalent description below. Enrolled learners can also listen to the playback.</p> : <audio controls preload="none" aria-labelledby={`${id}-playback`}
            src="/media/first-move-count-in.wav" />}
          <p>Audio description: Four high clicks count in. A lower tone marks beat one.
            Ari’s tap follows about a quarter of a second later, and the next two taps are late too.</p>
        </figure>}
        <fieldset>
          <legend>{decision.prompt}</legend>
          <div className="options">
            {decision.options.map((option, index) => (
              <label key={option.label} className={choice === index ? "option selected" : "option"}>
                <input type="radio" name={id} checked={choice === index}
                  onChange={() => {
                    setPrepared(false);
                    setChoices(previous => previous.map((answer, position) => position === step ? index : answer));
                    setReveals(previous => previous.map((shown, position) => position === step ? false : shown));
                  }} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="studio-actions">
          {step > 0 && <button type="button" className="secondary-button" onClick={() => goTo(step - 1)}>Previous decision</button>}
          <button type="button" className="feedback-button" disabled={choice === null || revealed}
            onClick={() => setReveals(previous => previous.map((shown, position) => position === step ? true : shown))}>Show feedback</button>
        </div>
        {revealed && choice !== null && (
          <>
            <div className="feedback" role="status">
              <p>{decision.options[choice].feedback}</p>
              {step === decisions.length - 1 && <p>Now complete the scenario checklist below before planning your own first move.</p>}
            </div>
            {step < decisions.length - 1 && (
              <button type="button" className="feedback-button" onClick={() => goTo(step + 1)}>Next decision</button>
            )}
          </>
        )}
      </div>
      <section className="lab-body" aria-labelledby={`${id}-checklist`}>
        <h4 id={`${id}-checklist`}>Apply the first-action checklist to Ari’s scenario</h4>
        <p>Use the planning ideas from Maya’s garden model in a different setting. Explain each choice in your own words. This is practice, not a grade; you will apply the checklist again to your own project.</p>
        <p className="form-note">{progress ? "Save your scenario at any point to restore your decisions, feedback and notes when you return. Saving does not share a response." : "Entries are not automatically saved. Copy your notes if you want to retain them."}</p>
        {checklistPrompts.map((item, index) => <div className="launch-field" key={item.label}>
          <label htmlFor={`${id}-check-${index}`}>{index + 1}. {item.label}</label>
          <p className="form-note" id={`${id}-check-hint-${index}`}>{item.hint}</p>
          <textarea aria-describedby={`${id}-check-hint-${index}`} id={`${id}-check-${index}`} rows={2} maxLength={1000} value={checklist[index]}
            onChange={event => {
              setPrepared(false);
              setChecklist(previous => previous.map((value, position) => position === index ? event.target.value : value));
            }} />
        </div>)}
        <details>
          <summary>Compare with one reasoned checklist</summary>
          <p>Ari wants to learn whether the opening cue supports a timely entry. A permitted phone and quiet period are useful resources. Testing just the opening is manageable. Late taps suggest Ari needs to revise the cue, but cannot establish that all beginners will struggle. If noise blocks recording, a silent timing check is a reasonable fallback, with the audible cue still untested. Private, non-identifying notes are sufficient.</p>
        </details>
        {progress && <div className="private-draft-actions">{saveButton}<PrivateDraftReceipt draft={draft} /></div>}
        {!ready && <p className="form-note">Explore feedback for all three decisions and complete the six prompts before preparing a full checklist.</p>}
        {ready && <>
          <label htmlFor={`${id}-summary`}>Your scenario checklist (copy or keep for reference)</label>
          <textarea id={`${id}-summary`} rows={10} readOnly value={summary} />
          {onPrepareResponse && <button type="button" className="secondary-button"
            onClick={() => { const accepted = onPrepareResponse(summary); setPrepared(accepted); if (accepted) document.getElementById("learner-response")?.focus(); }}>Use this checklist in my course response</button>}
          {prepared && <p role="status" className="form-success">Prepared in the response box, not saved or shared. Choose Save draft or Share with facilitator when ready.</p>}
          {!onPrepareResponse && <p className="form-note">Copy your checklist if useful. This view cannot share a response.</p>}
        </>}
      </section>
      </fieldset>
    </section>
  );
}
