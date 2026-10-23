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
    "The original six-week First Landing inquiry concept and a related eight-stop Journey Studio prototype about how water shapes the landscape.",
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
          summary="The original six-week First Landing inquiry concept and a related eight-stop Journey Studio prototype about how water shapes the landscape."
          statusNotice="This page preserves an original six-week design sketch. Journey Studio also contains an eight-stop Water Writes the Landscape prototype. Neither represents a validated field pilot; no enrollment, partner, or cohort is announced."
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

      <ContentSection title="Three related stages, not one finished program">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { stage: "01 / Origin", title: "Six-week learning design", reality: "The proposed multidisciplinary learning experience and the questions a pilot would test." },
            { stage: "02 / Creator", title: "Water Writes the Landscape", reality: "An eight-stop Journey Studio prototype. Not an implemented or validated field pilot." },
            { stage: "03 / Learner", title: "Water Fingerprints", reality: "A bounded adult LOCUS v0.1.1 field-test encounter for observing, evidencing, and returning." },
          ].map((stage) => (
            <article key={stage.stage} className="rounded-lg border border-border bg-soft-paper/40 p-5">
              <p className="font-mono text-metadata uppercase tracking-widest text-water">{stage.stage}</p>
              <h3 className="mt-3 font-serif text-xl text-ink">{stage.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary">{stage.reality}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 text-sm text-secondary">
          These are increasingly concrete answers to a shared research question, not three completed programs.
          A working prototype does not establish an educational outcome.
        </p>
      </ContentSection>

      <ContentSection title="What currently exists">
        <p>
          This page documents the original six-week concept, its learner arc, and pilot questions. A newer eight-stop <em>Water Writes the Landscape</em> learner route exists as a technical prototype in LOCUS Journey Studio. The two represent different stages of the same investigation, not two completed or field-tested educational programs.
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
