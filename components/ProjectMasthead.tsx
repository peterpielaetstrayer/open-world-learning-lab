import type { ReactNode } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareActions from "@/components/ShareActions";
import StatusBadge from "@/components/StatusBadge";
import ConceptNotice from "@/components/ConceptNotice";
import WideContainer from "@/components/layout/WideContainer";
import type { ProjectStatus } from "@/content/statuses";

interface ProjectMastheadProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  projectType: string;
  status: ProjectStatus;
  summary: string;
  statusNotice: string;
  metadataRail?: ReactNode;
  children?: ReactNode;
}

export default function ProjectMasthead({
  title,
  breadcrumbs,
  projectType,
  status,
  summary,
  statusNotice,
  metadataRail,
  children,
}: ProjectMastheadProps) {
  return (
    <header className="border-b border-border bg-soft-paper/20 texture-paper">
      <WideContainer className="py-8 md:py-14 lg:py-16">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6 md:mt-8 max-w-reading">
          <StatusBadge projectType={projectType} status={status} layout="stacked" className="mb-3 md:mb-4" />
          <h1 className="font-serif text-page-title text-ink leading-tight tracking-tight text-balance">
            {title}
          </h1>
          <p className="mt-4 md:mt-5 text-body-lg text-secondary leading-relaxed">
            {summary}
          </p>

          <ShareActions showPrint className="mt-6 md:mt-8" />

          <ConceptNotice className="mt-5 md:mt-6">{statusNotice}</ConceptNotice>

          {metadataRail && <div className="mt-8">{metadataRail}</div>}
        </div>

        {children}
      </WideContainer>
    </header>
  );
}
