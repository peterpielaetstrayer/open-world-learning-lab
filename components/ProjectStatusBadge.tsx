import type { ProjectStatus } from "@/content/statuses";
import { getStatusBadgeClass, getStatusLabel } from "@/content/statuses";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export default function ProjectStatusBadge({
  status,
  className = "",
}: ProjectStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(status)} ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
