/* eslint-disable @typescript-eslint/no-require-imports -- Node test harness loads TS using tsx. */
const assert = require("node:assert/strict");
const { test } = require("node:test");
require("tsx/cjs");

const { sortCourseActivities, LEVEL_TWO_CLOSING_REFLECTION_SLUG } = require("./activity-order.ts");

function activity(id, title, slug = id) {
  return { id, course_id: "course-1", module_id: "module-2", title, slug, instructions: "", is_published: true };
}

test("Module 2 closure comes after the graded portfolio, not before it", () => {
  const closure = activity("closure", "Your Next Move", LEVEL_TWO_CLOSING_REFLECTION_SLUG);
  const portfolio = activity("portfolio", "Launch Portfolio", "launch-portfolio");
  const practice = activity("practice", "First Move Studio", "first-move-studio");
  const activities = [closure, portfolio, practice];
  const criteria = [{ id: "criterion", activity_id: "portfolio", course_id: "course-1", position: 1, title: "Planning", description: "", maximum_points: 15 }];

  assert.deepEqual(sortCourseActivities(activities, criteria).map(item => item.id),
    ["practice", "portfolio", "closure"]);
  assert.deepEqual(activities.map(item => item.id), ["closure", "portfolio", "practice"]);
});

test("unrelated modules preserve practice-before-assignment sorting", () => {
  const a = activity("graded", "A assignment");
  const b = activity("practice-z", "Z practice");
  const c = activity("practice-b", "B practice");
  const criteria = [{ id: "criterion", activity_id: "graded", course_id: "course-1", position: 1, title: "Skill", description: "", maximum_points: 10 }];

  assert.deepEqual(sortCourseActivities([a, b, c], criteria).map(item => item.id),
    ["practice-b", "practice-z", "graded"]);
});

test("a missing closing reflection does not change existing course flow", () => {
  assert.deepEqual(sortCourseActivities([activity("z", "Z"), activity("a", "A")], [])
    .map(item => item.id), ["a", "z"]);
});
