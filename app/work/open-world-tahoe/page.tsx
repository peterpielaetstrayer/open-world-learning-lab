import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RelatedWork from "@/components/RelatedWork";
import TahoeExperience from "@/components/tahoe/TahoeExperience";
import { projects } from "@/content/projects";
import { getReleasesForProject } from "@/content/releases";
import { createPageMetadata } from "@/lib/metadata";
import "./tahoe.css";

export const metadata: Metadata = createPageMetadata({
  title: "Open World Tahoe — The Living Field Atlas",
  description:
    "The Tahoe origin study that began Open World Learning Lab. Explore four conceptual learning zones, a movement-inquiry example, and sample field missions.",
  path: "/work/open-world-tahoe",
});

export default function OpenWorldTahoePage() {
  const relatedReleases = getReleasesForProject("open-world-tahoe");
  const otherProjects = projects.filter((p) => p.slug !== "open-world-tahoe").slice(0, 3);

  return (
    <>
      <Header />
      <TahoeExperience />
      <aside className="tahoe-related" aria-label="Related OWLL work">
        <div className="tahoe-container">
          <RelatedWork projects={otherProjects} releases={relatedReleases} />
        </div>
      </aside>
      <Footer />
    </>
  );
}
