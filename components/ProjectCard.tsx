import Link from "next/link";
import type { Project } from "@/content/projects";
import ProjectStatusBadge from "./ProjectStatusBadge";

interface ProjectCardProps {
  project: Project;
  showVisual?: boolean;
}

function ProjectVisual({ slug }: { slug: string }) {
  const visuals: Record<string, { label: string; nodes: string[] }> = {
    "first-landing": {
      label: "Coastal systems",
      nodes: ["Shoreline", "Estuary", "History", "Future"],
    },
    locus: {
      label: "System layers",
      nodes: ["Field Notes", "Journey", "Mentor", "Atlas"],
    },
    "open-world-saturdays": {
      label: "Reengagement arc",
      nodes: ["Place", "Mentor", "Practice", "Return"],
    },
    "open-world-tahoe": {
      label: "Origin zones",
      nodes: ["Lake", "Mountain", "Trail", "Campfire"],
    },
  };

  const visual = visuals[slug] ?? { label: "Project", nodes: [] };

  return (
    <div
      className="rounded-lg border border-sand-dark/30 bg-background/50 p-4"
      aria-hidden="true"
    >
      <p className="field-label mb-3 opacity-60">{visual.label}</p>
      <div className="flex flex-wrap gap-1.5">
        {visual.nodes.map((node) => (
          <span
            key={node}
            className="rounded-md bg-sand/40 px-2 py-0.5 text-xs text-muted border border-sand-dark/25"
          >
            {node}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProjectCard({ project, showVisual = true }: ProjectCardProps) {
  return (
    <article className="card-premium card-lift group flex flex-col h-full hover:border-tahoe/30 overflow-hidden">
      <div className="border-b border-sand-dark/30 bg-gradient-to-r from-sand/30 to-transparent px-6 py-3 flex items-center justify-between gap-2">
        <span className="field-label text-tahoe/70">{project.projectType}</span>
        <ProjectStatusBadge status={project.status} />
      </div>

      <div className="p-6 md:p-7 flex flex-col flex-grow">
        <h3 className="font-serif text-xl text-foreground leading-snug group-hover:text-tahoe transition-colors">
          <Link href={project.href} className="focus-visible:rounded-sm">
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 text-sm text-muted leading-relaxed flex-grow">
          {project.summary}
        </p>

        {showVisual && (
          <div className="mt-5">
            <ProjectVisual slug={project.slug} />
          </div>
        )}

        <Link
          href={project.href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-tahoe hover:text-pine transition-colors focus-visible:rounded-sm"
        >
          View project
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
