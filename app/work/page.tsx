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
  ["open-world-saturdays", "open-world-tahoe"].includes(p.slug)
);

export default function WorkPage() {
  return (
    <>
      <Header />
      <main className="py-section-y-page">
        <WideContainer>
          <SectionHeader
            eyebrow="Current work"
            title="From questions to prototypes."
            intro="OWLL develops learning journeys, mentor systems, field tools, and infrastructure through research, design, testing, and release. Not every project is at the same stage of maturity."
          />

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
              Earlier concepts and origin studies that inform the lab but are not equally mature.
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
