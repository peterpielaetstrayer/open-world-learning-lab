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
          statusNotice="LOCUS is in product and learning-experience design. Early functions may be manually facilitated, rule-based, or simulated. The public page describes the educational system from the learner's perspective and does not represent a complete production platform."
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
        <ol className="space-y-4 list-none">
          {locusFullLearnerJourney.map((step) => (
            <li key={step.step} className="flex items-start gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-water/10 text-xs font-mono text-water border border-water/20">
                {step.step}
              </span>
              {step.text}
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

      <ContentSection title="What currently exists">
        <p>
          A public system description, educational architecture outline, and early prototype design direction. Production platform, creator methodology, and internal systems remain in development.
        </p>
      </ContentSection>

      <ContentSection title="What remains future work">
        <p>
          Full platform development, automated Field Notes tooling, creator workflows, mentor dashboards, Learning Atlas visualization, and validated learning-loop prototypes in real educational contexts.
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
