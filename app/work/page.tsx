import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import ProjectIndexEntry from "@/components/ProjectIndexEntry";
import WideContainer from "@/components/layout/WideContainer";
import { createPageMetadata } from "@/lib/metadata";
import { projects } from "@/content/projects";

export const metadata: Metadata = createPageMetadata({
  title: "Current Work — Open World Learning Lab",
  description:
    "Explore the learning journeys, prototypes, and origin studies currently being developed at Open World Learning Lab.",
  path: "/work",
});

const currentFocus = projects.filter((p) =>
  ["first-landing", "locus"].includes(p.slug)
);
const exploratoryWork = projects.filter((p) =>
  !["first-landing", "locus"].includes(p.slug)
);

export default function WorkPage() {
  return (
    <>
      <Header />
      <main className="py-section-y-page">
        <WideContainer>
          <SectionHeader
            level={1}
            eyebrow="Current work"
            title="From questions to prototypes."
            intro="OWLL develops learning journeys, mentor systems, field tools, and infrastructure through research, design, testing, and release. Not every project is at the same stage of maturity."
          />

          <aside aria-label="Ways to try an inquiry" className="mb-12 grid gap-5 rounded-xl border border-border bg-soft-paper/60 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-mono text-metadata uppercase tracking-widest text-water">Two ways to begin / No account</p>
              <h2 className="mt-2 font-serif text-2xl text-ink">Start with your world, or explore an illustrated coast.</h2>
              <p className="mt-2 max-w-reading text-sm leading-relaxed text-secondary">
                The everyday inquiry uses a private in-tab notebook. Water Fingerprints offers
                a guided conceptual shoreline scene. Neither transfers records to LOCUS.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/start" className="inline-flex min-h-11 items-center justify-center rounded-full bg-moss px-6 py-3 text-center text-sm font-medium text-on-dark hover:bg-deep-field">Try a real-world question ↗</Link>
              <Link href="/work/first-landing/field-experience" className="inline-flex min-h-11 items-center justify-center rounded-full border border-moss px-6 py-3 text-center text-sm font-medium text-moss hover:bg-moss/10">Try the illustrated inquiry ↗</Link>
            </div>
          </aside>

          <section className="mb-12 md:mb-16">
            <h2 className="font-serif text-section-title text-ink mb-2">Current focus</h2>
            <p className="mb-6 md:mb-8 text-sm text-secondary max-w-reading">
              The clearest public expressions of work underway now.
            </p>
            <div className="space-y-12 max-w-3xl">
              {currentFocus.map((project, i) => (
                <ProjectIndexEntry
                  key={project.slug}
                  project={project}
                  index={i}
                  ctaLabel={
                    project.slug === "first-landing"
                      ? "Explore First Landing"
                      : "Explore LOCUS"
                  }
                />
              ))}
            </div>
          </section>

          <section className="mb-12 md:mb-16 pt-6 md:pt-8 border-t border-border">
            <h2 className="font-serif text-section-title text-ink mb-2">
              Exploratory and origin work
            </h2>
            <p className="mb-6 md:mb-8 text-sm text-secondary max-w-reading">
              Research directions, early concepts, and origin studies that inform the lab but are not equally mature.
            </p>
            <div className="space-y-12 max-w-3xl">
              {exploratoryWork.map((project, i) => (
                <ProjectIndexEntry key={project.slug} project={project} index={i} />
              ))}
            </div>
          </section>

          <div className="pt-8 border-t border-border">
            <Link
              href="/releases"
              className="text-sm font-medium text-water hover:text-moss transition-colors"
            >
              View public releases →
            </Link>
          </div>
        </WideContainer>
      </main>
      <Footer />
    </>
  );
}
