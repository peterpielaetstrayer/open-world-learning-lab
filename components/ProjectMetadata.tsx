import type { ProjectStatus } from "@/content/statuses";
import ProjectStatusBadge from "./ProjectStatusBadge";

interface ProjectMetadataProps {
  projectType: string;
  status: ProjectStatus;
  summary: string;
}

export default function ProjectMetadata({
  projectType,
  status,
  summary,
}: ProjectMetadataProps) {
  return (
    <div className="card-premium p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="field-label">{projectType}</span>
        <ProjectStatusBadge status={status} />
      </div>
      <p className="text-lg text-muted leading-relaxed">{summary}</p>
    </div>
  );
}
