import type { Metadata } from "next";
import Link from "next/link";
import ProjectPageLayout from "@/components/ProjectPageLayout";
import ProjectMetadata from "@/components/ProjectMetadata";
import RelatedWork from "@/components/RelatedWork";
import { createPageMetadata } from "@/lib/metadata";
import { getReleasesForProject } from "@/content/releases";

export const metadata: Metadata = createPageMetadata({
  title: "First Landing Prototype — Pilot Sketch",
  description:
    "A proposed six-week place-based learning journey exploring how water shapes land, life, history, and the future of Virginia Beach.",
  path: "/work/first-landing",
});

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-foreground mb-4">{title}</h2>
      <div className="space-y-4 text-muted leading-relaxed">{children}</div>
    </section>
  );
}

const learnerArc = [
  {
    title: "Learning to Notice",
    description:
      "Establish bearings, slow down observation, begin Field Notes, and learn to distinguish noticing from immediate explanation.",
  },
  {
    title: "Water Shapes Land",
    description:
      "Investigate shoreline, movement, sediment, erosion, elevation, and changing coastal forms.",
  },
  {
    title: "Water Shapes Life",
    description:
      "Explore habitats, adaptation, biodiversity, interdependence, and evidence of living systems.",
  },
  {
    title: "Water Shapes Human History",
    description:
      "Connect waterways and landscape to travel, settlement, labor, conflict, culture, and the development of Virginia Beach.",
  },
  {
    title: "Water Shapes the Future",
    description:
      "Investigate flooding, development, stewardship, resilience, public decisions, and competing visions for the coast.",
  },
  {
    title: "Build the Field Guide",
    description:
      "Synthesize observations, sources, maps, explanations, and reflections into a learner-created artifact.",
  },
];

export default function FirstLandingPage() {
  const relatedReleases = getReleasesForProject("first-landing");

  return (
    <ProjectPageLayout
      title="First Landing Prototype"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Current Work", href: "/work" },
        { label: "First Landing Prototype" },
      ]}
      metadata={
        <ProjectMetadata
          projectType="Learning Journey"
          status="pilot-design"
          summary="A proposed six-week learning journey that uses First Landing and the surrounding coastal environment as a living systems classroom."
        />
      }
      statusNotice="This project is in pilot design. Enrollment is not currently open, and the public sketch may change as the curriculum, partnerships, safety plan, and learner-support model are refined."
      related={<RelatedWork releases={relatedReleases} />}
    >
      <ContentSection title="Central inquiry">
        <p className="font-medium text-foreground text-lg">
          How does water shape land, life, history, and the future of Virginia Beach?
        </p>
      </ContentSection>

      <ContentSection title="Educational premise">
        <p>
          First Landing and the surrounding coastal environment can function as a living systems classroom. A six-week journey would move learners from observation to inquiry to creation, using the place itself as the primary text.
        </p>
      </ContentSection>

      <ContentSection title="Public learner arc">
        <p className="text-sm text-stone">
          The following is presented as a provisional public sketch, not a finalized curriculum.
        </p>
        <ol className="mt-6 space-y-4">
          {learnerArc.map((week, i) => (
            <li key={week.title} className="card-premium p-5 list-none">
              <p className="field-label mb-1">Week {i + 1}</p>
              <h3 className="font-semibold text-foreground">{week.title}</h3>
              <p className="mt-2 text-sm">{week.description}</p>
            </li>
          ))}
        </ol>
      </ContentSection>

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
        <ul className="space-y-2 list-disc ml-5">
          <li>Whether a real place can sustain a coherent multidisciplinary learning journey</li>
          <li>Whether observation can lead naturally into rigorous inquiry</li>
          <li>How much structure learners require</li>
          <li>How mentors should support progress</li>
          <li>Which Field Notes are useful</li>
          <li>What should be automated</li>
          <li>What requires human judgment</li>
          <li>What evidence demonstrates meaningful learning</li>
          <li>How a six-week journey could lead into future local journeys</li>
        </ul>
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

      <div className="pt-6">
        <Link href="/work" className="text-sm font-medium text-tahoe hover:text-pine transition-colors">
          ← View all current work
        </Link>
      </div>
    </ProjectPageLayout>
  );
}
