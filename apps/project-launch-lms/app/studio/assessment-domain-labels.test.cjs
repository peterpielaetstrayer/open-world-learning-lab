/* eslint-disable @typescript-eslint/no-require-imports -- Node test runner loads TSX through tsx/cjs. */
const assert = require("node:assert/strict");
const { test } = require("node:test");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { JSDOM } = require("jsdom");

require("tsx/cjs");
const { CourseEvaluation } = require("./course-evaluation.tsx");
const { CourseQuiz } = require("./course-quiz.tsx");

// These checks inspect copy and form semantics only. Server rendering does not
// exercise Supabase authentication, row-level security, or submission receipts.
test("Level 1 survey discloses identity association and non-grading before its ten ratings", () => {
  const html = renderToStaticMarkup(React.createElement(CourseEvaluation, {
    supabase: {}, courseId: "synthetic-course", instructor: false, preview: true,
  }));
  const doc = new JSDOM(html).window.document;
  const intro = doc.querySelector(".studio-work > .form-note")?.textContent ?? "";
  assert.match(intro, /Level 1/);
  assert.match(intro, /not graded/);
  assert.match(intro, /not anonymous/);
  assert.match(intro, /associated with your course account/);
  assert.match(intro, /facilitators can view submitted comments/);
  const ratings = [...doc.querySelectorAll("select")];
  assert.equal(ratings.length, 10);
  assert.ok(ratings.every(select => select.required));
  assert.equal(doc.querySelectorAll("textarea").length, 1);
});

test("Level 2 quiz explains the limits of scenario answers and names applied work", () => {
  const html = renderToStaticMarkup(React.createElement(CourseQuiz, {
    supabase: {}, courseId: "synthetic-course", identity: "synthetic-learner",
    instructor: false, preview: true,
  }));
  const doc = new JSDOM(html).window.document;
  const intro = doc.querySelector(".studio-work > .form-note")?.textContent ?? "";
  assert.match(intro, /Level 2/);
  assert.match(intro, /knowledge and scenario judgment/i);
  assert.match(intro, /Direction Brief/);
  assert.match(intro, /not a measure of your confidence or intentions/);
});
