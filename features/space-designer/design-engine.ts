export type Audience = "family" | "teen" | "adult";
export type Priority = "create" | "research" | "explore";
export type Budget = "under5" | "5to10" | "10to20" | "over20";
export type Technology = "minimal" | "balanced" | "immersive";
export type Light = "bright" | "mixed" | "dim";

export type Brief = {
  audience: Audience;
  learner: string;
  interests: string;
  challenge: string;
  roomWidth: string;
  roomLength: string;
  roomNotes: string;
  light: Light;
  existing: string;
  priority: Priority;
  technology: Technology;
  budget: Budget;
  notes: string;
};

export type DesignConcept = {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  zones: { name: string; purpose: string }[];
  features: string[];
  tradeoff: string;
  palette: string;
};

export const startingBrief: Brief = {
  audience: "adult",
  learner: "",
  interests: "",
  challenge: "",
  roomWidth: "",
  roomLength: "",
  roomNotes: "",
  light: "mixed",
  existing: "",
  priority: "research",
  technology: "balanced",
  budget: "5to10",
  notes: "",
};

export const audienceName: Record<Audience, string> = {
  family: "A family or child",
  teen: "A teenager",
  adult: "An adult learner",
};

export const priorityName: Record<Priority, string> = {
  create: "Creating and completing projects",
  research: "Deep study, research, and focus",
  explore: "Curiosity and open-ended discovery",
};

export const technologyName: Record<Technology, string> = {
  minimal: "Technology in the background",
  balanced: "A thoughtful physical + digital balance",
  immersive: "Digital-first, with expansive displays",
};

export const budgetName: Record<Budget, string> = {
  under5: "Under $5,000",
  "5to10": "$5,000–$10,000",
  "10to20": "$10,000–$20,000",
  over20: "$20,000+",
};

const allowances: Record<Budget, number> = {
  under5: 3500,
  "5to10": 7500,
  "10to20": 15000,
  over20: 22500,
};

export function isMeasured(brief: Brief): boolean {
  const w = Number(brief.roomWidth);
  const l = Number(brief.roomLength);
  return Number.isFinite(w) && Number.isFinite(l) && w > 0 && l > 0;
}

export function roomArea(brief: Brief): number | null {
  if (!isMeasured(brief)) return null;
  return Number(brief.roomWidth) * Number(brief.roomLength);
}

export function proposedBudget(brief: Brief) {
  const total = allowances[brief.budget];
  const categories = [
    { name: "Furniture & storage", share: 0.24 },
    { name: "Digital display & connectivity", share: 0.18 },
    { name: "Learning & creation tools", share: 0.15 },
    { name: "Design & configuration", share: 0.18 },
    { name: "Installation allowance", share: 0.15 },
    { name: "Contingency", share: 0.10 },
  ];
  return {
    total,
    lines: categories.map((c) => ({
      name: c.name,
      amount: Math.round(total * c.share),
    })),
  };
}

export function makeConcepts(brief: Brief): DesignConcept[] {
  const area = roomArea(brief);
  const compact = area !== null && area < 100;
  const display = brief.technology === "minimal"
    ? "A movable laptop station and analog-first writing surfaces"
    : brief.technology === "immersive"
      ? "A large digital display or projection wall, subject to light and placement checks"
      : "A flexible monitor or projection surface balanced with tactile tools";
  const audience = brief.audience === "family"
    ? "Shared zones support collaboration and independent exploration."
    : brief.audience === "teen"
      ? "Ownership, creative expression, and independent projects lead the layout."
      : "Deep work, deliberate practice, and reflection shape the layout.";
  const spaceCaution = compact
    ? "Small-room tradeoff: use foldaway and mobile furniture; do not overcrowd circulation."
    : "Tradeoff: zones must be validated against real furniture sizes, circulation, and outlets.";
  const featured: Record<Priority, DesignConcept> = {
    create: {
      id: "project",
      name: "The Project Studio",
      tagline: "A place to make ideas tangible.",
      summary: "An adaptable workroom centered on making, experimentation, and finishing meaningful work. " + audience,
      zones: [
        { name: "Make", purpose: "Flexible project worktable" },
        { name: "Plan", purpose: "Writable project wall" },
        { name: "Store", purpose: "Supplies and in-progress work" },
        { name: "Reflect", purpose: "Review and display finished work" },
      ],
      features: [
        "A central movable work surface with task lighting",
        display,
        "Visible project storage and a weekly completion ritual",
        "A clear place to document, photograph, or present completed work",
      ],
      tradeoff: spaceCaution,
      palette: "moss",
    },
    research: {
      id: "research",
      name: "The Discovery Library",
      tagline: "Find focus. Follow a question.",
      summary: "A calm research studio for concentrated reading, inquiry, idea-mapping, and synthesis. " + audience,
      zones: [
        { name: "Focus", purpose: "Deep-work station" },
        { name: "Map", purpose: "Research wall or display" },
        { name: "Read", purpose: "Resources within reach" },
        { name: "Synthesize", purpose: "Notes and reflection" },
      ],
      features: [
        "A quiet main desk with an adjustable task light",
        display,
        "A physical resource shelf and a visible question board",
        "A simple capture-to-synthesis workflow for research notes",
      ],
      tradeoff: "Tradeoff: abundant screens can fragment attention; build in screen-free study time.",
      palette: "water",
    },
    explore: {
      id: "explore",
      name: "The Curiosity Atelier",
      tagline: "Follow the unexpected connection.",
      summary: "A flexible inquiry environment that invites reading, conversation, creative experiments, and exploration. " + audience,
      zones: [
        { name: "Explore", purpose: "Open discovery surface" },
        { name: "Create", purpose: "Experiment table" },
        { name: "Collect", purpose: "Artifacts and resources" },
        { name: "Share", purpose: "Show-and-tell wall" },
      ],
      features: [
        "A flexible table that adapts to changing interests",
        display,
        "An accessible rotating collection of books, tools, and materials",
        "A visible invitation to ask, test, and share new questions",
      ],
      tradeoff: "Tradeoff: open-ended spaces still need a weekly reset to avoid clutter.",
      palette: "sediment",
    },
  };
  const other = Object.values(featured).filter((c) => c.id !== featured[brief.priority].id);
  return [featured[brief.priority], ...other];
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function clean(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/[|<>]/g, "").trim() || "Not provided";
}

export function blueprintMarkdown(brief: Brief, concept: DesignConcept): string {
  const budget = proposedBudget(brief);
  const area = roomArea(brief);
  return [
    "# OWLL Space Designer — Exploratory Learning Blueprint",
    "",
    "**Research prototype / not an architectural plan, contractor specification, or price quote.**",
    "**Recommendations are rule-based, not AI-generated.**",
    "",
    "## Learner and intention",
    "- Learner: " + (clean(brief.learner) === "Not provided" ? audienceName[brief.audience] : clean(brief.learner)),
    "- Audience: " + audienceName[brief.audience],
    "- Interests: " + clean(brief.interests),
    "- Challenge: " + clean(brief.challenge),
    "- Main goal: " + priorityName[brief.priority],
    "- Technology preference: " + technologyName[brief.technology],
    "",
    "## Room conditions",
    "- Approximate area: " + (area ? area.toFixed(1) + " sq ft (user-provided measurements)" : "Not yet measured"),
    "- Lighting: " + brief.light,
    "- Existing furniture: " + clean(brief.existing),
    "- Constraints: " + clean(brief.roomNotes),
    "",
    "## Selected concept: " + concept.name,
    concept.summary,
    "",
    "### Learning zones",
    ...concept.zones.map((zone) => "- **" + zone.name + ":** " + zone.purpose),
    "",
    "### Proposed features",
    ...concept.features.map((feature) => "- " + feature),
    "",
    "### Constraints and tradeoffs",
    concept.tradeoff,
    "",
    "## Illustrative budget allocation",
    "- Chosen planning band: " + budgetName[brief.budget],
    "- Illustrative allocation baseline: " + formatUSD(budget.total),
    ...budget.lines.map((line) => "- " + line.name + ": " + formatUSD(line.amount)),
    "",
    "These amounts are placeholders, not product quotes. Verify dimensions, local labor, room safety, electrical needs, equipment compatibility, accessibility, and all actual prices.",
    "",
    "## Additional preferences",
    clean(brief.notes),
    "",
    "## Next validation steps",
    "1. Measure walls, doors, windows, outlets, furniture clearance, and ceiling height.",
    "2. Confirm the intended activities and what success would look like for the learner.",
    "3. Build a dimensionally accurate floor plan and obtain real product and installer quotes.",
    "4. Review electrical, installation, privacy, accessibility, and child safety requirements as applicable.",
    "5. Test the proposed learning routines before committing to a full build.",
    "",
    "Prepared using OWLL Space Designer v0.1, a private, simulated planning prototype.",
  ].join("\n");
}
