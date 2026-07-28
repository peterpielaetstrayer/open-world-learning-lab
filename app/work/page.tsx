import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import ProjectIndexEntry from "@/components/ProjectIndexEntry";
import DevelopmentSequence from "@/components/DevelopmentSequence";
import ProjectStatusBadge from "@/components/ProjectStatusBadge";
import WideContainer from "@/components/layout/WideContainer";
import { createPageMetadata } from "@/lib/metadata";
import { projects } from "@/content/projects";
import { projectStatuses, type ProjectStatus } from "@/content/statuses";

export const metadata: Metadata = createPageMetadata({
  title: "Current Work — Open World Learning Lab",
  description:
    "Explore the learning journeys, prototypes, and origin studies currently being developed at Open World Learning Lab.",
  path: "/work",
});

const statusOrder = Object.entries(projectStatuses)
  .sort(([, a], [, b]) => a.order - b.order)
  .map(([key]) => key as ProjectStatus);

export default function WorkPage() {
  const grouped = statusOrder
    .map((status) => ({
      status,
      items: projects.filter((p) => p.status === status),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <Header />
      <main className="py-section-y">
        <WideContainer>
          <SectionHeader
            eyebrow="Current work"
            title="From questions to prototypes."
            intro="OWLL develops learning journeys, mentor systems, field tools, and infrastructure through a sequence of research, design, testing, and release. Not every project moves through the same path—but each begins with a genuine question about how learning can become more connected to the real world."
          />

          <div className="mb-16">
            <DevelopmentSequence projects={projects} />
          </div>

          {grouped.map((group) => (
            <section key={group.status} className="mb-16">
              <div className="mb-8">
                <ProjectStatusBadge status={group.status} />
                <p className="mt-2 text-sm text-secondary max-w-reading">
                  {projectStatuses[group.status].shortExplanation}
                </p>
              </div>
              <div className="space-y-12 max-w-3xl">
                {group.items.map((project, i) => (
                  <ProjectIndexEntry key={project.slug} project={project} index={i} />
                ))}
              </div>
            </section>
          ))}

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
