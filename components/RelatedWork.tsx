import Link from "next/link";
import type { Project } from "@/content/projects";
import type { Release } from "@/content/releases";

interface RelatedWorkProps {
  projects?: Project[];
  releases?: Release[];
}

export default function RelatedWork({ projects = [], releases = [] }: RelatedWorkProps) {
  if (projects.length === 0 && releases.length === 0) return null;

  return (
    <aside className="mt-16 pt-10 border-t border-sand-dark/40">
      <h2 className="font-serif text-xl text-foreground mb-6">Related work</h2>

      {projects.length > 0 && (
        <ul className="space-y-3 mb-6">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={project.href}
                className="text-sm text-tahoe hover:text-pine transition-colors focus-visible:rounded-sm"
              >
                {project.title}
              </Link>
              <span className="text-sm text-muted"> — {project.projectType}</span>
            </li>
          ))}
        </ul>
      )}

      {releases.length > 0 && (
        <ul className="space-y-3">
          {releases.map((release) => (
            <li key={release.id}>
              <Link
                href={release.href}
                className="text-sm text-tahoe hover:text-pine transition-colors focus-visible:rounded-sm"
              >
                {release.subtitle}: {release.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
