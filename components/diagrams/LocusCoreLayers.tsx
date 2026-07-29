const coreLayers = [
  {
    number: 1,
    title: "Experience",
    description: "The learner and the world — real places, practices, and encounters that begin the loop.",
  },
  {
    number: 2,
    title: "Capture",
    description: "Field Notes — observations, questions, media, and evidence gathered in context.",
  },
  {
    number: 3,
    title: "Structure",
    description: "Journey design and guided inquiry — enough form to turn curiosity into investigation.",
  },
  {
    number: 4,
    title: "Human judgment",
    description: "Mentor and creator layers — feedback, facilitation, and design work that stay human-led.",
  },
  {
    number: 5,
    title: "Cumulative record",
    description: "Learning Atlas and return — artifacts, reflection, and growth that sharpen the next encounter.",
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
