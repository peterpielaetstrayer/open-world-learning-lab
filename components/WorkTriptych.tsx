import { workLabCards } from "@/content/shared";

export default function WorkTriptych() {
  return (
    <div className="relative max-w-4xl">
      <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-border-strong" aria-hidden="true" />
      <ol className="relative grid gap-0 md:grid-cols-3 md:gap-8 list-none border-l border-water/20 md:border-l-0 pl-5 md:pl-0">
        {workLabCards.map((card, i) => (
          <li
            key={card.title}
            className="relative border-b border-water/15 pb-6 mb-6 last:mb-0 last:border-b-0 last:pb-0 md:border-b-0 md:mb-0 md:pb-0"
          >
            <span
              className="absolute -left-[calc(1.25rem+1px)] top-0 flex h-7 w-7 md:relative md:left-auto md:top-auto md:mb-4 items-center justify-center rounded-full border border-water/30 bg-page font-mono text-metadata text-water"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="md:mt-0">
              <h3 className="font-serif text-section-title text-ink">{card.title}</h3>
              <p className="mt-2 md:mt-3 text-body text-secondary leading-relaxed">{card.description}</p>
              {i === 0 && (
                <p className="mt-2 md:mt-3 font-mono text-metadata text-quiet">Studies the problem</p>
              )}
              {i === 1 && (
                <p className="mt-2 md:mt-3 font-mono text-metadata text-quiet">Tests ideas in the world</p>
              )}
              {i === 2 && (
                <p className="mt-2 md:mt-3 font-mono text-metadata text-quiet">Builds supporting infrastructure</p>
              )}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 md:mt-8 font-mono text-metadata text-quiet max-w-reading">
        Research → Prototype → Infrastructure
      </p>
    </div>
  );
}
