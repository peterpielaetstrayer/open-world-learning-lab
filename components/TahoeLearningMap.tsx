interface Zone {
  name: string;
  concepts: string[];
}

interface TahoeLearningMapProps {
  zones: Zone[];
}

const zoneMeta = [
  { id: "01", marker: { top: "22%", left: "28%" }, accent: "tahoe" },
  { id: "02", marker: { top: "18%", left: "72%" }, accent: "pine" },
  { id: "03", marker: { top: "68%", left: "22%" }, accent: "stone" },
  { id: "04", marker: { top: "72%", left: "78%" }, accent: "sand" },
];

const accentStyles = {
  tahoe: {
    label: "text-tahoe",
    border: "border-tahoe/30 hover:border-tahoe/50",
    bg: "hover:bg-tahoe/[0.04]",
    dot: "bg-tahoe",
  },
  pine: {
    label: "text-pine",
    border: "border-pine/30 hover:border-pine/50",
    bg: "hover:bg-pine/[0.04]",
    dot: "bg-pine",
  },
  stone: {
    label: "text-stone",
    border: "border-stone/30 hover:border-stone/50",
    bg: "hover:bg-stone/[0.04]",
    dot: "bg-stone",
  },
  sand: {
    label: "text-foreground",
    border: "border-sand-dark/50 hover:border-sand-dark/80",
    bg: "hover:bg-sand/30",
    dot: "bg-stone",
  },
};

export default function TahoeLearningMap({ zones }: TahoeLearningMapProps) {
  return (
    <div className="mt-14 relative rounded-2xl border border-sand-dark/50 bg-background pattern-map-texture overflow-hidden">
      {/* Decorative map canvas */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* Abstract lake silhouette */}
          <path
            d="M280 210 C340 170 460 165 520 195 C580 225 590 280 550 320 C500 370 380 380 310 350 C240 320 220 250 280 210 Z"
            fill="rgba(74,124,155,0.07)"
            stroke="rgba(74,124,155,0.15)"
            strokeWidth="1"
          />
          {/* Contour lines */}
          <ellipse cx="400" cy="260" rx="200" ry="120" stroke="rgba(74,124,155,0.1)" strokeWidth="0.75" />
          <ellipse cx="400" cy="260" rx="160" ry="95" stroke="rgba(74,124,155,0.08)" strokeWidth="0.75" />
          <ellipse cx="400" cy="260" rx="120" ry="70" stroke="rgba(45,90,71,0.08)" strokeWidth="0.75" />
          <ellipse cx="400" cy="260" rx="80" ry="48" stroke="rgba(45,90,71,0.06)" strokeWidth="0.75" />
          {/* Route path */}
          <path
            d="M120 380 C200 300 280 340 400 280 C520 220 600 260 680 180"
            stroke="rgba(138,130,120,0.25)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          {/* Mission markers on map canvas */}
        </svg>

        {zoneMeta.map((z) => (
          <span
            key={z.id}
            className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${accentStyles[z.accent as keyof typeof accentStyles].dot} opacity-40`}
            style={{ top: z.marker.top, left: z.marker.left }}
          />
        ))}
      </div>

      <div className="relative p-6 md:p-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <p className="field-label mb-2">Expedition map</p>
            <h3 className="font-serif text-xl md:text-2xl text-foreground">
              Tahoe learning map
            </h3>
          </div>
          <div className="text-right">
            <p className="font-mono text-[0.65rem] text-stone tracking-wider">
              SCALE 1:48,000
            </p>
            <p className="font-mono text-[0.65rem] text-stone/70 tracking-wider mt-1">
              FIELD SKETCH · v0
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {zones.map((zone, i) => {
            const meta = zoneMeta[i] ?? zoneMeta[0];
            const styles = accentStyles[meta.accent as keyof typeof accentStyles];

            return (
              <article
                key={zone.name}
                className={`group relative rounded-xl border bg-card/90 backdrop-blur-sm p-5 transition-colors duration-200 ${styles.border} ${styles.bg}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border ${styles.border} ${styles.bg}`}
                      aria-hidden="true"
                    >
                      <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                    </span>
                    <div>
                      <p className="field-label opacity-70">zone {meta.id}</p>
                      <h4 className={`font-semibold ${styles.label}`}>
                        {zone.name}
                      </h4>
                    </div>
                  </div>
                  <span className="field-label opacity-50">mission node</span>
                </div>

                <ul className="flex flex-wrap gap-1.5">
                  {zone.concepts.map((concept) => (
                    <li
                      key={concept}
                      className="rounded-md bg-sand/50 px-2 py-0.5 text-xs text-foreground list-none border border-sand-dark/30"
                    >
                      {concept}
                    </li>
                  ))}
                </ul>

                {/* Thin route accent on hover */}
                <div
                  className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-tahoe/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
