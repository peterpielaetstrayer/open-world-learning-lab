import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Learning Environments — Open World Learning Lab",
  description: "Exploring physical, digital, and human learning environments designed around curiosity, agency, and meaningful projects.",
  path: "/learning-environments",
});

const layers = [
  { n: "01", title: "Understand the learner", question: "What are they curious about?", detail: "Begin with interests, aspirations, habits, and obstacles instead of a list of equipment." },
  { n: "02", title: "Understand the space", question: "What is already here?", detail: "Study light, work surfaces, circulation, existing tools, cost, and practical constraints." },
  { n: "03", title: "Design for activity", question: "What should someone be able to do?", detail: "Arrange places to focus, create, explore, collaborate, and reflect. Technology supports the activity." },
  { n: "04", title: "Activate and learn", question: "Does the environment help?", detail: "Test meaningful projects and routines, gather feedback, and adapt what does not work." },
];

const zones = [
  { name: "FOCUS", purpose: "Deep work", color: "bg-[#e7e6db]" },
  { name: "EXPLORE", purpose: "Questions & research", color: "bg-[#d5e4e3]" },
  { name: "MAKE", purpose: "Project practice", color: "bg-[#e4ddca]" },
  { name: "REFLECT", purpose: "Visible progress", color: "bg-[#dee6d7]" },
];

export default function LearningEnvironmentsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-deep-field text-on-dark">
          <div className="pointer-events-none absolute -right-28 top-8 h-[37rem] w-[37rem] rounded-full border border-on-dark/10" aria-hidden="true" />
          <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-16 sm:px-6 md:grid-cols-[1.05fr_.95fr] md:items-center lg:gap-16 lg:px-8 lg:py-24">
            <div className="relative z-10">
              <p className="font-mono text-xs uppercase tracking-[.17em] text-on-dark/60">OWLL / Research direction / Early concept</p>
              <h1 className="mt-6 max-w-2xl font-serif text-[clamp(2.8rem,5vw,5rem)] leading-[1.06] tracking-tight">
                A space for the person you are becoming.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-on-dark/80">
                What if the places where we live could be designed around curiosity, focused inquiry, creative work, and lifelong learning?
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-on-dark/60">
                OWLL Learning Environments is an early research and design exploration connecting physical spaces,
                meaningful learning activities, and thoughtful technology. It is not yet a commercial installation service.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#approach" className="btn-tactile inline-flex min-h-11 items-center rounded-full bg-field-paper px-6 py-3 text-sm font-medium text-ink hover:bg-soft-paper">
                  Explore the approach ↓
                </a>
                <Link href="/contact" className="btn-tactile inline-flex min-h-11 items-center rounded-full border border-on-dark/30 px-6 py-3 text-sm font-medium text-on-dark hover:bg-on-dark/10">
                  Start a research conversation
                </Link>
              </div>
            </div>
            <figure className="relative rounded-xl border border-on-dark/20 bg-on-dark/[.06] p-5 sm:p-8">
              <div className="flex justify-between gap-2 border-b border-on-dark/20 pb-4 font-mono text-[.62rem] uppercase tracking-widest text-on-dark/60">
                <span>Field plate / 001</span><span>Exploratory zoning</span>
              </div>
              <div className="mx-auto mt-7 grid aspect-[1.12] max-w-md grid-cols-2 grid-rows-2 gap-2 border-[6px] border-[#8da898] bg-[#c7d6cb] p-2 shadow-[16px_18px_0_rgba(0,0,0,0.12)] sm:gap-3 sm:p-3">
                {zones.map((zone,i) => (
                  <div key={zone.name} className={"flex min-w-0 flex-col justify-between gap-3 p-3 text-ink sm:p-5 " + zone.color}>
                    <span className="font-mono text-[.55rem] tracking-widest text-quiet">0{i+1}</span>
                    <div>
                      <strong className="block font-serif text-[clamp(1.15rem,2vw,1.7rem)] font-normal leading-tight">{zone.name}</strong>
                      <span className="mt-1 block text-[.65rem] text-secondary">{zone.purpose}</span>
                    </div>
                  </div>
                ))}
              </div>
              <figcaption className="mt-8 border-t border-on-dark/20 pt-4 text-xs leading-relaxed text-on-dark/60">
                A conceptual illustration of learning activities, not a floor plan, room measurement, or completed client installation.
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="approach" className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-water">The starting principle</p>
            <h2 className="mt-4 font-serif text-page-title">Design the conditions. Protect the learner&apos;s agency.</h2>
            <p className="mt-5 text-body-lg text-secondary">
              A learning environment is more than a desk, a display, or a collection of resources. It is the relationship
              among a person, a place, the work they care about, and the support that helps them follow through.
            </p>
            <p className="mt-4 text-body text-secondary">
              Technology may help, but it should not become the center of the room or replace relationships,
              experimentation, practical work, and time away from screens. The learner remains the decision-maker.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {layers.map(layer => (
              <article key={layer.n} className="rounded-lg border border-border bg-card p-6 sm:p-8">
                <span className="font-mono text-sm text-water">{layer.n} / METHOD</span>
                <h3 className="mt-5 font-serif text-2xl text-ink">{layer.title}</h3>
                <p className="mt-3 font-medium leading-relaxed text-secondary">{layer.question}</p>
                <p className="mt-3 text-sm leading-relaxed text-quiet">{layer.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-soft-paper">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-16 lg:px-8 lg:py-24">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-water">Pilot / first investigation</p>
              <h2 className="mt-4 font-serif text-page-title">Begin with one real room.</h2>
              <p className="mt-5 text-body text-secondary">
                The starting case study is a proposed personal learning headquarters for research,
                independent study, writing, and building projects. It will test the design method before
                the approach is presented as a repeatable service.
              </p>
              <p className="mt-4 text-body text-secondary">
                A private Space Designer prototype is also under development to investigate how room photos,
                personal goals, AI assistance, and human review could support practical learning-environment blueprints.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-quiet">
                These are research prototypes, not evidence of installed client spaces or verified educational results.
                OWLL is not currently taking orders for room installations.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-page p-7 sm:p-9">
              <p className="font-mono text-xs uppercase tracking-widest text-water">Questions guiding the work</p>
              <ol className="mt-6 space-y-5">
                {[
                  "What makes a room more useful for learner agency, meaningful inquiry, and independent projects?",
                  "Which improvements are valuable without expensive equipment or unnecessary screens?",
                  "How can AI assist with design while protecting privacy, consent, and human judgment?",
                  "How might effective learning environments become accessible beyond premium households?",
                ].map((question,i) => (
                  <li key={question} className="flex gap-4 text-sm leading-relaxed text-secondary">
                    <span className="shrink-0 font-mono text-xs text-water">0{i+1}</span><span>{question}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-water">Beyond the room</p>
          <h2 className="mt-4 max-w-2xl font-serif text-page-title">Connected to the world beyond the walls.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link href="/work/first-landing" className="rounded-lg border border-border p-6 transition-colors hover:border-water/30 hover:bg-soft-paper sm:p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-water">Learning journey</p>
              <h3 className="mt-4 font-serif text-2xl text-ink">First Landing</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary">A proposed inquiry-based learning experience rooted in the people, questions, and places of Virginia Beach.</p>
              <p className="mt-5 text-sm font-medium text-water">Explore First Landing →</p>
            </Link>
            <Link href="/work/locus" className="rounded-lg border border-border p-6 transition-colors hover:border-water/30 hover:bg-soft-paper sm:p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-water">Learning infrastructure</p>
              <h3 className="mt-4 font-serif text-2xl text-ink">LOCUS</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary">An emerging system connecting curiosity, experience, guided inquiry, field notes, mentorship, reflection, and cumulative learning. Integration with spaces is future work.</p>
              <p className="mt-5 text-sm font-medium text-water">Explore LOCUS →</p>
            </Link>
          </div>
        </section>

        <section className="bg-deep-field py-16 text-on-dark lg:py-20">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
            <p className="font-mono text-xs uppercase tracking-widest text-on-dark/55">Research & collaboration</p>
            <h2 className="mt-4 font-serif text-page-title">Help shape the questions worth testing.</h2>
            <p className="mt-5 text-body text-on-dark/70">
              OWLL welcomes thoughtful conversations with learners, families, educators,
              designers, researchers, and potential pilot collaborators. We are exploring possibilities,
              not offering finished installations.
            </p>
            <Link href="/contact" className="btn-tactile mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-field-paper px-7 py-3 text-sm font-medium text-ink hover:bg-soft-paper">
              Start a Conversation
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
