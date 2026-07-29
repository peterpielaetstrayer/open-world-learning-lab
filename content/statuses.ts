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
    label: "Archived Origin Study",
    shortExplanation: "Foundational design concept that informed later work. Not an active program.",
    order: 1,
    badgeClass: "bg-sediment/15 text-sediment border-sediment/30",
  },
  "early-concept": {
    label: "Early Concept",
    shortExplanation: "Preliminary exploration, not yet in active design.",
    order: 2,
    badgeClass: "bg-soft-paper text-ink border-border",
  },
  "pilot-design": {
    label: "Pilot Design",
    shortExplanation: "Learning journey or pilot being designed for future testing.",
    order: 3,
    badgeClass: "bg-water/10 text-water border-water/25",
  },
  "product-prototype": {
    label: "Product Prototype",
    shortExplanation: "Emerging system or tool in active prototype development.",
    order: 4,
    badgeClass: "bg-moss/10 text-moss border-moss/25",
  },
  "research-in-progress": {
    label: "Research in Progress",
    shortExplanation: "Active research or system mapping underway.",
    order: 5,
    badgeClass: "bg-water/10 text-water border-water/25",
  },
  published: {
    label: "Published Brief",
    shortExplanation: "Publicly released document or overview.",
    order: 6,
    badgeClass: "bg-moss/10 text-moss border-moss/25",
  },
};

export function getStatusLabel(status: ProjectStatus): string {
  return projectStatuses[status].label;
}

export function getStatusBadgeClass(status: ProjectStatus): string {
  return projectStatuses[status].badgeClass;
}
