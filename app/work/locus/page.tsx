import type { Metadata } from "next";
import Link from "next/link";
import ProjectPageLayout from "@/components/ProjectPageLayout";
import ProjectMetadata from "@/components/ProjectMetadata";
import RelatedWork from "@/components/RelatedWork";
import { createPageMetadata } from "@/lib/metadata";
import { projects } from "@/content/projects";

export const metadata: Metadata = createPageMetadata({
  title: "LOCUS — Learning System Prototype",
  description:
    "LOCUS is an emerging learning system designed to help learners turn curiosity, places, questions, practice, mentorship, reflection, and creation into cumulative growth.",
  path: "/work/locus",
});

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-foreground mb-4">{title}</h2>
      <div className="space-y-4 text-muted leading-relaxed">{children}</div>
    </section>
  );
}

const coreLayers = [
  {
    title: "Field Notes",
    description:
      "Capture observations, questions, images, audio, evidence, explanations, and reflections.",
  },
  {
    title: "Journey Layer",
    description:
      "Organize meaningful sequences of experiences, inquiry, practice, and creation.",
  },
  {
    title: "Mentor Layer",
    description:
      "Help human mentors understand progress, respond to needs, ask better questions, and intervene thoughtfully.",
  },
  {
    title: "Learning Atlas",
    description:
      "Build a cumulative record of places, concepts, skills, artifacts, and changing understanding.",
  },
  {
    title: "Creator Layer",
    description:
      "Help educators and learning designers transform domain knowledge and real environments into coherent learning journeys.",
  },
];

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
      title="LOCUS"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Current Work", href: "/work" },
        { label: "LOCUS" },
      ]}
      metadata={
        <ProjectMetadata
          projectType="Learning Infrastructure"
          status="product-prototype"
          summary="LOCUS is an emerging learning system designed to help learners turn curiosity, places, questions, practice, mentorship, reflection, and creation into cumulative growth."
        />
      }
      statusNotice="LOCUS is in product and learning-experience design. The public page describes the educational system from the learner's perspective and does not represent a complete production platform."
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
        <p>LOCUS is not simply:</p>
        <ul className="space-y-2 list-disc ml-5">
          <li>An AI tutor</li>
          <li>A chatbot with educational branding</li>
          <li>A replacement for teachers</li>
          <li>A screen-first learning platform</li>
          <li>A points-and-badges layer</li>
          <li>A system designed to automate every human decision</li>
        </ul>
      </ContentSection>

      <ContentSection title="Core layers">
        <div className="space-y-4 not-prose">
          {coreLayers.map((layer, i) => (
            <article key={layer.title} className="card-premium p-5">
              <p className="field-label mb-1">Layer {String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-semibold text-foreground">{layer.title}</h3>
              <p className="mt-2 text-sm text-muted">{layer.description}</p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="The current prototype">
        <p>
          The first prototype should demonstrate one complete learning loop rather than attempting to build the entire future platform.
        </p>
        <p>The prototype should show:</p>
        <ol className="space-y-2 mt-4">
          {prototypeLoop.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm list-none">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tahoe/10 text-xs font-medium text-tahoe border border-tahoe/20">
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

      <div className="pt-6">
        <Link href="/work" className="text-sm font-medium text-tahoe hover:text-pine transition-colors">
          ← View all current work
        </Link>
      </div>
    </ProjectPageLayout>
  );
}
