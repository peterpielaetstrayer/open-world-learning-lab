import { guardrails } from "@/content/shared";

interface GuardrailIndexProps {
  items?: typeof guardrails;
}

export default function GuardrailIndex({ items = guardrails }: GuardrailIndexProps) {
  return (
    <ol className="relative max-w-3xl list-none">
      <div className="absolute left-[1.125rem] top-2 bottom-2 w-px bg-border-strong" aria-hidden="true" />
      {items.map((guardrail, i) => (
        <li key={guardrail.title} className="relative pl-12 pb-10 last:pb-0">
          <span
            className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-page font-mono text-metadata text-water"
            aria-hidden="true"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-serif text-section-title text-ink">{guardrail.title}</h3>
          <p className="mt-2 text-body text-secondary leading-relaxed max-w-reading">
            {guardrail.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
