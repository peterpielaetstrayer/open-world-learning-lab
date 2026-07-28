import type { ReactNode } from "react";

interface FieldAtlasFrameProps {
  figureNumber?: string;
  projectId?: string;
  caption?: string;
  coordinates?: string;
  scale?: string;
  showCropMarks?: boolean;
  routeMarks?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function FieldAtlasFrame({
  figureNumber,
  projectId,
  caption,
  coordinates,
  scale = "1:48,000",
  showCropMarks = true,
  routeMarks,
  children,
  className = "",
}: FieldAtlasFrameProps) {
  return (
    <figure className={`relative ${className}`}>
      <div className="relative rounded-lg border border-border bg-page overflow-hidden">
        {showCropMarks && (
          <div className="pointer-events-none absolute inset-3 z-10" aria-hidden="true">
            <span className="absolute top-0 left-0 h-3 w-3 border-t border-l border-ink/20" />
            <span className="absolute top-0 right-0 h-3 w-3 border-t border-r border-ink/20" />
            <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-ink/20" />
            <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-ink/20" />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5 text-metadata">
          <div className="flex items-center gap-3">
            {figureNumber && (
              <span className="font-mono text-quiet">Fig. {figureNumber}</span>
            )}
            {projectId && (
              <span className="font-mono text-secondary">{projectId}</span>
            )}
          </div>
          <div className="flex items-center gap-4 font-mono text-quiet">
            {scale && <span>Scale {scale}</span>}
            {coordinates && <span>{coordinates}</span>}
          </div>
        </div>

        <div className="relative">{children}</div>

        {routeMarks && (
          <div className="border-t border-border px-4 py-2">{routeMarks}</div>
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 max-w-reading text-sm text-secondary leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
