import { learningLoopStages } from "@/content/shared";

export default function LearningLoop() {
  return (
    <div className="relative">
      <p className="text-center text-sm text-muted mb-10 max-w-2xl mx-auto">
        The loop does not end with an answer. It changes what the learner is able to notice next.
      </p>

      {/* Desktop circular/connected layout */}
      <div className="hidden lg:block relative mx-auto max-w-4xl">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 800 800"
          aria-hidden="true"
        >
          <circle
            cx="400"
            cy="400"
            r="280"
            fill="none"
            stroke="rgba(74,124,155,0.15)"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          <circle
            cx="400"
            cy="400"
            r="200"
            fill="rgba(74,124,155,0.03)"
            stroke="rgba(74,124,155,0.08)"
            strokeWidth="1"
          />
        </svg>

        <div className="relative aspect-square max-w-[800px] mx-auto">
          {learningLoopStages.map((stage, i) => {
            const angle = (i / learningLoopStages.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 280;
            const x = 50 + (Math.cos(angle) * radius) / 8;
            const y = 50 + (Math.sin(angle) * radius) / 8;

            return (
              <article
                key={stage.number}
                className="absolute w-44 -translate-x-1/2 -translate-y-1/2 card-premium p-4 hover:border-tahoe/30 transition-colors"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-tahoe/10 text-xs font-medium text-tahoe border border-tahoe/20">
                  {stage.number}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-foreground leading-snug">
                  {stage.title}
                </h3>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  {stage.description}
                </p>
              </article>
            );
          })}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6">
            <p className="field-label text-tahoe/70">Learning loop</p>
            <p className="mt-1 font-serif text-lg text-foreground">Experience → Return</p>
          </div>
        </div>
      </div>

      {/* Mobile/tablet vertical sequence */}
      <ol className="lg:hidden space-y-4 max-w-xl mx-auto">
        {learningLoopStages.map((stage, i) => (
          <li key={stage.number} className="relative list-none">
            <article className="card-premium p-5 flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tahoe/10 text-sm font-medium text-tahoe border border-tahoe/20">
                {stage.number}
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{stage.title}</h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </article>
            {i < learningLoopStages.length - 1 && (
              <div className="flex justify-center py-1" aria-hidden="true">
                <span className="h-4 w-px bg-tahoe/25" />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
