import type { ProjectStatus } from "@/content/statuses";
import { getStatusLabel } from "@/content/statuses";

interface StatusBadgeProps {
  projectType?: string;
  status?: ProjectStatus;
  releaseType?: string;
  className?: string;
  layout?: "inline" | "stacked";
}

export default function StatusBadge({
  projectType,
  status,
  releaseType,
  className = "",
  layout = "inline",
}: StatusBadgeProps) {
  const typeLabel = projectType ?? releaseType;
  const statusLabel = status ? getStatusLabel(status) : undefined;

  if (!typeLabel && !statusLabel) return null;

  const accessibleLabel = [typeLabel, statusLabel].filter(Boolean).join(" · ");

  if (layout === "stacked") {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`} aria-label={accessibleLabel}>
        {typeLabel && (
          <span className="font-mono text-metadata text-secondary">{typeLabel}</span>
        )}
        {statusLabel && (
          <span className="inline-flex w-fit items-center rounded-md border border-border bg-soft-paper/60 px-2 py-0.5 font-mono text-metadata text-ink">
            {statusLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <p className={`font-mono text-metadata text-secondary ${className}`}>
      <span className="sr-only">{accessibleLabel}</span>
      {typeLabel && (
        <span aria-hidden="true">{typeLabel}</span>
      )}
      {typeLabel && statusLabel && (
        <span aria-hidden="true" className="mx-1.5 text-quiet">·</span>
      )}
      {statusLabel && (
        <span aria-hidden="true" className="text-ink">{statusLabel}</span>
      )}
    </p>
  );
}
