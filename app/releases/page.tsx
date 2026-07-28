import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import ReleaseCard from "@/components/ReleaseCard";
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
      <main className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader
            eyebrow="Public work"
            title="A growing record of ideas, systems, and prototypes."
            intro="Each release identifies what it is, its publication status, version, whether it is conceptual or tested, and its publication date. Specific licenses apply only when explicitly noted."
          />

          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {releases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>

          <p className="mt-12 text-sm text-muted max-w-2xl">
            Additional releases will be published as the work develops. No download is offered unless a specific file has been deliberately released.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
