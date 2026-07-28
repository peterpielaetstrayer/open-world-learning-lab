import type { Metadata } from "next";
import Link from "next/link";
import ProjectPageLayout from "@/components/ProjectPageLayout";
import ProjectMetadata from "@/components/ProjectMetadata";
import RelatedWork from "@/components/RelatedWork";
import { createPageMetadata } from "@/lib/metadata";
import { getReleasesForProject } from "@/content/releases";

export const metadata: Metadata = createPageMetadata({
  title: "Open World Saturdays — Preliminary Concept",
  description:
    "A future mentor-supported Saturday learning experience designed to help learners rebuild motivation, self-awareness, confidence, and a relationship with learning through meaningful experiences in the world.",
  path: "/work/open-world-saturdays",
});

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-foreground mb-4">{title}</h2>
      <div className="space-y-4 text-muted leading-relaxed">{children}</div>
    </section>
  );
}

const possibleStructure = [
  "Small cohort",
  "Approved mentor",
  "Weekly Saturday experience",
  "Field-based learning",
  "Personal Field Notes",
  "Guided inquiry",
  "Individual and collaborative challenges",
  "Regular reflection",
  "Final learner-created artifact",
  "Transition into future learning opportunities",
];

const potentialPartners = [
  "Schools",
  "Counselors",
  "Libraries",
  "Parks",
  "Museums",
  "Community organizations",
  "AmeriCorps or mentor networks",
  "Homeschool and microschool communities",
  "Youth-serving nonprofits",
];

export default function OpenWorldSaturdaysPage() {
  const relatedReleases = getReleasesForProject("open-world-saturdays");

  return (
    <ProjectPageLayout
      title="Open World Saturdays"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Current Work", href: "/work" },
        { label: "Open World Saturdays" },
      ]}
      metadata={
        <ProjectMetadata
          projectType="Learner Reengagement Program"
          status="early-concept"
          summary="A future mentor-supported Saturday learning experience designed to help learners rebuild motivation, self-awareness, confidence, and a relationship with learning through meaningful experiences in the world."
        />
      }
      statusNotice="Open World Saturdays is an early concept. No cohort, school partnership, or public enrollment is currently being announced."
      related={<RelatedWork releases={relatedReleases} />}
    >
      <ContentSection title="Core premise">
        <p>
          Some learners do not need another conventional course added to the week. They need a carefully designed reentry into learning.
        </p>
        <p>Open World Saturdays explores what a six-to-ten-week journey might look like when learners:</p>
        <ul className="space-y-2 list-disc ml-5 mt-4">
          <li>Leave the conventional classroom</li>
          <li>Explore meaningful places</li>
          <li>Work with an approved mentor</li>
          <li>Reestablish physical and mental bearings</li>
          <li>Follow questions</li>
          <li>Practice observation</li>
          <li>Create something they care about</li>
          <li>Reflect on how they learn</li>
          <li>Experience themselves as capable again</li>
        </ul>
      </ContentSection>

      <ContentSection title="Possible structure">
        <p className="text-sm text-stone">The following is provisional and subject to change.</p>
        <ul className="mt-4 space-y-2">
          {possibleStructure.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-tahoe" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection title="Potential partners">
        <p className="text-sm text-stone">
          The following are possibilities under exploration, not commitments or confirmed partnerships.
        </p>
        <ul className="mt-4 grid sm:grid-cols-2 gap-2">
          {potentialPartners.map((partner) => (
            <li key={partner} className="text-sm flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pine/60" aria-hidden="true" />
              {partner}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection title="What currently exists">
        <p>
          An early concept document and public design sketch. No cohort, curriculum, mentor network, or partnership agreements have been finalized.
        </p>
      </ContentSection>

      <ContentSection title="What remains future work">
        <p>
          Program design, mentor selection and training, partnership development, safeguarding plans, pilot location identification, and evaluation framework.
        </p>
      </ContentSection>

      <div className="pt-6">
        <Link href="/work" className="text-sm font-medium text-tahoe hover:text-pine transition-colors">
          ← View all current work
        </Link>
      </div>
    </ProjectPageLayout>
  );
}
