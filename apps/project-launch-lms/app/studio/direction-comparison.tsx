"use client";

import { useCallback, useId, useState } from "react";
import type { LessonProgressIdentity } from "./project-direction-lesson";
import { usePrivateLessonDraft } from "./use-private-lesson-draft";
import { PrivateDraftReceipt } from "./private-draft-receipt";

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

type ComparisonSnapshot = { version: 1; ideas: Idea[]; chosen: 0 | 1 | null; reconsider: string; question: string; practiceInsight: string };
function normalizeComparison(raw: unknown): ComparisonSnapshot | null {
  if (!raw || typeof raw !== "object" || !("version" in raw) || raw.version !== 1) return null;
  const value = raw as Partial<ComparisonSnapshot>;
  const text = (input: unknown, max = 1200) => typeof input === "string" ? input.slice(0, max) : "";
  return {
    version: 1,
    ideas: [0, 1].map(index => {
      const idea = value.ideas?.[index];
      return { direction: text(idea?.direction), relevance: text(idea?.relevance), feasibility: text(idea?.feasibility), scope: text(idea?.scope), tradeoff: text(idea?.tradeoff) };
    }),
    chosen: value.chosen === 0 || value.chosen === 1 ? value.chosen : null,
    reconsider: text(value.reconsider), question: text(value.question), practiceInsight: text(value.practiceInsight, 900),
  };
}

export function DirectionComparison({ onPrepareResponse, progress, onStructuredDirty }: {
  onPrepareResponse?: (text: string) => boolean;
  progress?: LessonProgressIdentity;
  onStructuredDirty?: (dirty: boolean) => void;
}) {
  const id = useId();
  const [ideas, setIdeas] = useState<Idea[]>([blankIdea(), blankIdea()]);
  const [chosen, setChosen] = useState<0 | 1 | null>(null);
  const [reconsider, setReconsider] = useState("");
  const [question, setQuestion] = useState("");
  const [practiceInsight, setPracticeInsight] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [preparedFingerprint, setPreparedFingerprint] = useState("");

  const snapshot: ComparisonSnapshot = { version: 1, ideas, chosen, reconsider, question, practiceInsight };
  const restore = useCallback((value: ComparisonSnapshot) => {
    setIdeas(value.ideas); setChosen(value.chosen); setReconsider(value.reconsider);
    setQuestion(value.question); setPracticeInsight(value.practiceInsight);
    setReviewed(false); setPreparedFingerprint("");
  }, []);
  const draft = usePrivateLessonDraft({ progress, lessonKey: "direction-comparison-v1", snapshot, restore, normalize: normalizeComparison, onDirty: onStructuredDirty });
  const canEdit = draft.status === "preview" || draft.status === "ready";
  const savedStatus = draft.status === "loading" ? "Loading your saved comparison…"
    : draft.status === "saving" ? "Saving your comparison…"
    : draft.status === "error" ? "Could not load saved work. Refresh before editing."
    : draft.dirty ? "Unsaved comparison changes"
    : draft.savedOnce ? "Comparison draft saved privately" : "No saved comparison yet";
  const saveBar = progress ? <div className="comparison-save-bar">
    <div><p className="eyebrow">Private workspace</p><p className="form-note" role="status">{savedStatus}</p></div>
    <button type="button" className="secondary-button" disabled={draft.status !== "ready" || (!draft.dirty && draft.savedOnce)} onClick={() => void draft.save()}>Save comparison draft</button>
  </div> : null;

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

    {saveBar}
    {draft.error && <p className="form-error" role="alert">{draft.error}</p>}
    {progress ? <p className="form-note">Save any time, even if you have not finished. Your saved fields will return when you reopen this activity. Saving is private and does not share work with your facilitator.</p> : <p className="form-note">Practice view: entries are not stored. Copy any work you want to retain.</p>}
    <fieldset className="comparison-work-fields" disabled={!canEdit} aria-label="Compare project directions">
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
        <legend><span className="comparison-direction-letter" aria-hidden="true">{index === 0 ? "A" : "B"}</span> Direction {index === 0 ? "A" : "B"}</legend>
        {questions.map(({ field, label, hint }) => <div className="direction-comparison-question" key={field}>
          <label htmlFor={`${id}-${index}-${field}`}>{label}</label>
          <p className="form-note" id={`${id}-${index}-${field}-hint`}>{hint}</p>
          <textarea aria-describedby={`${id}-${index}-${field}-hint`} id={`${id}-${index}-${field}`} rows={field === "direction" ? 2 : 3}
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

      {progress && <div className="private-draft-actions"><button type="button" className="secondary-button" disabled={draft.status !== "ready" || (!draft.dirty && draft.savedOnce)} onClick={() => void draft.save()}>Save comparison draft</button><PrivateDraftReceipt draft={draft} /></div>}
      <button type="button" className="feedback-button" disabled={!complete}
        onClick={() => { setReviewed(true); setPreparedFingerprint(""); }}>Review my comparison</button>
      {!complete && <p className="form-note" role="status">Complete both directions, all three decision lenses, one tradeoff for each, a tentative choice, what could change it, and a question for feedback. A short phrase is enough for each box.</p>}
    </div>

    </fieldset>
    {reviewed && <div className="direction-comparison-feedback" aria-live="polite">
      <p className="eyebrow">Your ungraded comparison card</p>
      <h4>You have a reasoned starting point—not a permanent answer.</h4>
      <p>You compared two possibilities using meaning, practical conditions and a bounded first test. Read your tradeoffs again: what would you learn from trying the selected direction? If new evidence changes your choice, revising is part of good project thinking.</p>
      <p className="form-note">This feedback confirms the comparison steps, not the quality or correctness of your reasoning. A facilitator can challenge your assumptions after you share your response.</p>
      <label htmlFor={`${id}-card`}>Your comparison card (select and copy if useful)</label>
      <textarea id={`${id}-card`} rows={13} readOnly value={summary} />
      {progress && <div className="comparison-save-bar"><div><p className="form-note">Keep your structured work before sharing.</p><PrivateDraftReceipt draft={draft} /></div><button type="button" className="secondary-button" disabled={draft.status !== "ready" || (!draft.dirty && draft.savedOnce)} onClick={() => void draft.save()}>Save reviewed comparison</button></div>}
      {onPrepareResponse ? <>
        <button type="button" className="secondary-button"
          onClick={() => {
            const prepared = onPrepareResponse(summary);
            setPreparedFingerprint(prepared ? summary : "");
            if (prepared) document.getElementById("learner-response")?.focus();
          }}>Use this comparison in my course response</button>
        {preparedFingerprint === summary && <p className="form-success" role="status">Your comparison has been copied to the response box below. The response has <strong>not been saved or shared</strong>. Review it before sharing; your private comparison draft is separate.</p>}
      </> : <p className="form-note">This view cannot share a response. Copy the card if you want to keep it.</p>}
      <p><strong>Next:</strong> After receiving feedback, prepare your graded Project Direction Brief. Explain your choice, resources, safe alternatives, scope, tradeoff and a question that is still open.</p>
    </div>}
  </section>;
}
