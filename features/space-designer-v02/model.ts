export type Audience = "family" | "teen" | "adult";
export type Focus = "research" | "making" | "exploration";
export type Technology = "quiet" | "balanced" | "immersive";

export type StudioBrief = {
  audience: Audience;
  goals: string;
  obstacles: string;
  dimensions: { width: string; length: string };
  lighting: "bright" | "mixed" | "dim";
  roomConstraints: string;
  keep: string;
  technology: Technology;
  focus: Focus;
  budget: string;
  feedback: string;
};

export type DesignZone = { name: string; purpose: string; reason: string };
export type DesignConcept = {
  id: "A" | "B";
  name: string;
  subtitle: string;
  rationale: string;
  zones: DesignZone[];
  features: string[];
  tradeoffs: string[];
  renderPrompt: string;
};
export type StudioPlan = {
  source: "guided" | "ai";
  observed: string[];
  uncertain: string[];
  questions: string[];
  concepts: DesignConcept[];
};

export const initialBrief: StudioBrief = {
  audience: "adult",
  goals: "",
  obstacles: "",
  dimensions: { width: "", length: "" },
  lighting: "mixed",
  roomConstraints: "",
  keep: "",
  technology: "balanced",
  focus: "research",
  budget: "$5,000–$10,000",
  feedback: "",
};

export function positiveArea(brief: StudioBrief) {
  const w = Number(brief.dimensions.width);
  const l = Number(brief.dimensions.length);
  return Number.isFinite(w) && Number.isFinite(l) && w > 0 && l > 0 && w <= 100 && l <= 100
    ? Math.round(w * l * 10) / 10 : null;
}

export function makeGuidedPlan(brief: StudioBrief, photoProvided: boolean): StudioPlan {
  const roomArea = positiveArea(brief);
  const goals = brief.goals.trim() || "self-directed projects and lifelong learning";
  const preserve = brief.keep.trim() ? "Retain existing: " + brief.keep.trim() + "." : "Reuse existing furniture where practical.";
  const compact = roomArea !== null && roomArea < 105;
  const primary = brief.focus === "research" ? "Inquiry" : brief.focus === "making" ? "Making" : "Discovery";
  const table = compact ? "folding or compact worktable" : "flexible central worktable";
  const screen = brief.technology === "quiet" ? "movable laptop and large analog pinboard"
    : brief.technology === "immersive" ? "large interactive display or projection wall (pending site review)"
    : "optional screen and generously sized analog planning surface";
  const caution = "Furniture dimensions, fire egress, electrical loads, accessibility, and the placement of windows and doors still require verification.";
  const base = "Personal learning priorities: " + goals + ". " + preserve;
  const concepts: DesignConcept[] = [
    {
      id: "A",
      name: primary + " Studio",
      subtitle: "Calm focus, clear next actions",
      rationale: base + " Organize the room around a primary deep-work surface and a visible progression from question to completed work.",
      zones: [
        { name: "Focus", purpose: "Uninterrupted reading or creating", reason: "Reduce switching and protect attention." },
        { name: "Map", purpose: "Visible project wall", reason: "Externalize open questions and next actions." },
        { name: "Library", purpose: "Tools and resources", reason: "Keep relevant material easy to find." },
        { name: "Reflect", purpose: "Review and synthesis", reason: "Make progress and learning visible." },
      ],
      features: ["Ergonomic main desk, adjustable lighting", screen, "Small curated resource shelf", "A single clearly visible current project"],
      tradeoffs: [caution, "Prioritizes quiet study over shared maker activities."],
      renderPrompt: "Create a refined, realistically achievable learning-focused home studio. Deep-work desk, warm library textures, intelligently zoned reading corner, writable project wall, curated resources, human-centered natural materials. " + preserve,
    },
    {
      id: "B",
      name: "Exploration Workshop",
      subtitle: "Flexible making, discovery, collaboration",
      rationale: base + " Arrange the environment around hands-on experiments, movable tools, and project presentation.",
      zones: [
        { name: "Make", purpose: "Flexible hands-on projects", reason: "Encourage experimentation and completion." },
        { name: "Share", purpose: "Collaborative project display", reason: "Invite explanation and feedback." },
        { name: "Store", purpose: "Modular material access", reason: "Support varied interests without clutter." },
        { name: "Reset", purpose: "Daily cleanup and reflection", reason: "Preserve flexibility over time." },
      ],
      features: [table, "Rolling storage and clear work surfaces", screen, "An inviting display for work in progress"],
      tradeoffs: [caution, "A flexible workshop may offer less isolation for sustained concentration."],
      renderPrompt: "Create a premium, realistically achievable home learning workshop with flexible central table, mobile project storage, hands-on learning materials, creative research wall, plants, warm daylight, unobstructed circulation. " + preserve,
    },
  ];
  if (brief.feedback.trim()) {
    for (const concept of concepts) {
      concept.rationale += " Requested revision: " + brief.feedback.trim() + ".";
      concept.renderPrompt += " Incorporate this requested change where feasible: " + brief.feedback.trim().slice(0, 300) + ".";
    }
  }
  return {
    source: "guided",
    observed: photoProvided ? ["A photo is attached for reference; it has not been analyzed in guided mode."] : ["No room photo supplied."],
    uncertain: [
      roomArea ? "Approximate area of " + roomArea + " sq ft is based only on supplied dimensions." : "Room dimensions have not been confirmed.",
      "Door swings, windows, sockets, clearances, structural conditions, and furniture dimensions are unverified.",
      "Illustrative renderings cannot establish buildability or pricing.",
    ],
    questions: [
      "Which one or two activities should the room make much easier?",
      "What existing furniture or equipment must remain?",
      "Where are the door, windows, and electrical outlets?",
    ],
    concepts,
  };
}

export function exportBlueprint(brief: StudioBrief, plan: StudioPlan, concept: DesignConcept): string {
  const area = positiveArea(brief);
  return [
    "# OWLL Space Designer — Learning Environment Concept",
    "",
    "Prototype output; illustrative only. Not construction, electrical or architectural documentation. No verified quotes.",
    "Planning mode: " + (plan.source === "ai" ? "AI-assisted; requires independent validation." : "Guided templates; no AI model used."),
    "",
    "## Learner",
    "- Audience: " + brief.audience,
    "- Goals: " + (brief.goals || "Not yet entered"),
    "- Constraints: " + (brief.obstacles || "Not provided"),
    "- Preferred focus: " + brief.focus,
    "- Technology: " + brief.technology,
    "- Budget planning band: " + brief.budget + " (not an estimate)",
    "",
    "## Room",
    "- Approximate area: " + (area ? area + " sq ft" : "Unmeasured"),
    "- Light: " + brief.lighting,
    "- Room conditions: " + (brief.roomConstraints || "Not provided"),
    "- Preserve: " + (brief.keep || "Not provided"),
    "",
    "## Selected direction: " + concept.name,
    concept.rationale,
    "",
    "### Design zones",
    ...concept.zones.map(z => "- **" + z.name + "** — " + z.purpose + ". Rationale: " + z.reason),
    "",
    "### Suggested features",
    ...concept.features.map(f => "- " + f),
    "",
    "### Tradeoffs",
    ...concept.tradeoffs.map(t => "- " + t),
    "",
    "## Observations (if any)",
    ...plan.observed.map(x => "- " + x),
    "",
    "## Uncertainties",
    ...plan.uncertain.map(x => "- " + x),
    "",
    "## Questions to resolve",
    ...plan.questions.map(x => "- " + x),
    "",
    "## Customer requested revisions",
    brief.feedback || "None recorded",
    "",
    "## Next steps",
    "1. Validate measurements and actual architectural features.",
    "2. Select dimensioned furniture, lighting, and tools.",
    "3. Obtain current product quotations and installer guidance.",
    "4. Test learning routines in the space before purchasing.",
    "",
    "Generated by OWLL Space Designer v0.2. Concept renderings, if made, are illustrative only.",
  ].join("\n");
}

export function isStudioPlan(value: unknown): value is Omit<StudioPlan, "source"> {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<StudioPlan>;
  const strings = (a: unknown) => Array.isArray(a) && a.every(x => typeof x === "string") && a.length <= 16;
  return strings(v.observed) && strings(v.uncertain) && strings(v.questions) &&
    Array.isArray(v.concepts) && v.concepts.length === 2 &&
    v.concepts.every(c => c && (c.id === "A" || c.id === "B") &&
      typeof c.name === "string" && typeof c.subtitle === "string" &&
      typeof c.rationale === "string" && typeof c.renderPrompt === "string" &&
      strings(c.features) && strings(c.tradeoffs) && Array.isArray(c.zones) &&
      c.zones.length >= 2 && c.zones.length <= 6 &&
      c.zones.every(z => z && typeof z.name === "string" &&
        typeof z.purpose === "string" && typeof z.reason === "string"));
}
