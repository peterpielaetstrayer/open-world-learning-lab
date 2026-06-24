import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ManifestoHero from "@/components/ManifestoHero";
import ManifestoSection from "@/components/ManifestoSection";
import PullQuote from "@/components/PullQuote";
import PrincipleCard from "@/components/PrincipleCard";

export const metadata: Metadata = {
  title: "Not a Metaverse School | Open World Learning Lab",
  description:
    "A manifesto for open-world education, real places, human mentorship, and technology that returns learning to reality.",
  openGraph: {
    title: "Not a Metaverse School | Open World Learning Lab",
    description:
      "A manifesto for open-world education, real places, human mentorship, and technology that returns learning to reality.",
    type: "article",
    locale: "en_US",
    siteName: "Open World Learning Lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "Not a Metaverse School | Open World Learning Lab",
    description:
      "A manifesto for open-world education, real places, human mentorship, and technology that returns learning to reality.",
  },
};

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
      "AI supports learning; mentors, teachers, families, and communities guide it.",
  },
  {
    title: "Safety before spectacle",
    description:
      "Outdoor and public learning require preparation, supervision, local knowledge, and risk management.",
  },
  {
    title: "Local respect",
    description:
      "Places are not theme parks. They have histories, communities, ecologies, and limits.",
  },
  {
    title: "Equity by design",
    description:
      "This cannot become luxury education for the already privileged.",
  },
];

export default function ManifestoPage() {
  return (
    <>
      <Header />
      <main>
        <ManifestoHero />

        <div className="section-divider" aria-hidden="true" />

        <ManifestoSection id="origin" title="The idea started in Tahoe." variant="sand">
          <p>
            I grew up in Tahoe, where the line between school and the world always
            felt thinner than it does in most places. The mountain, the lake, the
            weather, the trails, the boats, the seasons — they were not
            abstractions. They were daily reality.
          </p>
          <p>
            When I was sixteen, I remember watching peers on independent study
            spend much of their time skiing. Some of them did not seem to care
            about math in the classroom. But they cared deeply about landing a
            flip.
          </p>
          <p>
            What if they could do the trick, return to the exact moment, study
            the angle, rotation, force, timing, momentum, torque, and body
            mechanics — and learn the math because it helped them become better
            at something real?
          </p>
          <PullQuote>
            Maybe students do not hate knowledge. Maybe they hate knowledge
            removed from reality.
          </PullQuote>
        </ManifestoSection>

        <div className="section-divider" aria-hidden="true" />

        <ManifestoSection title="Schooling is not the same as education.">
          <p>
            Schools can do important things. They can create stability, access,
            community, credentialing, care, and shared civic experiences. This
            manifesto is not a lazy attack on teachers or public education.
          </p>
          <p>
            But schooling is a system of rooms, bells, schedules, subjects,
            assignments, and tests. Education is larger than that. Education is
            the formation of attention, judgment, skill, curiosity, memory,
            discipline, taste, and responsibility.
          </p>
          <p>
            The problem is not structure itself. The problem is structure that
            forgets what it is for.
          </p>
          <p className="text-foreground font-medium">
            Open-world education asks: what if structure began with the world
            instead of hiding from it?
          </p>
        </ManifestoSection>

        <PullQuote variant="dark">
          The world should not become content. The world should become
          curriculum.
        </PullQuote>

        <ManifestoSection title="The world should not become content. The world should become curriculum.">
          <p>
            A lake is not just scenery. It is ecology, physics, climate, history,
            public policy, economics, stewardship, and poetry.
          </p>
          <p>
            A trail is not just a trail. It is geology, navigation, endurance,
            land use, observation, and attention.
          </p>
          <p>
            A ski jump or wakeboard trick is not just recreation. It is momentum,
            torque, force, timing, balance, risk, feedback, and practice.
          </p>
          <p>
            A shared meal is not just food. It is chemistry, agriculture,
            culture, story, ritual, ethics, and conversation.
          </p>
          <p className="text-foreground">
            The world is already layered with knowledge. The work of education is
            to help learners notice the layers, ask better questions, and build
            understanding from contact with reality.
          </p>
        </ManifestoSection>

        <div className="section-divider" aria-hidden="true" />

        <ManifestoSection
          title="Open-world education is not chaos. It is structured freedom."
          variant="interface"
        >
          <p className="font-medium text-foreground text-base sm:text-lg">
            Experience → curiosity → guided inquiry → knowledge → practice →
            artifact → reflection
          </p>
          <p>
            Open-world learning does not mean telling students to wander around
            and hope learning happens. It means designing rigorous pathways
            through real environments.
          </p>
          <p>
            Students need missions, constraints, mentors, tools, feedback,
            standards, and opportunities to show what they know.
          </p>
          <p>
            The freedom is in the entry points. One learner may enter through
            sport. Another through ecology. Another through food. Another through
            history, design, engineering, storytelling, or public service.
          </p>
          <p className="text-foreground">
            The structure is in the learning loop: experience, inquiry,
            knowledge, practice, artifact, reflection.
          </p>
        </ManifestoSection>

        <PullQuote variant="dark">
          The goal is not to make education more digital. The goal is to make
          reality more legible.
        </PullQuote>

        <ManifestoSection title="Technology should return us to reality.">
          <p>
            This project is not a call to put children into headsets all day. It
            is not a call to replace the physical world with simulation. It is
            not a call to make every human moment into content.
          </p>
          <p>
            The best use of AI glasses, spatial computing, translation, and
            intelligent tutoring is not to escape the world. It is to make the
            world more legible.
          </p>
          <p>A student should be able to look at a lake and ask what is happening beneath the surface.</p>
          <p>
            A student should be able to replay a movement and see the physics
            inside the motion.
          </p>
          <p>
            A student should be able to walk through a forest and receive better
            questions, not just more information.
          </p>
          <p className="text-foreground">
            Technology should not become the teacher. It should become a lens, a
            notebook, a translator, a guide, and a bridge.
          </p>
        </ManifestoSection>

        <div className="section-divider" aria-hidden="true" />

        <ManifestoSection title="AI should not replace the mentor." variant="sand">
          <p>
            Human mentorship is central. Teachers, guides, coaches, elders,
            craftspeople, designers, parents, scientists, artists, and community
            members all help learners interpret the world.
          </p>
          <p>
            AI can help scaffold questions, translate, annotate, summarize,
            suggest resources, personalize practice, and reveal patterns. But it
            cannot replace the moral, relational, embodied work of mentorship.
          </p>
          <p>
            A good mentor sees the learner. A good mentor knows when to push,
            when to wait, when to ask, when to demonstrate, when to correct,
            and when to let the learner struggle.
          </p>
          <PullQuote>
            AI should not replace the mentor. It should help the mentor see the
            learner more clearly.
          </PullQuote>
        </ManifestoSection>

        <ManifestoSection title="This should be open-source.">
          <p>
            The point of Open World Learning Lab is not to own the idea. The
            point is to name, frame, test, publish, and improve it in public.
          </p>
          <p>
            If open-world education is valuable, it should not be trapped inside
            one company, one school, one founder, one curriculum vendor, or one
            platform.
          </p>
          <p>
            The project should produce public resources: manifestos, concept
            briefs, mission templates, field guides, ethical guardrails, pilot
            blueprints, reflection tools, and design frameworks that educators
            and communities can study, critique, remix, and improve.
          </p>
          <div className="mt-8 card-premium bg-sand/20 p-6 not-prose">
            <p className="text-sm text-muted leading-relaxed">
              Unless otherwise noted, educational design materials are intended
              to be shared under{" "}
              <span className="text-foreground font-medium">
                Creative Commons Attribution 4.0
              </span>
              . Code resources may be released separately under an MIT-style
              license.
            </p>
          </div>
        </ManifestoSection>

        <div className="section-divider" aria-hidden="true" />

        <section className="py-16 md:py-24 bg-background">
          <div className="mx-auto max-w-3xl px-6">
            <header className="mb-10">
              <p className="field-label mb-3">Manifesto</p>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight text-foreground">
                The future has to be built carefully.
              </h2>
              <p className="mt-5 text-base md:text-lg text-muted leading-relaxed">
                Open-world education could become deeply human. It could also
                become surveillance, distraction, inequity, or spectacle.
              </p>
            </header>
            <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
              {guardrails.map((guardrail) => (
                <PrincipleCard key={guardrail.title} {...guardrail} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-slate-deep text-background pattern-topo py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-tahoe/5 via-transparent to-pine/5" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <p className="field-label text-sand/50 mb-4">Closing</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
              The future of education should not feel like escaping reality.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-sand/80 leading-relaxed">
              It should feel like finally seeing reality clearly.
            </p>
            <p className="mt-8 text-base md:text-lg text-sand/70 leading-relaxed max-w-2xl mx-auto">
              Open World Learning Lab is an attempt to put that idea into the
              world before the future arrives carelessly.
            </p>
            <p className="mt-5 text-base text-sand/60 leading-relaxed max-w-2xl mx-auto">
              Not because one person needs to own it.
              <br />
              Because the idea is worth building well.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/"
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-background px-7 py-3.5 text-sm font-medium text-foreground hover:bg-sand"
              >
                Explore the project
              </Link>
              <a
                href="mailto:hello@openworldlearninglab.com?subject=Open%20World%20Learning%20Lab%20Collaboration"
                className="btn-tactile inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-sand/30 px-7 py-3.5 text-sm font-medium text-background hover:bg-sand/10"
              >
                Contact / collaborate
              </a>
            </div>

            <p className="mt-14 text-sm text-sand/45 italic max-w-lg mx-auto leading-relaxed">
              Not a metaverse school. A real-world learning model for an age of
              intelligent tools.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
