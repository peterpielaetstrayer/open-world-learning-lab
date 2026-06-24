interface GuardrailCardProps {
  title: string;
  description: string;
  index?: number;
}

export default function GuardrailCard({
  title,
  description,
  index = 0,
}: GuardrailCardProps) {
  return (
    <article className="card-premium card-lift group hover:border-pine/30 overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-pine/40 via-pine/20 to-transparent" aria-hidden="true" />
      <div className="p-6 md:p-7">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine/10 text-pine border border-pine/15 shadow-sm">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </span>
          <div>
            <p className="field-label mb-1">
              Guardrail · {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="font-semibold text-foreground leading-snug">{title}</h3>
            <p className="mt-2.5 text-sm text-muted leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
