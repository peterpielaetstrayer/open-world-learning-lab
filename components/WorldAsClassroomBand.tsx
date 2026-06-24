function ZoneIcon({ type }: { type: string }) {
  const cls = "h-4 w-4";
  switch (type) {
    case "lake":
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2 9 C4 6 7 5 10 6 C12 7 14 8 14 10 C12 13 8 14 5 12 C3 11 1 10 2 9Z"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="currentColor"
            fillOpacity="0.15"
          />
        </svg>
      );
    case "mountain":
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M1 13 L6 4 L9 8 L12 5 L15 13 Z"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="currentColor"
            fillOpacity="0.12"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "trail":
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2 12 C5 8 8 10 11 5 C12 3 14 2 14 2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            strokeLinecap="round"
          />
          <circle cx="14" cy="2" r="1.5" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.2" />
          <path d="M8 2 L8 4 M8 12 L8 14 M2 8 L4 8 M12 8 L14 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
  }
}

const environments = [
  {
    name: "Lake",
    zone: "01",
    icon: "lake",
    accent: "text-tahoe",
    dot: "bg-tahoe text-tahoe",
    ring: "border-tahoe/30 bg-tahoe/[0.06] hover:border-tahoe/50 hover:bg-tahoe/10",
    glow: "group-hover:shadow-tahoe/10",
    concepts: ["ecology", "physics", "policy"],
  },
  {
    name: "Mountain",
    zone: "02",
    icon: "mountain",
    accent: "text-pine",
    dot: "bg-pine text-pine",
    ring: "border-pine/30 bg-pine/[0.06] hover:border-pine/50 hover:bg-pine/10",
    glow: "group-hover:shadow-pine/10",
    concepts: ["biomechanics", "risk", "feedback"],
  },
  {
    name: "Trail",
    zone: "03",
    icon: "trail",
    accent: "text-stone",
    dot: "bg-stone text-stone",
    ring: "border-stone/35 bg-sand/50 hover:border-stone/55 hover:bg-sand/70",
    glow: "",
    concepts: ["geology", "navigation", "attention"],
  },
  {
    name: "Campfire",
    zone: "04",
    icon: "campfire",
    accent: "text-foreground",
    dot: "bg-stone/80 text-stone",
    ring: "border-sand-dark/60 bg-sand/40 hover:border-sand-dark hover:bg-sand/60",
    glow: "",
    concepts: ["chemistry", "story", "civic conversation"],
  },
];

export default function WorldAsClassroomBand() {
  return (
    <div
      className="relative border-y border-sand-dark/50 bg-gradient-to-b from-slate-surface/80 via-background to-sand/30 overflow-hidden"
      aria-label="The world as classroom"
    >
      {/* Route line across band — desktop */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-1/2 hidden lg:block h-px w-full -translate-y-1/2 opacity-30"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1="8%"
          y1="0"
          x2="92%"
          y2="0"
          stroke="rgba(74,124,155,0.4)"
          strokeWidth="1"
          strokeDasharray="6 8"
        />
      </svg>

      <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
          <div>
            <p className="field-label">Map legend</p>
            <p className="mt-1 font-serif text-lg text-foreground">
              World as classroom
            </p>
          </div>
          <p className="font-mono text-[0.65rem] text-stone/80 tracking-wider">
            39.0968° N · 120.0324° W · Tahoe basin
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {environments.map((env) => (
            <article
              key={env.name}
              className={`group zone-card relative rounded-2xl border p-4 md:p-5 shadow-sm ${env.ring}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-current/15 ${env.accent} bg-card/60`}
                  >
                    <ZoneIcon type={env.icon} />
                  </span>
                  <div>
                    <h3 className={`font-serif text-base md:text-lg leading-tight ${env.accent}`}>
                      {env.name}
                    </h3>
                    <p className="field-label opacity-50 mt-0.5">zone {env.zone}</p>
                  </div>
                </div>
                <span
                  className={`h-2 w-2 rounded-full ${env.dot.split(" ")[0]} opacity-70 hidden sm:block`}
                  aria-hidden="true"
                />
              </div>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {env.concepts.map((concept) => (
                  <li
                    key={concept}
                    className="rounded-md bg-card/90 px-2 py-0.5 text-[0.7rem] text-muted list-none border border-sand-dark/25 shadow-sm"
                  >
                    {concept}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
