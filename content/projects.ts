import type { ProjectStatus } from "./statuses";

export interface Project {
  slug: string;
  title: string;
  projectType: string;
  status: ProjectStatus;
  summary: string;
  href: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "first-landing",
    title: "First Landing Prototype",
    projectType: "Learning Journey",
    status: "pilot-design",
    summary:
      "A proposed six-week place-based learning journey exploring how water shapes land, life, history, and the future of Virginia Beach.",
    href: "/work/first-landing",
    featured: true,
  },
  {
    slug: "locus",
    title: "LOCUS",
    projectType: "Learning Infrastructure",
    status: "product-prototype",
    summary:
      "An emerging system connecting Field Notes, guided inquiry, mentorship, practice, reflection, and meaningful creation into cumulative learning.",
    href: "/work/locus",
    featured: true,
  },
  {
    slug: "open-world-saturdays",
    title: "Open World Saturdays",
    projectType: "Learner Reengagement Program",
    status: "early-concept",
    summary:
      "A future mentor-supported Saturday learning experience designed to rebuild motivation, self-awareness, confidence, and a love of learning through the real world.",
    href: "/work/open-world-saturdays",
    featured: true,
  },
  {
    slug: "open-world-tahoe",
    title: "Open World Tahoe",
    projectType: "Origin Study",
    status: "origin-study",
    summary:
      "The Tahoe thought experiment that began the lab: what might education become if the lake, mountain, trail, and community formed an interconnected learning environment?",
    href: "/work/open-world-tahoe",
    featured: true,
  },
];

export const projectDevelopmentSequence = [
  "Question",
  "Origin Study",
  "Concept",
  "Learning Architecture",
  "Prototype",
  "Pilot",
  "Evaluation",
  "Revision",
  "Release or Expansion",
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const tahoeZones = [
  {
    name: "Lake as System",
    concepts: ["Ecology", "Climate", "Physics", "Public policy", "Stewardship"],
  },
  {
    name: "Mountain as Lab",
    concepts: ["Momentum", "Torque", "Biomechanics", "Risk", "Feedback"],
  },
  {
    name: "Trail as Text",
    concepts: ["Geology", "Navigation", "Land use", "Endurance", "Attention"],
  },
  {
    name: "Campfire as Seminar",
    concepts: ["Chemistry", "Anthropology", "Food", "Story", "Ritual", "Civic conversation"],
  },
];

export const sampleMissions = [
  {
    title: "The Flip Mission",
    description:
      "Learners analyze a ski, snowboard, or wakeboard trick using video replay, body mechanics, physics, and reflection.",
    concepts: ["force", "rotation", "torque", "timing", "feedback", "risk"],
    artifact: "Annotated replay",
  },
  {
    title: "The Lake as a Living System",
    description:
      "Learners investigate water clarity, invasive species, tourism, climate, land use, and local governance.",
    concepts: ["ecology", "systems thinking", "policy", "stewardship", "data"],
    artifact: "Mini-documentary or dataset",
  },
  {
    title: "The Trail Field Guide",
    description:
      "Learners hike a route and document geology, plant life, navigation decisions, human impact, and questions for further research.",
    concepts: ["geology", "botany", "mapping", "endurance", "observation"],
    artifact: "Field guide or map",
  },
  {
    title: "Fire, Food, and Civilization",
    description:
      "Learners gather around food and fire to study chemistry, anthropology, culture, ritual, conversation, and the history of shared meals.",
    concepts: ["combustion", "food systems", "story", "ethics", "community"],
    artifact: "Reflective essay or oral defense",
  },
];
