import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareActions from "@/components/ShareActions";
import { createPageMetadata } from "@/lib/metadata";
import { projects } from "@/content/projects";
import { guardrails, learningLoopStages, siteConfig } from "@/content/shared";
import { getStatusLabel } from "@/content/statuses";

export const metadata: Metadata = createPageMetadata({
  title: "OWLL at a Glance — Open World Learning Lab",
  description:
    "A concise introduction to Open World Learning Lab, its thesis, current work, and the relationship between OWLL, learning journeys, Field Notes, and LOCUS.",
  path: "/releases/owll-at-a-glance",
});

export default function OwllAtAGlancePage() {
  return (
    <>
      <Header />
      <main className="py-section-y-page">
        <article className="owll-brief mx-auto max-w-3xl px-5 sm:px-6">
          <div className="mb-8 md:mb-10" data-print-hide="true">
            <ShareActions showPrint />
          </div>

          <header className="border-b border-sand-dark/40 pb-8 mb-10 print:pb-6 print:mb-8">
            <p className="field-label">Open World Learning Lab</p>
            <p className="font-mono text-metadata text-quiet">OWLL Brief 001 · Version 1.0 · July 2026</p>
            <h1 className="mt-6 font-serif text-4xl md:text-5xl leading-tight tracking-tight text-foreground print:text-3xl">
              OWLL at a Glance
            </h1>
          </header>

          <section className="brief-section">
            <h2 className="brief-heading">Summary</h2>
            <p className="brief-body">
              Open World Learning Lab is an independent education design lab developing place-based learning journeys, mentor systems, and intelligent tools that help learners turn curiosity and lived experience into cumulative growth.
            </p>
          </section>

          <section className="brief-section">
            <h2 className="brief-heading">The problem</h2>
            <p className="brief-body">
              Too much learning is separated from the places, practices, questions, relationships, and purposes that make knowledge meaningful.
            </p>
          </section>

          <section className="brief-section">
            <h2 className="brief-heading">The proposition</h2>
            <p className="brief-body">
              The world is already full of curriculum. With thoughtful design, human support, and appropriate tools, real environments can become rigorous learning environments.
            </p>
          </section>

          <section className="brief-section">
            <h2 className="brief-heading">The learning loop</h2>
            <p className="brief-body font-medium text-foreground">
              {learningLoopStages.map((s) => s.title).join(" → ")}
            </p>
          </section>

          <section className="brief-section">
            <h2 className="brief-heading">The architecture</h2>
            <dl className="space-y-4">
              {[
                { term: "OWLL", def: "The research, design, and experimentation house." },
                { term: "Learning Journeys", def: "The real educational experiences." },
                { term: "Field Notes", def: "The learner capture layer." },
                { term: "LOCUS", def: "The emerging learning and creator infrastructure." },
                { term: "Learning Atlas", def: "The cumulative record of growth." },
              ].map(({ term, def }) => (
                <div key={term}>
                  <dt className="font-semibold text-foreground">{term}</dt>
                  <dd className="brief-body mt-0.5">{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="brief-section">
            <h2 className="brief-heading">Current work</h2>
            <ul className="space-y-2">
              {projects.map((p) => (
                <li key={p.slug} className="brief-body flex flex-wrap gap-2">
                  <span className="font-medium text-foreground">{p.title}</span>
                  <span className="text-stone">— {getStatusLabel(p.status)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="brief-section">
            <h2 className="brief-heading">Design commitments</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {guardrails.map((g) => (
                <li key={g.title} className="brief-body list-disc ml-5">
                  {g.title}
                </li>
              ))}
            </ul>
          </section>

          <section className="brief-section">
            <h2 className="brief-heading">Current invitation</h2>
            <p className="brief-body">
              OWLL is interested in conversations with educators, mentors, researchers, families, designers, technologists, and potential pilot partners who are thinking seriously about the future of learning.
            </p>
          </section>

          <footer className="mt-12 pt-8 border-t border-sand-dark/40 space-y-2 print:mt-8">
            <p className="text-sm text-muted">openworldlearninglab.com</p>
            <p className="text-xs text-stone">{siteConfig.copyright}</p>
            <p className="text-xs text-stone">{siteConfig.licensingNote}</p>
            <p className="text-xs text-stone">{siteConfig.disclaimer}</p>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}
