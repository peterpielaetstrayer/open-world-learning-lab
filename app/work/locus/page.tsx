import type { Metadata } from "next";
import Link from "next/link";
import ProjectPageLayout, { ContentSection } from "@/components/ProjectPageLayout";
import ProjectMasthead from "@/components/ProjectMasthead";
import VisualPlate from "@/components/visual/VisualPlate";
import LocusCoreLayers from "@/components/diagrams/LocusCoreLayers";
import FieldNoteSpecimen from "@/components/FieldNoteSpecimen";
import RelatedWork from "@/components/RelatedWork";
import { createPageMetadata } from "@/lib/metadata";
import { projects } from "@/content/projects";
import { locusFullLearnerJourney } from "@/content/locus-journey";
import { siteConfig } from "@/content/shared";

export const metadata: Metadata = createPageMetadata({
  title: "LOCUS — Learning System Prototype",
  description:
    "LOCUS is an emerging learning system designed to help learners turn curiosity, places, questions, practice, mentorship, reflection, and creation into cumulative growth.",
  path: "/work/locus",
});

export default function LocusPage() {
  const relatedProjects = projects.filter((p) => p.slug !== "locus").slice(0, 2);

  return (
    <ProjectPageLayout
      masthead={
        <ProjectMasthead
          title="LOCUS"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Current Work", href: "/work" },
            { label: "LOCUS" },
          ]}
          projectType="Learning Infrastructure"
          status="product-prototype"
          summary="LOCUS helps connect real-world experience, Field Notes, guided inquiry, practice, mentorship, creation, reflection, and cumulative growth."
          statusNotice="A narrow adult field-test prototype is working in a separate LOCUS learner app. Creator integration, adaptive intelligence, validated learning outcomes, and youth-ready infrastructure remain future work. This is not a complete production learning platform."
        />
      }
      related={<RelatedWork projects={relatedProjects} />}
    >
      <ContentSection title="What LOCUS is">
        <p>
          LOCUS helps connect real-world experience, Field Notes, guided inquiry, practice, mentorship, creation, reflection, and cumulative growth.
        </p>
        <p>
          It is not simply an AI tutor. It is the emerging learning and creator infrastructure behind open-world education.
        </p>
      </ContentSection>

      <ContentSection title="One complete learner journey">
        <ol className="relative max-w-reading list-none pl-5 border-l border-water/20">
          {locusFullLearnerJourney.map((step) => (
            <li key={step.step} className="relative pb-5 last:pb-0 pl-4">
              <span className="absolute -left-[calc(0.75rem+1px)] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-water/30 bg-page font-mono text-[0.65rem] text-water">
                {step.step}
              </span>
              <p className="text-sm text-secondary leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </ContentSection>

      <section aria-labelledby="locus-system-view">
        <h2 id="locus-system-view" className="font-serif text-section-title text-ink mb-5">
          LOCUS in One View
        </h2>
        <VisualPlate
          assetKey="locus-system-spine"
          theme="locus"
          variant="infographic"
          title="LOCUS in One View"
          expandLabel="Expand system view"
          caption="Conceptual system plate — supporting visual after the learner journey above."
        />
      </section>

      <ContentSection title="What LOCUS is not">
        <ul className="space-y-2 border-l-2 border-sediment/30 pl-5">
          <li>Not an AI tutor or chatbot with educational branding</li>
          <li>Not a replacement for teachers</li>
          <li>Not a screen-first learning platform</li>
          <li>Not a points-and-badges layer</li>
          <li>Not a system designed to automate every human decision</li>
        </ul>
      </ContentSection>

      <ContentSection title="Core layers">
        <p className="mb-6 text-sm text-secondary">
          After one learner journey, the wider system can be understood as connected layers.
        </p>
        <LocusCoreLayers />
      </ContentSection>

      <FieldNoteSpecimen />

      <ContentSection title="Intelligence—real and simulated">
        <p>
          Some early prototype functions may initially be manually facilitated, rule-based, or simulated in order to understand what the product genuinely needs before automating it.
        </p>
        <p>
          The purpose of the prototype is not to pretend that complete artificial intelligence already exists. It is to identify where intelligence adds educational value, where human judgment remains necessary, and how the complete learning loop should function.
        </p>
      </ContentSection>

      <ContentSection title="What exists now / What is still experimental">
        <p>
          LOCUS v0.1.1 is a bounded adult founder field-test application. Its Water Fingerprints encounter supports
          attention and observation, three quick captures, a distinct evidence step, explanation from memory,
          reflection, later retrieval, and export of an individual field-test record.
        </p>
        <p>
          The current learner app uses browser-local storage, with offline use possible after an initial online load.
          It does not have account sync, a live-AI assistant, a full Learner Atlas, or production youth safeguards.
          A working app is not, by itself, evidence of improved learning outcomes.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Working", detail: "One adult field inquiry: notice, capture, examine evidence, articulate, reflect, and return." },
            { label: "In development", detail: "Creator workflows, portable journey handoff, and future continuity infrastructure." },
            { label: "Not established", detail: "Measured learning benefits, youth readiness, cloud sync, or a unified adaptive platform." },
          ].map((item) => (
            <article key={item.label} className="rounded-lg border border-border bg-soft-paper/40 p-5">
              <h3 className="font-serif text-xl text-ink">{item.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary">{item.detail}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <a href="https://locus-blond.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-full bg-moss px-6 py-3 text-sm font-medium text-on-dark hover:bg-deep-field">
            Open adult field-test app ↗
          </a>
          <a href="https://github.com/peterpielaetstrayer/locus" target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-sm font-medium text-water hover:text-moss">
            Read code and test limitations ↗
          </a>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-quiet">
          Adult experimental prototype. Work is stored in the browser used for testing and can be lost if its
          local data is cleared; export your record to preserve it. The field-test deployment may change during development.
        </p>
      </ContentSection>

      <ContentSection title="How the product pieces relate">
        <p>
          OWLL studies and communicates the educational approach. First Landing is a proposed place-based
          learning journey. The LOCUS learner app implements one narrow real-world encounter.
          Journey Studio develops separate creator and facilitator workflows; LOCUS Core remains a reference
          learner-surface prototype. They are not yet one seamlessly integrated system.
        </p>
      </ContentSection>

      <ContentSection title="Next evidence gates">
        <p>
          Confirm the creator-to-learner handoff against real artifacts, test usability in actual field conditions,
          examine the quality of learner evidence and later recall, and complete appropriate privacy and
          safeguarding reviews before expanding public access or adaptive functionality.
        </p>
      </ContentSection>

      <ContentSection title="Start a product conversation">
        <p>
          OWLL is interested in conversations about product design, learning infrastructure, and technology collaboration — not procurement or enrollment.
        </p>
        <div className="mt-6">
          <a
            href={`mailto:${siteConfig.email}?subject=LOCUS%20Conversation`}
            className="btn-tactile inline-flex items-center justify-center rounded-full bg-moss px-7 py-3.5 text-sm font-medium text-on-dark hover:bg-moss/90"
          >
            Discuss LOCUS
          </a>
        </div>
      </ContentSection>

      <div className="pt-4">
        <Link href="/work" className="text-sm font-medium text-water hover:text-moss transition-colors">
          ← View all current work
        </Link>
      </div>
    </ProjectPageLayout>
  );
}
