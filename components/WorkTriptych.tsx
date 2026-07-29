import { workLabCards } from "@/content/shared";

const progressionNotes = [
  "Studies the problem",
  "Tests ideas in the world",
  "Builds supporting infrastructure",
];

export default function WorkTriptych() {
  return (
    <div className="relative max-w-4xl">
      <div
        className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-border-strong"
        aria-hidden="true"
      />

      <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:overflow-visible md:px-0 pb-1 md:pb-0 snap-x snap-mandatory md:snap-none">
        <ol className="relative flex md:grid md:grid-cols-3 gap-4 md:gap-8 list-none min-w-max md:min-w-0 md:w-full">
          {workLabCards.map((card, i) => (
            <li
              key={card.title}
              className="relative w-[min(72vw,16.5rem)] shrink-0 snap-center md:w-auto md:shrink md:snap-align-none"
            >
              <span
                className="mb-3 flex h-7 w-7 items-center justify-center rounded-full border border-water/30 bg-page font-mono text-metadata text-water"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-section-title text-ink">{card.title}</h3>
              <p className="mt-2 md:mt-3 text-body text-secondary leading-relaxed">
                {card.description}
              </p>
              <p className="mt-2 md:mt-3 font-mono text-metadata text-quiet">
                {progressionNotes[i]}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-5 md:mt-8 font-mono text-metadata text-quiet max-w-reading">
        Research → Prototype → Infrastructure
      </p>
    </div>
  );
}
