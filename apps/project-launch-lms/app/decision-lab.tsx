"use client";

import { useState } from "react";

type Option = {
  id: string;
  title: string;
  explanation: string;
  isBestFirstTest: boolean;
};

const options: Option[] = [
  {
    id: "a",
    title: "Purchase new equipment immediately.",
    explanation:
      "Buying supplies before learning what students actually need risks spending resources on the wrong solution. First clarify the problem.",
    isBestFirstTest: false,
  },
  {
    id: "b",
    title: "With school permission, observe how the area is used during one lunch period.",
    explanation:
      "A small, permission-based observation gives useful evidence about the problem while staying feasible and low-cost. Then decide what to test next.",
    isBestFirstTest: true,
  },
  {
    id: "c",
    title: "Plan a complete redesign of the campus.",
    explanation:
      "The ambition is understandable, but a campus-wide redesign is too broad for a first step. Start with a bounded question you can test.",
    isBestFirstTest: false,
  },
];

export default function DecisionLab() {
  const [choice, setChoice] = useState("");
  const [revealed, setRevealed] = useState(false);
  const selected = options.find((item) => item.id === choice);

  return (
    <div className="lab-card">
      <div className="lab-header">
        <span className="lab-step">CASE STUDY · 01 / DEMONSTRATION</span>
        <span className="lab-topic">Feasibility & evidence</span>
      </div>
      <div className="lab-body">
        <h3>Where would you begin?</h3>
        <p>
          A student wants to improve an underused outdoor seating area at school.
          They have two weeks, no project budget, and an idea—but little information
          about what makes the space difficult to use.
        </p>
        <fieldset>
          <legend>Which first action would provide the most useful evidence?</legend>
          <div className="options">
            {options.map((option) => (
              <label className={choice === option.id ? "option selected" : "option"} key={option.id}>
                <input
                  type="radio"
                  name="decision"
                  value={option.id}
                  checked={choice === option.id}
                  onChange={() => { setChoice(option.id); setRevealed(false); }}
                />
                <span>{option.title}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button className="feedback-button" type="button" onClick={() => setRevealed(true)} disabled={!choice}>
          Consider this decision
        </button>
        {revealed && selected && (
          <div className="feedback" role="status" aria-live="polite">
            <p className="eyebrow">{selected.isBestFirstTest ? "Strong starting point" : "Consider another approach"}</p>
            <p>{selected.explanation}</p>
            <p className="feedback-prompt">
              <strong>Transfer:</strong> For your own idea, what is one small, safe action
              that would help you learn something before investing more time or resources?
            </p>
          </div>
        )}
        <p className="lab-disclaimer">
          This is a non-persistent prototype exercise. Formal learner submissions,
          rubric feedback and grading will be implemented and tested separately.
        </p>
      </div>
    </div>
  );
}
