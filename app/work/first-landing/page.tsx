import type { Metadata } from "next";
import Link from "next/link";
import ProjectPageLayout, { ContentSection } from "@/components/ProjectPageLayout";
import ProjectMasthead from "@/components/ProjectMasthead";
import ProjectFigureSection from "@/components/layout/ProjectFigureSection";
import VisualPlate from "@/components/visual/VisualPlate";
import CoastalJourney from "@/components/diagrams/CoastalJourney";
import FieldNoteSpecimen from "@/components/FieldNoteSpecimen";
import RelatedWork from "@/components/RelatedWork";
import { createPageMetadata } from "@/lib/metadata";
import { getReleasesForProject } from "@/content/releases";
import { siteConfig } from "@/content/shared";

export const metadata: Metadata = createPageMetadata({
  title: "First Landing Prototype — Pilot Sketch",
  description:
    "A proposed six-week place-based learning journey exploring how water shapes land, life, history, and the future of Virginia Beach.",
  path: "/work/first-landing",
});

export default function FirstLandingPage() {
  const relatedReleases = getReleasesForProject("first-landing");

  return (
    <ProjectPageLayout
      masthead={
        <ProjectMasthead
          title="First Landing Prototype"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Current Work", href: "/work" },
            { label: "First Landing Prototype" },
          ]}
          projectType="Learning Journey"
          status="pilot-design"
          summary="A proposed six-week place-based learning journey exploring how water shapes land, life, history, and the future of Virginia Beach."
          statusNotice="This is a proposed learning journey currently in design. Enrollment, partners, cohort dates, and operating arrangements have not been finalized."
        />
      }
      lead={
        <div>
          <p className="font-mono text-metadata text-water">Central inquiry</p>
          <p className="mt-2 font-medium text-ink text-body-lg">
            How does water shape land, life, history, and the future of Virginia Beach?
          </p>
        </div>
      }
      figure={
        <ProjectFigureSection>
          <VisualPlate
            assetKey="first-landing-coastal-systems"
            theme="first-landing"
            variant="infographic"
            title="Water Shapes the Journey"
            expandLabel="Expand field plate"
          />
        </ProjectFigureSection>
      }
      related={<RelatedWork releases={relatedReleases} />}
    >
      <ContentSection title="Educational premise">
        <p>
          First Landing and the surrounding coastal environment can function as a living systems classroom. A six-week journey moves learners from observation to inquiry to creation, using the place itself as the primary text.
        </p>
      </ContentSection>

      <ContentSection title="Six-week learner arc">
        <p className="mb-6 text-sm text-secondary italic">
          Accessible summary of the journey shown in the field plate above. Provisional public sketch — not a finalized curriculum.
        </p>
        <CoastalJourney />
      </ContentSection>

      <FieldNoteSpecimen />

      <ContentSection title="Intended outputs">
        <ul className="space-y-2 list-disc ml-5">
          <li>Field Notes</li>
          <li>Place-based questions</li>
          <li>Evidence collection</li>
          <li>Maps</li>
          <li>Explanations</li>
          <li>Mentor conversations</li>
          <li>A learner-created field guide</li>
          <li>Reflection on how perception changed</li>
        </ul>
      </ContentSection>

      <ContentSection title="What the pilot is intended to test">
        <ol className="space-y-3 list-none">
          {[
            "Whether a real place can sustain a coherent multidisciplinary learning journey",
            "Whether observation can lead naturally into rigorous inquiry",
            "How much structure learners require",
            "How mentors should support progress",
            "Which Field Notes are useful",
            "What should be automated",
            "What requires human judgment",
            "What evidence demonstrates meaningful learning",
            "How a six-week journey could lead into future local journeys",
          ].map((item, i) => (
            <li key={item} className="flex gap-3 text-sm">
              <span className="font-mono text-metadata text-water shrink-0">{String(i + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ol>
      </ContentSection>

      <ContentSection title="What currently exists">
        <p>
          A public design sketch, learner arc outline, and pilot inquiry framework. Curriculum materials, partnerships, safety plans, and learner-support models remain in development.
        </p>
      </ContentSection>

      <ContentSection title="What remains future work">
        <p>
          Facilitator guides, detailed session plans, partnership agreements, safeguarding procedures, Field Notes tooling integration, and pilot evaluation methods.
        </p>
      </ContentSection>

      <ContentSection title="What kind of conversation is appropriate now">
        <p>
          OWLL is interested in thoughtful conversations about potential pilot environments, curriculum design, mentorship models, and community partnerships — not enrollment applications.
        </p>
        <div className="mt-6">
          <a
            href={`mailto:${siteConfig.email}?subject=First%20Landing%20Conversation`}
            className="btn-tactile inline-flex items-center justify-center rounded-full bg-moss px-7 py-3.5 text-sm font-medium text-on-dark hover:bg-moss/90"
          >
            Start a First Landing Conversation
          </a>
        </div>
      </ContentSection>

      <div className="pt-4">
        <Link href="/work" className="text-sm font-medium text-water hover:text-moss transition-colors">
          ← View all current work
        </Link>
      </div>
    </ProjectPageLayout>
  );
}
