interface MissionCardProps {
  title: string;
  description: string;
  concepts: string[];
  artifact: string;
  index?: number;
}

export default function MissionCard({
  title,
  description,
  concepts,
  artifact,
  index = 0,
}: MissionCardProps) {
  const missionId = `OWL-M${String(index + 1).padStart(2, "0")}`;

  return (
    <article className="card-premium card-lift group flex flex-col h-full hover:border-tahoe/30 focus-within:border-tahoe/40 overflow-hidden">
      {/* Brief header strip */}
      <div className="border-b border-sand-dark/30 bg-gradient-to-r from-sand/30 to-transparent px-6 py-3 flex items-center justify-between gap-2">
        <span className="field-label text-tahoe/70">Mission brief</span>
        <span className="font-mono text-[0.6rem] text-stone/60 tracking-wider">
          {missionId}
        </span>
      </div>

      <div className="p-6 md:p-7 flex flex-col flex-grow">
        <div className="flex items-start gap-3 mb-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tahoe/10 text-tahoe border border-tahoe/15 shadow-sm group-hover:bg-tahoe/15 transition-colors">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-lg sm:text-xl text-foreground leading-snug">
              {title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-muted leading-relaxed flex-grow">
          {description}
        </p>

        <div className="mt-5 rounded-lg border border-sand-dark/25 bg-background/50 p-4">
          <p className="field-label mb-2">Concepts</p>
          <div className="flex flex-wrap gap-1.5">
            {concepts.map((concept) => (
              <span
                key={concept}
                className="rounded-md bg-card px-2 py-0.5 text-xs text-foreground border border-sand-dark/30"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-sand-dark/30 flex items-end justify-between gap-4">
          <div>
            <p className="field-label">Possible artifact</p>
            <p className="mt-1 text-sm font-medium text-tahoe">{artifact}</p>
          </div>
          <span className="shrink-0 rounded-full bg-sand/50 px-2 py-0.5 font-mono text-[0.58rem] text-stone/70 tracking-wide border border-sand-dark/30">
            reflection
          </span>
        </div>
      </div>
    </article>
  );
}
