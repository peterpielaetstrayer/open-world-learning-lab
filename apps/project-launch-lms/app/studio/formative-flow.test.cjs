/* eslint-disable @typescript-eslint/no-require-imports -- CJS DOM harness loads JSX only after initializing browser globals. */
const assert = require("node:assert/strict");
const { test, afterEach } = require("node:test");
const Module = require("node:module");
const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!doctype html><html lang='en'><body></body></html>", {
  url: "https://example.test/studio?course=course-1",
});
Object.assign(globalThis, {
  window: dom.window,
  self: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  MutationObserver: dom.window.MutationObserver,
  getComputedStyle: dom.window.getComputedStyle,
  IS_REACT_ACT_ENVIRONMENT: true,
});
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });

let db;
let currentUserId = "learner-1";
const calls = [];
const stubSupabase = {
  auth: { getUser: async () => ({ data: { user: { id: currentUserId } }, error: null }) },
  from(table) {
    const filters = [];
    let write = null;
    const filtered = () => (db[table] ?? []).filter(row => filters.every(([field, value]) => row[field] === value));
    const perform = () => {
      if (write?.kind === "insert") {
        const row = { ...write.value, id: `new-${table}`, updated_at: "2026-11-18T12:00:00Z", submitted_at: "2026-11-18T12:00:00Z" };
        db[table].push(row);
        calls.push({ table, kind: "insert", row });
        return { data: row, error: null };
      }
      if (write?.kind === "update") {
        for (const row of filtered()) Object.assign(row, write.value);
        calls.push({ table, kind: "update" });
        return { data: filtered(), error: null };
      }
      return { data: filtered(), error: null };
    };
    const query = {
      select: () => query,
      eq: (field, value) => { filters.push([field, value]); return query; },
      order: () => query,
      maybeSingle: async () => { const result = perform(); return { ...result, data: Array.isArray(result.data) ? result.data[0] ?? null : result.data }; },
      single: async () => { const result = perform(); return { ...result, data: Array.isArray(result.data) ? result.data[0] ?? null : result.data }; },
      insert: value => { write = { kind: "insert", value }; return query; },
      update: value => { write = { kind: "update", value }; return query; },
      then: (resolve, reject) => Promise.resolve(perform()).then(resolve, reject),
    };
    return query;
  },
  async rpc(name, values) {
    calls.push({ kind: "rpc", name, values });
    if (name === "pll_publish_formative_feedback") {
      db.pll_feedback.push({ id: "feedback-1", submission_id: values.p_submission_id, summary: values.p_summary, published_at: "2026-11-18T12:00:00Z" });
      return { error: null };
    }
    if (name === "pll_publish_review") {
      db.pll_feedback.push({ id: "feedback-1", submission_id: values.p_submission_id, summary: values.p_summary, published_at: "2026-11-18T12:00:00Z" });
      return { error: null };
    }
    return { error: new Error("Unexpected RPC") };
  },
};

// Only the auth/data client is stubbed. The course UI and its interaction logic
// remain the real React components. This is not a real Supabase RLS test.
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === "@/lib/supabase-browser" || request.endsWith("/lib/supabase-browser")) {
    return { browserSupabase: () => stubSupabase };
  }
  return originalLoad.call(this, request, parent, isMain);
};
require("tsx/cjs");
const React = require("react");
const { render, screen, fireEvent, waitFor, cleanup } = require("@testing-library/react");
const StudioPage = require("./page.tsx").default;
const { ProjectDirectionLesson } = require("./project-direction-lesson.tsx");
const { SyntheticStudio } = require("../studio-preview/synthetic-studio.tsx");
Module._load = originalLoad;

function resetData() {
  currentUserId = "learner-1";
  db = {
    pll_memberships: [{ course_id: "course-1", user_id: "learner-1", member_role: "learner" }],
    pll_courses: [{ id: "course-1", title: "Project Launch Lab", description: "Explore ideas" }],
    pll_modules: [{ id: "module-1", course_id: "course-1", module_number: 1, title: "Discover & Define", is_published: true }],
    pll_activities: [
      { id: "practice-1", course_id: "course-1", module_id: "module-1", slug: "practice", title: "Practice choosing", instructions: "Compare two options.", is_published: true },
      { id: "graded-1", course_id: "course-1", module_id: "module-1", slug: "brief", title: "Direction Brief", instructions: "Explain your choice.", is_published: true },
    ],
    pll_drafts: [], pll_submissions: [], pll_feedback: [], pll_rubric_scores: [], pll_lesson_progress: [],
    pll_rubric_criteria: [{ id: "criterion-1", activity_id: "graded-1", course_id: "course-1", position: 1, title: "Reasoning", description: "Explain the decision", maximum_points: 10 }],
  };
  calls.length = 0;
}
afterEach(() => cleanup());

test("learner saves and shares ungraded practice without asking for a rubric score", async () => {
  resetData();
  window.confirm = () => true;
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Practice choosing/ }));
  assert.match(screen.getByText(/Ungraded practice/).textContent, /Ungraded practice/);
  fireEvent.change(screen.getByLabelText("Your practice reflection or question for feedback"), { target: { value: "I chose the smaller experiment." } });
  fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
  await waitFor(() => assert.equal(db.pll_drafts.length, 1));
  assert.equal(db.pll_drafts[0].response_text, "I chose the smaller experiment.");
  fireEvent.click(screen.getByRole("button", { name: "Share with facilitator (final)" }));
  await waitFor(() => assert.equal(db.pll_submissions.length, 1));
  assert.equal(db.pll_submissions[0].response_text, "I chose the smaller experiment.");
  assert.match((await screen.findByText("Your shared practice reflection")).textContent, /shared/);
});

test("graded assignment keeps its rubric-scored submission language", async () => {
  resetData();
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Direction Brief/ }));
  assert.ok(screen.getByText("How your work will be evaluated"));
  assert.ok(screen.getByRole("button", { name: "Submit final response" }));
  assert.equal(screen.queryByText(/Ungraded practice/), null);
});

test("facilitator publishes ungraded practice feedback without rubric scores", async () => {
  resetData();
  currentUserId = "facilitator-1";
  db.pll_memberships = [{ course_id: "course-1", user_id: currentUserId, member_role: "facilitator" }];
  db.pll_submissions.push({ id: "practice-submission-1", activity_id: "practice-1", course_id: "course-1", learner_id: "learner-1", response_text: "I chose a smaller experiment.", submitted_at: "2026-11-18T12:00:00Z" });
  window.confirm = () => true;
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Review submissions" }));
  fireEvent.change(screen.getByLabelText("Submission to review"), { target: { value: "practice-submission-1" } });
  assert.ok(screen.getByText(/This activity has no points or rubric score/));
  assert.equal(screen.queryByText("Score each criterion"), null);
  fireEvent.change(screen.getByLabelText("Formative feedback"), { target: { value: "Good thinking. Test your smallest assumption first." } });
  fireEvent.click(screen.getByRole("button", { name: "Publish formative feedback" }));
  await waitFor(() => assert.equal(db.pll_feedback.length, 1));
  const rpc = calls.find(call => call.kind === "rpc");
  assert.equal(rpc.name, "pll_publish_formative_feedback");
  assert.equal(rpc.values.p_submission_id, "practice-submission-1");
  assert.equal(rpc.values.p_summary, "Good thinking. Test your smallest assumption first.");
  assert.equal("p_scores" in rpc.values, false);
});

test("facilitator graded review still requires every criterion and uses rubric publishing", async () => {
  resetData();
  currentUserId = "facilitator-1";
  db.pll_memberships = [{ course_id: "course-1", user_id: currentUserId, member_role: "facilitator" }];
  db.pll_submissions.push({ id: "graded-submission-1", activity_id: "graded-1", course_id: "course-1", learner_id: "learner-1", response_text: "My constraints guided my selection.", submitted_at: "2026-11-18T12:00:00Z" });
  window.confirm = () => true;
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Review submissions" }));
  fireEvent.change(screen.getByLabelText("Submission to review"), { target: { value: "graded-submission-1" } });
  fireEvent.change(screen.getByLabelText("Overall feedback"), { target: { value: "Clear reasoning; add evidence." } });
  fireEvent.click(screen.getByRole("button", { name: "Publish complete review" }));
  assert.ok(screen.getByRole("alert").textContent.includes("valid score"));
  assert.equal(calls.filter(call => call.kind === "rpc").length, 0);
  fireEvent.change(screen.getByLabelText(/Reasoning — maximum/), { target: { value: "8" } });
  fireEvent.click(screen.getByRole("button", { name: "Publish complete review" }));
  await waitFor(() => assert.equal(db.pll_feedback.length, 1));
  const rpc = calls.find(call => call.kind === "rpc");
  assert.equal(rpc.name, "pll_publish_review");
  assert.deepEqual(rpc.values.p_scores, [{ criterion_id: "criterion-1", points: 8, note: "" }]);
});

test("signed-in lesson explicitly saves and resumes private progress without a grade", async () => {
  resetData();
  const progress = { courseId: "course-1", activityId: "practice-1", learnerId: "learner-1" };
  render(React.createElement(ProjectDirectionLesson, { progress }));
  const save = await screen.findByRole("button", { name: "Save my lesson work" });
  fireEvent.change(screen.getByLabelText("Something I care about or like exploring"), { target: { value: "Bird migration" } });
  fireEvent.click(screen.getByRole("button", { name: /Consider/ }));
  fireEvent.change(screen.getByLabelText("My possible project direction"), { target: { value: "Map one nearby bird route" } });
  fireEvent.click(save);
  await waitFor(() => assert.equal(db.pll_lesson_progress.length, 1));
  assert.equal(db.pll_lesson_progress[0].state.version, 1);
  assert.equal(db.pll_lesson_progress[0].state.curiosity, "Bird migration");
  assert.equal(db.pll_submissions.length, 0);
  cleanup();
  render(React.createElement(ProjectDirectionLesson, { progress }));
  await screen.findByDisplayValue("Map one nearby bird route");
  assert.equal(screen.getByLabelText("My possible project direction").value, "Map one nearby bird route");
  assert.match(screen.getByText(/Your lesson work is saved to your account/).textContent, /saved/);
  assert.equal(screen.getByRole("button", { name: "Save my lesson work" }).disabled, true);
});

test("unknown saved lesson format is not silently overwritten", async () => {
  resetData();
  db.pll_lesson_progress.push({
    id: "legacy-progress", course_id: "course-1", activity_id: "practice-1", learner_id: "learner-1",
    lesson_key: "project-direction-lesson-v1", state: { version: 2, anOlderFormat: true },
  });
  render(React.createElement(ProjectDirectionLesson, { progress: { courseId: "course-1", activityId: "practice-1", learnerId: "learner-1" } }));
  const alert = await screen.findByRole("alert");
  assert.match(alert.textContent, /unsupported format/);
  assert.equal(screen.queryByRole("button", { name: "Save my lesson work" }), null);
  assert.equal(db.pll_lesson_progress[0].state.version, 2);
});

test("learner dashboard shows the course journey, safe choices and honest progress", async () => {
  resetData();
  render(React.createElement(StudioPage));
  const heading = await screen.findByRole("heading", { name: /Start with curiosity/ });
  assert.ok(heading);
  assert.match(screen.getByText(/These counts track submissions and feedback/).textContent, /not mastery/);
  assert.ok(screen.getByText(/You do not need to buy anything/));
  assert.ok(screen.getByRole("button", { name: "Begin exploring" }));
  assert.ok(screen.getByRole("heading", { name: "Discover & Define" }));
  fireEvent.click(screen.getByRole("button", { name: "Begin exploring" }));
  assert.ok(screen.getByText("Compare two options."));
});

test("ungraded responses and published feedback are discoverable in Feedback", async () => {
  resetData();
  db.pll_submissions.push({ id: "response-1", activity_id: "practice-1", course_id: "course-1", learner_id: "learner-1", response_text: "I chose a smaller test.", submitted_at: "2026-11-18T12:00:00Z" });
  db.pll_feedback.push({ id: "feedback-1", course_id: "course-1", submission_id: "response-1", summary: "Good constraint analysis. Now ask what you can observe.", published_at: "2026-11-18T12:30:00Z" });
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  assert.ok(screen.getByText("of 2 activity responses shared"));
  fireEvent.click(screen.getByRole("button", { name: "Feedback" }));
  assert.ok(screen.getByRole("heading", { name: "Your work and feedback" }));
  assert.ok(screen.getByText("Ungraded practice"));
  assert.ok(screen.getByText("Good constraint analysis. Now ask what you can observe."));
});

test("protected design preview distinguishes fictional states and navigates to feedback", () => {
  render(React.createElement(SyntheticStudio));
  assert.ok(screen.getByText(/This is a design preview, not a signed-in course/));
  assert.ok(screen.getByRole("button", { name: "Starting learner" }));
  assert.ok(screen.getByRole("heading", { name: /Start with curiosity/ }));
  fireEvent.click(screen.getByRole("button", { name: "Example with feedback" }));
  assert.ok(screen.getByText("of 4 activity responses shared"));
  fireEvent.click(screen.getByRole("button", { name: "Feedback" }));
  assert.ok(screen.getByRole("heading", { name: "Your work and feedback" }));
  assert.ok(screen.getAllByText("Ungraded practice").length >= 1);
  assert.ok(screen.getByText(/What one observation would show whether/));
  fireEvent.click(screen.getByRole("button", { name: "Practice choosing a direction" }));
  assert.ok(screen.getByText(/Your example reflection/));
  assert.equal(screen.queryByText(/Saving and sharing are disabled/), null);
});

test("entry diagnostic explains the starting point and prepares a real ungraded draft", async () => {
  resetData();
  db.pll_activities[0].instructions = "[[entry-diagnostic]]";
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Practice choosing/ }));
  const review = screen.getByRole("button", { name: "Review my starting point" });
  assert.equal(review.disabled, true);
  const answers = [
    ["Two interests, questions, or problems", "Drawing and bird migration"],
    ["Something you tried to learn or do", "A garden needed time and help"],
    ["A more testable direction", "A short guide; I would need permission"],
    ["A tiny first move", "Make a paper draft"],
  ];
  for (const [label, value] of answers) {
    fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value } });
  }
  fireEvent.click(screen.getByRole("radio", { name: "3" }));
  assert.equal(review.disabled, false);
  fireEvent.click(review);
  assert.ok(screen.getByText(/A focused first question creates a path/));
  assert.equal(db.pll_drafts.length, 0);
  fireEvent.click(screen.getByRole("button", { name: "Use these answers in my course response" }));
  const courseResponse = screen.getByLabelText("Your practice reflection or question for feedback");
  assert.match(courseResponse.value, /Drawing and bird migration/);
  assert.match(courseResponse.value, /Starting confidence .*: 3/);
  assert.equal(db.pll_drafts.length, 0, "Preparing cannot silently save to the backend");
  fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
  await waitFor(() => assert.equal(db.pll_drafts.length, 1));
  assert.match(db.pll_drafts[0].response_text, /Make a paper draft/);
  assert.equal(db.pll_submissions.length, 0, "A saved diagnostic draft is not a final submission");
});
