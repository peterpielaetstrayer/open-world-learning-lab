interface MissionDossierProps {
  title: string;
  description: string;
  concepts: string[];
  artifact: string;
  index?: number;
}

export default function MissionDossier({
  title,
  description,
  concepts,
  artifact,
  index = 0,
}: MissionDossierProps) {
  const missionId = `OWL-M${String(index + 1).padStart(2, "0")}`;

  return (
    <article className="border-l-2 border-water/30 pl-5 py-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <p className="font-mono text-metadata text-quiet">Field-study dossier · {missionId}</p>
      </div>
      <h3 className="font-serif text-xl text-ink leading-snug">{title}</h3>
      <p className="mt-3 text-sm text-secondary leading-relaxed">{description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {concepts.map((concept) => (
          <span
            key={concept}
            className="rounded-md border border-border bg-soft-paper/50 px-2 py-0.5 text-xs text-secondary"
          >
            {concept}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm">
        <span className="font-mono text-metadata text-quiet">Artifact </span>
        <span className="text-water">{artifact}</span>
      </p>
    </article>
  );
}
