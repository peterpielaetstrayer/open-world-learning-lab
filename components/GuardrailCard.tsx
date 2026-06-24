interface GuardrailCardProps {
  title: string;
  description: string;
}

export default function GuardrailCard({
  title,
  description,
}: GuardrailCardProps) {
  return (
    <article className="card-lift rounded-2xl border border-sand-dark/50 bg-card p-6 md:p-7 hover:border-pine/25">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pine/10 text-pine">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <div>
          <p className="field-label mb-1">Guardrail</p>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
