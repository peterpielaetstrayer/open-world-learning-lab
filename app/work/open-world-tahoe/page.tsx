import type { Metadata } from "next";
import Link from "next/link";
import ProjectPageLayout from "@/components/ProjectPageLayout";
import ProjectMetadata from "@/components/ProjectMetadata";
import RelatedWork from "@/components/RelatedWork";
import MissionCard from "@/components/MissionCard";
import TahoeLearningMap from "@/components/TahoeLearningMap";
import PullQuote from "@/components/PullQuote";
import { createPageMetadata } from "@/lib/metadata";
import { tahoeZones, sampleMissions } from "@/content/projects";
import { getReleasesForProject } from "@/content/releases";
import { projects } from "@/content/projects";

export const metadata: Metadata = createPageMetadata({
  title: "Open World Tahoe — Origin Study",
  description:
    "The original thought experiment behind Open World Learning Lab: what might education become if Tahoe itself functioned as an interconnected learning environment?",
  path: "/work/open-world-tahoe",
});

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-foreground mb-4">{title}</h2>
      <div className="space-y-4 text-muted leading-relaxed">{children}</div>
    </section>
  );
}

export default function OpenWorldTahoePage() {
  const relatedReleases = getReleasesForProject("open-world-tahoe");
  const otherProjects = projects.filter((p) => p.slug !== "open-world-tahoe").slice(0, 3);

  return (
    <ProjectPageLayout
      title="Open World Tahoe"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Current Work", href: "/work" },
        { label: "Open World Tahoe" },
      ]}
      metadata={
        <ProjectMetadata
          projectType="Origin Study"
          status="origin-study"
          summary="The original thought experiment behind Open World Learning Lab: what might education become if Tahoe itself functioned as an interconnected learning environment?"
        />
      }
      statusNotice="Open World Tahoe is an origin study and design concept. It is not currently operating as a school, academy, or enrolled program."
      related={
        <RelatedWork projects={otherProjects} releases={relatedReleases} />
      }
    >
      <ContentSection title="The personal origin story">
        <p>
          I grew up in Tahoe, where the line between school and the world always felt thinner than it does in most places. The mountain, the lake, the weather, the trails, the boats, the seasons — they were not abstractions. They were daily reality.
        </p>
        <p>
          When I was sixteen, I remember watching peers on independent study spend much of their time skiing. Some of them did not seem to care about math in the classroom. But they cared deeply about landing a flip.
        </p>
      </ContentSection>

      <PullQuote>
        Maybe students do not hate knowledge. Maybe they hate knowledge removed from reality.
      </PullQuote>

      <ContentSection title="The flip question">
        <p>
          What if they could do the trick, return to the exact moment, study the angle, rotation, force, timing, momentum, torque, and body mechanics — and learn the math because it helped them become better at something real?
        </p>
        <p>
          Open World Tahoe became the original thought experiment behind the lab: what might education become if the lake, mountain, trail, and community formed an interconnected learning environment?
        </p>
      </ContentSection>

      <ContentSection title="Learning zones">
        <p>
          The Tahoe origin study imagined four interconnected zones where real environments become rigorous learning contexts.
        </p>
        <div className="not-prose -mx-6 md:mx-0">
          <TahoeLearningMap zones={tahoeZones} />
        </div>
      </ContentSection>

      <ContentSection title="The original learning sequence">
        <p className="font-medium text-foreground">
          Experience → curiosity → guided inquiry → knowledge → practice → artifact → reflection
        </p>
        <p>
          Open-world learning does not mean telling students to wander around and hope learning happens. It means designing rigorous pathways through real environments with missions, constraints, mentors, tools, feedback, and opportunities to show what they know.
        </p>
      </ContentSection>

      <ContentSection title="Sample mission concepts">
        <p className="text-sm text-stone">
          The following are clearly labeled sample mission concepts — design sketches, not active programs.
        </p>
        <div className="not-prose grid gap-5 sm:grid-cols-2 mt-6">
          {sampleMissions.map((mission, i) => (
            <MissionCard key={mission.title} {...mission} index={i} />
          ))}
        </div>
      </ContentSection>

      <ContentSection title="Educational ideas that survived into OWLL">
        <ul className="space-y-2 list-disc ml-5">
          <li>Learning should begin with real places, practices, and questions</li>
          <li>Structure and freedom are not opposites — rigorous pathways can start in the world</li>
          <li>Human mentorship remains central; technology supports rather than replaces it</li>
          <li>Learners should produce meaningful artifacts that demonstrate understanding</li>
          <li>Reflection and return deepen perception over time</li>
          <li>Every place has history, ecology, community, and limits that must be respected</li>
        </ul>
      </ContentSection>

      <ContentSection title="What Changed After Tahoe">
        <p>
          Open World Tahoe initially placed significant emphasis on live exploration, spatial technology, and globally connected learners. Those possibilities remain part of the longer horizon, but the work has since become broader and more grounded.
        </p>
        <p>
          OWLL is now beginning with learning journeys that can be tested using ordinary tools, human mentorship, careful field design, and lightweight digital support. The technology should grow from demonstrated educational needs rather than lead the work by default.
        </p>
      </ContentSection>

      <div className="pt-6">
        <Link
          href="/work"
          className="text-sm font-medium text-tahoe hover:text-pine transition-colors"
        >
          ← View all current work
        </Link>
      </div>
    </ProjectPageLayout>
  );
}
