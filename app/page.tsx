import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import PullQuote from "@/components/PullQuote";
import WorkTriptych from "@/components/WorkTriptych";
import ProjectIndexEntry from "@/components/ProjectIndexEntry";
import LearningLoopDiagram from "@/components/diagrams/LearningLoopDiagram";
import GuardrailIndex from "@/components/diagrams/GuardrailIndex";
import ReleaseCover, { releaseTypeToVariant } from "@/components/ReleaseCover";
import EditorialSection from "@/components/layout/EditorialSection";
import ReadingColumn from "@/components/layout/ReadingColumn";
import SectionDivider from "@/components/layout/SectionDivider";
import Link from "next/link";
import { projects } from "@/content/projects";
import { releases } from "@/content/releases";
import { founderBio } from "@/content/shared";

export { homeMetadata as metadata } from "@/lib/metadata";

const primaryProjects = projects.filter((p) =>
  ["first-landing", "locus"].includes(p.slug)
);

const owllAtAGlance = releases.find((r) => r.slug === "owll-at-a-glance");

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        <SectionDivider />

        {/* THESIS + LEARNING LOOP */}
        <EditorialSection id="thesis">
          <SectionHeader
            eyebrow="The starting question"
            title="Maybe students do not hate knowledge. Maybe they hate knowledge removed from reality."
          />
          <ReadingColumn className="space-y-5 text-body text-secondary">
            <p>
              Modern schooling often separates knowledge from the living contexts that make it matter. Open-world education begins with a different proposition: the world is already full of curriculum.
            </p>
            <p>
              The challenge is not simply to send learners outside. It is to design enough structure, support, inquiry, practice, and reflection for experience to become durable learning.
            </p>
          </ReadingColumn>
          <PullQuote>The goal is not less structure. It is structured freedom.</PullQuote>

          <div className="mt-10 pt-10 md:mt-14 md:pt-14 border-t border-border" id="learning-loop">
            <SectionHeader
              eyebrow="How open-world learning works"
              title="Experience becomes learning through a designed loop."
            />
            <LearningLoopDiagram />
          </div>
        </EditorialSection>

        <SectionDivider />

        {/* WHAT OWLL DOES */}
        <EditorialSection id="what-owll-is" variant="soft">
          <SectionHeader
            eyebrow="What OWLL does"
            title="OWLL studies the problem, prototypes the experience, and builds toward supporting infrastructure."
          />
          <WorkTriptych />
        </EditorialSection>

        <SectionDivider />

        {/* TWO PRIMARY DOORS */}
        <EditorialSection id="current-work">
          <SectionHeader
            eyebrow="Primary prototypes"
            title="Two doors into the current work."
          />
          <div className="space-y-12 md:space-y-16">
            {primaryProjects.map((project) => (
              <ProjectIndexEntry
                key={project.slug}
                project={project}
                layout="featured"
                ctaLabel={
                  project.slug === "first-landing"
                    ? "Explore First Landing"
                    : "Explore LOCUS"
                }
              />
            ))}
          </div>
          <div className="mt-8 md:mt-12">
            <Link
              href="/work"
              className="text-sm font-medium text-water hover:text-moss transition-colors"
            >
              View all current and exploratory work →
            </Link>
          </div>
        </EditorialSection>

        <SectionDivider />

        {/* PRINCIPLES, FOUNDER, INVITATION */}
        <EditorialSection id="guardrails" variant="soft">
          <SectionHeader
            eyebrow="What must remain true"
            title="A more powerful learning environment also requires stronger boundaries."
          />
          <GuardrailIndex />
        </EditorialSection>

        <SectionDivider />

        <EditorialSection id="founder" spacing="compact">
          <SectionHeader
            eyebrow="Who is developing this work"
            title="Founded through practice, not abstraction."
          />
          <ReadingColumn className="text-body text-secondary leading-relaxed">
            <p>{founderBio.short}</p>
            <p className="mt-4">
              <Link
                href="/about"
                className="text-sm font-medium text-water hover:text-moss transition-colors"
              >
                Read more about OWLL →
              </Link>
            </p>
          </ReadingColumn>
        </EditorialSection>

        {owllAtAGlance && (
          <>
            <SectionDivider />
            <EditorialSection id="releases" spacing="compact">
              <SectionHeader
                eyebrow="Selected public work"
                title="OWLL at a Glance"
                intro="A concise leave-behind introduction to the lab, its thesis, and its current work."
              />
              <div className="max-w-md">
                <ReleaseCover
                  releaseId={owllAtAGlance.subtitle}
                  title={owllAtAGlance.title}
                  releaseType={owllAtAGlance.releaseType}
                  version={owllAtAGlance.version}
                  date={owllAtAGlance.publishedAt}
                  visualVariant={releaseTypeToVariant(owllAtAGlance.releaseType)}
                  href={owllAtAGlance.href}
                  summary={owllAtAGlance.summary}
                />
              </div>
              <div className="mt-8">
                <Link
                  href="/releases"
                  className="text-sm font-medium text-water hover:text-moss transition-colors"
                >
                  View all releases →
                </Link>
              </div>
            </EditorialSection>
          </>
        )}

        <SectionDivider />

        {/* FINAL INVITATION */}
        <EditorialSection id="contact" variant="dark" className="pattern-topo">
          <ReadingColumn className="mx-auto text-center">
            <h2 className="font-serif text-page-title text-on-dark leading-tight">
              Start a thoughtful conversation.
            </h2>
            <p className="mt-5 md:mt-8 text-body text-on-dark/70">
              OWLL is interested in conversations with educators, mentors, learning designers, researchers, community organizations, technologists, and potential pilot collaborators.
            </p>
            <div className="mt-7 md:mt-10 flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
              <Link
                href="/contact"
                className="btn-tactile inline-flex min-h-11 items-center justify-center rounded-full bg-page px-7 py-3 text-sm font-medium text-ink hover:bg-soft-paper"
              >
                Start a Conversation
              </Link>
              <Link
                href="/work"
                className="btn-tactile inline-flex min-h-11 items-center justify-center rounded-full border border-on-dark/30 px-7 py-3 text-sm font-medium text-on-dark hover:bg-on-dark/10"
              >
                Explore the Work
              </Link>
            </div>
          </ReadingColumn>
        </EditorialSection>
      </main>
      <Footer />
    </>
  );
}
