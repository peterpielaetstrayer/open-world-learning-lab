"use client";

import { useId, useState } from "react";

type Idea = { direction: string; relevance: string; feasibility: string; scope: string; tradeoff: string };
type IdeaField = keyof Idea;
const blankIdea = (): Idea => ({ direction: "", relevance: "", feasibility: "", scope: "", tradeoff: "" });

const questions: { field: IdeaField; label: string; hint: string }[] = [
  { field: "direction", label: "Possible project direction", hint: "What could you investigate, make, or improve?" },
  { field: "relevance", label: "Relevance: why it matters", hint: "Why is it interesting or useful to you or someone else?" },
  { field: "feasibility", label: "Feasibility: what is available", hint: "Think about time, materials, support, safety and permissions. A barrier is useful to notice." },
  { field: "scope", label: "Scope: a small first test", hint: "What could you safely try, sketch, compare, or investigate first?" },
  { field: "tradeoff", label: "One tradeoff", hint: "What might you gain by choosing this, and what might you set aside or need to change?" },
];

export function DirectionComparison({ onPrepareResponse }: { onPrepareResponse?: (text: string) => boolean }) {
  const id = useId();
  const [ideas, setIdeas] = useState<Idea[]>([blankIdea(), blankIdea()]);
  const [chosen, setChosen] = useState<0 | 1 | null>(null);
  const [reconsider, setReconsider] = useState("");
  const [question, setQuestion] = useState("");
  const [practiceInsight, setPracticeInsight] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [preparedFingerprint, setPreparedFingerprint] = useState("");

  const complete = ideas.every(idea => Object.values(idea).every(value => value.trim()))
    && chosen !== null && Boolean(reconsider.trim()) && Boolean(question.trim());
  const summary = [
    "PROJECT LAUNCH LAB · TWO-DIRECTION COMPARISON",
    "Ungraded formative practice · working judgment, not a final commitment",
    practiceInsight.trim() ? "Optional Gauntlet/text-scenario insight (not a score): " + practiceInsight.trim() : "Optional practice insight: not provided; personal comparison is still valid.",
    ...ideas.flatMap((idea, index) => [
      "",
      `DIRECTION ${index === 0 ? "A" : "B"}: ${idea.direction.trim()}`,
      `Relevance: ${idea.relevance.trim()}`,
      `Feasibility, resources and permissions: ${idea.feasibility.trim()}`,
      `Focused first test: ${idea.scope.trim()}`,
      `Tradeoff: ${idea.tradeoff.trim()}`,
    ]),
    "",
    `My tentative direction: ${chosen === null ? "Not chosen" : `${chosen === 0 ? "A" : "B"} — ${ideas[chosen].direction.trim()}`}`,
    `What could change my mind: ${reconsider.trim()}`,
    `My question for a facilitator: ${question.trim()}`,
    "Next: use feedback and this comparison to develop a separate, graded Project Direction Brief.",
  ].join("\n");

  function updateIdea(index: number, field: IdeaField, value: string) {
    setIdeas(previous => previous.map((idea, position) => position === index ? { ...idea, [field]: value } : idea));
    setReviewed(false);
    setPreparedFingerprint("");
  }

  return <section className="direction-comparison" aria-labelledby={`${id}-heading`}>
    <header className="diagnostic-intro">
      <p className="eyebrow">Module 1 · Discover & Define · 10–15 minutes</p>
      <h3 id={`${id}-heading`}>Put two directions to the test</h3>
      <p>Choose two ideas you care about, examine them through relevance, feasibility and scope, and make a <strong>tentative</strong> decision. The goal is to explain your thinking—not to pick a perfect project.</p>
      <p className="form-note">This is ungraded practice. Short notes are fine. No purchases, public posts, travel, contact with strangers, AI use or disclosure of private information are required. If an action needs permission, write a safe alternative.</p>
    </header>

    <details className="direction-comparison-model">
      <summary>Need an example? Compare a broad idea with a manageable one</summary>
      <p><strong>Broad:</strong> “Teach everyone how to eat healthy.” There is a meaningful purpose, but the audience and first test are too large to check quickly.</p>
      <p><strong>Focused:</strong> “On paper, compare three affordable snack ideas using ingredients already at home.” The learner can investigate available information without preparing food, making purchases or needing to share personal information. Allergies, restrictions and household rules still matter.</p>
      <p><strong>Tradeoff:</strong> The small comparison will not change everyone’s eating habits. It can, however, reveal what a realistic first question looks like.</p>
      <p>Use your own interests where possible. The optional Project Launch Gauntlet may help you explore a choice, but you can complete this activity with text alone.</p>
    </details>

    <div className="direction-comparison-decision">
      <label htmlFor={id + "-practice-insight"}>
        Optional: What did the Gauntlet or the text-only scenario teach you about a project constraint?
      </label>
      <p className="form-note">
        You may leave this blank. An insight is useful; a Gauntlet score is not
        required or recorded here.
      </p>
      <textarea id={id + "-practice-insight"} rows={3} maxLength={900}
        value={practiceInsight} onChange={event => {
          setPracticeInsight(event.target.value);
          setReviewed(false);
          setPreparedFingerprint("");
        }} placeholder="One idea seemed promising until…" />
    </div>

    <div className="direction-comparison-grid">
      {ideas.map((idea, index) => <fieldset key={index} className="direction-comparison-idea">
        <legend>Direction {index === 0 ? "A" : "B"}</legend>
        {questions.map(({ field, label, hint }) => <div className="direction-comparison-question" key={field}>
          <label htmlFor={`${id}-${index}-${field}`}>{label}</label>
          <p className="form-note">{hint}</p>
          <textarea id={`${id}-${index}-${field}`} rows={field === "direction" ? 2 : 3}
            maxLength={1200} value={idea[field]} onChange={event => updateIdea(index, field, event.target.value)}
            placeholder={field === "tradeoff" ? "I gain… but I may give up or need…" : "My thinking so far…"} />
        </div>)}
      </fieldset>)}
    </div>

    <div className="direction-comparison-decision">
      <fieldset>
        <legend>Which direction would you explore first?</legend>
        <p className="form-note">Choose a direction for now, even if you still have questions. You can revise it after feedback or new evidence.</p>
        {[0, 1].map(index => <label key={index} className="direction-comparison-radio">
          <input type="radio" name={`${id}-choice`} checked={chosen === index}
            onChange={() => { setChosen(index as 0 | 1); setReviewed(false); setPreparedFingerprint(""); }} />
          Direction {index === 0 ? "A" : "B"}{ideas[index].direction.trim() ? ` — ${ideas[index].direction.trim()}` : ""}
        </label>)}
      </fieldset>
      <label htmlFor={`${id}-reconsider`}>What information or feedback could make you reconsider?</label>
      <textarea id={`${id}-reconsider`} rows={3} maxLength={1200} value={reconsider}
        onChange={event => { setReconsider(event.target.value); setReviewed(false); setPreparedFingerprint(""); }}
        placeholder="I would reconsider if…" />
      <label htmlFor={`${id}-question`}>What specific question would you ask your facilitator?</label>
      <textarea id={`${id}-question`} rows={3} maxLength={1200} value={question}
        onChange={event => { setQuestion(event.target.value); setReviewed(false); setPreparedFingerprint(""); }}
        placeholder="I would like feedback on whether…" />

      <button type="button" className="feedback-button" disabled={!complete}
        onClick={() => { setReviewed(true); setPreparedFingerprint(""); }}>Review my comparison</button>
      {!complete && <p className="form-note" role="status">Complete both directions, all three decision lenses, one tradeoff for each, a tentative choice, what could change it, and a question for feedback. A short phrase is enough for each box.</p>}
    </div>

    {reviewed && <div className="direction-comparison-feedback" aria-live="polite">
      <p className="eyebrow">Your ungraded comparison card</p>
      <h4>You have a reasoned starting point—not a permanent answer.</h4>
      <p>You compared two possibilities using meaning, practical conditions and a bounded first test. Read your tradeoffs again: what would you learn from trying the selected direction? If new evidence changes your choice, revising is part of good project thinking.</p>
      <p className="form-note">This feedback confirms the comparison steps, not the quality or correctness of your reasoning. A facilitator can challenge your assumptions after you share your response.</p>
      <label htmlFor={`${id}-card`}>Your comparison card (select and copy if useful)</label>
      <textarea id={`${id}-card`} rows={13} readOnly value={summary} />
      {onPrepareResponse ? <>
        <button type="button" className="secondary-button"
          onClick={() => setPreparedFingerprint(onPrepareResponse(summary) ? summary : "")}>Use this comparison in my course response</button>
        {preparedFingerprint === summary && <p className="form-success" role="status">Your comparison is in the course response box below. It has <strong>not been saved or shared</strong>. Choose Save draft, or Share with facilitator (final) when ready.</p>}
      </> : <p className="form-note">This private preview does not save or send anything. Copy the card if you want to keep it.</p>}
      <p><strong>Next:</strong> After receiving feedback, prepare your graded Project Direction Brief. Explain your choice, resources, safe alternatives, scope, tradeoff and a question that is still open.</p>
    </div>}
  </section>;
}
