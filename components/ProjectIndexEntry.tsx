import Link from "next/link";
import type { Project } from "@/content/projects";
import { getProjectTheme } from "@/content/project-themes";
import { getVisualAsset } from "@/content/visual-assets";
import StatusBadge from "@/components/StatusBadge";
import VisualPlate from "@/components/visual/VisualPlate";
import VisualFallback from "@/components/visual/VisualFallback";

interface ProjectIndexEntryProps {
  project: Project;
  index?: number;
  layout?: "editorial" | "featured" | "compact";
}

const previewAssetKeys: Record<string, string> = {
  "first-landing": "first-landing-coastal-systems",
  locus: "locus-system-spine",
};

export default function ProjectIndexEntry({
  project,
  index = 0,
  layout = "editorial",
}: ProjectIndexEntryProps) {
  const theme = getProjectTheme(project.slug);
  const previewKey = previewAssetKeys[project.slug];
  const previewAsset = previewKey ? getVisualAsset(previewKey) : undefined;
  const hasPreviewImage = Boolean(previewAsset?.desktopSrc);

  if (layout === "featured") {
    return (
      <article className="group grid gap-6 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-10 items-start">
        <Link
          href={project.href}
          className="block overflow-hidden rounded-lg border border-border focus-visible:rounded-lg"
          aria-hidden="true"
          tabIndex={-1}
        >
          {hasPreviewImage ? (
            <VisualPlate
              assetKey={previewKey}
              theme={previewAsset!.theme}
              variant="project-preview"
              showCaption={false}
              frameClassName="!aspect-[16/10]"
            />
          ) : (
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-soft-paper">
              <VisualFallback
                theme={theme.key}
                variant={
                  project.slug === "open-world-saturdays"
                    ? "journey"
                    : project.slug === "open-world-tahoe"
                      ? "zones"
                      : "landscape"
                }
                className="absolute inset-0"
              />
            </div>
          )}
        </Link>

        <div className="min-w-0 border-l-2 pl-6" style={{ borderColor: theme.accent }}>
          <StatusBadge projectType={project.projectType} status={project.status} className="mb-3" />
          <h3 className="font-serif text-2xl text-ink leading-snug group-hover:text-water transition-colors">
            <Link href={project.href}>{project.title}</Link>
          </h3>
          <p className="mt-3 max-w-reading text-body text-secondary leading-relaxed">
            {project.summary}
          </p>
          <Link
            href={project.href}
            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-water hover:text-moss transition-colors"
          >
            View project
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    );
  }

  if (layout === "compact") {
    return (
      <article
        className="group grid gap-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6 items-start"
      >
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-soft-paper"
          aria-hidden="true"
        >
          <VisualFallback
            theme={theme.key}
            variant={
              project.slug === "open-world-saturdays" ? "journey" : "zones"
            }
            className="absolute inset-0"
          />
        </div>

        <div className="min-w-0">
          <StatusBadge projectType={project.projectType} status={project.status} className="mb-2" />
          <h3 className="font-serif text-xl text-ink leading-snug group-hover:text-water transition-colors">
            <Link href={project.href}>{project.title}</Link>
          </h3>
          <p className="mt-2 text-sm text-secondary leading-relaxed line-clamp-3">
            {project.summary}
          </p>
          <Link
            href={project.href}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-water hover:text-moss transition-colors"
          >
            View project
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    );
  }

  const stagger = index % 2 === 1 ? "lg:ml-12" : "";

  return (
    <article
      className={`group relative border-l-2 pl-6 py-2 ${stagger}`}
      style={{ borderColor: theme.accent }}
    >
      <div
        className="absolute -left-[5px] top-3 h-2 w-2 rounded-full"
        style={{ backgroundColor: theme.accent }}
        aria-hidden="true"
      />

      <StatusBadge projectType={project.projectType} status={project.status} className="mb-2" />

      <h3 className="font-serif text-xl text-ink leading-snug group-hover:text-water transition-colors">
        <Link href={project.href}>{project.title}</Link>
      </h3>

      <p className="mt-2 max-w-reading text-body text-secondary leading-relaxed">
        {project.summary}
      </p>

      <Link
        href={project.href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-water hover:text-moss transition-colors"
      >
        View project
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
