import { learningLoopStages } from "@/content/learning-loop";

export default function LearningLoopDiagram() {
  return (
    <div className="relative">
      <p className="mb-6 md:mb-10 max-w-reading text-body text-secondary">
        The loop does not end with an answer. It changes what the learner is able to notice next.
      </p>

      {/* Screen reader accessible list — single semantic source */}
      <ol className="sr-only">
        {learningLoopStages.map((stage) => (
          <li key={stage.id}>
            {stage.number}. {stage.title}: {stage.description}
          </li>
        ))}
      </ol>

      {/* Desktop trail */}
      <div className="hidden lg:block" aria-hidden="true">
        <div className="relative mx-auto max-w-4xl py-8">
          <svg
            viewBox="0 0 800 800"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle
              cx="400"
              cy="400"
              r="280"
              fill="none"
              stroke="var(--color-water)"
              strokeOpacity="0.15"
              strokeWidth="1.5"
              strokeDasharray="8 6"
            />
            <path
              d="M400 120 A280 280 0 1 1 395 120"
              fill="none"
              stroke="var(--color-moss)"
              strokeOpacity="0.25"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--color-moss)" fillOpacity="0.4" />
              </marker>
            </defs>
          </svg>

          <div className="relative aspect-square max-w-[800px] mx-auto">
            {learningLoopStages.map((stage, i) => {
              const angle = (i / learningLoopStages.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 280;
              const x = 50 + (Math.cos(angle) * radius) / 8;
              const y = 50 + (Math.sin(angle) * radius) / 8;

              return (
                <div
                  key={stage.id}
                  className="absolute w-44 -translate-x-1/2 -translate-y-1/2 border-l-2 border-water/30 pl-3"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span className="font-mono text-metadata text-water">{String(stage.number).padStart(2, "0")}</span>
                  <p className="mt-1 text-sm font-medium text-ink leading-snug">{stage.title}</p>
                  <p className="mt-1 text-xs text-secondary leading-relaxed">{stage.description}</p>
                </div>
              );
            })}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6">
              <p className="font-mono text-metadata text-quiet">Learning loop</p>
              <p className="mt-1 font-serif text-display-sm text-ink">Experience → Return</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile vertical trail */}
      <ol className="lg:hidden relative max-w-reading mx-auto space-y-0 list-none pl-6 border-l border-water/20" aria-hidden="true">
        {learningLoopStages.map((stage, i) => (
          <li key={stage.id} className="relative pb-6 md:pb-8 last:pb-0">
            <span className="absolute -left-[calc(0.75rem+1px)] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-water/30 bg-page font-mono text-[0.65rem] text-water">
              {stage.number}
            </span>
            <p className="text-sm font-medium text-ink">{stage.title}</p>
            <p className="mt-1 text-sm text-secondary leading-relaxed">{stage.description}</p>
            {i === learningLoopStages.length - 1 && (
              <p className="mt-3 font-mono text-metadata text-moss">↩ Return to Experience</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
