import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import PullQuote from "@/components/PullQuote";
import WorkTriptych from "@/components/WorkTriptych";
import ProjectIndexEntry from "@/components/ProjectIndexEntry";
import LearningLoopDiagram from "@/components/diagrams/LearningLoopDiagram";
import TechnologyHorizons from "@/components/diagrams/TechnologyHorizons";
import GuardrailIndex from "@/components/diagrams/GuardrailIndex";
import ReleaseCover, { releaseTypeToVariant } from "@/components/ReleaseCover";
import VisualPlate from "@/components/visual/VisualPlate";
import StatusBadge from "@/components/StatusBadge";
import EditorialSection from "@/components/layout/EditorialSection";
import ReadingColumn from "@/components/layout/ReadingColumn";
import SectionDivider from "@/components/layout/SectionDivider";
import Link from "next/link";
import { projects } from "@/content/projects";
import { releases } from "@/content/releases";
import { siteConfig } from "@/content/shared";

export { homeMetadata as metadata } from "@/lib/metadata";

export default function Home() {
  const featuredReleases = releases.filter((r) => r.featured);

  return (
    <>
      <Header />
      <main>
        <Hero />

        <SectionDivider />

        {/* THESIS */}
        <EditorialSection id="thesis">
          <SectionHeader
            eyebrow="The starting question"
            title="Maybe students do not hate knowledge. Maybe they hate knowledge removed from reality."
          />
          <ReadingColumn className="space-y-5 text-body text-secondary">
            <p>
              Modern schooling often organizes learning around schedules, subjects, rooms, assignments, and tests. Those structures can be useful, but they can also separate knowledge from the living contexts that make it matter.
            </p>
            <p>Open-world education begins with a different proposition: the world is already full of curriculum.</p>
            <p>
              A coastline can become ecology, geology, history, public policy, physics, and stewardship. A trail can become navigation, biology, attention, endurance, and land use. A kitchen table can become chemistry, culture, story, economics, and civic conversation.
            </p>
            <p>
              The challenge is not simply to send learners outside. The challenge is to design enough structure, support, inquiry, practice, and reflection for experience to become durable learning.
            </p>
          </ReadingColumn>
          <aside className="mt-10 max-w-reading border-l-2 border-sun-marker/40 pl-5">
            <p className="font-mono text-metadata text-quiet">Field note</p>
            <p className="mt-1 text-caption text-secondary italic">
              Structure and freedom are not opposites in place-based learning.
            </p>
          </aside>
          <PullQuote>The goal is not less structure. It is structured freedom.</PullQuote>
        </EditorialSection>

        <SectionDivider />

        {/* ONE LAB, THREE FORMS */}
        <EditorialSection id="what-owll-is" variant="soft">
          <SectionHeader
            eyebrow="One lab, three forms of work"
            title="Researching, prototyping, and building toward a more alive learning future."
          />
          <WorkTriptych />
        </EditorialSection>

        <SectionDivider />

        {/* CURRENT WORK */}
        <EditorialSection id="current-work">
          <SectionHeader
            eyebrow="Now being developed"
            title="The work is moving from philosophy into prototypes."
          />
          <div className="space-y-14">
            <div className="space-y-16">
              {projects
                .filter((project) => project.featured && ["first-landing", "locus"].includes(project.slug))
                .map((project) => (
                  <ProjectIndexEntry key={project.slug} project={project} layout="featured" />
                ))}
            </div>

            <div className="grid gap-10 sm:grid-cols-2 max-w-4xl pt-4 border-t border-border">
              {projects
                .filter((project) => ["open-world-saturdays", "open-world-tahoe"].includes(project.slug))
                .map((project) => (
                  <ProjectIndexEntry key={project.slug} project={project} layout="compact" />
                ))}
            </div>
          </div>
          <div className="mt-12">
            <Link
              href="/work"
              className="btn-tactile inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-ink hover:border-water/40"
            >
              View all current work
            </Link>
          </div>
        </EditorialSection>

        <SectionDivider />

        {/* LEARNING LOOP */}
        <EditorialSection id="learning-loop" variant="field">
          <SectionHeader
            eyebrow="How open-world learning works"
            title="Experience becomes learning through a designed loop."
          />
          <LearningLoopDiagram />
        </EditorialSection>

        <SectionDivider />

        {/* TECHNOLOGY HORIZONS */}
        <EditorialSection id="how-we-build" variant="soft">
          <SectionHeader
            eyebrow="Technology should follow the learning"
            title="The work can begin with ordinary tools."
          />
          <TechnologyHorizons />
        </EditorialSection>

        <SectionDivider />

        {/* OPEN WORLD TAHOE */}
        <EditorialSection id="open-world-tahoe" variant="dark">
          <SectionHeader
            eyebrow="Origin Study · OWL-001"
            title="Open World Tahoe"
            dark
          />
          <ReadingColumn className="space-y-5 text-body text-on-dark/80">
            <p>Open World Learning Lab began with a question formed in Tahoe.</p>
            <p>
              Growing up around students who spent their days skiing, riding, hiking, exploring, and learning through the world, it was difficult not to notice how much intelligence, discipline, curiosity, and skill could exist outside the forms school usually recognized.
            </p>
            <p>
              What if a learner studying a snowboard or wakeboard trick could return to the exact moment, examine angle, force, timing, rotation, risk, and feedback—and encounter mathematics and physics because the knowledge helped them understand something real?
            </p>
            <p className="text-on-dark font-medium">
              Open World Tahoe became the original thought experiment behind the lab.
            </p>
          </ReadingColumn>

          <StatusBadge
            projectType="Origin Study"
            status="origin-study"
            className="mt-6 text-on-dark/70"
          />

          <div className="mt-10">
            <VisualPlate
              assetKey="tahoe-origin-atlas"
              theme="tahoe"
              variant="hero"
              caption="Four zones — lake, mountain, trail, and campfire."
            />
          </div>

          <div className="mt-10">
            <Link
              href="/work/open-world-tahoe"
              className="btn-tactile inline-flex items-center rounded-full bg-water px-7 py-3.5 text-sm font-medium text-on-dark hover:bg-water/90"
            >
              Explore Open World Tahoe
            </Link>
          </div>
        </EditorialSection>

        <SectionDivider />

        {/* GUARDRAILS */}
        <EditorialSection id="guardrails" variant="soft">
          <SectionHeader
            eyebrow="What must remain true"
            title="A more powerful learning environment also requires stronger boundaries."
          />
          <GuardrailIndex />
        </EditorialSection>

        <SectionDivider />

        {/* RELEASES */}
        <EditorialSection id="releases">
          <SectionHeader
            eyebrow="Public work"
            title="A growing record of ideas, systems, and prototypes."
            intro="OWLL publishes selected briefs, system maps, pilot sketches, field notes, and design studies as the work develops."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredReleases.map((release) => (
              <ReleaseCover
                key={release.id}
                releaseId={release.subtitle}
                title={release.title}
                releaseType={release.releaseType}
                version={release.version}
                date={release.publishedAt}
                visualVariant={releaseTypeToVariant(release.releaseType)}
                href={release.href}
              />
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/releases"
              className="btn-tactile inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-ink hover:border-water/40"
            >
              View All Releases
            </Link>
          </div>
        </EditorialSection>

        <SectionDivider />

        {/* CLOSING */}
        <EditorialSection id="contact" variant="dark" className="pattern-topo">
          <ReadingColumn className="mx-auto text-center">
            <h2 className="font-serif text-page-title text-on-dark leading-tight">
              The future of education should not feel like escaping reality.
            </h2>
            <p className="mt-6 text-body-lg text-on-dark/80">
              It should feel like finally seeing reality clearly.
            </p>
            <p className="mt-8 text-body text-on-dark/70">
              OWLL is developing its first learning journeys, public design studies, creator workflows, and product prototypes. The lab is interested in thoughtful conversations with educators, mentors, researchers, families, designers, technologists, and potential pilot partners.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`mailto:${siteConfig.email}?subject=Follow%20the%20Work`}
                className="btn-tactile inline-flex items-center justify-center rounded-full bg-page px-7 py-3.5 text-sm font-medium text-ink hover:bg-soft-paper"
              >
                Follow the Work
              </a>
              <Link
                href="/contact"
                className="btn-tactile inline-flex items-center justify-center rounded-full border border-on-dark/30 px-7 py-3.5 text-sm font-medium text-on-dark hover:bg-on-dark/10"
              >
                Contact the Lab
              </Link>
            </div>
          </ReadingColumn>
        </EditorialSection>
      </main>
      <Footer />
    </>
  );
}
