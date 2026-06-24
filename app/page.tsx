import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorldAsClassroomBand from "@/components/WorldAsClassroomBand";
import Section from "@/components/Section";
import ProcessStep from "@/components/ProcessStep";
import MissionCard from "@/components/MissionCard";
import GuardrailCard from "@/components/GuardrailCard";
import TahoeLearningMap from "@/components/TahoeLearningMap";
import Footer from "@/components/Footer";

const processSteps = [
  { title: "Experience", phrase: "Start in the real world" },
  { title: "Curiosity spike", phrase: "Something catches attention" },
  { title: "Guided inquiry", phrase: "Questions with support" },
  { title: "Knowledge gain", phrase: "Concepts take shape" },
  { title: "Real-world practice", phrase: "Apply and test" },
  { title: "Public artifact", phrase: "Show the learning" },
  { title: "Reflection", phrase: "Integrate and deepen" },
];

const tahoeZones = [
  {
    name: "Lake as System",
    concepts: ["Ecology", "Climate", "Physics", "Public policy", "Stewardship"],
  },
  {
    name: "Mountain as Lab",
    concepts: ["Momentum", "Torque", "Biomechanics", "Risk", "Feedback"],
  },
  {
    name: "Trail as Text",
    concepts: ["Geology", "Navigation", "Land use", "Endurance", "Attention"],
  },
  {
    name: "Campfire as Seminar",
    concepts: ["Chemistry", "Anthropology", "Story", "Ritual", "Civic conversation"],
  },
];

const howItWorksCards = [
  {
    title: "Real places",
    description:
      "Learning starts with actual environments: lakes, trails, neighborhoods, farms, museums, kitchens, workshops, and public spaces.",
  },
  {
    title: "Explorer streams",
    description:
      "Local learners and mentors document real expeditions so remote students can follow, ask questions, compare places, and join the inquiry.",
  },
  {
    title: "AI scaffolding",
    description:
      "AI can help translate, annotate, prompt questions, explain concepts, suggest next steps, and connect experience to disciplinary knowledge.",
  },
  {
    title: "Human mentorship",
    description:
      "Teachers, guides, coaches, elders, designers, and subject experts remain central. Technology supports the learning relationship; it does not replace it.",
  },
  {
    title: "Public artifacts",
    description:
      "Students create field guides, maps, videos, essays, datasets, debates, designs, and demonstrations that show what they learned.",
  },
];

const missions = [
  {
    title: "The Flip Mission",
    description:
      "Students analyze a ski, snowboard, or wakeboard trick using video replay, body mechanics, physics, and reflection.",
    concepts: ["force", "rotation", "torque", "timing", "feedback", "risk"],
    artifact: "Annotated replay",
  },
  {
    title: "The Lake as a Living System",
    description:
      "Students investigate water clarity, invasive species, tourism, climate, land use, and local governance.",
    concepts: ["ecology", "systems thinking", "policy", "stewardship", "data"],
    artifact: "Mini-documentary or dataset",
  },
  {
    title: "The Trail Field Guide",
    description:
      "Students hike a route and document geology, plant life, navigation decisions, human impact, and questions for further research.",
    concepts: ["geology", "botany", "mapping", "endurance", "observation"],
    artifact: "Field guide or map",
  },
  {
    title: "Fire, Food, and Civilization",
    description:
      "Students gather around food and fire to study chemistry, anthropology, culture, ritual, conversation, and the history of shared meals.",
    concepts: ["combustion", "food systems", "story", "ethics", "community"],
    artifact: "Reflective essay or oral defense",
  },
];

const guardrails = [
  {
    title: "Reality first",
    description:
      "Technology should deepen attention to the world, not pull learners away from it.",
  },
  {
    title: "Consent always",
    description:
      "Recording, streaming, data use, and participation must be transparent and opt-in, especially with minors.",
  },
  {
    title: "Humans lead",
    description:
      "AI can scaffold and support. Teachers, mentors, families, and communities guide the learning.",
  },
  {
    title: "Safety before spectacle",
    description:
      "Outdoor learning requires serious risk management, preparation, supervision, and local knowledge.",
  },
  {
    title: "Local respect",
    description:
      "Tahoe is not a theme park. Every place has history, community, ecology, and limits.",
  },
  {
    title: "Equity by design",
    description:
      "Open-world education should not become luxury education for the already privileged. Access must be part of the model from the beginning.",
  },
];

const libraryOnPage = [
  { label: "Manifesto", href: "/manifesto" },
  { label: "Origin story", href: "#origin" },
  { label: "Open-world framework", href: "#framework" },
  { label: "Meta Academy Tahoe pilot sketch", href: "#meta-academy" },
  { label: "Sample learning missions", href: "#missions" },
  { label: "Design guardrails", href: "#guardrails" },
];

const libraryComingSoon = [
  "One-page concept brief",
  "Future white paper",
  "Downloadable mission template packs",
  "Field guide and reflection templates",
  "Meta Academy Tahoe pilot blueprints",
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WorldAsClassroomBand />

        {/* Origin story */}
        <Section id="origin" variant="sand" divider>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-foreground">
                The idea started in Tahoe.
              </h2>
              <div className="mt-8 space-y-5 text-muted leading-relaxed">
                <p>
                  I grew up in Tahoe, where I watched students on independent
                  study spend their days skiing, riding, hiking, exploring, and
                  learning from the world in ways school often did not know how
                  to recognize.
                </p>
                <p>
                  When I was sixteen, I remember thinking about friends who did
                  not seem to care about math in the classroom, but cared deeply
                  about landing a flip. What if they could do the trick, return
                  to the exact moment, study the angle, rotation, force,
                  timing, and mechanics — and learn the math because it helped
                  them become better at something real?
                </p>
                <p>
                  Maybe many students do not hate knowledge.
                  <br />
                  Maybe they hate knowledge removed from reality.
                </p>
                <p className="text-foreground font-medium">
                  Open World Learning Lab begins from that insight.
                </p>
              </div>
            </div>

            <blockquote className="relative card-premium glass-panel p-8 md:p-10 card-lift overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tahoe/20 to-transparent" aria-hidden="true" />
              <p className="field-label mb-4">Field note · origin</p>
              <div className="absolute top-6 right-6 text-6xl font-serif text-tahoe/15 leading-none select-none" aria-hidden="true">
                &ldquo;
              </div>
              <p className="relative font-serif text-2xl md:text-[1.65rem] leading-snug text-foreground">
                Maybe students do not hate knowledge. Maybe they hate knowledge
                removed from reality.
              </p>
              <footer className="mt-6 text-sm text-stone">— Field note</footer>
            </blockquote>
          </div>
        </Section>

        {/* Core thesis */}
        <Section
          id="framework"
          title="Schooling and education are not the same thing."
          divider
        >
          <div className="max-w-3xl space-y-5 text-muted leading-relaxed">
            <p>
              Modern school systems often organize learning around schedules,
              subjects, rooms, assignments, and tests. Those structures can be
              useful, but they can also separate knowledge from the living
              contexts that make knowledge matter.
            </p>
            <p>
              Open-world education starts from a different sequence:
            </p>
            <p className="font-medium text-foreground text-base sm:text-lg leading-relaxed">
              Experience → curiosity → guided inquiry → knowledge → practice →
              artifact → reflection
            </p>
            <p>
              The goal is not to remove structure. The goal is to create
              structured freedom: rigorous learning pathways that begin in the
              real world and move toward deeper understanding.
            </p>
          </div>

          <div className="mt-12 md:mt-16 -mx-6 px-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
            <div className="flex gap-5 lg:gap-2 min-w-max lg:min-w-0 lg:justify-between rounded-2xl border border-sand-dark/30 bg-card/60 backdrop-blur-sm p-6 lg:p-8 lg:border-0 lg:bg-transparent lg:backdrop-blur-none lg:p-0">
              {processSteps.map((step, i) => (
                <ProcessStep
                  key={step.title}
                  number={i + 1}
                  title={step.title}
                  phrase={step.phrase}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* Meta Academy Tahoe */}
        <Section
          id="meta-academy"
          variant="slate"
          title="Meta Academy Tahoe: a first pilot concept."
          subtitle="A place-based, globally networked learning environment built around Tahoe as an open-world classroom."
          divider
        >
          <div className="max-w-3xl space-y-5 text-muted leading-relaxed">
            <p>
              Meta Academy Tahoe is a concept for using AI glasses, live
              translation, spatial media, educator-designed missions, and human
              mentorship to turn Tahoe into a rigorous learning environment that
              students around the world can enter, follow, question, and learn
              from.
            </p>
            <p>
              The lake becomes ecology, climate, physics, public policy, and
              stewardship.
            </p>
            <p>
              A ski jump or wakeboard trick becomes momentum, torque, balance,
              timing, biomechanics, and feedback.
            </p>
            <p>
              A trail becomes geology, navigation, land use, endurance, and
              attention.
            </p>
            <p>
              A campfire becomes chemistry, anthropology, food, story, ritual,
              and civic conversation.
            </p>
            <p className="text-foreground">
              This is not about replacing teachers with AI or replacing the real
              world with screens. It is about using emerging tools to help
              students step deeper into reality.
            </p>
          </div>

          <TahoeLearningMap zones={tahoeZones} />
        </Section>

        {/* How it works */}
        <Section id="how-it-works" title="How the model works." variant="sand" divider>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorksCards.map((card, i) => (
              <article
                key={card.title}
                className={`card-premium card-lift p-6 md:p-7 hover:border-tahoe/25 ${
                  i === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <span className="field-label">
                  module {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-lg text-foreground">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {card.description}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-14 text-center font-serif text-xl md:text-2xl text-foreground">
            The point is not more screen time.{" "}
            <span className="text-tahoe">The point is better attention.</span>
          </p>
        </Section>

        {/* Sample missions */}
        <Section
          id="missions"
          title="Sample learning missions."
          intro="Open-world learning needs structure. Missions turn exploration into rigorous inquiry, practice, and evidence of learning."
          variant="interface"
          divider
        >
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            {missions.map((mission, i) => (
              <MissionCard key={mission.title} {...mission} index={i} />
            ))}
          </div>
        </Section>

        {/* Guardrails */}
        <Section
          id="guardrails"
          title="The future has to be built carefully."
          intro="Open-world education could become deeply human, or it could become another layer of surveillance, distraction, and commercialization. The design matters."
          variant="sand"
          divider
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guardrails.map((guardrail, i) => (
              <GuardrailCard key={guardrail.title} {...guardrail} index={i} />
            ))}
          </div>
        </Section>

        {/* Library */}
        <Section
          id="library"
          title="An open-source design library for the future of education."
          divider
        >
          <div className="max-w-3xl space-y-5 text-muted leading-relaxed">
            <p>
              Open World Learning Lab is being designed as a public resource: a
              place to publish frameworks, white papers, sample missions, field
              guides, ethical guardrails, and pilot blueprints that educators,
              designers, technologists, families, and communities can study,
              remix, critique, and improve.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-pine">
                On this site (v0)
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                The following are already represented in the sections below.
              </p>
              <ul className="mt-4 space-y-2">
                {libraryOnPage.map((resource) => (
                  <li key={resource.label}>
                    <a
                      href={resource.href}
                      className="card-premium card-lift flex items-center gap-3 px-4 py-3.5 text-sm text-foreground hover:border-tahoe/30"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-pine/10 border border-pine/15">
                        <span className="h-1.5 w-1.5 rounded-full bg-pine" />
                      </span>
                      {resource.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone">
                Downloadable releases (next)
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Standalone documents and templates will be published here as they
                are finalized.
              </p>
              <ul className="mt-4 space-y-2">
                {libraryComingSoon.map((resource) => (
                  <li
                    key={resource}
                    className="card-premium flex items-center gap-3 border-dashed px-4 py-3.5 text-sm text-muted bg-sand/15"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sand/40 border border-sand-dark/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-stone/50" />
                    </span>
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 card-premium bg-sand/20 p-6 max-w-3xl">
            <p className="text-sm text-muted leading-relaxed">
              Unless otherwise noted, project writing and educational design
              materials are intended to be shared under{" "}
              <span className="text-foreground font-medium">
                Creative Commons Attribution 4.0
              </span>
              . Code resources may be released separately under an MIT-style
              license.
            </p>
          </div>

          <p className="mt-8 text-sm text-muted max-w-3xl">
            Briefs, templates, and blueprints will be available for download as
            the library matures. This page is the first public sketch.
          </p>
        </Section>

        {/* Final CTA */}
        <Section id="contact" variant="dark" className="pattern-topo relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-tahoe/5 via-transparent to-pine/5" aria-hidden="true" />
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
              The future of education should not feel like escaping reality.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-sand/80 leading-relaxed">
              It should feel like finally seeing reality clearly.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="mailto:hello@openworldlearninglab.com?subject=Follow%20the%20project"
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-background px-7 py-3.5 text-sm font-medium text-foreground hover:bg-sand"
              >
                Follow the project
              </a>
              <a
                href="mailto:hello@openworldlearninglab.com?subject=Collaboration%20inquiry"
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-sand/30 px-7 py-3.5 text-sm font-medium text-background hover:bg-sand/10"
              >
                Contact / collaborate
              </a>
            </div>

            <p className="mt-10 text-sm text-sand/50">
              This is a v0 public concept site. The framework, missions, and
              white papers are in development.
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
