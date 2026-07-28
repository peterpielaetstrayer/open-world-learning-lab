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
  return (
    <>
      <Header />
      <main className="py-section-y">
        <WideContainer>
          <SectionHeader
            eyebrow="Public work"
            title="A growing record of ideas, systems, and prototypes."
            intro="Each release identifies what it is, its publication status, version, whether it is conceptual or tested, and its publication date. Specific licenses apply only when explicitly noted."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {releases.map((release) => (
              <div key={release.id} className="flex flex-col">
                <ReleaseCover
                  releaseId={release.subtitle}
                  title={release.title}
                  releaseType={release.releaseType}
                  version={release.version}
                  date={release.publishedAt}
                  visualVariant={releaseTypeToVariant(release.releaseType)}
                  href={release.href}
                  className="flex-1"
                />
                <p className="mt-3 text-sm text-secondary leading-relaxed px-1">
                  {release.summary}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-secondary max-w-reading">
            Additional releases will be published as the work develops. No download is offered unless a specific file has been deliberately released.
          </p>
        </WideContainer>
      </main>
      <Footer />
    </>
  );
}
