import type { Metadata } from "next";
import Link from "next/link";
import ProjectPageLayout, {
  ContentSection,
} from "@/components/ProjectPageLayout";
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
  const relatedProjects = projects
    .filter((p) => p.slug !== "locus")
    .slice(0, 2);

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
          summary="A learner-owned continuity and intelligence system in development: connecting what you notice, investigate and create with what you choose to pursue next."
          statusNotice="Early prototype. This page distinguishes current functionality from the wider design. The examples below illustrate the approach; they are not records of evaluated learner outcomes."
        />
      }
      related={<RelatedWork projects={relatedProjects} />}
    >
      <ContentSection title="Keep building on what you learn">
        <p>
          Learning can become fragmented across places, courses, projects and
          tools. LOCUS is an OWLL initiative exploring how questions,
          explanations and evidence can remain useful to a person across those
          changes.
        </p>
        <p>
          A record matters when you can return to it, question it, connect it to
          something new and decide what to do next. That is the continuity LOCUS
          aims to support.
        </p>
      </ContentSection>

      <ContentSection title="What exists today">
        <p>
          The early learner prototype supports recording an inquiry, returning
          to records in the same browser and exporting notes. It is separate
          from this public website, which provides a system description and
          illustrative design artifacts.
        </p>
        <p>
          Cross-device continuity, a comprehensive learning atlas and adaptive
          intelligence remain development goals. The prototype does not yet
          establish improved learning outcomes.
        </p>
      </ContentSection>

      <ContentSection title="Two starting points, a continuing record">
        <p>
          Structured Journeys provide a designed path through a question or
          setting. Open Explore starts with something the learner notices or
          wants to understand. Both can include mentors, reliable sources,
          deliberate practice and feedback.
        </p>
        <p>
          Connections to concepts, courses or curricular standards could help
          learners relate an experience to formal study. Such connections need
          review; a captured note alone is not evidence of mastery.
        </p>
      </ContentSection>

      <ContentSection title="A learner journey we are designing toward">
        <p>
          The sequence below describes the wider design, including capabilities
          that are not yet implemented.
        </p>
        <ol className="relative max-w-reading list-none pl-5 border-l border-water/20">
          {locusFullLearnerJourney.map((step) => (
            <li key={step.step} className="relative pb-5 last:pb-0 pl-4">
              <span className="absolute -left-[calc(0.75rem+1px)] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-water/30 bg-page font-mono text-[0.65rem] text-water">
                {step.step}
              </span>
              <p className="text-sm text-secondary leading-relaxed">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </ContentSection>

      <section aria-labelledby="locus-system-view">
        <h2
          id="locus-system-view"
          className="font-serif text-section-title text-ink mb-5"
        >
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

      <ContentSection title="Design commitments">
        <ul className="space-y-2 border-l-2 border-sediment/30 pl-5">
          <li>
            Learners should be able to inspect, correct, export and decide how
            to share their records.
          </li>
          <li>
            Guidance should strengthen the learner&apos;s judgment and preserve
            the role of mentors and educators.
          </li>
          <li>
            Technology should support attention to the experience and the people
            involved.
          </li>
          <li>
            Claims about understanding should be grounded in explanation,
            practice and evidence.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="The wider system design">
        <p className="mb-6 text-sm text-secondary">
          These conceptual layers describe the longer-term architecture, not a
          list of available features.
        </p>
        <LocusCoreLayers />
      </ContentSection>

      <section id="field-note-example" aria-label="Illustrative Field Note">
        <FieldNoteSpecimen />
      </section>

      <ContentSection title="What could intelligence add?">
        <p>
          A future system could help a learner notice connections between
          experiences, return to an unfinished question or identify a useful
          next step. The central question is whether that assistance strengthens
          understanding and agency.
        </p>
        <p>
          Early tests can use human facilitation, simple rules or clearly
          labeled simulations to examine that value before adding automation.
          Any suggestions should remain open to inspection and correction.
        </p>
      </ContentSection>

      <ContentSection title="What remains future work">
        <p>
          Questions for future work include continuity across devices, a
          learner-controlled atlas, creator and mentor tools, and ways to help
          families navigate learning opportunities. Field testing should
          determine which capabilities deserve to be built next.
        </p>
      </ContentSection>

      <ContentSection title="Start a product conversation">
        <p>
          Have experience with learner agency, knowledge systems, learning
          design or personal data ownership? We welcome a specific question or a
          proposal to explore together.
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
        <Link
          href="/work"
          className="text-sm font-medium text-water hover:text-moss transition-colors"
        >
          ← View all current work
        </Link>
      </div>
    </ProjectPageLayout>
  );
}
