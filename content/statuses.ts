export type ProjectStatus =
  | "origin-study"
  | "early-concept"
  | "pilot-design"
  | "product-prototype"
  | "research-in-progress"
  | "published";

export type ReleaseStatus = ProjectStatus;

export interface StatusConfig {
  label: string;
  shortExplanation: string;
  order: number;
  badgeClass: string;
}

export const projectStatuses: Record<ProjectStatus, StatusConfig> = {
  "origin-study": {
    label: "Origin Study",
    shortExplanation: "Foundational design concept that informed later work.",
    order: 1,
    badgeClass: "bg-stone/15 text-stone border-stone/30",
  },
  "early-concept": {
    label: "Early Concept",
    shortExplanation: "Preliminary exploration, not yet in active design.",
    order: 2,
    badgeClass: "bg-sand/60 text-foreground border-sand-dark/50",
  },
  "pilot-design": {
    label: "Pilot Design",
    shortExplanation: "Learning journey or pilot being designed for future testing.",
    order: 3,
    badgeClass: "bg-tahoe/10 text-tahoe border-tahoe/25",
  },
  "product-prototype": {
    label: "Product Prototype",
    shortExplanation: "Emerging system or tool in active prototype development.",
    order: 4,
    badgeClass: "bg-pine/10 text-pine border-pine/25",
  },
  "research-in-progress": {
    label: "Research in Progress",
    shortExplanation: "Active research or system mapping underway.",
    order: 5,
    badgeClass: "bg-tahoe/10 text-tahoe border-tahoe/25",
  },
  published: {
    label: "Published Brief",
    shortExplanation: "Publicly released document or overview.",
    order: 6,
    badgeClass: "bg-pine/10 text-pine border-pine/25",
  },
};

export function getStatusLabel(status: ProjectStatus): string {
  return projectStatuses[status].label;
}

export function getStatusBadgeClass(status: ProjectStatus): string {
  return projectStatuses[status].badgeClass;
}
