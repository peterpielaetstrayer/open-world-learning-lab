import type { CourseActivity, RubricCriterion } from "@/lib/course-types";

// A closing reflection belongs after the learner's graded portfolio, even
// though it is intentionally ungraded. Other practice precedes assignments.
export const LEVEL_TWO_CLOSING_REFLECTION_SLUG = "your-next-move-reflection";

export function sortCourseActivities(
  activities: CourseActivity[],
  criteria: RubricCriterion[],
): CourseActivity[] {
  const gradedActivityIds = new Set(criteria.map(criterion => criterion.activity_id));
  return [...activities].sort((a, b) => {
    const aIsClosing = a.slug === LEVEL_TWO_CLOSING_REFLECTION_SLUG;
    const bIsClosing = b.slug === LEVEL_TWO_CLOSING_REFLECTION_SLUG;
    return Number(aIsClosing) - Number(bIsClosing)
      || Number(gradedActivityIds.has(a.id)) - Number(gradedActivityIds.has(b.id))
      || a.title.localeCompare(b.title);
  });
}
