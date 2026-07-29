import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import ReleaseCover, { releaseTypeToVariant } from "@/components/ReleaseCover";
import WideContainer from "@/components/layout/WideContainer";
import { createPageMetadata } from "@/lib/metadata";
import { releases } from "@/content/releases";

export const metadata: Metadata = createPageMetadata({
  title: "Releases — Open World Learning Lab",
  description:
    "Public briefs, system maps, pilot sketches, and design studies from Open World Learning Lab.",
  path: "/releases",
});

export default function ReleasesPage() {
  const [featured, ...rest] = releases;

  return (
    <>
      <Header />
      <main className="py-section-y-page">
        <WideContainer>
          <SectionHeader
            eyebrow="Public work"
            title="A growing record of ideas, systems, and prototypes."
            intro="Each release identifies what it is, its publication status, version, whether it is conceptual or tested, and its publication date. Specific licenses apply only when explicitly noted."
          />

          {featured && (
            <div className="mb-6 md:mb-8">
              <ReleaseCover
                releaseId={featured.subtitle}
                title={featured.title}
                releaseType={featured.releaseType}
                version={featured.version}
                date={featured.publishedAt}
                visualVariant={releaseTypeToVariant(featured.releaseType)}
                href={featured.href}
                summary={featured.summary}
              />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {rest.map((release) => (
              <ReleaseCover
                key={release.id}
                releaseId={release.subtitle}
                title={release.title}
                releaseType={release.releaseType}
                version={release.version}
                date={release.publishedAt}
                visualVariant={releaseTypeToVariant(release.releaseType)}
                href={release.href}
                summary={release.summary}
                compact
                className="h-full"
              />
            ))}
          </div>

          <p className="mt-8 md:mt-12 text-sm text-secondary max-w-reading">
            Additional releases will be published as the work develops. No download is offered unless a specific file has been deliberately released.
          </p>
        </WideContainer>
      </main>
      <Footer />
    </>
  );
}
