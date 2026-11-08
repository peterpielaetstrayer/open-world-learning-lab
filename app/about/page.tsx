import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";
import { founderBio, siteConfig } from "@/content/shared";

export const metadata: Metadata = createPageMetadata({
  title: "About — Open World Learning Lab",
  description:
    "Learn about Open World Learning Lab, an independent research and design initiative for lifelong learning, educational agency, and learning through the world.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="py-section-y-page">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <SectionHeader
            level={1}
            title="Why Open World Learning Lab exists."
          />

          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              Open World Learning Lab is an independent, early-stage research
              and design initiative exploring how people can take greater
              ownership of learning throughout life.
            </p>
            <p>
              Our premise is that learning happens through places, families,
              communities, work, books, conversation, practice, and meaningful
              projects. Our research and design questions concern how those
              experiences can lead to lasting understanding, useful skills and
              greater agency.
            </p>
            <p>
              OWLL pursues educational sovereignty: the practical capacity to
              shape one&apos;s learning and development with meaningful
              opportunity, sound judgment, and human support. For children, that
              agency develops alongside adults&apos; responsibilities for care,
              safety, and exposure to diverse ideas.
            </p>
            <p>
              Current work includes learning journey designs, the LOCUS
              continuity prototype and exploratory Learning Environments
              concepts. The longer-term ambition is an independent research and
              design institute whose work can generate new tools, educational
              models and ventures.
            </p>
          </div>

          <section className="mt-12 max-w-reading">
            <h2 className="font-serif text-2xl text-ink">
              Who this work is for
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Self-directed adults, parents and children, educators, mentors,
              community groups, and researchers all have a place in the
              long-term vision. Parents are learners, too. Supporting access
              means creating useful low-cost entry points and adaptable guidance
              without limiting how far an ambitious learner may progress.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              Today, anyone can try the public field inquiry or explore the
              project designs. Broader programs and family resources remain in
              development.
            </p>
          </section>

          <section className="mt-12 rounded-lg border border-border bg-soft-paper p-6">
            <h2 className="font-serif text-2xl text-ink">
              Learning environments, not just learning content.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              Learning Environments explores how rooms, tools, relationships and
              daily routines can support attention, inquiry and creation. The
              first concepts consider everyday spaces and the people who use
              them.
            </p>
            <Link
              href="/learning-environments"
              className="mt-4 inline-block text-sm font-medium text-water hover:text-moss"
            >
              Explore Learning Environments →
            </Link>
          </section>

          <section className="mt-16">
            <h2 className="font-serif text-2xl text-foreground mb-6">
              Founded through practice, not abstraction.
            </h2>
            <div className="space-y-5 text-muted leading-relaxed">
              <p>{founderBio.short}</p>
              <p>
                OWLL began with an idea in Tahoe: connect a mountain, lake,
                trail and community into a learning environment, with emerging
                wearable technology helping people follow their questions. That
                starting point now informs a broader inquiry into learning
                across places, relationships and time.
              </p>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-serif text-2xl text-foreground mb-6">
              Build from educational practice
            </h2>
            <div className="space-y-5 text-muted leading-relaxed">
              <p>The design approach begins with the learning experience.</p>
              <p>
                Start by studying a place or domain, identifying meaningful
                questions and designing a path through them. Then examine how
                learners use the experience, what they can explain and where
                guidance helps. These are the steps the prototypes are intended
                to make testable.
              </p>
              <p>
                The aim is to let observations from educational practice shape
                the tools. Field testing and evidence of learning remain
                necessary parts of that work.
              </p>
            </div>
          </section>

          <div className="mt-16 flex flex-wrap gap-4">
            <Link
              href="/work"
              className="btn-tactile inline-flex items-center justify-center rounded-full bg-pine px-6 py-3 text-sm font-medium text-white hover:bg-pine-light"
            >
              Explore the Work
            </Link>
            <Link
              href="/contact"
              className="btn-tactile inline-flex items-center justify-center rounded-full border border-sand-dark/80 px-6 py-3 text-sm font-medium text-foreground hover:border-tahoe/40"
            >
              Start a Conversation
            </Link>
          </div>

          <p className="mt-12 text-sm text-stone border-l-2 border-tahoe/25 pl-4">
            {siteConfig.disclaimer}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
