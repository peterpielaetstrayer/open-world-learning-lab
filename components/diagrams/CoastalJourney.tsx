interface CoastalWeek {
  week: number;
  title: string;
  layer: string;
  movement: string;
}

const coastalArc: CoastalWeek[] = [
  {
    week: 1,
    title: "Learning to Notice",
    layer: "Shoreline observation",
    movement: "Establish bearings; distinguish noticing from explanation.",
  },
  {
    week: 2,
    title: "Water Shapes Land",
    layer: "Geology & erosion",
    movement: "Investigate sediment, elevation, and changing coastal forms.",
  },
  {
    week: 3,
    title: "Water Shapes Life",
    layer: "Estuary & habitat",
    movement: "Explore adaptation, biodiversity, and living systems.",
  },
  {
    week: 4,
    title: "Water Shapes Human History",
    layer: "Settlement & culture",
    movement: "Connect waterways to travel, labor, and Virginia Beach history.",
  },
  {
    week: 5,
    title: "Water Shapes the Future",
    layer: "Stewardship & policy",
    movement: "Investigate flooding, resilience, and public decisions.",
  },
  {
    week: 6,
    title: "Build the Field Guide",
    layer: "Synthesis & creation",
    movement: "Synthesize observations into a learner-created artifact.",
  },
];

export default function CoastalJourney() {
  return (
    <div>
      <p className="mb-6 text-sm text-secondary italic max-w-reading">
        Provisional public sketch — not a finalized curriculum.
      </p>

      <ol className="sr-only">
        {coastalArc.map((w) => (
          <li key={w.week}>
            Week {w.week}: {w.title}. {w.layer}. {w.movement}
          </li>
        ))}
      </ol>

      <div className="relative max-w-3xl" aria-hidden="true">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-water/20" />
        <ol className="space-y-0 list-none">
          {coastalArc.map((week, i) => (
            <li key={week.week} className="relative pl-12 pb-8 last:pb-0">
              <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-water/30 bg-page font-mono text-metadata text-water">
                W{week.week}
              </span>
              <div
                className="rounded-r-lg border border-l-0 border-border py-4 pr-4 pl-5"
                style={{
                  background: `linear-gradient(90deg, rgba(47,102,114,${0.03 + i * 0.015}) 0%, transparent 100%)`,
                }}
              >
                <p className="font-mono text-metadata text-water">{week.layer}</p>
                <h3 className="mt-1 font-serif text-lg text-ink">{week.title}</h3>
                <p className="mt-2 text-sm text-secondary">{week.movement}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export { coastalArc };
