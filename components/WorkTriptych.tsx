import { workLabCards } from "@/content/shared";

export default function WorkTriptych() {
  return (
    <div className="relative max-w-4xl">
      <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-border-strong" aria-hidden="true" />
      <ol className="grid gap-8 md:grid-cols-3 list-none">
        {workLabCards.map((card, i) => (
          <li key={card.title} className="relative">
            <span
              className="mb-4 flex h-8 w-8 items-center justify-center rounded-full border border-water/30 bg-page font-mono text-metadata text-water"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-serif text-section-title text-ink">{card.title}</h3>
            <p className="mt-3 text-body text-secondary leading-relaxed">{card.description}</p>
            {i === 0 && (
              <p className="mt-3 font-mono text-metadata text-quiet">Creates questions & principles</p>
            )}
            {i === 1 && (
              <p className="mt-3 font-mono text-metadata text-quiet">Tests ideas in the world</p>
            )}
            {i === 2 && (
              <p className="mt-3 font-mono text-metadata text-quiet">Supports repeatable systems</p>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-8 font-mono text-metadata text-quiet max-w-reading">
        Research → Prototype → Infrastructure
      </p>
    </div>
  );
}
