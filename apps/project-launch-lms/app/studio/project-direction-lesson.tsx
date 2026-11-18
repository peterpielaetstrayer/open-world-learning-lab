"use client";

import { useEffect, useId, useRef, useState } from "react";

const stages = [
  { name: "Start with curiosity", short: "Notice" },
  { name: "Look through three lenses", short: "Explore" },
  { name: "Check a direction", short: "Consider" },
  { name: "Make a project decision", short: "Decide" },
] as const;

const lenses = [
  {
    name: "Relevance",
    question: "Does it matter to you or someone else?",
    description: "A direction is easier to sustain when you can say why it is worth exploring.",
    example: "I like drawing, and I want to help a friend feel comfortable starting.",
    caution: "You do not need a life-changing mission. A genuine question is enough to begin.",
  },
  {
    name: "Feasibility",
    question: "What could you try with what you have?",
    description: "Consider your time, materials, support, and any permissions you might need.",
    example: "I have paper, pencils, and a few afternoons. I could test a short drawing guide.",
    caution: "Feasible does not mean effortless. It means there is a realistic next move.",
  },
  {
    name: "Scope",
    question: "Is the first version focused enough to try?",
    description: "Choose a manageable starting point. You can expand after you learn from it.",
    example: "One guide for one beginner is a better first test than a schoolwide program.",
    caution: "A smaller first step is not a smaller ambition.",
  },
] as const;

const directionChecks = [
  { label: "Meaning", question: "Can I explain why this direction interests me or helps someone?" },
  { label: "Reality", question: "Can I identify a first attempt using time and resources I actually have?" },
  { label: "Focus", question: "Can I describe a version small enough to try and learn from?" },
  { label: "Learning potential", question: "Is there something useful I could find out by trying it?" },
] as const;

const options = [
  {
    label: "Run a schoolwide creativity campaign this week",
    feedback: "The purpose is generous, but a schoolwide launch adds coordination, permissions, and a large audience before Tessa knows what helps a beginner. What smaller version could she test first?",
    takeaway: "Relevance is present, but feasibility and scope need another look.",
  },
  {
    label: "Make a complete series of drawing tutorial videos",
    feedback: "Videos might become useful later. Right now Tessa has paper, pencils, and limited time—not the equipment or process for a video series. She can find out what beginners need before choosing a larger format.",
    takeaway: "A promising format can still be too demanding for a first move.",
  },
  {
    label: "Create a one-page, three-step sketch guide and try it with one beginner",
    feedback: "This direction connects Tessa’s interest to someone else, fits her available tools, and focuses on a test she could actually run. She would still need to observe whether the guide is clear and revise it.",
    takeaway: "This is the strongest first direction given the information available—not proof that it will work.",
  },
] as const;

export function ProjectDirectionLesson() {
  const id = useId();
  const [stage, setStage] = useState(0);
  const [curiosity, setCuriosity] = useState("");
  const [wonder, setWonder] = useState("");
  const [direction, setDirection] = useState("");
  const [considered, setConsidered] = useState<boolean[]>([false, false, false, false]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const shouldFocusHeading = useRef(false);

  useEffect(() => {
    if (shouldFocusHeading.current) {
      heading.current?.focus();
      shouldFocusHeading.current = false;
    }
  }, [stage]);

  function navigate(target: number) {
    if (target < 0 || target >= stages.length || target === stage) return;
    shouldFocusHeading.current = true;
    setStage(target);
  }

  const consideredCount = considered.filter(Boolean).length;

  return (
    <section className="direction-lesson" aria-labelledby={`${id}-lesson-heading`}>
      <div className="direction-intro">
        <p className="direction-kicker">Project Launch Lab · Module 1</p>
        <h3 id={`${id}-lesson-heading`}>Find a project direction</h3>
        <p>Turn something you are curious about into a direction you can actually explore.</p>
        <p className="direction-save-note"><strong>Interactive draft:</strong> Your answers stay on this page for this session. They are not yet saved to your account. Copy anything you want to keep before leaving.</p>
      </div>

      <nav aria-label="Lesson sections" className="direction-steps">
        {stages.map((item, index) => (
          <button key={item.short} type="button" aria-current={stage === index ? "step" : undefined}
            onClick={() => navigate(index)}>
            <span className="direction-step-number">{String(index + 1).padStart(2, "0")}</span>
            <span>{item.short}</span>
          </button>
        ))}
      </nav>

      <div className="direction-panel">
        <p className="direction-progress">Part {stage + 1} of {stages.length} · {stages[stage].name}</p>

        {stage === 0 && (
          <div aria-labelledby={`${id}-stage-heading`}>
            <h3 id={`${id}-stage-heading`} tabIndex={-1} ref={heading}>A project can begin with a question</h3>
            <p className="direction-lead">You do not need a brilliant idea or a complete plan. Begin by noticing something that makes you curious, excited, frustrated, or eager to help.</p>
            <div className="direction-quote">“What is something I would enjoy understanding, making, improving, or sharing?”</div>
            <label htmlFor={`${id}-curiosity`}>Something I care about or like exploring</label>
            <textarea id={`${id}-curiosity`} rows={3} value={curiosity} onChange={event => setCuriosity(event.target.value)}
              placeholder="It could be music, drawing, food, a problem at school, a question about nature…" />
            <label htmlFor={`${id}-wonder`}>Something I wonder about or might want to try</label>
            <textarea id={`${id}-wonder`} rows={3} value={wonder} onChange={event => setWonder(event.target.value)}
              placeholder="I wonder whether… / What if I tried…" />
            <details className="direction-help">
              <summary>Not sure yet? Try one of these starting points.</summary>
              <ul>
                <li>Something you have learned recently and want to understand better</li>
                <li>Something you wish were easier for you or someone you know</li>
                <li>A skill you would enjoy practicing or sharing</li>
              </ul>
              <p>You can leave either box blank. You are exploring possibilities, not submitting an answer.</p>
            </details>
          </div>
        )}

        {stage === 1 && (
          <div aria-labelledby={`${id}-stage-heading`}>
            <h3 id={`${id}-stage-heading`} tabIndex={-1} ref={heading}>Three ways to look at an idea</h3>
            <p className="direction-lead">A promising idea is not just exciting. It is meaningful enough to try, realistic for your situation, and focused enough to learn from.</p>
            <div className="direction-lens-grid">
              {lenses.map((lens, index) => (
                <article className="direction-lens" key={lens.name}>
                  <p className="direction-lens-index">Lens {index + 1}</p>
                  <h4>{lens.name}</h4>
                  <p><strong>{lens.question}</strong></p>
                  <p>{lens.description}</p>
                  <div className="direction-example"><span>In practice</span><p>{lens.example}</p></div>
                  <p className="direction-nuance">Remember: {lens.caution}</p>
                </article>
              ))}
            </div>
            <p className="direction-footnote">These lenses help you ask better questions; they are not a formula for guaranteeing success. You may revisit them as your project changes.</p>
          </div>
        )}

        {stage === 2 && (
          <div aria-labelledby={`${id}-stage-heading`}>
            <h3 id={`${id}-stage-heading`} tabIndex={-1} ref={heading}>Try a Project Direction Check</h3>
            <p className="direction-lead">Use the three lenses—and one extra reflection about what you could learn—to explore a possible first direction. Checking a box means you considered the question, not that you passed a test.</p>
            <label htmlFor={`${id}-direction`}>My possible project direction</label>
            <textarea id={`${id}-direction`} rows={3} value={direction} onChange={event => setDirection(event.target.value)}
              placeholder="I might create, test, investigate, or improve…" />
            <fieldset className="direction-checks">
              <legend>Questions to consider</legend>
              {directionChecks.map((check, index) => (
                <label className="direction-check" key={check.label}>
                  <input type="checkbox" checked={considered[index]}
                    onChange={event => setConsidered(previous => previous.map((value, i) => i === index ? event.target.checked : value))} />
                  <span><strong>{check.label}</strong><span>{check.question}</span></span>
                </label>
              ))}
            </fieldset>
            <p className="direction-small" aria-live="polite">{consideredCount} of {directionChecks.length} questions considered. You can continue at any point.</p>
            <div className="direction-insight"><strong>A useful first direction is revisable.</strong> If an idea feels too big, try describing a smaller first attempt. If you are unsure why it matters, return to what sparked your curiosity.</div>
          </div>
        )}

        {stage === 3 && (
          <div aria-labelledby={`${id}-stage-heading`}>
            <h3 id={`${id}-stage-heading`} tabIndex={-1} ref={heading}>What should Tessa try first?</h3>
            <p className="direction-lead">Tessa enjoys drawing and wants to help other students who say they “cannot draw.” She has paper, pencils, and a few free afternoons. She has not arranged recording equipment, schoolwide access, or special permissions.</p>
            <p>Each direction has an appealing part. Which is the strongest <em>first move</em> given what Tessa knows right now?</p>
            <fieldset className="direction-choice-fieldset">
              <legend>Choose one direction</legend>
              <div className="direction-options">
                {options.map((option, index) => (
                  <label className={chosen === index ? "direction-option direction-option-selected" : "direction-option"} key={option.label}>
                    <input type="radio" name={`${id}-tessa-choice`} checked={chosen === index}
                      onChange={() => { setChosen(index); setFeedbackVisible(false); }} />
                    <span className="direction-option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label htmlFor={`${id}-reason`}>What makes you lean toward this choice? (optional)</label>
            <textarea id={`${id}-reason`} rows={2} value={reason} onChange={event => setReason(event.target.value)}
              placeholder="I chose this because…" />
            <button type="button" className="direction-primary" disabled={chosen === null || feedbackVisible}
              onClick={() => setFeedbackVisible(true)}>Explore feedback</button>
            {feedbackVisible && chosen !== null && (
              <div className="direction-feedback" role="status" aria-label="Decision feedback">
                <p className="direction-kicker">What this decision reveals</p>
                <h4>{options[chosen].takeaway}</h4>
                <p>{options[chosen].feedback}</p>
                <p><strong>Keep thinking:</strong> Tessa will need evidence from trying a guide with a beginner before claiming it helps. A first decision is a testable direction, not a finished answer.</p>
                <button type="button" className="direction-link-button" onClick={() => { setChosen(null); setFeedbackVisible(false); }}>
                  Reconsider the options
                </button>
              </div>
            )}
          </div>
        )}

        <div className="direction-controls">
          <button type="button" className="direction-back" onClick={() => navigate(stage - 1)} disabled={stage === 0}>Previous</button>
          {stage < stages.length - 1 ? (
            <button type="button" className="direction-primary" onClick={() => navigate(stage + 1)}>
              Continue to {stages[stage + 1].short.toLowerCase()} <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button type="button" className="direction-back" onClick={() => navigate(2)}>Return to my direction check</button>
          )}
        </div>
      </div>
    </section>
  );
}
