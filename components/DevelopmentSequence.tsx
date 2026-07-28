import { projectDevelopmentSequence } from "@/content/projects";
import type { Project } from "@/content/projects";

interface DevelopmentSequenceProps {
  projects?: Project[];
}

const projectPositions: Record<string, number> = {
  "open-world-tahoe": 1,
  "open-world-saturdays": 2,
  "first-landing": 4,
  locus: 4,
};

export default function DevelopmentSequence({ projects = [] }: DevelopmentSequenceProps) {
  const activeSlugs = new Set(projects.map((p) => p.slug));

  return (
    <div className="max-w-4xl">
      <p className="font-mono text-metadata text-quiet mb-6">Project development sequence</p>

      <ol className="sr-only">
        {projectDevelopmentSequence.map((step, i) => (
          <li key={step}>
            {i + 1}. {step}
          </li>
        ))}
      </ol>

      {/* Desktop stepped progression */}
      <div className="hidden sm:block" aria-hidden="true">
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-px bg-border" />
          <ol className="relative flex flex-wrap gap-y-6 justify-between list-none">
            {projectDevelopmentSequence.map((step, i) => {
              const isActive = Object.entries(projectPositions).some(
                ([slug, pos]) => pos === i && activeSlugs.has(slug)
              );
              return (
                <li key={step} className="flex flex-col items-center w-[10%] min-w-[4.5rem] text-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-[0.6rem] font-mono ${
                      isActive
                        ? "border-water bg-water/10 text-water font-medium"
                        : "border-border bg-page text-quiet"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 text-[0.65rem] leading-tight text-secondary">{step}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Mobile vertical */}
      <ol className="sm:hidden relative list-none pl-6 border-l border-border space-y-4" aria-hidden="true">
        {projectDevelopmentSequence.map((step, i) => {
          const isActive = Object.entries(projectPositions).some(
            ([slug, pos]) => pos === i && activeSlugs.has(slug)
          );
          return (
            <li key={step} className="relative">
              <span
                className={`absolute -left-[calc(0.75rem+1px)] top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[0.55rem] font-mono ${
                  isActive ? "bg-water/10 text-water border border-water/30" : "bg-page text-quiet border border-border"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-sm text-secondary">{step}</span>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-sm text-secondary leading-relaxed max-w-reading">
        Not every project will move through this sequence identically. Some remain origin studies; others advance toward pilot design or product prototype.
      </p>
    </div>
  );
}
