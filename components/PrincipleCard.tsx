interface PrincipleCardProps {
  title: string;
  description: string;
}

export default function PrincipleCard({ title, description }: PrincipleCardProps) {
  return (
    <article className="card-premium p-5 md:p-6 hover:border-pine/25 transition-colors">
      <p className="field-label mb-2">Guardrail</p>
      <h3 className="font-semibold text-foreground leading-snug">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
    </article>
  );
}
