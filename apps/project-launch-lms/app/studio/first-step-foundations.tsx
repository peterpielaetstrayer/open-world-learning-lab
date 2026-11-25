"use client";

import { useId, useState } from "react";

const concepts = [
  {
    title: "Purpose and a learning question",
    explanation: "Name whom or what your project could serve. Ask what a small action could help you learn, even if the outcome differs from your hopes.",
    example: "I want to improve a school garden. What would we need to know before changing even one bed?",
  },
  {
    title: "Milestones and a checkpoint",
    explanation: "Break a larger direction into at least three ordered, realistic steps. A checkpoint tells you when to review evidence and decide whether to continue.",
    example: "1. Learn the school's requirements. 2. Sketch one bed. 3. Review constraints and decide whether a permitted small test is possible.",
  },
  {
    title: "Resources, permissions and constraints",
    explanation: "Identify what you have, what needs permission or trusted support, and what could stop the plan. A low-resource, safe alternative belongs in the plan.",
    example: "No permission to change the garden? Start with a paper sketch and permitted information rather than physical changes.",
  },
  {
    title: "A bounded action and observable evidence",
    explanation: "A small step is worth trying when it can inform a decision. A prediction is an expectation; evidence is something actually observed or documented.",
    example: "Prediction: the sketch fits. Evidence, if gathered: measurements or staff feedback. Without a check, the prediction remains untested.",
  },
  {
    title: "Feedback, interpretation and the next move",
    explanation: "Feedback helps you think; it is not a command to obey. Explain why you revised a plan or why it remains defensible, and identify what is still unknown.",
    example: "If a sponsor raises an accessibility concern, change the sketch or identify the information needed before settling on a layout.",
  },
] as const;

const questions = [
  {
    title: "Identify a meaningful constraint",
    prompt: "Maya wants to redesign her school's garden but has not received permission. What most directly limits her first action?",
    choices: [
      { label: "Her interest in gardening", feedback: "Interest explains purpose, but it does not authorize a change to school property. Look for a limiting condition." },
      { label: "Missing school permission", feedback: "Yes. Permission is a real feasibility and safety constraint. Maya can prepare a sketch without changing school property." },
      { label: "The colors of the plants", feedback: "Plant choice might matter later. Permission is the immediate constraint on altering school property." },
    ],
    correct: 1,
    revisit: "Resources, permissions and constraints",
  },
  {
    title: "Choose a bounded first action",
    prompt: "Which action gathers useful information while minimizing avoidable risk and commitment?",
    choices: [
      { label: "Start digging a school garden bed immediately", feedback: "Physical changes before permission would be unsafe or unauthorized. Test a smaller question first." },
      { label: "Purchase supplies for the entire redesign", feedback: "Spending money is not needed to identify the first important constraint. Begin with what is already available." },
      { label: "Sketch one possible bed and check requirements with an approved staff sponsor", feedback: "Yes. A sketch and requirements check can reveal constraints without physical changes or spending." },
    ],
    correct: 2,
    revisit: "Milestones and a checkpoint",
  },
  {
    title: "Distinguish prediction and evidence",
    prompt: "Maya predicts that her sketch will fit and be acceptable. Which item would count as evidence, if it happened?",
    choices: [
      { label: "Feeling certain the design will be approved", feedback: "Confidence is still a prediction. It does not establish fit or permission." },
      { label: "A staff sponsor reviews the sketch and identifies concrete requirements", feedback: "Correct. This would be observed feedback, though it would not prove that the full garden would succeed." },
      { label: "Writing that everyone will love the new garden", feedback: "This predicts other people's reactions. Evidence needs an actual check, observation or feedback." },
    ],
    correct: 1,
    revisit: "A bounded action and observable evidence",
  },
] as const;

export function FirstStepMiniLesson() {
  return <section className="foundation-lesson" aria-labelledby="first-step-lesson-heading">
    <p className="eyebrow">Module 2 · Learn · 5–7 minutes</p>
    <h3 id="first-step-lesson-heading">What makes a first step feasible?</h3>
    <p>A project can matter without being ready for a large launch. A useful first action is safe, realistic and designed to reveal information—not guarantee success.</p>
    <ol className="foundation-concepts">
      {concepts.map(concept => <li key={concept.title}>
        <h4>{concept.title}</h4>
        <p>{concept.explanation}</p>
        <p className="foundation-example"><strong>Example:</strong> {concept.example}</p>
      </li>)}
    </ol>
    <div className="direction-insight"><strong>First-action checklist:</strong> Can I name my purpose, three ordered milestones, available resources, one meaningful constraint, permission or safety needs, a small informative action and the evidence I might actually collect? What is the safe alternative?</div>
    <p className="form-note">This is teaching, not a scored assignment. No purchase, public post, stranger contact, AI tool or risky action is required.</p>
  </section>;
}

const mayaPrompts = [
  { label: "Purpose", hint: "What is Maya trying to improve?" },
  { label: "Milestones", hint: "What three steps could she put in order?" },
  { label: "Resources", hint: "What information, materials or support could she use?" },
  { label: "Constraint", hint: "What is not yet available or permitted?" },
  { label: "Intended evidence", hint: "What could she actually observe or document? What would it not prove?" },
] as const;

export function MayaGardenModel() {
  const id = useId();
  const [revealed, setRevealed] = useState(false);
  const [notes, setNotes] = useState<string[]>(() => mayaPrompts.map(() => ""));
  return <section className="foundation-lesson" aria-labelledby="maya-garden-heading">
    <p className="eyebrow">Module 2 · Observe · 5 minutes</p>
    <h3 id="maya-garden-heading">Maya&apos;s school garden: a worked decision</h3>
    <p>Maya wants to improve her school garden, but a complete redesign needs supplies, time and school permission she does not have yet. She can still prepare a useful first step.</p>
    <div className="foundation-prompt">
      <h4>Think before seeing the model</h4>
      <p>Suppose Maya has paper and existing garden information. She can check school requirements with an approved sponsor, sketch one possible bed, and review the constraints before deciding whether to test it. She has not gathered measurements or received feedback yet.</p>
      <p>Identify the plan components in your own words. These brief notes are optional, ungraded practice; you can compare with the model at any time.</p>
      {mayaPrompts.map((prompt, index) => <div className="launch-field" key={prompt.label}>
        <label htmlFor={`${id}-maya-${index}`}>{prompt.label}</label>
        <p className="form-note" id={`${id}-maya-hint-${index}`}>{prompt.hint}</p>
        <textarea aria-describedby={`${id}-maya-hint-${index}`} id={`${id}-maya-${index}`} rows={2} maxLength={1000} value={notes[index]}
          onChange={event => setNotes(previous => previous.map((value, position) => position === index ? event.target.value : value))} />
      </div>)}
      <p className="form-note">Keep a private copy of any notes you want to retain. These practice fields do not automatically save or submit.</p>
      <button type="button" className="secondary-button" aria-expanded={revealed}
        onClick={() => setRevealed(value => !value)}>{revealed ? "Hide annotated model" : "Show annotated model"}</button>
    </div>
    {revealed && <div className="launch-model" role="status" aria-label="Annotated garden plan">
      <dl>
        <dt>Purpose</dt><dd>Explore one realistic improvement to a shared garden, not redesign everything at once.</dd>
        <dt>Three ordered milestones</dt><dd>1. Check school requirements. 2. Sketch one possible garden bed with available paper. 3. Review constraints before choosing any permitted small test.</dd>
        <dt>Resources, permissions and constraints</dt><dd>Paper, existing garden information and an approved staff sponsor could help. Missing permission or supplies prevents physical work now.</dd>
        <dt>Safe first action and fallback</dt><dd>Prepare a sketch and ask through approved school channels. If the permission check is unavailable, document the barrier and keep the sketch private.</dd>
        <dt>Prediction and potential evidence</dt><dd>“This bed will work” is a prediction. Measurements or specific staff feedback could be evidence if collected; planning them is not the same as collecting them.</dd>
        <dt>Limits and next decision</dt><dd>A sketch or permission check cannot prove that plants will grow. Actual feedback could justify a revision or a reasoned decision to retain the sketch.</dd>
      </dl>
      <p><strong>Compare your notes:</strong> Did you distinguish available resources from missing permission, and intended evidence from observations that have actually happened? Revise your notes if useful.</p>
      <p className="form-note">This is a hypothetical example—not a claim that Maya obtained permission, planted anything or received feedback.</p>
    </div>}
  </section>;
}

export function FirstStepChecks() {
  const id = useId();
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const changeAnswer = (index: number, value: number | null) => {
    setAnswers(previous => previous.map((answer, i) => i === index ? value : answer));
    setRevealed(previous => previous.map((shown, i) => i === index ? false : shown));
  };
  return <section className="foundation-lesson" aria-labelledby={id + "-checks-heading"}>
    <p className="eyebrow">Module 2 · Practice · 5–8 minutes · ungraded</p>
    <h3 id={id + "-checks-heading"}>Check your first-step reasoning</h3>
    <p>Choose an answer, read the explanation and try again if helpful. These checks are learning opportunities, not a score.</p>
    <div className="foundation-checks">{questions.map((question, index) => <section className="foundation-check" key={question.title} aria-labelledby={id + "-question-" + index}>
      <h4 id={id + "-question-" + index}>{index + 1}. {question.title}</h4>
      <p>{question.prompt}</p>
      <fieldset><legend>Choose the strongest response</legend>{question.choices.map((choice, position) => <label className="foundation-choice" key={choice.label}>
        <input type="radio" name={id + "-q-" + index} checked={answers[index] === position} onChange={() => changeAnswer(index, position)} />
        <span>{choice.label}</span>
      </label>)}</fieldset>
      <button type="button" className="feedback-button" disabled={answers[index] === null}
        onClick={() => setRevealed(previous => previous.map((shown, i) => i === index ? true : shown))}>Show explanation</button>
      {revealed[index] && answers[index] !== null && <div className="foundation-feedback" role="status">
        <strong>{answers[index] === question.correct ? "Reasoned choice." : "Consider the distinction."}</strong>
        <p>{question.choices[answers[index]].feedback}</p>
        <p>Revisit the lesson idea: <strong>{question.revisit}</strong>.</p>
        <button type="button" className="secondary-button" onClick={() => changeAnswer(index, null)}>Try this question again</button>
      </div>}
    </section>)}</div>
    <p className="form-note">Next, apply the checklist to a different scenario in First Move Studio. Then design your own project First Move Card. No grade or submission occurs here.</p>
  </section>;
}
