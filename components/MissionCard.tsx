interface MissionCardProps {
  title: string;
  description: string;
  concepts: string[];
  artifact: string;
}

export default function MissionCard({
  title,
  description,
  concepts,
  artifact,
}: MissionCardProps) {
  return (
    <article className="rounded-2xl border border-sand-dark/50 bg-card p-6 md:p-8 flex flex-col h-full hover:border-tahoe/30 hover:shadow-md hover:shadow-foreground/5 transition-all">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tahoe/10 text-tahoe">
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
        <h3 className="font-serif text-lg sm:text-xl text-foreground leading-snug min-w-0">
          {title}
        </h3>
      </div>

      <p className="text-sm text-muted leading-relaxed flex-grow">
        {description}
      </p>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-stone mb-2">
          Concepts
        </p>
        <div className="flex flex-wrap gap-1.5">
          {concepts.map((concept) => (
            <span
              key={concept}
              className="rounded-md bg-sand/50 px-2 py-0.5 text-xs text-foreground"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-sand-dark/40">
        <p className="text-xs font-medium uppercase tracking-wider text-stone">
          Possible artifact
        </p>
        <p className="mt-1 text-sm text-tahoe">{artifact}</p>
      </div>
    </article>
  );
}
