"use client";

import { useEffect, useId, useRef, useState } from "react";

const stages = [
  { name: "Start with curiosity", short: "Notice" },
  { name: "Look through three lenses", short: "Explore" },
  { name: "Check a direction", short: "Consider" },
  { name: "Make a project decision", short: "Decide" },
  { name: "Guided practice: drawing", short: "Practice A" },
  { name: "Guided practice: recycling", short: "Practice B" },
  { name: "Independent practice: food", short: "Practice C" },
  { name: "Check your understanding", short: "Check" },
  { name: "Create your direction draft", short: "My draft" },
  { name: "Carry your direction forward", short: "Next moves" },
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

const practiceScenes = [
  {
    title: "Could a cloud-sketch guide be a good start?",
    context: "A learner wants to make a one-page guide that shows a beginner how to draw a cloud in three steps.",
    prompts: [
      "What interest or purpose could make this meaningful?",
      "What time, materials, or support would the learner need?",
      "What makes this direction focused—or what would you narrow?",
    ],
    model: [
      "Relevance: The learner may want to practice art or help someone feel able to begin drawing.",
      "Feasibility: Paper, a pencil, a short amount of time, and a clarity check may be enough to start.",
      "Scope: Three cloud-sketch steps for one beginner are more focused than teaching all of drawing.",
    ],
    reflection: "Another explanation can work if it shows why the guide matters, what the first attempt needs, and why its scope is manageable.",
  },
  {
    title: "What if the recycling idea is too large?",
    context: "A learner wants to replace the entire school's recycling system by Friday. They care about waste, but they do not have permission to change the bins.",
    prompts: [
      "What meaningful purpose is behind the idea?",
      "Which practical barriers or permissions matter?",
      "What smaller investigation or design task could come first?",
    ],
    model: [
      "Relevance: Less waste or cleaner school spaces could matter to this learner and their community.",
      "Feasibility: Changing bins requires permission, time, materials and staff support; Friday is a tight deadline.",
      "Scope: They might map one area, draft questions for a staff sponsor, or sketch a proposal instead of changing school property.",
    ],
    reflection: "The learner's concern is worthwhile even if the original plan is unrealistic. A safe, permission-aware first inquiry can preserve the purpose.",
  },
  {
    title: "Can a small comparison be a project?",
    context: "A learner wants to compare three simple snack ideas using ingredients already available at home and explain which would be easiest to prepare. No cooking, purchase, or sharing personal information is required.",
    prompts: ["In a short explanation, consider meaning, practical conditions (including allergies, food restrictions, and household rules), and what makes the comparison focused."],
    model: [
      "Relevance: It might help with convenience, curiosity about food, family routines or a limited budget.",
      "Feasibility: The learner can compare ingredients and preparation steps on paper, while respecting allergies and household expectations.",
      "Scope: Comparing three available ideas is specific; the learner is not trying to solve nutrition for everyone.",
    ],
    reflection: "A reasonable alternative answer may focus on different circumstances. What matters is that the three lenses shape the explanation.",
  },
] as const;

const knowledgeChecks = [
  {
    title: "Which lens explains the barrier?",
    situation: "A student cares deeply about recycling but does not have permission to change the school's bins. Which lens most directly explains the obstacle?",
    answers: [
      { label: "Relevance—how much the student cares", feedback: "Caring shows relevance. Missing permission limits what can safely and realistically be done, so feasibility is the more direct lens." },
      { label: "Feasibility—what can safely and realistically be done", feedback: "Exactly. Permission is a feasibility condition. A smaller inquiry or staff conversation may still be possible." },
      { label: "Scope—how many bins the school has", feedback: "The number of bins can affect project size, but the obstacle named here is permission, a feasibility constraint." },
    ],
  },
  {
    title: "Which direction is more focused?",
    situation: "A student wants to help others learn to draw. Which direction is a manageable place to begin?",
    answers: [
      { label: "Help everyone become a better artist", feedback: "This goal is broad. It does not name a first product, a specific audience or something to learn from trying." },
      { label: "Build a complete drawing course for the whole school this week", feedback: "An entire school course in one week has a large scope and would likely need resources and permissions. Narrow the first step." },
      { label: "Make a one-page beginner guide and check whether its three steps are clear", feedback: "Yes. One short guide, one beginner and a clarity check make the direction easier to attempt and revise." },
    ],
  },
  {
    title: "Which explanation shows a real tradeoff?",
    situation: "A student chooses a short illustrated guide instead of a series of videos. Which explanation best shows reasoning?",
    answers: [
      { label: "Short guides are always more valuable than videos", feedback: "No format is automatically better. A tradeoff explanation compares a choice to the student's goals and constraints." },
      { label: "The guide fits my time and materials; I can improve it after a small check, and videos could come later", feedback: "Yes. This explains the resources, a feasible test and how the larger video idea could remain possible later." },
      { label: "Videos are never useful for learning", feedback: "Rejecting videos entirely is not a reasoned comparison. The question is which format fits this first attempt." },
    ],
  },
] as const;

type PracticeResponse = { relevance: string; feasibility: string; scope: string; combined: string; revealed: boolean };
const newPracticeResponse = (): PracticeResponse => ({ relevance: "", feasibility: "", scope: "", combined: "", revealed: false });

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
  const [practice, setPractice] = useState<PracticeResponse[]>(() => practiceScenes.map(() => newPracticeResponse()));
  const [checkChoices, setCheckChoices] = useState<(number | null)[]>([null, null, null]);
  const [checkRevealed, setCheckRevealed] = useState<boolean[]>([false, false, false]);
  const [draftWhy, setDraftWhy] = useState("");
  const [draftFirst, setDraftFirst] = useState("");
  const [draftFocus, setDraftFocus] = useState("");
  const [draftLearn, setDraftLearn] = useState("");
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
  const practiceIndex = stage - 4;
  const currentPractice = practiceScenes[practiceIndex];
  const currentResponse = practice[practiceIndex];
  const draftText = [
    "PROJECT LAUNCH LAB · PROJECT DIRECTION DRAFT",
    "Ungraded working draft — not a final commitment or submission",
    "",
    `Starting interest or question 1: ${curiosity || "(not filled in)"}`,
    `Starting interest or question 2: ${wonder || "(not filled in)"}`,
    `Direction to explore: ${direction || "(not filled in)"}`,
    `Why it matters: ${draftWhy || "(not filled in)"}`,
    `A realistic first exploration: ${draftFirst || "(not filled in)"}`,
    `How the scope is focused: ${draftFocus || "(not filled in)"}`,
    `What I could learn: ${draftLearn || "(not filled in)"}`,
    "",
    "Next: compare directions, explore tradeoffs, request feedback, then prepare a Direction Brief.",
    "This draft is stored only in this page until you download or copy it.",
  ].join("\n");

  function updatePractice(index: number, field: keyof Omit<PracticeResponse, "revealed">, value: string) {
    setPractice(previous => previous.map((response, i) => i === index ? { ...response, [field]: value } : response));
  }

  function revealPractice(index: number) {
    setPractice(previous => previous.map((response, i) => i === index ? { ...response, revealed: true } : response));
  }

  function downloadDraft() {
    const blob = new Blob([draftText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "project-direction-draft.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="direction-lesson" aria-labelledby={`${id}-lesson-heading`}>
      <div className="direction-intro">
        <p className="direction-kicker">Project Launch Lab · Module 1</p>
        <h3 id={`${id}-lesson-heading`}>Find a project direction</h3>
        <p>Turn something you are curious about into a direction you can actually explore.</p>
        <p className="direction-save-note"><strong>Interactive draft:</strong> Your answers stay on this page for this session, but are not yet saved to your account. Download or copy your Project Direction Draft in Part 9 before leaving.</p>
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
                <ul>
                  <li><strong>Meaning:</strong> Making drawing easier for beginners matters to Tessa.</li>
                  <li><strong>Reality:</strong> She can begin with the paper and pencils she has.</li>
                  <li><strong>Focus:</strong> A single guide is narrower than a schoolwide campaign.</li>
                  <li><strong>Learning:</strong> A voluntary clarity check could reveal what she needs to revise.</li>
                </ul>
                <button type="button" className="direction-link-button" onClick={() => { setChosen(null); setFeedbackVisible(false); }}>
                  Reconsider the options
                </button>
              </div>
            )}
          </div>
        )}

        {stage >= 4 && stage <= 6 && currentPractice && currentResponse && (
          <div aria-labelledby={`${id}-stage-heading`}>
            <h3 id={`${id}-stage-heading`} tabIndex={-1} ref={heading}>{currentPractice.title}</h3>
            <p className="direction-lead">{currentPractice.context}</p>
            <div className="direction-practice-intro">
              <strong>{practiceIndex === 0 ? "Try with guidance" : practiceIndex === 1 ? "Apply with a bigger constraint" : "Now explain in your own way"}</strong>
              <p>{practiceIndex === 2
                ? "Use all three lenses in one short response. Think about what matters, what is possible, and what keeps the comparison focused."
                : "Use each lens to explain this idea. Short answers are fine if they include a reason. If you're unsure, say what you would need to find out."}</p>
            </div>
            {practiceIndex < 2 ? (
              (["relevance", "feasibility", "scope"] as const).map((field, index) => (
                <div key={field}>
                  <label htmlFor={`${id}-practice-${practiceIndex}-${field}`}>
                    <span className="direction-label-index">{index + 1}.</span> {field[0].toUpperCase() + field.slice(1)}: {currentPractice.prompts[index]}
                  </label>
                  <textarea id={`${id}-practice-${practiceIndex}-${field}`} rows={3}
                    value={currentResponse[field]} onChange={event => updatePractice(practiceIndex, field, event.target.value)}
                    placeholder={index === 0 ? "This could matter because…" : index === 1 ? "A realistic first attempt would need…" : "I would make this more focused by…"} />
                </div>
              ))
            ) : (
              <>
                <label htmlFor={`${id}-practice-${practiceIndex}-combined`}>{currentPractice.prompts[0]}</label>
                <textarea id={`${id}-practice-${practiceIndex}-combined`} rows={6}
                  value={currentResponse.combined} onChange={event => updatePractice(practiceIndex, "combined", event.target.value)}
                  placeholder="This could be meaningful because… A practical comparison would need… It stays manageable because…" />
              </>
            )}
            <p className="direction-small">Your response is practice, not a grade. A reasonable alternative explanation may be just as strong as the example.</p>
            <button type="button" className="direction-primary" disabled={currentResponse.revealed ||
              (practiceIndex < 2
                ? !currentResponse.relevance.trim() || !currentResponse.feasibility.trim() || !currentResponse.scope.trim()
                : !currentResponse.combined.trim())}
              onClick={() => revealPractice(practiceIndex)}>Compare with a model response</button>
            {currentResponse.revealed && (
              <div className="direction-feedback" role="status" aria-label="Scenario model and guidance">
                <p className="direction-kicker">One defensible explanation</p>
                <ul>
                  {currentPractice.model.map(line => <li key={line}>{line}</li>)}
                </ul>
                <p>{currentPractice.reflection}</p>
                <p><strong>Revise if useful:</strong> Your fields above remain editable. Compare the reasons, not the exact wording.</p>
              </div>
            )}
          </div>
        )}

        {stage === 7 && (
          <div aria-labelledby={`${id}-stage-heading`}>
            <h3 id={`${id}-stage-heading`} tabIndex={-1} ref={heading}>Check your understanding</h3>
            <p className="direction-lead">Three short decisions will help you recognize the lenses and a meaningful tradeoff. These are ungraded, and you can retry as often as you need.</p>
            <div className="direction-quiz">
              {knowledgeChecks.map((check, index) => (
                <section className="direction-quiz-item" key={check.title} aria-labelledby={`${id}-question-${index}`}>
                  <p className="direction-kicker">Question {index + 1} of {knowledgeChecks.length}</p>
                  <h4 id={`${id}-question-${index}`}>{check.title}</h4>
                  <p>{check.situation}</p>
                  <fieldset className="direction-choice-fieldset">
                    <legend>Choose an answer</legend>
                    <div className="direction-options">
                      {check.answers.map((answer, answerIndex) => (
                        <label key={answer.label} className={checkChoices[index] === answerIndex ? "direction-option direction-option-selected" : "direction-option"}>
                          <input type="radio" name={`${id}-check-${index}`} checked={checkChoices[index] === answerIndex}
                            onChange={() => {
                              setCheckChoices(previous => previous.map((choice, i) => i === index ? answerIndex : choice));
                              setCheckRevealed(previous => previous.map((visible, i) => i === index ? false : visible));
                            }} />
                          <span className="direction-option-letter">{String.fromCharCode(65 + answerIndex)}</span>
                          <span>{answer.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <button type="button" className="direction-primary" disabled={checkChoices[index] === null || checkRevealed[index]}
                    onClick={() => setCheckRevealed(previous => previous.map((visible, i) => i === index ? true : visible))}>Show explanation</button>
                  {checkRevealed[index] && checkChoices[index] !== null && (
                    <div className="direction-feedback" role="status">
                      <p>{check.answers[checkChoices[index]].feedback}</p>
                      <div className="direction-feedback-actions">
                        <button type="button" className="direction-link-button" onClick={() => {
                          setCheckChoices(previous => previous.map((choice, i) => i === index ? null : choice));
                          setCheckRevealed(previous => previous.map((visible, i) => i === index ? false : visible));
                        }}>Try this question again</button>
                        <button type="button" className="direction-link-button" onClick={() => navigate(1)}>Review the three lenses</button>
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        )}

        {stage === 8 && (
          <div aria-labelledby={`${id}-stage-heading`}>
            <h3 id={`${id}-stage-heading`} tabIndex={-1} ref={heading}>Your first Project Direction Draft</h3>
            <p className="direction-lead">Return to your interests, choose one possible direction, and explain why it deserves a first look. This draft belongs to you; it is not your final project or graded Direction Brief.</p>
            <div className="direction-recap">
              <p><strong>Interest or question 1:</strong> {curiosity.trim() || "Not chosen yet"}</p>
              <p><strong>Interest or question 2:</strong> {wonder.trim() || "Not chosen yet"}</p>
              <button type="button" className="direction-link-button" onClick={() => navigate(0)}>Revisit my starting questions</button>
            </div>
            <label htmlFor={`${id}-draft-direction`}>One direction I want to explore</label>
            <textarea id={`${id}-draft-direction`} rows={3} value={direction} onChange={event => setDirection(event.target.value)}
              placeholder="I want to investigate, create or improve…" />
            <label htmlFor={`${id}-draft-why`}>Why it matters to me or someone else</label>
            <textarea id={`${id}-draft-why`} rows={3} value={draftWhy} onChange={event => setDraftWhy(event.target.value)} />
            <label htmlFor={`${id}-draft-first`}>What I can realistically investigate or create first</label>
            <textarea id={`${id}-draft-first`} rows={3} value={draftFirst} onChange={event => setDraftFirst(event.target.value)} />
            <label htmlFor={`${id}-draft-focus`}>How I can make the direction focused</label>
            <textarea id={`${id}-draft-focus`} rows={3} value={draftFocus} onChange={event => setDraftFocus(event.target.value)} />
            <label htmlFor={`${id}-draft-learn`}>One thing a small attempt could help me learn</label>
            <textarea id={`${id}-draft-learn`} rows={3} value={draftLearn} onChange={event => setDraftLearn(event.target.value)} />
            <div className="direction-insight">If an answer is hard to write, that is useful information. Try narrowing the direction, choosing a safe alternative, or naming what support you would need.</div>
            <div className="direction-draft-export">
              <h4>Keep a copy of your draft</h4>
              <p>The LMS does not yet save this exercise. Download your draft now, or select and copy the plain text below before closing this page. Keep it somewhere private.</p>
              <button type="button" className="direction-primary" onClick={downloadDraft}>Download my draft (.txt)</button>
              <label htmlFor={`${id}-draft-copy`}>Plain-text copy of my current draft</label>
              <textarea id={`${id}-draft-copy`} rows={10} readOnly value={draftText} />
            </div>
          </div>
        )}

        {stage === 9 && (
          <div aria-labelledby={`${id}-stage-heading`}>
            <h3 id={`${id}-stage-heading`} tabIndex={-1} ref={heading}>A direction worth exploring</h3>
            <p className="direction-lead">You have practiced using relevance, feasibility and scope to turn broad ideas into manageable first directions. Your reasoning matters more than having a polished answer today.</p>
            <div className="direction-insight">
              <p><strong>Before you leave:</strong> If you wrote a Project Direction Draft, return to the previous screen and download or copy it. This prototype does not save your text to your account.</p>
              <button type="button" className="direction-link-button" onClick={() => navigate(8)}>Review and keep my draft</button>
            </div>
            <h4>Where you go next</h4>
            <ol className="direction-next-list">
              <li><strong>Project Launch Gauntlet.</strong> Challenge your starting direction by considering tradeoffs and constraints.</li>
              <li><strong>Ungraded direction comparison.</strong> Compare options and seek meaningful facilitator feedback when that course activity is available.</li>
              <li><strong>Project Direction Brief.</strong> Use your reasoning to prepare the separately graded, 30-point assignment when assigned in the LMS.</li>
            </ol>
            <p>You do not need to buy materials, travel, contact strangers, post publicly, disclose personal information, or use AI. If an action needs permission, choose a safe alternative first.</p>
            <p className="direction-closing">A strong beginning is not the biggest idea. It is one you can explain, explore, and improve.</p>
            <p className="direction-small">Return to the course outline for your assigned next activity. This screen does not submit a grade or mark the course complete.</p>
          </div>
        )}

        {stage >= 4 && stage <= 8 && (
          <details className="direction-help direction-pocket-check">
            <summary>Open the Project Direction Check</summary>
            <ol>
              {directionChecks.map(check => <li key={check.label}><strong>{check.label}:</strong> {check.question}</li>)}
            </ol>
            <button type="button" className="direction-link-button" onClick={() => navigate(2)}>Revisit my original direction check</button>
          </details>
        )}

        <div className="direction-controls">
          <button type="button" className="direction-back" onClick={() => navigate(stage - 1)} disabled={stage === 0}>Previous</button>
          {stage < stages.length - 1 ? (
            <button type="button" className="direction-primary" onClick={() => navigate(stage + 1)}>
              Continue to {stages[stage + 1].short.toLowerCase()} <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button type="button" className="direction-back" onClick={() => navigate(8)}>Review my project draft</button>
          )}
        </div>
      </div>
    </section>
  );
}
