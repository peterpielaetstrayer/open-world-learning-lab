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

const audiencePaths = [
  {
    title: "Individuals",
    description: "Develop the questions, practices, and confidence to direct your own learning throughout life.",
  },
  {
    title: "Families",
    description: "Discover how adults and children can learn alongside one another. Parents are learners, too.",
  },
  {
    title: "Educators & Mentors",
    description: "Explore learning experiences built around real questions, meaningful practice, and human support.",
  },
  {
    title: "Communities & Researchers",
    description: "Investigate the conditions that make learning more accessible, rigorous, and connected.",
  },
];

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
            eyebrow="The purpose"
            title="Education is bigger than school, and learning lasts a lifetime."
          />
          <ReadingColumn className="space-y-5 text-body text-secondary">
            <p>
              Learning takes place through family, work, neighborhoods, books, places, conversations, and the questions we choose to pursue. The world is already full of opportunities to learn.
            </p>
            <p>
              OWLL studies how curiosity can become understanding people can explain, practice, apply, and revisit. The goal is not less guidance or weaker foundations. It is structured freedom: meaningful support that helps people become increasingly capable of directing their own learning.
            </p>
          </ReadingColumn>
          <PullQuote>The world is the curriculum. Human agency is the purpose.</PullQuote>

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
            title="OWLL studies learning, designs experiences, and builds toward supporting infrastructure."
          />
          <WorkTriptych />
        </EditorialSection>

        <SectionDivider />

        {/* HUMAN ENTRY POINTS — not a claim that every program exists today */}
        <EditorialSection id="who-its-for" spacing="compact">
          <SectionHeader
            eyebrow="Who this work includes"
            title="A learning life belongs to more than one institution."
            intro="Our work is for people who want learning to be more connected, self-directed, and human. The pathways below describe who OWLL intends to serve, not programs that are currently open for enrollment."
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {audiencePaths.map((audience) => (
              <article key={audience.title} className="border-t border-border-strong pt-5">
                <h3 className="font-serif text-section-title text-ink">
                  {audience.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  {audience.description}
                </p>
              </article>
            ))}
          </div>
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

        {/* EXPANDING RESEARCH DIRECTION */}
        <EditorialSection id="learning-environments" variant="soft" spacing="compact">
          <div className="grid gap-8 md:grid-cols-[1.25fr_.75fr] md:items-center">
            <div>
              <p className="font-mono text-metadata uppercase tracking-widest text-water">
                New research direction / Early concept
              </p>
              <h2 className="mt-4 max-w-2xl font-serif text-page-title text-ink">
                What if the places we inhabit helped us become more capable learners?
              </h2>
              <p className="mt-5 max-w-reading text-body text-secondary">
                OWLL Learning Environments explores how people, rooms, resources, and
                learning activities might be designed together. One proposed starting point
                is a personal learning-space case study, not a commercial installation offer.
              </p>
              <Link href="/learning-environments" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-water hover:text-moss">
                Explore Learning Environments →
              </Link>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="font-mono text-metadata uppercase tracking-widest text-quiet">Learning is situated</p>
              <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md bg-soft-paper p-4"><span className="font-serif text-xl">Focus</span><p className="mt-1 text-xs text-secondary">Space for attention</p></div>
                <div className="rounded-md bg-[#dce8e4] p-4"><span className="font-serif text-xl">Explore</span><p className="mt-1 text-xs text-secondary">Space for inquiry</p></div>
                <div className="rounded-md bg-[#e5decd] p-4"><span className="font-serif text-xl">Make</span><p className="mt-1 text-xs text-secondary">Space for creation</p></div>
                <div className="rounded-md bg-[#e0e7d9] p-4"><span className="font-serif text-xl">Reflect</span><p className="mt-1 text-xs text-secondary">Space for growth</p></div>
              </div>
              <p className="mt-4 text-xs text-quiet">Conceptual learning zones, not a completed room.</p>
            </div>
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
                intro="A July 2026 snapshot of the lab’s earlier focus, preserved as the research and design direction evolves."
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
              We welcome thoughtful questions from adult learners, families, educators, researchers, designers, and community organizations. Current work is early-stage, and this is not a program enrollment or service booking channel.
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
