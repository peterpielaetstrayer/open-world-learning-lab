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
    "Open World Learning Lab is an independent early-stage education research, design, and experimentation project exploring place-based learning.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeader title="Designing toward a more alive learning future." />

          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              Open World Learning Lab is an independent early-stage education research, design, and experimentation project.
            </p>
            <p>
              The lab explores how real places, human mentorship, learner agency, intelligent tools, creative work, and cumulative reflection might form a more connected learning environment.
            </p>
            <p>
              OWLL begins with prototypes rather than declarations. The goal is to design, test, document, and revise specific learning experiences before attempting to build a complete platform or institution around them.
            </p>
            <p>
              The work currently includes place-based learning journeys, learner-support models, Field Notes, creator workflows, public system maps, and the early development of LOCUS.
            </p>
          </div>

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
