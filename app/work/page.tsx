import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import ProjectCard from "@/components/ProjectCard";
import ProjectStatusBadge from "@/components/ProjectStatusBadge";
import { createPageMetadata } from "@/lib/metadata";
import {
  projects,
  projectDevelopmentSequence,
} from "@/content/projects";
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
      <main className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader
            eyebrow="Current work"
            title="From questions to prototypes."
            intro="OWLL develops learning journeys, mentor systems, field tools, and infrastructure through a sequence of research, design, testing, and release. Not every project moves through the same path—but each begins with a genuine question about how learning can become more connected to the real world."
          />

          <div className="mb-16 card-premium p-6 md:p-8">
            <p className="field-label mb-4">Project development sequence</p>
            <ol className="flex flex-wrap gap-2">
              {projectDevelopmentSequence.map((step, i) => (
                <li key={step} className="flex items-center gap-2 list-none">
                  <span className="rounded-md bg-sand/50 px-2.5 py-1 text-xs text-foreground border border-sand-dark/30">
                    {step}
                  </span>
                  {i < projectDevelopmentSequence.length - 1 && (
                    <span className="text-stone/40 hidden sm:inline" aria-hidden="true">→</span>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              Not every project will move through this sequence identically. Some remain origin studies; others advance toward pilot design or product prototype.
            </p>
          </div>

          {grouped.map((group) => (
            <section key={group.status} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <ProjectStatusBadge status={group.status} />
                <p className="text-sm text-muted">
                  {projectStatuses[group.status].shortExplanation}
                </p>
              </div>
              <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                {group.items.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </section>
          ))}

          <div className="text-center pt-8 border-t border-sand-dark/30">
            <Link
              href="/releases"
              className="text-sm font-medium text-tahoe hover:text-pine transition-colors"
            >
              View public releases →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
