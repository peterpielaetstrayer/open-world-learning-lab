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


test("Module 1 keeps explicit teaching before Gauntlet and graded Direction Brief", () => {
  const lesson = activity("lesson", "Z Learn", "project-direction-lesson");
  const diagnostic = activity("diagnostic", "Z Diagnostic", "entry-diagnostic");
  const gauntlet = activity("gauntlet", "A Challenge", "gauntlet-practice");
  const comparison = activity("comparison", "A Compare", "direction-comparison");
  const brief = activity("brief", "A Brief", "project-direction-brief");
  const criteria = [{ id: "rubric", activity_id: "brief", maximum_points: 10 }];
  const items = [brief, comparison, lesson, gauntlet, diagnostic];

  assert.deepEqual(sortCourseActivities(items, criteria).map(item => item.id),
    ["diagnostic", "lesson", "gauntlet", "comparison", "brief"]);
  assert.deepEqual(items.map(item => item.id),
    ["brief", "comparison", "lesson", "gauntlet", "diagnostic"]);
});

test("Module 2 follows teach, model, checks, application, feedback, evidence, portfolio and closure", () => {
  const stages = [
    activity("learn", "Z Learn", "first-step-mini-lesson"),
    activity("model", "Z Maya", "maya-garden-model"),
    activity("check", "Z Check", "first-step-checks"),
    activity("studio", "A Studio", "first-move-studio"),
    activity("card", "A Card", "first-move-card"),
    activity("revision", "A Revision", "first-move-revision"),
    activity("evidence", "A Evidence", "first-move-evidence"),
    activity("portfolio", "A Portfolio", "launch-portfolio"),
    activity("closure", "A Reflection", LEVEL_TWO_CLOSING_REFLECTION_SLUG),
  ];
  const criteria = [{ id: "rubric", activity_id: "portfolio", maximum_points: 15 }];
  assert.deepEqual(sortCourseActivities([...stages].reverse(), criteria).map(item => item.id),
    stages.map(item => item.id));
});

test("editor-created UUID activities use exact standalone shortcodes to preserve order", () => {
  const lesson = activity("lesson", "Z teacher instructions", "b0d4c4d2-uuid");
  lesson.instructions = "Learn before the Studio.\n\n[[first-step-mini-lesson]]\n\nReview planning language.";
  const checks = activity("check", "A Check", "b0d4c4d3-uuid");
  checks.instructions = "Try it.\n\n[[first-step-checks]]";
  const studio = activity("studio", "A Studio", "first-move-studio");
  const portfolio = activity("portfolio", "A Portfolio", "launch-portfolio");
  const criteria = [{ id: "rubric", activity_id: "portfolio", maximum_points: 15 }];
  assert.deepEqual(sortCourseActivities([portfolio, studio, checks, lesson], criteria).map(item => item.id),
    ["lesson", "check", "studio", "portfolio"]);
});

test("editor-created module introduction and conclusion titles bracket course work", () => {
  const intro = activity("intro", "Module 2 Introduction — Plan & Launch", "uuid-intro");
  const lesson = activity("lesson", "Z Model", "maya-garden-model");
  const portfolio = activity("portfolio", "Launch Portfolio", "launch-portfolio");
  const conclusion = activity("conclusion", "Module 2 Conclusion — What You Learned", "uuid-conclusion");
  const close = activity("close", "Your Next Move", LEVEL_TWO_CLOSING_REFLECTION_SLUG);
  const rubric = [{ id: "rubric", activity_id: "portfolio", maximum_points: 15 }];
  assert.deepEqual(sortCourseActivities([close, conclusion, portfolio, lesson, intro], rubric)
    .map(item => item.id), ["intro", "lesson", "portfolio", "conclusion", "close"]);
});
