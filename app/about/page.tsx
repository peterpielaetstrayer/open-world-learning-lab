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
          <SectionHeader title="Designing toward a more alive learning future." />

          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              Open World Learning Lab is an independent, early-stage research and design initiative exploring how people can take greater ownership of learning throughout life.
            </p>
            <p>
              Our premise is that learning happens through places, families, communities, work, books, conversation, practice, and meaningful projects. We study how those experiences can become sustained knowledge, skills, better questions, and greater agency.
            </p>
            <p>
              OWLL pursues educational sovereignty: the practical capacity to shape one's learning and development with meaningful opportunity, sound judgment, and human support. For children, that agency develops alongside adults' responsibilities for care, safety, and exposure to diverse ideas.
            </p>
            <p>
              The current public work includes place-based learning journey designs, learner-support ideas, system maps, the early LOCUS prototype, and exploratory physical Learning Environments research. Adult and family learning resources are under editorial development, not yet a public program.
            </p>
          </div>

          <section className="mt-12 max-w-reading">
            <h2 className="font-serif text-2xl text-ink">Who can learn here?</h2>
            <p className="mt-4 text-muted leading-relaxed">
              Self-directed adults, parents and children, educators, mentors, community groups,
              and researchers all have a place in the long-term vision. Parents are learners, too.
              Supporting access means creating useful low-cost entry points and adaptable guidance
              without limiting how far an ambitious learner may progress.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              These are intended audiences, not a claim that all corresponding programs,
              resources, partnerships, or services are already operating.
            </p>
          </section>

          <section className="mt-12 rounded-lg border border-border bg-soft-paper p-6">
            <h2 className="font-serif text-2xl text-ink">Learning environments, not just learning content.</h2>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              A new early-stage research direction considers how rooms, tools, and daily routines
              could support independent inquiry and learner agency. It remains exploratory,
              and no room installation service has launched.
            </p>
            <Link href="/learning-environments" className="mt-4 inline-block text-sm font-medium text-water hover:text-moss">
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
                His background spans student mentorship and teaching, program and experience design, hospitality, and place-based learning. He is currently completing an M.S. in Learning Design and Technology while developing First Landing, LOCUS, and the broader OWLL research and design program.
              </p>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-serif text-2xl text-foreground mb-6">
              Creator Before the Platform
            </h2>
            <div className="space-y-5 text-muted leading-relaxed">
              <p>The first version of LOCUS is not software alone.</p>
              <p>
                Before automating the system, OWLL is manually performing the work: studying a place or domain, identifying meaningful questions, building a learning architecture, guiding a learner through the experience, examining the evidence, and revising the journey.
              </p>
              <p>
                This approach allows the product to emerge from real educational work rather than forcing learning into a predetermined software structure.
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
