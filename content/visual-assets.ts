export type VisualAssetStatus = "placeholder" | "final";

export type VisualTheme =
  | "owll"
  | "first-landing"
  | "locus"
  | "saturdays"
  | "tahoe";

export type VisualVariant = "hero" | "infographic" | "project-preview";

export type VisualAsset = {
  key: string;
  desktopSrc: string | null;
  mobileSrc?: string | null;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  focalPosition?: string;
  mobileFocalPosition?: string;
  previewFocalPosition?: string;
  status: VisualAssetStatus;
  theme: VisualTheme;
  containsEmbeddedText?: boolean;
  title?: string;
};

export const visualAssets: Record<string, VisualAsset> = {
  "homepage-learning-landscape": {
    key: "homepage-learning-landscape",
    desktopSrc: "/visuals/owll/homepage-learning-landscape.png",
    mobileSrc: null,
    title: "A Place Becomes a Learning System",
    alt: "A learner follows an annotated coastal path where field observations, questions, notes, and returning routes transform the landscape into a learning system.",
    caption: "The living field — where attention, questions, and practice connect.",
    width: 1536,
    height: 1024,
    focalPosition: "58% 45%",
    mobileFocalPosition: "55% 40%",
    status: "final",
    theme: "owll",
    containsEmbeddedText: false,
  },
  "first-landing-coastal-systems": {
    key: "first-landing-coastal-systems",
    desktopSrc: "/visuals/first-landing/coastal-systems-field-plate.png",
    mobileSrc: null,
    title: "Water Shapes the Journey",
    alt: "Conceptual field-atlas plate showing a six-week coastal learning journey across shoreline, dunes, wetlands, human history, coastal risk, and learner synthesis.",
    caption:
      "Conceptual field-atlas plate showing the proposed six-week First Landing learning journey across shoreline, dunes, wetlands, human history, coastal risk, and learner-created synthesis.",
    width: 1536,
    height: 1024,
    focalPosition: "50% 50%",
    mobileFocalPosition: "50% 45%",
    previewFocalPosition: "52% 62%",
    status: "final",
    theme: "first-landing",
    containsEmbeddedText: true,
  },
  "locus-system-spine": {
    key: "locus-system-spine",
    desktopSrc: "/visuals/locus/locus-system-spine.png",
    mobileSrc: null,
    title: "From Experience to Cumulative Growth",
    alt: "Conceptual system plate showing how LOCUS connects real-world experience, Field Notes, guided inquiry, mentorship, creation, feedback, and cumulative learning.",
    caption:
      "Conceptual system plate showing how LOCUS connects real-world experience, Field Notes, guided inquiry, mentorship, creation, feedback, and cumulative learning.",
    width: 1536,
    height: 1024,
    focalPosition: "50% 50%",
    mobileFocalPosition: "50% 45%",
    previewFocalPosition: "28% 50%",
    status: "final",
    theme: "locus",
    containsEmbeddedText: true,
  },
  "saturdays-journey": {
    key: "saturdays-journey",
    desktopSrc: null,
    mobileSrc: null,
    alt: "Conceptual reengagement journey from arrival through practice and continuation.",
    width: 1536,
    height: 1024,
    focalPosition: "50% 45%",
    mobileFocalPosition: "50% 35%",
    status: "placeholder",
    theme: "saturdays",
    containsEmbeddedText: false,
  },
  "tahoe-origin-atlas": {
    key: "tahoe-origin-atlas",
    desktopSrc: null,
    mobileSrc: null,
    alt: "Four-zone origin atlas for Open World Tahoe — lake, mountain, trail, and campfire.",
    caption: "Origin study — four interconnected learning zones.",
    width: 1600,
    height: 900,
    focalPosition: "50% 50%",
    mobileFocalPosition: "50% 40%",
    status: "placeholder",
    theme: "tahoe",
    containsEmbeddedText: false,
  },
};

/** @deprecated Use first-landing-coastal-systems */
export const LEGACY_ASSET_ALIASES: Record<string, string> = {
  "first-landing-coastal": "first-landing-coastal-systems",
  "locus-backdrop": "locus-system-spine",
};

export function getVisualAsset(key: string): VisualAsset | undefined {
  const resolvedKey = LEGACY_ASSET_ALIASES[key] ?? key;
  return visualAssets[resolvedKey];
}

export function resolveVisualSrc(
  asset: VisualAsset,
  mobile = false
): string | null {
  if (mobile && asset.mobileSrc) return asset.mobileSrc;
  return asset.desktopSrc;
}
