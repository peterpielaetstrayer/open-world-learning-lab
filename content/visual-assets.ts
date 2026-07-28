export type VisualAssetStatus = "placeholder" | "final";

export type VisualTheme =
  | "owll"
  | "first-landing"
  | "locus"
  | "saturdays"
  | "tahoe";

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
  status: VisualAssetStatus;
  theme: VisualTheme;
};

export const visualAssets: Record<string, VisualAsset> = {
  "homepage-learning-landscape": {
    key: "homepage-learning-landscape",
    desktopSrc: null,
    mobileSrc: null,
    alt: "Conceptual field atlas showing place, inquiry, mentorship, and return across an open learning landscape.",
    caption: "The living field — where attention, questions, and practice connect.",
    width: 1600,
    height: 900,
    focalPosition: "60% 40%",
    mobileFocalPosition: "50% 35%",
    status: "placeholder",
    theme: "owll",
  },
  "first-landing-coastal": {
    key: "first-landing-coastal",
    desktopSrc: null,
    mobileSrc: null,
    alt: "Conceptual coastal systems field plate for the First Landing learning journey.",
    caption: "Coastal systems — shoreline, estuary, history, and future.",
    width: 1400,
    height: 875,
    focalPosition: "55% 50%",
    mobileFocalPosition: "50% 40%",
    status: "placeholder",
    theme: "first-landing",
  },
  "locus-backdrop": {
    key: "locus-backdrop",
    desktopSrc: null,
    mobileSrc: null,
    alt: "Environmental backdrop suggesting layers of a learning system.",
    width: 1400,
    height: 700,
    focalPosition: "50% 50%",
    status: "placeholder",
    theme: "locus",
  },
  "saturdays-journey": {
    key: "saturdays-journey",
    desktopSrc: null,
    mobileSrc: null,
    alt: "Conceptual reengagement journey from arrival through practice and continuation.",
    width: 1400,
    height: 875,
    focalPosition: "50% 45%",
    mobileFocalPosition: "50% 35%",
    status: "placeholder",
    theme: "saturdays",
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
  },
};

export function getVisualAsset(key: string): VisualAsset | undefined {
  return visualAssets[key];
}

export function resolveVisualSrc(
  asset: VisualAsset,
  mobile = false
): string | null {
  if (mobile && asset.mobileSrc) return asset.mobileSrc;
  return asset.desktopSrc;
}
