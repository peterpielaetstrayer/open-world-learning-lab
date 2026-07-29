import { learningLoopStages } from "@/content/learning-loop";

function stagePosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const radius = 280;
  return {
    left: `${50 + (Math.cos(angle) * radius) / 8}%`,
    top: `${50 + (Math.sin(angle) * radius) / 8}%`,
  };
}

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

      <div
        className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:overflow-visible sm:px-0"
        aria-hidden="true"
      >
        <div className="relative mx-auto w-full min-w-[21rem] max-w-4xl py-4 sm:py-6 md:py-8">
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
              markerEnd="url(#learning-loop-arrowhead)"
            />
            <defs>
              <marker
                id="learning-loop-arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="var(--color-moss)" fillOpacity="0.4" />
              </marker>
            </defs>
          </svg>

          <div className="relative mx-auto aspect-square w-full max-w-[800px]">
            {learningLoopStages.map((stage, i) => {
              const position = stagePosition(i, learningLoopStages.length);
              const label = stage.shortTitle ?? stage.title;

              return (
                <div
                  key={stage.id}
                  className="absolute w-[4.5rem] sm:w-28 md:w-32 lg:w-44 -translate-x-1/2 -translate-y-1/2 border-l-2 border-water/30 pl-1.5 sm:pl-2 md:pl-3"
                  style={position}
                >
                  <span className="font-mono text-[0.625rem] sm:text-metadata text-water">
                    {String(stage.number).padStart(2, "0")}
                  </span>
                  <p className="mt-0.5 text-[0.6875rem] sm:text-xs md:text-sm font-medium text-ink leading-snug">
                    <span className="md:hidden">{label}</span>
                    <span className="hidden md:inline">{stage.title}</span>
                  </p>
                  <p className="mt-1 hidden lg:block text-xs text-secondary leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              );
            })}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-3 sm:px-6">
              <p className="font-mono text-[0.625rem] sm:text-metadata text-quiet">Learning loop</p>
              <p className="mt-0.5 sm:mt-1 font-serif text-base sm:text-display-sm text-ink">
                Experience → Return
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
