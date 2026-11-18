"use client";

import { useEffect, useId, useRef, useState } from "react";

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

export function FirstMoveStudio() {
  const id = useId();
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<(number | null)[]>([null, null, null]);
  const [reveals, setReveals] = useState<boolean[]>([false, false, false]);
  const choice = choices[step];
  const revealed = reveals[step];
  const decision = decisions[step];
  const heading = useRef<HTMLHeadingElement>(null);
  const focusHeading = useRef(false);

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
      <div className="lab-body">
        <p className="form-note">Decision {step + 1} of {decisions.length}</p>
        <h4 id={`${id}-heading`} tabIndex={-1} ref={heading}>{decision.title}</h4>
        <p>{decision.context}</p>
        {step === 1 && <figure className="playback-example">
          <figcaption id={`${id}-playback`}>Illustrative playback from Ari’s first test</figcaption>
          <audio controls preload="none" aria-labelledby={`${id}-playback`}
            src="/media/first-move-count-in.wav" />
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
              {step === decisions.length - 1 && <p>Now use the directions below to plan a test for your own project.</p>}
            </div>
            {step < decisions.length - 1 && (
              <button type="button" className="feedback-button" onClick={() => goTo(step + 1)}>Next decision</button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
