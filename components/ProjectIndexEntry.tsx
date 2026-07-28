import Link from "next/link";
import type { Project } from "@/content/projects";
import { getProjectTheme } from "@/content/project-themes";
import StatusBadge from "@/components/StatusBadge";

interface ProjectIndexEntryProps {
  project: Project;
  index?: number;
}

export default function ProjectIndexEntry({ project, index = 0 }: ProjectIndexEntryProps) {
  const theme = getProjectTheme(project.slug);
  const stagger = index % 2 === 1 ? "lg:ml-12" : "";

  return (
    <article
      className={`group relative border-l-2 pl-6 py-2 ${stagger}`}
      style={{ borderColor: theme.accent }}
    >
      <div
        className="absolute -left-[5px] top-3 h-2 w-2 rounded-full"
        style={{ backgroundColor: theme.accent }}
        aria-hidden="true"
      />

      {/* Abstract visual fragment */}
      <div
        className="mb-4 h-12 w-full max-w-[200px] rounded opacity-60 overflow-hidden"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 48" className="h-full w-full">
          <path
            d={`M0 30 Q50 ${20 + index * 3} 100 28 T200 ${24 + index * 2}`}
            fill="none"
            stroke={theme.accent}
            strokeOpacity="0.4"
          />
          <circle cx={40 + index * 30} cy={20} r="3" fill={theme.accentSecondary} fillOpacity="0.5" />
        </svg>
      </div>

      <StatusBadge projectType={project.projectType} status={project.status} className="mb-2" />

      <h3 className="font-serif text-xl text-ink leading-snug group-hover:text-water transition-colors">
        <Link href={project.href}>{project.title}</Link>
      </h3>

      <p className="mt-2 max-w-reading text-body text-secondary leading-relaxed">
        {project.summary}
      </p>

      <Link
        href={project.href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-water hover:text-moss transition-colors"
      >
        View project
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
