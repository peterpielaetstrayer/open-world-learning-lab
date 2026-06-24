const environments = [
  {
    name: "Lake",
    zone: "01",
    accent: "text-tahoe",
    dot: "bg-tahoe/70",
    ring: "border-tahoe/25 bg-tahoe/5",
    concepts: ["ecology", "physics", "policy"],
  },
  {
    name: "Mountain",
    zone: "02",
    accent: "text-pine",
    dot: "bg-pine/70",
    ring: "border-pine/25 bg-pine/5",
    concepts: ["biomechanics", "risk", "feedback"],
  },
  {
    name: "Trail",
    zone: "03",
    accent: "text-stone",
    dot: "bg-stone/70",
    ring: "border-stone/30 bg-sand/40",
    concepts: ["geology", "navigation", "attention"],
  },
  {
    name: "Campfire",
    zone: "04",
    accent: "text-foreground",
    dot: "bg-stone/60",
    ring: "border-sand-dark/60 bg-sand/30",
    concepts: ["chemistry", "story", "civic conversation"],
  },
];

export default function WorldAsClassroomBand() {
  return (
    <div
      className="border-y border-sand-dark/40 bg-sand/20"
      aria-label="The world as classroom"
    >
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <p className="field-label">World as classroom</p>
          <p className="font-mono text-[0.65rem] text-stone/80 tracking-wider">
            39.0968° N · 120.0324° W · Tahoe basin
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {environments.map((env) => (
            <article
              key={env.name}
              className={`group rounded-xl border ${env.ring} p-4 md:p-5 card-lift`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${env.dot} mission-marker`}
                    aria-hidden="true"
                  />
                  <h3 className={`font-serif text-base md:text-lg ${env.accent}`}>
                    {env.name}
                  </h3>
                </div>
                <span className="field-label opacity-60">z{env.zone}</span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {env.concepts.map((concept) => (
                  <li
                    key={concept}
                    className="rounded-md bg-card/80 px-2 py-0.5 text-[0.7rem] text-muted list-none border border-sand-dark/30"
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
