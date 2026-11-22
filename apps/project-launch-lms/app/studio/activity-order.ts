import type { CourseActivity, RubricCriterion } from "@/lib/course-types";

// A curriculum sequence is not alphabetical. Teaching and feedback must
// precede authentic graded work; closing reflection follows that work.
// These priorities are for the two-module Project Launch Lab only, and use
// established activity slugs or exact standalone instructional shortcodes.
// The database does not currently have an explicit activity position field.
export const LEVEL_TWO_CLOSING_REFLECTION_SLUG = "your-next-move-reflection";

const COURSE_STAGES: ReadonlyArray<{ priority: number; slugs: readonly string[]; marker?: string }> = [
  { priority: 10, slugs: ["entry-diagnostic"], marker: "[[entry-diagnostic]]" },
  { priority: 20, slugs: ["project-direction-lesson"], marker: "[[project-direction-lesson]]" },
  { priority: 25, slugs: ["first-step-mini-lesson", "first-step-foundations"], marker: "[[first-step-mini-lesson]]" },
  { priority: 30, slugs: ["maya-garden-model"], marker: "[[maya-garden-model]]" },
  { priority: 35, slugs: ["first-step-checks"], marker: "[[first-step-checks]]" },
  { priority: 40, slugs: ["gauntlet-practice", "gauntlet-bridge"], marker: "[[gauntlet-bridge]]" },
  { priority: 45, slugs: ["direction-comparison"], marker: "[[direction-comparison]]" },
  { priority: 50, slugs: ["first-move-studio"], marker: "[[first-move-studio]]" },
  { priority: 55, slugs: ["first-move-card"], marker: "[[first-move-card]]" },
  { priority: 60, slugs: ["first-move-revision"], marker: "[[first-move-revision]]" },
  { priority: 65, slugs: ["first-move-evidence"], marker: "[[first-move-evidence]]" },
  { priority: 90, slugs: ["project-direction-brief", "launch-portfolio"] },
  { priority: 95, slugs: ["module-one-conclusion", "module-two-conclusion"] },
];

function hasStandaloneMarker(instructions: string, marker: string): boolean {
  return instructions.split(/\r?\n/).some(line => line.trim() === marker);
}

function courseStage(activity: CourseActivity, isGraded: boolean): number {
  if (activity.slug === LEVEL_TWO_CLOSING_REFLECTION_SLUG ||
    hasStandaloneMarker(activity.instructions, "[[level-two-exit-check]]")) return 100;
  // The lesson editor generates UUID slugs; recognize explicit module
  // introductions and conclusions by their faculty-facing activity titles.
  if (/^module [12] introduction\b/i.test(activity.title)) return 5;
  if (/^module [12] conclusion\b/i.test(activity.title)) return 95;
  // Preserve the first instructional prerequisite when a staged lesson
  // deliberately includes multiple teaching markers.
  const known = COURSE_STAGES.find(stage =>
    stage.slugs.includes(activity.slug) ||
    Boolean(stage.marker && hasStandaloneMarker(activity.instructions, stage.marker)));
  if (known) return known.priority;
  // Unknown content stays predictable, but is never promoted above a known
  // prerequisite merely because its title sorts first alphabetically.
  return isGraded ? 90 : 80;
}

export function sortCourseActivities(
  activities: CourseActivity[],
  criteria: RubricCriterion[],
): CourseActivity[] {
  const gradedActivityIds = new Set(criteria.map(criterion => criterion.activity_id));
  return [...activities].sort((a, b) => {
    const aGraded = gradedActivityIds.has(a.id);
    const bGraded = gradedActivityIds.has(b.id);
    const aStage = courseStage(a, aGraded);
    const bStage = courseStage(b, bGraded);
    return aStage - bStage
      || Number(aGraded) - Number(bGraded)
      || a.title.localeCompare(b.title)
      || a.id.localeCompare(b.id);
  });
}
