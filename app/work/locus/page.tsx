import type { Metadata } from "next";
import Link from "next/link";
import ProjectPageLayout, { ContentSection } from "@/components/ProjectPageLayout";
import ProjectMasthead from "@/components/ProjectMasthead";
import ProjectFigureSection from "@/components/layout/ProjectFigureSection";
import VisualPlate from "@/components/visual/VisualPlate";
import LocusCoreLayers from "@/components/diagrams/LocusCoreLayers";
import FieldNoteSpecimen from "@/components/FieldNoteSpecimen";
import RelatedWork from "@/components/RelatedWork";
import { createPageMetadata } from "@/lib/metadata";
import { projects } from "@/content/projects";

export const metadata: Metadata = createPageMetadata({
  title: "LOCUS — Learning System Prototype",
  description:
    "LOCUS is an emerging learning system designed to help learners turn curiosity, places, questions, practice, mentorship, reflection, and creation into cumulative growth.",
  path: "/work/locus",
});

const prototypeLoop = [
  "A learner encountering a place or prompt",
  "Capturing a Field Note",
  "Developing a question",
  "Receiving structured guidance",
  "Investigating and practicing",
  "Creating an artifact",
  "Explaining the work",
  "Receiving mentor feedback",
  "Adding the experience to a cumulative record",
];

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
          summary="LOCUS is an emerging learning system designed to help learners turn curiosity, places, questions, practice, mentorship, reflection, and creation into cumulative growth."
          statusNotice="LOCUS is in product and learning-experience design. The public page describes the educational system from the learner's perspective and does not represent a complete production platform."
        />
      }
      figure={
        <ProjectFigureSection>
          <VisualPlate
            assetKey="locus-system-spine"
            theme="locus"
            variant="infographic"
            title="From Experience to Cumulative Growth"
          />
        </ProjectFigureSection>
      }
      related={<RelatedWork projects={relatedProjects} />}
    >
      <ContentSection title="What LOCUS is">
        <p>
          LOCUS is intended to help learners, mentors, families, and learning designers connect curiosity, places, Field Notes, guided inquiry, practice, feedback, reflection, and artifacts into cumulative growth.
        </p>
        <p>
          It is not simply an AI tutor. It is the emerging learning and creator infrastructure behind open-world education.
        </p>
      </ContentSection>

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
          A responsive summary of the system plate above. Labels remain conceptual — not live system data.
        </p>
        <LocusCoreLayers />
      </ContentSection>

      <FieldNoteSpecimen />

      <ContentSection title="The current prototype">
        <p>
          The first prototype should demonstrate one complete learning loop rather than attempting to build the entire future platform.
        </p>
        <ol className="space-y-2 mt-4">
          {prototypeLoop.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm list-none">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-water/10 text-xs font-mono text-water border border-water/20">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </ContentSection>

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

      <div className="pt-4">
        <Link href="/work" className="text-sm font-medium text-water hover:text-moss transition-colors">
          ← View all current work
        </Link>
      </div>
    </ProjectPageLayout>
  );
}
