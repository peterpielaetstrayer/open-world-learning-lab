import Link from "next/link";

type ReleaseCoverVariant =
  | "brief"
  | "system-map"
  | "pilot-sketch"
  | "concept-note"
  | "origin-study";

export type ReleaseCoverProps = {
  releaseId: string;
  title: string;
  releaseType: string;
  version: string;
  date?: string;
  theme?: string;
  visualVariant?: ReleaseCoverVariant;
  href?: string;
  className?: string;
  compact?: boolean;
};

const variantAccent: Record<ReleaseCoverVariant, string> = {
  brief: "from-water/20 to-moss/10",
  "system-map": "from-moss/15 to-water/15",
  "pilot-sketch": "from-water/15 to-sediment/10",
  "concept-note": "from-sun-marker/15 to-moss/10",
  "origin-study": "from-deep-field/20 to-water/10",
};

function CoverArt({ variant }: { variant: ReleaseCoverVariant }) {
  return (
    <div
      className={`relative h-full w-full bg-gradient-to-br ${variantAccent[variant]} texture-contour overflow-hidden`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="xMidYMid slice">
        <path d="M0 80 Q50 60 100 70 T200 65" fill="none" stroke="var(--color-water)" strokeOpacity="0.3" />
        <path d="M20 100 C60 85 100 95 140 80 C170 70 190 75 200 70" fill="none" stroke="var(--color-moss)" strokeOpacity="0.25" strokeDasharray="3 5" />
        <circle cx="160" cy="40" r="3" fill="var(--color-sediment)" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

export default function ReleaseCover({
  releaseId,
  title,
  releaseType,
  version,
  date,
  visualVariant = "brief",
  href,
  className = "",
  compact = false,
}: ReleaseCoverProps) {
  const content = (
    <article
      className={`group flex ${compact ? "flex-row gap-4" : "flex-col"} overflow-hidden rounded-lg border border-border bg-page hover:border-water/30 transition-colors ${className}`}
    >
      <div className={`relative shrink-0 ${compact ? "w-24 h-16" : "aspect-[5/3] w-full"}`}>
        <CoverArt variant={visualVariant} />
        <span className="absolute bottom-1.5 left-2 font-mono text-[0.55rem] text-ink/50">{releaseId}</span>
      </div>

      <div className={`flex flex-col ${compact ? "py-2 pr-3" : "p-5"}`}>
        <p className="font-mono text-metadata text-quiet">{releaseType}</p>
        <h3 className={`mt-1 font-serif text-ink leading-snug group-hover:text-water transition-colors ${compact ? "text-base" : "text-xl"}`}>
          {title}
        </h3>
        <div className="mt-auto pt-2 flex flex-wrap items-center gap-2 font-mono text-metadata text-quiet">
          <span>v{version}</span>
          {date && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={date}>
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </>
          )}
        </div>
      </div>
    </article>
  );

  if (href) {
    const isAnchor = href.startsWith("/#");
    if (isAnchor) {
      return (
        <a href={href} className="block focus-visible:rounded-lg">
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className="block focus-visible:rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}

export function releaseTypeToVariant(releaseType: string): ReleaseCoverVariant {
  const map: Record<string, ReleaseCoverVariant> = {
    "Concept Brief": "brief",
    "System Map": "system-map",
    "Pilot Sketch": "pilot-sketch",
    "Concept Note": "concept-note",
    "Origin Study": "origin-study",
  };
  return map[releaseType] ?? "brief";
}
