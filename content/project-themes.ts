export type ProjectThemeKey =
  | "owll"
  | "first-landing"
  | "locus"
  | "saturdays"
  | "tahoe";

export interface ProjectTheme {
  key: ProjectThemeKey;
  label: string;
  accent: string;
  accentSecondary: string;
  accentTertiary: string;
}

export const projectThemes: Record<ProjectThemeKey, ProjectTheme> = {
  owll: {
    key: "owll",
    label: "OWLL",
    accent: "var(--color-water)",
    accentSecondary: "var(--color-moss)",
    accentTertiary: "var(--color-sediment)",
  },
  "first-landing": {
    key: "first-landing",
    label: "First Landing",
    accent: "var(--color-water)",
    accentSecondary: "var(--color-fog)",
    accentTertiary: "var(--color-sediment)",
  },
  locus: {
    key: "locus",
    label: "LOCUS",
    accent: "var(--color-deep-field)",
    accentSecondary: "var(--color-moss)",
    accentTertiary: "var(--color-sun-marker)",
  },
  saturdays: {
    key: "saturdays",
    label: "Open World Saturdays",
    accent: "var(--color-moss)",
    accentSecondary: "var(--color-sun-marker)",
    accentTertiary: "var(--color-soft-paper)",
  },
  tahoe: {
    key: "tahoe",
    label: "Open World Tahoe",
    accent: "var(--color-water)",
    accentSecondary: "var(--color-deep-field)",
    accentTertiary: "var(--color-fog)",
  },
};

export const slugToTheme: Record<string, ProjectThemeKey> = {
  "first-landing": "first-landing",
  locus: "locus",
  "open-world-saturdays": "saturdays",
  "open-world-tahoe": "tahoe",
};

export function getProjectTheme(slug: string): ProjectTheme {
  const key = slugToTheme[slug] ?? "owll";
  return projectThemes[key];
}
