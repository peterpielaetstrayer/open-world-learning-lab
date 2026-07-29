import { technologyHorizons } from "@/content/shared";
import PullQuote from "@/components/PullQuote";

const horizonConfig = [
  {
    key: "today" as const,
    label: "Today",
    accent: "bg-moss",
    tools: ["Notebook", "Phone", "Camera", "Maps"],
    items: technologyHorizons.today,
  },
  {
    key: "emerging" as const,
    label: "Emerging Prototype",
    accent: "bg-water",
    tools: ["Field Notes", "Journey UI", "Creator tools"],
    items: technologyHorizons.emerging,
  },
  {
    key: "future" as const,
    label: "Future Horizon",
    accent: "bg-sediment",
    tools: ["Spatial layers", "Translation", "Capture"],
    items: technologyHorizons.future,
  },
];

export default function TechnologyHorizons() {
  return (
    <div>
      <ol className="relative max-w-4xl list-none">
        <div
          className="absolute left-3 top-3 bottom-3 w-px bg-gradient-to-b from-moss/40 via-water/40 to-sediment/40"
          aria-hidden="true"
        />

        {horizonConfig.map((horizon, index) => (
          <li key={horizon.key} className="relative pb-12 last:pb-0 pl-10">
            <span
              className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full ${horizon.accent}`}
              aria-hidden="true"
            >
              <span className="h-2 w-2 rounded-full bg-page" />
            </span>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-mono text-metadata text-ink">{horizon.label}</h3>
              <p className="font-mono text-[0.65rem] text-quiet" aria-hidden="true">
                {horizon.tools.join(" · ")}
              </p>
            </div>

            <ul className="mt-4 space-y-2 border-l border-border pl-4">
              {horizon.items.map((item) => (
                <li key={item} className="text-sm text-secondary leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>

            {index < horizonConfig.length - 1 && (
              <p className="mt-6 font-mono text-[0.65rem] text-quiet" aria-hidden="true">
                Tools change · learner and world remain continuous
              </p>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-10 max-w-reading text-sm text-secondary leading-relaxed">
        The future interface may change. The educational principle should not: technology must deepen attention to reality rather than compete with it.
      </p>

      <PullQuote>The point is not more screen time. The point is better attention.</PullQuote>
    </div>
  );
}
