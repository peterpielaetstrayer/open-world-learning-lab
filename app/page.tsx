import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import PullQuote from "@/components/PullQuote";
import ProjectCard from "@/components/ProjectCard";
import ReleaseCard from "@/components/ReleaseCard";
import LearningLoop from "@/components/LearningLoop";
import FutureHorizon from "@/components/FutureHorizon";
import GuardrailCard from "@/components/GuardrailCard";
import TahoeLearningMap from "@/components/TahoeLearningMap";
import Footer from "@/components/Footer";
import Link from "next/link";
import { projects, tahoeZones } from "@/content/projects";
import { releases } from "@/content/releases";
import { guardrails, workLabCards, siteConfig } from "@/content/shared";

export { homeMetadata as metadata } from "@/lib/metadata";

export default function Home() {
  const featuredReleases = releases.filter((r) => r.featured);

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* SECTION 2 — THE THESIS */}
        <Section id="thesis" divider>
          <SectionHeader
            eyebrow="The starting question"
            title="Maybe students do not hate knowledge. Maybe they hate knowledge removed from reality."
          />
          <div className="max-w-3xl space-y-5 text-muted leading-relaxed">
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
          </div>
          <PullQuote>The goal is not less structure. It is structured freedom.</PullQuote>
        </Section>

        {/* SECTION 3 — WHAT OWLL IS */}
        <Section id="what-owll-is" variant="sand" divider>
          <SectionHeader
            eyebrow="One lab, three forms of work"
            title="Researching, prototyping, and building toward a more alive learning future."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {workLabCards.map((card, i) => (
              <article
                key={card.title}
                className="card-premium card-lift p-6 md:p-7 hover:border-tahoe/25 relative"
              >
                {i < workLabCards.length - 1 && (
                  <div
                    className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-tahoe/20 z-10"
                    aria-hidden="true"
                  />
                )}
                <p className="field-label mb-2">Form {String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-serif text-xl text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">{card.description}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* SECTION 4 — CURRENT WORK */}
        <Section id="current-work" divider>
          <SectionHeader
            eyebrow="Now being developed"
            title="The work is moving from philosophy into prototypes."
          />
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/work"
              className="btn-tactile inline-flex items-center justify-center rounded-full border border-sand-dark/80 px-6 py-3 text-sm font-medium text-foreground hover:border-tahoe/40"
            >
              View all current work
            </Link>
          </div>
        </Section>

        {/* SECTION 5 — THE LEARNING LOOP */}
        <Section id="learning-loop" variant="interface" divider>
          <SectionHeader
            eyebrow="How open-world learning works"
            title="Experience becomes learning through a designed loop."
          />
          <LearningLoop />
        </Section>

        {/* SECTION 6 — HOW WE BUILD NOW */}
        <Section id="how-we-build" variant="sand" divider>
          <SectionHeader
            eyebrow="Technology should follow the learning"
            title="The work can begin with ordinary tools."
          />
          <FutureHorizon />
        </Section>

        {/* SECTION 7 — OPEN WORLD TAHOE ORIGIN FEATURE */}
        <Section id="open-world-tahoe" variant="slate" divider>
          <SectionHeader
            eyebrow="Origin Study · OWL-001"
            title="Open World Tahoe"
          />
          <div className="max-w-3xl space-y-5 text-muted leading-relaxed">
            <p>Open World Learning Lab began with a question formed in Tahoe.</p>
            <p>
              Growing up around students who spent their days skiing, riding, hiking, exploring, and learning through the world, it was difficult not to notice how much intelligence, discipline, curiosity, and skill could exist outside the forms school usually recognized.
            </p>
            <p>
              What if a learner studying a snowboard or wakeboard trick could return to the exact moment, examine angle, force, timing, rotation, risk, and feedback—and encounter mathematics and physics because the knowledge helped them understand something real?
            </p>
            <p className="text-foreground font-medium">
              Open World Tahoe became the original thought experiment behind the lab.
            </p>
            <p className="text-sm text-stone border-l-2 border-tahoe/25 pl-4">
              Origin study. Not currently operating as a school or educational program.
            </p>
          </div>
          <TahoeLearningMap zones={tahoeZones} />
          <div className="mt-10">
            <Link
              href="/work/open-world-tahoe"
              className="btn-tactile inline-flex items-center justify-center rounded-full bg-pine px-7 py-3.5 text-sm font-medium text-white hover:bg-pine-light"
            >
              Explore Open World Tahoe
            </Link>
          </div>
        </Section>

        {/* SECTION 8 — DESIGN GUARDRAILS */}
        <Section id="guardrails" variant="sand" divider>
          <SectionHeader
            eyebrow="What must remain true"
            title="A more powerful learning environment also requires stronger boundaries."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guardrails.map((guardrail, i) => (
              <GuardrailCard key={guardrail.title} {...guardrail} index={i} />
            ))}
          </div>
        </Section>

        {/* SECTION 9 — RELEASES FROM THE LAB */}
        <Section id="releases" divider>
          <SectionHeader
            eyebrow="Public work"
            title="A growing record of ideas, systems, and prototypes."
            intro="OWLL publishes selected briefs, system maps, pilot sketches, field notes, and design studies as the work develops."
          />
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/releases"
              className="btn-tactile inline-flex items-center justify-center rounded-full border border-sand-dark/80 px-6 py-3 text-sm font-medium text-foreground hover:border-tahoe/40"
            >
              View All Releases
            </Link>
          </div>
        </Section>

        {/* SECTION 10 — CLOSING STATEMENT */}
        <Section id="contact" variant="dark" className="pattern-topo relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-tahoe/5 via-transparent to-pine/5" aria-hidden="true" />
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
              The future of education should not feel like escaping reality.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-sand/80 leading-relaxed">
              It should feel like finally seeing reality clearly.
            </p>
            <p className="mt-8 text-base text-sand/70 leading-relaxed">
              OWLL is developing its first learning journeys, public design studies, creator workflows, and product prototypes. The lab is interested in thoughtful conversations with educators, mentors, researchers, families, designers, technologists, and potential pilot partners.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href={`mailto:${siteConfig.email}?subject=Follow%20the%20Work`}
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-background px-7 py-3.5 text-sm font-medium text-foreground hover:bg-sand"
              >
                Follow the Work
              </a>
              <Link
                href="/contact"
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-sand/30 px-7 py-3.5 text-sm font-medium text-background hover:bg-sand/10"
              >
                Contact the Lab
              </Link>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
