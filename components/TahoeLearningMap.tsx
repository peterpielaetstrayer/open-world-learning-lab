interface Zone {
  name: string;
  concepts: string[];
}

interface TahoeLearningMapProps {
  zones: Zone[];
}

const zoneMeta = [
  { id: "01", gridClass: "lg:col-start-1 lg:row-start-1", accent: "tahoe" as const },
  { id: "02", gridClass: "lg:col-start-3 lg:row-start-1", accent: "pine" as const },
  { id: "03", gridClass: "lg:col-start-1 lg:row-start-3", accent: "stone" as const },
  { id: "04", gridClass: "lg:col-start-3 lg:row-start-3", accent: "sand" as const },
];

const accentStyles = {
  tahoe: {
    label: "text-tahoe",
    border: "border-tahoe/25 hover:border-tahoe/45",
    bg: "hover:bg-tahoe/[0.05]",
    dot: "bg-tahoe",
  },
  pine: {
    label: "text-pine",
    border: "border-pine/25 hover:border-pine/45",
    bg: "hover:bg-pine/[0.05]",
    dot: "bg-pine",
  },
  stone: {
    label: "text-stone",
    border: "border-stone/25 hover:border-stone/45",
    bg: "hover:bg-stone/[0.04]",
    dot: "bg-stone",
  },
  sand: {
    label: "text-foreground",
    border: "border-sand-dark/45 hover:border-sand-dark/70",
    bg: "hover:bg-sand/40",
    dot: "bg-stone",
  },
};

const mapMeta = [
  { label: "Status", value: "Pilot concept" },
  { label: "Mode", value: "Place-based learning" },
  { label: "Reach", value: "Global stream" },
];

export default function TahoeLearningMap({ zones }: TahoeLearningMapProps) {
  return (
    <div className="mt-14 relative rounded-2xl border border-sand-dark/40 overflow-hidden shadow-xl shadow-foreground/[0.04]">
      {/* Map canvas background */}
      <div className="absolute inset-0 pattern-map-texture" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 900 600"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <path
            d="M300 250 C370 200 500 195 580 230 C660 265 680 340 630 400 C570 470 420 480 340 440 C260 400 230 310 300 250 Z"
            fill="rgba(74,124,155,0.08)"
            stroke="rgba(74,124,155,0.18)"
            strokeWidth="1.25"
          />
          <ellipse cx="450" cy="320" rx="220" ry="140" stroke="rgba(74,124,155,0.09)" strokeWidth="0.75" />
          <ellipse cx="450" cy="320" rx="175" ry="110" stroke="rgba(74,124,155,0.07)" strokeWidth="0.75" />
          <ellipse cx="450" cy="320" rx="130" ry="82" stroke="rgba(45,90,71,0.07)" strokeWidth="0.75" />
          <ellipse cx="450" cy="320" rx="85" ry="54" stroke="rgba(45,90,71,0.05)" strokeWidth="0.75" />
          <path
            d="M80 480 C200 380 300 420 450 320 C600 220 700 260 820 160"
            stroke="rgba(138,130,120,0.22)"
            strokeWidth="1.25"
            strokeDasharray="5 7"
          />
          {/* Cross-zone routes on lg layout */}
          <path d="M180 180 L450 320 L720 180" stroke="rgba(74,124,155,0.12)" strokeWidth="1" strokeDasharray="4 6" />
          <path d="M180 420 L450 320 L720 420" stroke="rgba(74,124,155,0.12)" strokeWidth="1" strokeDasharray="4 6" />
        </svg>

        <span className="mission-pin mission-pin-pulse bg-tahoe/50 text-tahoe top-[28%] left-[22%] hidden lg:block" />
        <span className="mission-pin mission-pin-pulse bg-pine/50 text-pine top-[28%] left-[78%] hidden lg:block [animation-delay:0.8s]" />
        <span className="mission-pin mission-pin-pulse bg-stone/50 text-stone top-[72%] left-[22%] hidden lg:block [animation-delay:1.6s]" />
        <span className="mission-pin mission-pin-pulse bg-stone/40 text-stone top-[72%] left-[78%] hidden lg:block [animation-delay:2.4s]" />
        <span className="mission-pin bg-tahoe/30 text-tahoe top-[50%] left-[50%] hidden lg:block" />
      </div>

      <div className="relative glass-panel rounded-2xl border-0 shadow-none bg-white/75 backdrop-blur-md m-1 md:m-1.5">
        {/* Map header */}
        <div className="border-b border-sand-dark/30 px-6 md:px-8 py-5 md:py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <div>
              <p className="field-label mb-2">Expedition map</p>
              <h3 className="font-serif text-xl md:text-2xl text-foreground">
                Tahoe learning map
              </h3>
            </div>

            <div className="flex flex-wrap gap-4 lg:gap-6">
              {mapMeta.map((item) => (
                <div key={item.label} className="min-w-[7rem]">
                  <p className="field-label opacity-60">{item.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="text-left lg:text-right shrink-0">
              <p className="font-mono text-[0.65rem] text-stone tracking-wider">
                SCALE 1:48,000
              </p>
              <p className="font-mono text-[0.65rem] text-stone/60 tracking-wider mt-1">
                FIELD SKETCH · v0
              </p>
            </div>
          </div>
        </div>

        {/* Zone grid — diamond layout on lg */}
        <div className="p-5 md:p-7 lg:p-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 gap-4 md:gap-5">
            {/* Center lake node — lg only */}
            <div
              className="hidden lg:flex lg:col-start-2 lg:row-start-2 flex-col items-center justify-center rounded-2xl border border-dashed border-tahoe/25 bg-tahoe/[0.04] p-6 text-center"
              aria-hidden="true"
            >
              <span className="mission-pin bg-tahoe/60 text-tahoe relative top-0 left-0 transform-none mb-3" />
              <p className="field-label text-tahoe/70">Center</p>
              <p className="font-serif text-lg text-tahoe mt-1">Tahoe Basin</p>
              <p className="mt-1 font-mono text-[0.6rem] text-stone/60">open-world classroom</p>
            </div>

            {zones.map((zone, i) => {
              const meta = zoneMeta[i] ?? zoneMeta[0];
              const styles = accentStyles[meta.accent];

              return (
                <article
                  key={zone.name}
                  className={`group zone-card relative rounded-xl border bg-card/92 backdrop-blur-sm p-5 md:p-6 card-premium-inner ${meta.gridClass} ${styles.border} ${styles.bg}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${styles.border} bg-background/80`}
                        aria-hidden="true"
                      >
                        <span className={`h-2.5 w-2.5 rounded-full ${styles.dot} mission-pin-pulse`} />
                      </span>
                      <div>
                        <p className="field-label opacity-60">zone {meta.id}</p>
                        <h4 className={`font-semibold leading-snug ${styles.label}`}>
                          {zone.name}
                        </h4>
                      </div>
                    </div>
                    <span className="field-label opacity-40 shrink-0 hidden sm:block">
                      node
                    </span>
                  </div>

                  <ul className="flex flex-wrap gap-1.5">
                    {zone.concepts.map((concept) => (
                      <li
                        key={concept}
                        className="rounded-md bg-sand/40 px-2 py-0.5 text-xs text-foreground list-none border border-sand-dark/25"
                      >
                        {concept}
                      </li>
                    ))}
                  </ul>

                  <div
                    className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-200 text-tahoe"
                    aria-hidden="true"
                  />
                </article>
              );
            })}
          </div>
        </div>

        {/* Map footer coordinates */}
        <div className="border-t border-sand-dark/25 px-6 md:px-8 py-3 flex flex-wrap justify-between gap-2">
          <p className="font-mono text-[0.6rem] text-stone/55 tracking-wider">
            39.0968° N · 120.0324° W
          </p>
          <p className="field-label opacity-50">Meta Academy Tahoe · concept pilot</p>
        </div>
      </div>
    </div>
  );
}
