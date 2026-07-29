export const locusHomepageJourney = [
  "Experience",
  "Field Note",
  "Question",
  "Guidance",
  "Practice",
  "Artifact",
  "Feedback",
  "Learning Atlas",
] as const;

export const locusFullLearnerJourney = [
  {
    step: 1,
    text: "A learner encounters a place, problem, or prompt.",
  },
  {
    step: 2,
    text: "The learner records a Field Note.",
  },
  {
    step: 3,
    text: "A meaningful question emerges.",
  },
  {
    step: 4,
    text: "Guidance connects the learner to inquiry and sources.",
  },
  {
    step: 5,
    text: "The learner practices or investigates.",
  },
  {
    step: 6,
    text: "The learner creates an artifact.",
  },
  {
    step: 7,
    text: "A mentor responds.",
  },
  {
    step: 8,
    text: "The experience becomes part of a growing Learning Atlas.",
  },
  {
    step: 9,
    text: "The learner returns to the world with sharper perception.",
  },
] as const;

export const projectCtaLabels: Record<string, string> = {
  "first-landing": "Explore First Landing",
  locus: "Explore LOCUS",
};
