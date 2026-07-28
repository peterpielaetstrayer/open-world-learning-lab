const journeySteps = [
  { id: "arrive", label: "Arrive", description: "Enter a meaningful place with mentor support." },
  { id: "reorient", label: "Reorient", description: "Reestablish physical and mental bearings." },
  { id: "notice", label: "Notice", description: "Practice observation before explanation." },
  { id: "question", label: "Question", description: "Follow genuine curiosity into inquiry." },
  { id: "practice", label: "Practice", description: "Apply skills through field-based learning." },
  { id: "continue", label: "Create and Continue", description: "Produce an artifact; transition toward future learning." },
];

export default function SaturdaysJourney() {
  return (
    <div>
      <ol className="sr-only">
        {journeySteps.map((step) => (
          <li key={step.id}>
            {step.label}: {step.description}
          </li>
        ))}
      </ol>

      <div className="relative max-w-3xl py-4" aria-hidden="true">
        <svg viewBox="0 0 600 120" className="w-full h-24 mb-6 hidden sm:block">
          <path
            d="M30 60 C120 30 200 40 300 55 C400 70 480 45 570 60"
            fill="none"
            stroke="var(--color-moss)"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          {journeySteps.map((step, i) => {
            const x = 30 + (i / (journeySteps.length - 1)) * 540;
            const y = 60 - Math.sin((i / journeySteps.length) * Math.PI) * 25;
            return (
              <g key={step.id}>
                <circle cx={x} cy={y} r="5" fill="var(--color-moss)" fillOpacity="0.5" />
                <text x={x} y={y + 22} textAnchor="middle" fontSize="9" fill="var(--color-ink)">{step.label}</text>
              </g>
            );
          })}
        </svg>

        <ol className="sm:hidden relative list-none pl-6 border-l border-moss/25 space-y-6">
          {journeySteps.map((step) => (
            <li key={step.id} className="relative">
              <span className="absolute -left-[calc(0.75rem+1px)] top-1 h-3 w-3 rounded-full bg-moss/40" />
              <p className="font-medium text-ink">{step.label}</p>
              <p className="mt-1 text-sm text-secondary">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="hidden sm:grid sm:grid-cols-3 gap-4 mt-2">
          {journeySteps.map((step) => (
            <div key={step.id} className="text-sm">
              <p className="font-medium text-ink">{step.label}</p>
              <p className="mt-1 text-secondary text-xs leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PartnerEcosystem({ partners }: { partners: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {partners.map((partner) => (
        <span
          key={partner}
          className="rounded-md border border-border bg-soft-paper/40 px-3 py-1.5 text-sm text-secondary"
        >
          {partner}
        </span>
      ))}
    </div>
  );
}
