import type { ReactNode } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareActions from "@/components/ShareActions";
import StatusBadge from "@/components/StatusBadge";
import ConceptNotice from "@/components/ConceptNotice";
import VisualPlate from "@/components/visual/VisualPlate";
import type { ProjectStatus } from "@/content/statuses";
import type { VisualTheme } from "@/content/visual-assets";
import WideContainer from "@/components/layout/WideContainer";

interface ProjectMastheadProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  projectType: string;
  status: ProjectStatus;
  summary: string;
  statusNotice: string;
  visualAssetKey?: string;
  visualTheme?: VisualTheme;
  metadataRail?: ReactNode;
}

export default function ProjectMasthead({
  title,
  breadcrumbs,
  projectType,
  status,
  summary,
  statusNotice,
  visualAssetKey,
  visualTheme = "owll",
  metadataRail,
}: ProjectMastheadProps) {
  return (
    <header className="border-b border-border bg-soft-paper/20 texture-paper">
      <WideContainer className="py-10 md:py-14 lg:py-16">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14 items-start">
          <div className="min-w-0">
            <StatusBadge projectType={projectType} status={status} className="mb-4" />
            <h1 className="font-serif text-page-title text-ink leading-tight tracking-tight">
              {title}
            </h1>
            <p className="mt-5 max-w-reading text-body-lg text-secondary leading-relaxed">
              {summary}
            </p>

            <ShareActions showPrint className="mt-8" />

            <ConceptNotice className="mt-6">{statusNotice}</ConceptNotice>

            {metadataRail && (
              <div className="mt-8 lg:hidden">{metadataRail}</div>
            )}
          </div>

          <div className="min-w-0">
            <VisualPlate
              assetKey={visualAssetKey}
              theme={visualTheme}
              aspect="landscape"
              priority
            />
          </div>
        </div>

        {metadataRail && (
          <div className="hidden lg:block mt-10 max-w-xs">{metadataRail}</div>
        )}
      </WideContainer>
    </header>
  );
}
