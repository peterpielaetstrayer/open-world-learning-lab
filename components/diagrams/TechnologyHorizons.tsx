import { technologyHorizons } from "@/content/shared";
import PullQuote from "@/components/PullQuote";

const horizonConfig = [
  {
    key: "today" as const,
    label: "Today",
    accent: "moss",
    tools: ["Notebook", "Phone", "Camera", "Maps"],
    items: technologyHorizons.today,
  },
  {
    key: "emerging" as const,
    label: "Emerging Prototype",
    accent: "water",
    tools: ["Field Notes", "Journey UI", "Creator tools"],
    items: technologyHorizons.emerging,
  },
  {
    key: "future" as const,
    label: "Future Horizon",
    accent: "sediment",
    tools: ["Spatial layers", "Translation", "Capture"],
    items: technologyHorizons.future,
  },
];

const accentDot: Record<string, string> = {
  moss: "bg-moss",
  water: "bg-water",
  sediment: "bg-sediment",
};

export default function TechnologyHorizons() {
  return (
    <div>
      <div className="relative">
        <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-border" aria-hidden="true" />
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
          {horizonConfig.map((horizon, i) => (
            <article key={horizon.key} className="relative">
              <div className="flex items-center gap-3 mb-6">
                <span className={`h-2.5 w-2.5 rounded-full ${accentDot[horizon.accent]}`} aria-hidden="true" />
                <h3 className="font-mono text-metadata text-ink">{horizon.label}</h3>
              </div>

              {/* Representative tools */}
              <div className="mb-5 flex flex-wrap gap-2" aria-hidden="true">
                {horizon.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-md border border-border bg-soft-paper/50 px-2.5 py-1 text-xs text-secondary"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <ul className="space-y-2 border-l border-border pl-4">
                {horizon.items.map((item) => (
                  <li key={item} className="text-sm text-secondary leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>

              {i < horizonConfig.length - 1 && (
                <span className="hidden lg:block absolute -right-4 top-12 text-quiet" aria-hidden="true">→</span>
              )}
            </article>
          ))}
        </div>
      </div>

      <p className="mt-10 max-w-reading text-sm text-secondary leading-relaxed">
        The future interface may change. The educational principle should not: technology must deepen attention to reality rather than compete with it.
      </p>

      <PullQuote>The point is not more screen time. The point is better attention.</PullQuote>
    </div>
  );
}
