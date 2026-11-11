"use client";

import { useEffect, useId, useRef, useState } from "react";

const decisions = [
  {
    title: "Choose what to test",
    context: "Maya wants to make a 30-second practice track for someone learning to enter on beat one. She has a phone and 20 minutes in a quiet room. Her first plan is to record the whole track.",
    prompt: "Which action would tell Maya whether the count-in gives her enough time to enter?",
    options: [
      { label: "Record the whole track and play it back with the guide.", feedback: "That could show how the complete exercise flows. It also means recording material Maya may redo if the opening cue changes." },
      { label: "Record just the count-in and first beat, then try it with the guide.", feedback: "This checks the audible cue against the guide and gives Maya a short sample she can easily revise and replay." },
      { label: "Tap through the timing in the written guide.", feedback: "A silent check can expose an unclear instruction. It leaves open whether the cue is audible and gives Maya enough time to enter." },
    ],
  },
  {
    title: "Use the result",
    context: "A peer asks what Maya needs to learn before recording the whole track. Maya tests just the opening. She follows the guide on two playbacks and misses beat one both times.",
    prompt: "What is a reasonable next move based on those two playbacks?",
    options: [
      { label: "Add a clearer spoken count-in and repeat the same check.", feedback: "The missed entries give Maya a reason to revise the cue. Repeating the same check gives her a useful comparison. A later test with beginners can answer how they respond." },
      { label: "Conclude that the guide fails for all beginners.", feedback: "The two playbacks describe Maya’s own experience under those conditions. She would need observations from beginners to make a claim about them." },
      { label: "Record the full track before changing the cue.", feedback: "Recording more would not resolve what Maya already observed about the opening. She can revise and retest the cue while the rest of the track is still flexible." },
    ],
  },
  {
    title: "Respond when the test is blocked",
    context: "Imagine a different outcome. Maya tries to record, but background noise makes the cue impossible to hear clearly.",
    prompt: "What can Maya do with the information she has?",
    options: [
      { label: "Mark the count-in as successful and move on.", feedback: "The recording did not let Maya evaluate the cue. Record the obstacle so the next decision reflects what she actually learned." },
      { label: "Note the obstacle, check the written timing silently, and plan another recording.", feedback: "The silent check can improve the instructions. Maya still needs a usable recording to check the audible cue, and her notes explain why that test remains open." },
      { label: "Give up the project and choose a different idea.", feedback: "The obstacle concerns where and when Maya can record. She can adjust the test conditions and keep the project direction." },
    ],
  },
];

export function FirstMoveStudio() {
  const id = useId();
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
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
    setChoice(null);
    setRevealed(false);
  }

  return (
    <section className="lab-card" aria-labelledby={`${id}-heading`}>
      <div className="lab-body">
        <p className="form-note">Decision {step + 1} of {decisions.length}</p>
        <h4 id={`${id}-heading`} tabIndex={-1} ref={heading}>{decision.title}</h4>
        <p>{decision.context}</p>
        <fieldset>
          <legend>{decision.prompt}</legend>
          <div className="options">
            {decision.options.map((option, index) => (
              <label key={option.label} className={choice === index ? "option selected" : "option"}>
                <input type="radio" name={id} checked={choice === index}
                  onChange={() => { setChoice(index); setRevealed(false); }} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="studio-actions">
          {step > 0 && <button type="button" className="secondary-button" onClick={() => goTo(step - 1)}>Previous decision</button>}
          <button type="button" className="feedback-button" disabled={choice === null || revealed}
            onClick={() => setRevealed(true)}>Show feedback</button>
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
