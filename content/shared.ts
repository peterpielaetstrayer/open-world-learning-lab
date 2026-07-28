export const siteConfig = {
  name: "Open World Learning Lab",
  shortName: "OWLL",
  url: "https://openworldlearninglab.com",
  email: "hello@openworldlearninglab.com",
  description:
    "Open World Learning Lab is an independent education design lab developing place-based learning journeys, mentor systems, and intelligent tools for more connected, cumulative learning.",
  disclaimer:
    "Open World Learning Lab is an independent early-stage research and design project. It is not currently operating as a school or accredited educational program.",
  copyright: "© 2026 Open World Learning Lab. All rights reserved.",
  licensingNote:
    "Selected resources may be released under separate Creative Commons or open-source licenses.",
};

export { learningLoopStages } from "./learning-loop";

export const guardrails = [
  {
    title: "Reality First",
    description:
      "Technology should deepen attention to the world, not pull learners away from it.",
  },
  {
    title: "Consent and Privacy",
    description:
      "Recording, data collection, AI use, location information, and participation must be transparent, limited, and meaningfully consensual—especially when minors are involved.",
  },
  {
    title: "Humans Lead",
    description:
      "AI can scaffold, organize, translate, prompt, and support. Teachers, mentors, families, guides, and communities remain responsible for human judgment and care.",
  },
  {
    title: "Safety Before Spectacle",
    description:
      "Outdoor and community-based learning requires preparation, supervision, accessibility planning, risk management, and local knowledge.",
  },
  {
    title: "Local Respect",
    description:
      "Every place has history, ecology, community, memory, ownership, conflict, and limits. Places should not be treated as interchangeable content backdrops.",
  },
  {
    title: "Equity by Design",
    description:
      "Open-world education must not become luxury education for learners who already have access to transportation, technology, safe environments, knowledgeable adults, and flexible schedules.",
  },
];

export const workLabCards = [
  {
    title: "Research Lab",
    description:
      "Investigating how learning can become more embodied, cumulative, self-aware, rigorous, and connected to real life.",
  },
  {
    title: "Prototype Studio",
    description:
      "Designing and testing learning journeys, mentor systems, field tools, learner-support models, and public artifacts.",
  },
  {
    title: "Infrastructure Lab",
    description:
      "Developing LOCUS—the emerging learning and creator infrastructure behind open-world education.",
  },
];

export const technologyHorizons = {
  today: [
    "A notebook",
    "A phone",
    "A camera",
    "Audio prompts",
    "Maps",
    "Credible sources",
    "Mentor conversations",
    "Real places",
    "Thoughtful reflection",
  ],
  emerging: [
    "AI-assisted Field Notes",
    "Journey interfaces",
    "Creator tools",
    "Mentor-support layers",
    "Adaptive prompts",
    "Cumulative Learning Atlases",
    "Learner progress and evidence systems",
  ],
  future: [
    "Context-aware glasses",
    "Spatial learning layers",
    "Live translation",
    "Minimal environmental overlays",
    "Hands-free capture",
    "Place-responsive guidance",
  ],
};

export const navLinks = [
  { href: "/#thesis", label: "Thesis" },
  { href: "/work", label: "Current Work" },
  { href: "/#learning-loop", label: "Learning Loop" },
  { href: "/releases", label: "Releases" },
  { href: "/#guardrails", label: "Guardrails" },
  { href: "/about", label: "About" },
];
