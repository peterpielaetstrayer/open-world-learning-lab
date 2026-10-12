import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WideContainer from "@/components/layout/WideContainer";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Start Learning in Your World — A Free OWLL Field Inquiry",
  description:
    "Try a simple, free, ten-minute inquiry using something already around you. No account, AI, equipment, or travel required.",
  path: "/start",
});

const steps = [
  {
    number: "01",
    time: "2 minutes",
    title: "Notice",
    prompt: "Choose something within reach or sight that makes you curious.",
    directions:
      "Look closely at an object, a pattern, a sound, a plant, a meal, a tool, or an everyday process. Describe what you can actually observe before trying to explain it.",
    fieldNote: "I notice…",
  },
  {
    number: "02",
    time: "2 minutes",
    title: "Ask and predict",
    prompt: "Turn your observation into a question you can investigate.",
    directions:
      "Try asking how, why, what changes, or what would happen if. Then make a tentative prediction. It is fine to be uncertain or wrong; the question is the starting point.",
    fieldNote: "I wonder… / My prediction is…",
  },
  {
    number: "03",
    time: "3 minutes",
    title: "Investigate",
    prompt: "Find one piece of evidence that could change your mind.",
    directions:
      "Look from another angle, compare two examples, perform a safe small test, ask a knowledgeable person, or consult a trustworthy source. Separate what you found from what you still assume.",
    fieldNote: "The evidence I found… / I am still unsure about…",
  },
  {
    number: "04",
    time: "2 minutes",
    title: "Explain or make",
    prompt: "Show what you understand without copying your source.",
    directions:
      "Say it aloud, write two sentences, draw a diagram, demonstrate the idea, or make a tiny model. What would you tell someone encountering the question for the first time?",
    fieldNote: "Here is how I would explain it…",
  },
  {
    number: "05",
    time: "1 minute",
    title: "Return",
    prompt: "Decide what you would look for next.",
    directions:
      "Note one thing your explanation cannot yet account for. Tomorrow, try to recall the idea before looking at your notes, and see whether it explains a new example.",
    fieldNote: "Next, I want to test…",
  },
];

export default function StartPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-page py-section-y-page">
          <WideContainer>
            <div className="max-w-3xl">
              <p className="font-mono text-metadata uppercase tracking-widest text-water">
                OWLL / First field inquiry / Free to use
              </p>
              <h1 className="mt-5 font-serif text-display text-ink text-balance">
                Start with what is already around you.
              </h1>
              <p className="mt-6 text-body-lg leading-relaxed text-secondary">
                You do not need a classroom, a specialized app, or a perfect plan to begin
                learning. Find something in your world, ask a real question about it,
                investigate, and explain what you discover.
              </p>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-5 font-mono text-metadata text-quiet">
                <span>About 10 minutes</span>
                <span>Paper or memory is enough</span>
                <span>No account or data collection</span>
              </div>
              <a
                href="#field-guide"
                className="btn-tactile mt-7 inline-flex min-h-11 items-center rounded-full bg-moss px-7 py-3 text-sm font-medium text-on-dark hover:bg-moss/90"
              >
                Begin the inquiry ↓
              </a>
            </div>
          </WideContainer>
        </section>

        <section className="bg-soft-paper/40 py-section-y-compact">
          <WideContainer>
            <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] md:gap-12">
              <div>
                <p className="font-mono text-metadata uppercase tracking-widest text-water">
                  A starting example
                </p>
                <h2 className="mt-3 font-serif text-section-title text-ink">
                  Why does bread become stale?
                </h2>
                <p className="mt-4 text-body text-secondary leading-relaxed">
                  You might notice that yesterday&apos;s bread feels different from fresh bread.
                  What changed? What do you predict will happen if it is warmed? How could
                  you investigate your explanation safely? A familiar object can open
                  questions about chemistry, food, observation, and evidence.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="font-mono text-metadata uppercase tracking-widest text-water">
                  Other starting points
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-secondary">
                  <li>Why is one part of a room warmer than another?</li>
                  <li>What makes some neighborhood plants grow in different places?</li>
                  <li>How does a familiar tool make a difficult task easier?</li>
                  <li>Why does a bus, shadow, or tide follow a pattern?</li>
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-quiet">
                  Stay with something you can investigate safely and accessibly. You never
                  need to travel, buy materials, taste unknown substances, or handle hazards.
                </p>
              </div>
            </div>
          </WideContainer>
        </section>

        <section id="field-guide" className="scroll-mt-28 py-section-y">
          <WideContainer>
            <div className="max-w-3xl">
              <p className="font-mono text-metadata uppercase tracking-widest text-water">
                The inquiry / Five moves
              </p>
              <h2 className="mt-3 font-serif text-page-title text-ink">
                Turn curiosity into something you can explain.
              </h2>
              <p className="mt-4 text-body text-secondary">
                The suggested times are flexible. For a five-minute version, do the first
                two moves, then explain your best current guess. Return later to investigate.
              </p>
            </div>
            <ol className="mt-10 grid gap-4 lg:grid-cols-2">
              {steps.map((step) => (
                <li key={step.number} className="rounded-xl border border-border bg-card p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                    <span className="font-mono text-metadata text-water">{step.number} / FIELD MOVE</span>
                    <span className="font-mono text-metadata text-quiet">{step.time}</span>
                  </div>
                  <h3 className="mt-5 font-serif text-section-title text-ink">{step.title}</h3>
                  <p className="mt-3 font-medium text-secondary">{step.prompt}</p>
                  <p className="mt-3 text-sm leading-relaxed text-secondary">{step.directions}</p>
                  <div className="mt-6 border-l-2 border-water/40 bg-soft-paper/40 px-4 py-3">
                    <p className="font-mono text-metadata text-quiet">Field note</p>
                    <p className="mt-1 text-sm italic text-ink">{step.fieldNote}</p>
                  </div>
                </li>
              ))}
            </ol>
          </WideContainer>
        </section>

        <section className="bg-soft-paper/40 py-section-y-compact">
          <WideContainer>
            <div className="grid gap-8 md:grid-cols-2 md:gap-14">
              <div>
                <p className="font-mono text-metadata uppercase tracking-widest text-water">
                  Make it your own
                </p>
                <h2 className="mt-3 font-serif text-section-title text-ink">
                  There is more than one way to participate.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-secondary">
                  Speak rather than write, sketch rather than type, work alone or with
                  someone else. If you have more time, compare different explanations,
                  examine a second source, or design another safe test.
                </p>
              </div>
              <div>
                <p className="font-mono text-metadata uppercase tracking-widest text-water">
                  Learning together
                </p>
                <h2 className="mt-3 font-serif text-section-title text-ink">
                  For parents, children, and mentors
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-secondary">
                  Let the learner choose a question. Ask what they notice and what might
                  change their mind before giving your own explanation. Adults can
                  investigate their own questions alongside children. Keep the activity
                  age-appropriate and supervised where needed.
                </p>
              </div>
            </div>
          </WideContainer>
        </section>

        <section className="py-section-y-compact">
          <WideContainer>
            <div className="max-w-3xl">
              <h2 className="font-serif text-section-title text-ink">
                What this is, and what it is not
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-secondary">
                This is an introductory OWLL learning activity, not a course, assessment,
                or evaluated intervention. Its purpose is to make our approach concrete:
                notice the world, ask meaningful questions, seek evidence, express an
                explanation, and return to test it. It does not establish that OWLL
                improves learning outcomes.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link href="/#learning-loop" className="inline-flex min-h-11 items-center font-medium text-water hover:text-moss">
                  Explore the learning approach →
                </Link>
                <Link href="/work" className="inline-flex min-h-11 items-center font-medium text-water hover:text-moss">
                  See current projects →
                </Link>
              </div>
            </div>
          </WideContainer>
        </section>
      </main>
      <Footer />
    </>
  );
}
