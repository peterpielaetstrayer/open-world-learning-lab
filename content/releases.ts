import type { ProjectStatus } from "./statuses";

export interface Release {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  releaseType: string;
  status: ProjectStatus;
  version: string;
  publishedAt: string;
  updatedAt?: string;
  conceptStartedAt?: string;
  summary: string;
  relatedProject?: string;
  license?: string;
  featured: boolean;
  href: string;
  downloadHref?: string;
}

export const releases: Release[] = [
  {
    id: "owll-brief-001",
    slug: "owll-at-a-glance",
    title: "OWLL at a Glance",
    subtitle: "OWLL Brief 001",
    releaseType: "Concept Brief",
    status: "published",
    version: "1.0",
    publishedAt: "2026-07-28",
    summary:
      "A concise introduction to the lab, its thesis, its current work, and the relationship between OWLL, learning journeys, Field Notes, and LOCUS.",
    relatedProject: undefined,
    featured: true,
    href: "/releases/owll-at-a-glance",
  },
  {
    id: "owll-system-map-001",
    slug: "open-world-learning-loop",
    title: "The Open-World Learning Loop",
    subtitle: "OWLL System Map 001",
    releaseType: "System Map",
    status: "research-in-progress",
    version: "0.1",
    publishedAt: "2026-07-28",
    summary:
      "A visual model showing how experience, inquiry, practice, mentorship, creation, reflection, and return form a cumulative learning process.",
    relatedProject: undefined,
    featured: true,
    href: "/#learning-loop",
  },
  {
    id: "owll-pilot-sketch-001",
    slug: "first-landing",
    title: "First Landing",
    subtitle: "OWLL Pilot Sketch 001",
    releaseType: "Pilot Sketch",
    status: "pilot-design",
    version: "0.1",
    publishedAt: "2026-07-28",
    summary:
      "A public overview of a proposed place-based learning journey in Virginia Beach.",
    relatedProject: "first-landing",
    featured: true,
    href: "/work/first-landing",
  },
  {
    id: "owll-origin-study-001",
    slug: "open-world-tahoe",
    title: "Open World Tahoe",
    subtitle: "OWLL Origin Study 001",
    releaseType: "Origin Study",
    status: "origin-study",
    version: "1.0",
    conceptStartedAt: "2025-06-01",
    publishedAt: "2026-07-28",
    summary:
      "The original Tahoe concept that helped establish the foundations of open-world education.",
    relatedProject: "open-world-tahoe",
    featured: true,
    href: "/work/open-world-tahoe",
  },
  {
    id: "owll-concept-note-001",
    slug: "open-world-saturdays",
    title: "Open World Saturdays",
    subtitle: "OWLL Concept Note 001",
    releaseType: "Concept Note",
    status: "early-concept",
    version: "0.1",
    publishedAt: "2026-07-28",
    summary:
      "An early exploration of a mentor-supported Saturday model for learner motivation and reengagement.",
    relatedProject: "open-world-saturdays",
    featured: true,
    href: "/work/open-world-saturdays",
  },
];

export function getReleaseBySlug(slug: string): Release | undefined {
  return releases.find((r) => r.slug === slug);
}

export function getReleasesForProject(projectSlug: string): Release[] {
  return releases.filter((r) => r.relatedProject === projectSlug);
}
