export type LearningLoopStage = {
  id: string;
  number: number;
  title: string;
  shortTitle?: string;
  description: string;
  themeKey?: string;
};

export const learningLoopStages: LearningLoopStage[] = [
  {
    id: "experience",
    number: 1,
    title: "Experience",
    shortTitle: "Experience",
    description:
      "Begin with a real place, practice, problem, encounter, or question.",
    themeKey: "water",
  },
  {
    id: "notice",
    number: 2,
    title: "Notice and Capture",
    shortTitle: "Notice",
    description:
      "Record observations, images, audio, measurements, reactions, and questions through Field Notes.",
    themeKey: "moss",
  },
  {
    id: "inquiry",
    number: 3,
    title: "Guided Inquiry",
    shortTitle: "Inquiry",
    description:
      "Use prompts, credible sources, mentors, peers, and appropriate AI support to investigate what matters.",
    themeKey: "water",
  },
  {
    id: "practice",
    number: 4,
    title: "Knowledge and Practice",
    shortTitle: "Practice",
    description:
      "Develop concepts, build skills, and apply new understanding in the world.",
    themeKey: "sediment",
  },
  {
    id: "creation",
    number: 5,
    title: "Creation",
    shortTitle: "Create",
    description:
      "Produce a field guide, map, essay, explanation, dataset, design, demonstration, performance, or other meaningful artifact.",
    themeKey: "sun-marker",
  },
  {
    id: "reflection",
    number: 6,
    title: "Explanation and Reflection",
    shortTitle: "Reflect",
    description:
      "Explain the work, receive feedback, examine the evidence, and notice how understanding has changed.",
    themeKey: "moss",
  },
  {
    id: "return",
    number: 7,
    title: "Return",
    shortTitle: "Return",
    description:
      "Revisit the place, practice, or question with sharper perception and add the experience to a growing Learning Atlas.",
    themeKey: "water",
  },
];
