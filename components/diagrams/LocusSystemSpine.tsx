const spineNodes = [
  { id: "world", label: "World", role: "Environment", tier: "context" },
  { id: "learner", label: "Learner", role: "Experience", tier: "learner" },
  { id: "field-notes", label: "Field Notes", role: "Capture", tier: "learner" },
  { id: "journey", label: "Journey Layer", role: "Structure", tier: "system" },
  { id: "mentor", label: "Mentor Layer", role: "Human judgment", tier: "human" },
  { id: "atlas", label: "Learning Atlas", role: "Cumulative record", tier: "system" },
  { id: "creator", label: "Creator Layer", role: "Design work", tier: "human" },
  { id: "artifact", label: "Artifact", role: "Creation", tier: "learner" },
  { id: "return", label: "Return", role: "Reflection", tier: "learner" },
];

const tierStyles: Record<string, string> = {
  context: "border-water/30 bg-water/5",
  learner: "border-moss/30 bg-moss/5",
  human: "border-sun-marker/30 bg-sun-marker/5",
  system: "border-deep-field/20 bg-deep-field/5",
};

export default function LocusSystemSpine() {
  return (
    <div>
      <p className="mb-8 max-w-reading text-body text-secondary">
        LOCUS connects learner experience, human mentorship, creator work, and a cumulative learning record. Labels remain conceptual — not live system data.
      </p>

      <ol className="sr-only">
        {spineNodes.map((node) => (
          <li key={node.id}>
            {node.label}: {node.role}
          </li>
        ))}
      </ol>

      {/* Desktop horizontal spine */}
      <div className="hidden md:block overflow-x-auto" aria-hidden="true">
        <div className="relative min-w-[720px] py-6">
          <div className="absolute top-1/2 left-8 right-8 h-px bg-border-strong" />
          <div className="relative flex justify-between gap-2 px-4">
            {spineNodes.map((node) => (
              <div key={node.id} className="flex flex-col items-center w-20 text-center">
                <div className={`rounded-md border px-2 py-2 ${tierStyles[node.tier]}`}>
                  <p className="text-xs font-medium text-ink leading-tight">{node.label}</p>
                </div>
                <p className="mt-2 font-mono text-[0.6rem] text-quiet leading-tight">{node.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile vertical spine */}
      <ol className="md:hidden relative max-w-reading list-none pl-6 border-l-2 border-deep-field/15" aria-hidden="true">
        {spineNodes.map((node) => (
          <li key={node.id} className="relative pb-6 last:pb-0">
            <span className="absolute -left-[calc(0.75rem+1px)] top-1 block h-3 w-3 rounded-full bg-water/40 border-2 border-page" />
            <div className={`inline-block rounded-md border px-3 py-2 ${tierStyles[node.tier]}`}>
              <p className="text-sm font-medium text-ink">{node.label}</p>
              <p className="font-mono text-metadata text-quiet">{node.role}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-4 font-mono text-metadata text-quiet">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-water/50" /> Learner experience</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sun-marker/50" /> Human judgment</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-deep-field/30" /> System layers</span>
      </div>
    </div>
  );
}
