import type { Metadata } from "next";
import Link from "next/link";
import ProjectPageLayout, { ContentSection } from "@/components/ProjectPageLayout";
import ProjectMasthead from "@/components/ProjectMasthead";
import VisualPlate from "@/components/visual/VisualPlate";
import LocusCoreLayers from "@/components/diagrams/LocusCoreLayers";
import LocusProductProof from "@/components/LocusProductProof";
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
      spotlight={<LocusProductProof />}
      related={<RelatedWork projects={relatedProjects} />}
    >
      <ContentSection title="What LOCUS is becoming">
        <p>
          LOCUS is being designed as a learner-owned continuity layer for curiosity, experience, evidence,
          reflection, and meaningful return. It aims to support learning without replacing a person&apos;s own
          attention, judgment, practice, or relationships.
        </p>
        <p>
          The functioning adult prototype deliberately tests a narrower cycle.
          The surrounding infrastructure for mentorship, creator-authored journeys, and a cumulative Learning Atlas
          is a product direction, not a completed system.
        </p>
      </ContentSection>

      <ContentSection title="The longer-term learner journey">
        <p className="mb-6 text-sm text-secondary">
          The nine stages below describe the envisioned wider ecosystem, not nine integrated features in the current app.
          For the working adult encounter, see the four-stage product proof above.
        </p>
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

      <ContentSection title="Proposed system layers">
        <p className="mb-6 text-sm text-secondary">
          These five layers are an architectural direction. Only a narrow portion is implemented by the current adult field-test app.
        </p>
        <LocusCoreLayers />
      </ContentSection>

      <FieldNoteSpecimen />

      <ContentSection title="Where future intelligence may help">
        <p>
          Later experiments may use manual facilitation, simple rules, or clearly labeled simulations to learn where AI would genuinely support inquiry rather than replace it.
        </p>
        <p>
          The purpose of the prototype is not to pretend that complete artificial intelligence already exists. It is to identify where intelligence adds educational value, where human judgment remains necessary, and how the complete learning loop should function.
        </p>
      </ContentSection>

      <ContentSection title="What the current build can and cannot demonstrate">
        <p>
          LOCUS v0.1.1 implements one bounded adult field-test loop: three quick observations,
          promotion of one Capture into reasoned Evidence, independent articulation, reflection,
          local draft preservation, later retrieval, and a user-initiated JSON export.
          The current experience runs in the learner&apos;s browser.
        </p>
        <p>
          The linked application has no live AI, account syncing, integrated creator delivery,
          full Learner Atlas, or production youth safeguards. A working loop also does not establish
          improved educational outcomes. A local backup restore feature is under review separately,
          and is not available in the current live build.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a href="https://locus-blond.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-full bg-moss px-6 py-3 text-sm font-medium text-on-dark hover:bg-deep-field">
            Test the current adult prototype ↗
          </a>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-quiet">
          Your field record stays on the browser used for testing. Export it before clearing that browser.
          The app can evolve during development.
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
