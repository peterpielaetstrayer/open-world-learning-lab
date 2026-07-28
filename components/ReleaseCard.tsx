import Link from "next/link";
import type { Release } from "@/content/releases";
import ProjectStatusBadge from "./ProjectStatusBadge";

interface ReleaseCardProps {
  release: Release;
}

export default function ReleaseCard({ release }: ReleaseCardProps) {
  const isExternalSection = release.href.startsWith("/#");
  const actionLabel = release.slug === "owll-at-a-glance" ? "View Brief" : "Read Online";

  return (
    <article className="card-premium card-lift group flex flex-col h-full hover:border-tahoe/30 overflow-hidden">
      <div className="border-b border-sand-dark/30 bg-gradient-to-r from-sand/30 to-transparent px-6 py-3 flex items-center justify-between gap-2">
        <span className="field-label text-tahoe/70">{release.releaseType}</span>
        <ProjectStatusBadge status={release.status} />
      </div>

      <div className="p-6 md:p-7 flex flex-col flex-grow">
        <p className="field-label opacity-60">{release.subtitle}</p>
        <h3 className="mt-1 font-serif text-xl text-foreground leading-snug">
          {isExternalSection ? (
            <a href={release.href} className="hover:text-tahoe transition-colors focus-visible:rounded-sm">
              {release.title}
            </a>
          ) : (
            <Link href={release.href} className="hover:text-tahoe transition-colors focus-visible:rounded-sm">
              {release.title}
            </Link>
          )}
        </h3>

        <p className="mt-3 text-sm text-muted leading-relaxed flex-grow">
          {release.summary}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone">
          <span>v{release.version}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={release.publishedAt}>
            {new Date(release.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          {release.license && (
            <>
              <span aria-hidden="true">·</span>
              <span>{release.license}</span>
            </>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {isExternalSection ? (
            <a
              href={release.href}
              className="text-sm font-medium text-tahoe hover:text-pine transition-colors focus-visible:rounded-sm"
            >
              {actionLabel}
            </a>
          ) : (
            <Link
              href={release.href}
              className="text-sm font-medium text-tahoe hover:text-pine transition-colors focus-visible:rounded-sm"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
