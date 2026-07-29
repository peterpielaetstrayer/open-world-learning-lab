const coreLayers = [
  {
    number: 1,
    title: "Field Notes",
    description: "Observations, questions, media, and evidence gathered in context from real-world experience.",
  },
  {
    number: 2,
    title: "Journey Layer",
    description: "Structured pathways that turn curiosity into guided inquiry, practice, and creation.",
  },
  {
    number: 3,
    title: "Mentor Layer",
    description: "Human feedback, facilitation, and judgment that remain central to the learning process.",
  },
  {
    number: 4,
    title: "Learning Atlas",
    description: "A cumulative record of artifacts, reflection, and growth that sharpens future perception.",
  },
  {
    number: 5,
    title: "Creator Layer",
    description: "Tools and workflows that help learning designers build, test, and revise journeys.",
  },
];

export default function LocusCoreLayers() {
  return (
    <ol className="relative max-w-reading list-none">
      <div className="absolute left-[0.6875rem] top-2 bottom-2 w-px bg-border-strong" aria-hidden="true" />
      {coreLayers.map((layer) => (
        <li key={layer.title} className="relative pl-10 pb-8 last:pb-0">
          <span
            className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-page font-mono text-[0.65rem] text-water"
            aria-hidden="true"
          >
            {layer.number}
          </span>
          <h3 className="font-serif text-lg text-ink">{layer.title}</h3>
          <p className="mt-1.5 text-sm text-secondary leading-relaxed">{layer.description}</p>
        </li>
      ))}
    </ol>
  );
}
