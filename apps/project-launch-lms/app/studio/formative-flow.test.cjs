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
    pll_drafts: [], pll_submissions: [], pll_feedback: [], pll_rubric_scores: [],
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
