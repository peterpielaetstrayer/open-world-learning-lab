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
    if (name === "pll_portfolio_is_open") return { data: db.portfolioOpen === true, error: null };
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
const { render, screen, within, fireEvent, waitFor, cleanup } = require("@testing-library/react");
const StudioPage = require("./page.tsx").default;
const { ProjectDirectionLesson } = require("./project-direction-lesson.tsx");
const { SyntheticStudio } = require("../studio-preview/synthetic-studio.tsx");
const { ModuleOneWalkthrough } = require("../module-one-preview/walkthrough.tsx");
const { ModuleTwoWalkthrough } = require("../module-two-preview/walkthrough.tsx");
const { FirstMoveEvidence } = require("./first-move-evidence.tsx");
const { FirstMoveRevision } = require("./first-move-revision.tsx");
const { FirstMoveStudio } = require("./first-move-studio.tsx");
const { FirstStepMiniLesson, MayaGardenModel, FirstStepChecks } = require("./first-step-foundations.tsx");
const { LaunchPortfolioRubricReview, academicLaunchPortfolioRubric,
  academicLaunchPortfolioPointBands, compareLaunchPortfolioRubric } = require("./launch-portfolio-rubric.tsx");
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

function addUnreconciledLaunchPortfolio() {
  db.pll_activities.push({
    id: "launch-portfolio-1", course_id: "course-1", module_id: "module-1",
    slug: "launch-portfolio", title: "Launch Portfolio", instructions: "Reflect on your first move.", is_published: true,
  });
  for (const [index, title] of ["Feasible plan", "First-action evidence", "Evidence-informed next step"].entries()) {
    db.pll_rubric_criteria.push({
      id: `portfolio-criterion-${index}`, activity_id: "launch-portfolio-1", course_id: "course-1",
      position: index + 1, title, description: title, maximum_points: 10,
    });
  }
}

test("unreconciled Launch Portfolio permits a saved draft but not an accidental final submission", async () => {
  resetData();
  addUnreconciledLaunchPortfolio();
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Launch Portfolio/ }));
  assert.match(screen.getByRole("status").textContent, /submission on hold/i);
  fireEvent.change(screen.getByLabelText("Your project reasoning or response"), {
    target: { value: "Here is my draft plan and a genuine obstacle." },
  });
  assert.equal(screen.getByRole("button", { name: "Submit final response" }).disabled, true);
  fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
  await waitFor(() => assert.equal(db.pll_drafts.length, 1));
  assert.equal(db.pll_drafts[0].response_text, "Here is my draft plan and a genuine obstacle.");
  assert.equal(db.pll_submissions.length, 0);
});

test("unreconciled Launch Portfolio cannot publish a grade through the facilitator UI", async () => {
  resetData();
  addUnreconciledLaunchPortfolio();
  currentUserId = "facilitator-1";
  db.pll_memberships = [{ course_id: "course-1", user_id: currentUserId, member_role: "facilitator" }];
  db.pll_submissions.push({
    id: "portfolio-submission-1", activity_id: "launch-portfolio-1", course_id: "course-1",
    learner_id: "learner-1", response_text: "A bounded first action was blocked by unsafe weather.",
    submitted_at: "2026-11-18T12:00:00Z",
  });
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Review submissions" }));
  fireEvent.change(screen.getByLabelText("Submission to review"), { target: { value: "portfolio-submission-1" } });
  assert.match(screen.getByRole("status").textContent, /totals 30 points/);
  fireEvent.change(screen.getByLabelText("Overall feedback"), {
    target: { value: "The documented obstacle was authentic. Consider a safer next test." },
  });
  assert.equal(screen.getByRole("button", { name: "Publish complete review" }).disabled, true);
  assert.equal(calls.filter(call => call.kind === "rpc").length, 0);
  assert.equal(db.pll_feedback.length, 0);
});

test("a four-by-fifteen Launch Portfolio draft still requires faculty release before scoring", async () => {
  resetData();
  addUnreconciledLaunchPortfolio();
  db.pll_rubric_criteria = db.pll_rubric_criteria.filter(item => item.activity_id !== "launch-portfolio-1");
  for (const [index, rubric] of academicLaunchPortfolioRubric.entries()) {
    db.pll_rubric_criteria.push({
      id: `academic-criterion-${index}`, activity_id: "launch-portfolio-1", course_id: "course-1",
      position: index + 1, title: rubric.title, description: rubric.evidence, maximum_points: 15,
    });
  }
  currentUserId = "facilitator-1";
  db.pll_memberships = [{ course_id: "course-1", user_id: currentUserId, member_role: "facilitator" }];
  db.pll_submissions.push({
    id: "portfolio-submission-2", activity_id: "launch-portfolio-1", course_id: "course-1",
    learner_id: "learner-1", response_text: "A thoughtful and safe first attempt.",
    submitted_at: "2026-11-18T12:00:00Z",
  });
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Review submissions" }));
  fireEvent.change(screen.getByLabelText("Submission to review"), { target: { value: "portfolio-submission-2" } });
  assert.match(screen.getByRole("status").textContent, /academic approval gate/);
  assert.match(screen.getByRole("status").textContent, /totals 60 points/);
  fireEvent.change(screen.getByLabelText("Overall feedback"), {
    target: { value: "Good rationale and honest interpretation." },
  });
  assert.equal(screen.getByRole("button", { name: "Publish complete review" }).disabled, true);
  assert.equal(calls.filter(call => call.kind === "rpc").length, 0);
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
  const outcomes = screen.getByRole("heading", { name: "What you will learn" }).closest("section");
  assert.ok(outcomes, "Original course outcomes are visible on the actual course home");
  assert.equal(outcomes.querySelectorAll("ol > li").length, 6);
  assert.match(outcomes.textContent, /Identify possible starting points for learner-directed projects/);
  assert.match(outcomes.textContent, /Explain why a personally chosen direction matters/);
  assert.match(outcomes.textContent, /document a genuine barrier/);
  assert.match(screen.getByText(/These counts track shared responses and feedback/).textContent, /not mastery/);
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
  assert.ok(screen.getByText("of 2 requested responses shared"));
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
  assert.ok(screen.getByText("of 4 requested responses shared"));
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

test("direction lesson draft can be prepared for the actual LMS response without silently saving", async () => {
  resetData();
  db.pll_activities[0].instructions = "[[project-direction-lesson]]";
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Practice choosing/ }));
  fireEvent.click(await screen.findByRole("button", { name: /My draft/ }));
  fireEvent.change(screen.getByLabelText("One direction I want to explore"), { target: { value: "Compare three watercolor exercises" } });
  fireEvent.change(screen.getByLabelText("What I can realistically investigate or create first"), { target: { value: "Try one sketch on paper" } });
  fireEvent.click(screen.getByRole("button", { name: "Use my direction draft in the course response" }));
  const response = screen.getByLabelText("Your practice reflection or question for feedback");
  assert.match(response.value, /Compare three watercolor exercises/);
  assert.equal(db.pll_drafts.length, 0);
  assert.equal(db.pll_submissions.length, 0);
  fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
  await waitFor(() => assert.equal(db.pll_drafts.length, 1));
  assert.match(db.pll_drafts[0].response_text, /Try one sketch on paper/);
  assert.equal(db.pll_submissions.length, 0);
});

test("two-direction comparison prepares a formative draft and respects overwrite refusal", async () => {
  resetData();
  db.pll_activities[0].instructions = "[[direction-comparison]]";
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Practice choosing/ }));
  const comparisonButton = screen.getByRole("button", { name: "Review my comparison" });
  assert.equal(comparisonButton.disabled, true);
  for (const index of ["A", "B"]) {
    const position = index === "A" ? 0 : 1;
    for (const label of ["Possible project direction", "Relevance: why it matters", "Feasibility: what is available", "Scope: a small first test", "One tradeoff"]) {
      const inputs = screen.getAllByLabelText(label);
      fireEvent.change(inputs[position], { target: { value: `${index}: ${label}` } });
    }
  }
  fireEvent.click(screen.getByRole("radio", { name: /Direction A/ }));
  fireEvent.change(screen.getByLabelText("What information or feedback could make you reconsider?"), { target: { value: "A test fails to teach me anything" } });
  fireEvent.change(screen.getByLabelText("What specific question would you ask your facilitator?"), { target: { value: "Is my first step narrow enough?" } });
  assert.equal(comparisonButton.disabled, false);
  fireEvent.click(comparisonButton);
  assert.ok(screen.getByText(/confirms the comparison steps, not the quality/));
  assert.equal(db.pll_drafts.length, 0);
  const response = screen.getByLabelText("Your practice reflection or question for feedback");
  fireEvent.change(response, { target: { value: "My other draft" } });
  window.confirm = () => false;
  fireEvent.click(screen.getByRole("button", { name: "Use this comparison in my course response" }));
  assert.equal(response.value, "My other draft");
  assert.equal(screen.queryByText(/not been saved or shared/), null);
  window.confirm = () => true;
  fireEvent.click(screen.getByRole("button", { name: "Use this comparison in my course response" }));
  assert.match(response.value, /DIRECTION A/);
  assert.match(response.value, /Is my first step narrow enough/);
  assert.equal(db.pll_drafts.length, 0);
  fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
  await waitFor(() => assert.equal(db.pll_drafts.length, 1));
  assert.match(db.pll_drafts[0].response_text, /DIRECTION B/);
});

test("Module 1 protected walkthrough preserves unsaved in-page ideas across lesson steps", () => {
  render(React.createElement(ModuleOneWalkthrough));
  assert.ok(screen.getByText(/Review prototype only/));
  fireEvent.click(screen.getByRole("button", { name: /02 · Starting point/ }));
  fireEvent.change(screen.getByLabelText(/Two interests, questions, or problems/), { target: { value: "Clouds and music" } });
  fireEvent.click(screen.getByRole("button", { name: /04 · Compare ideas/ }));
  assert.ok(screen.getByRole("heading", { name: "Compare ideas" }));
  const gauntlet = screen.getByRole("link", { name: /Open Project Launch Gauntlet/ });
  assert.equal(gauntlet.getAttribute("href"), "https://project-launch-gauntlet.vercel.app/");
  assert.equal(gauntlet.getAttribute("target"), "_blank", "Game must preserve the draft in this course tab");
  assert.match(gauntlet.getAttribute("rel"), /noopener/);
  assert.ok(screen.getByText(/Gauntlet does not/));
  fireEvent.click(screen.getByText(/Use the text-only alternative/));
  assert.ok(screen.getByText(/Devon wants to share stories/));
  fireEvent.click(screen.getByRole("button", { name: /02 · Starting point/ }));
  assert.equal(screen.getByLabelText(/Two interests, questions, or problems/).value, "Clouds and music");
});

test("optional Gauntlet insight accompanies personal comparison without requiring a game score", async () => {
  resetData();
  db.pll_activities[0].instructions = "[[gauntlet-bridge]]\n\n[[direction-comparison]]";
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Practice choosing/ }));
  assert.ok(screen.getByRole("link", { name: /Open Project Launch Gauntlet/ }));
  const insight = screen.getByLabelText(/Optional: What did the Gauntlet/);
  fireEvent.change(insight, { target: { value: "Permission matters more than a fast public launch." } });
  for (const index of ["A", "B"]) {
    const position = index === "A" ? 0 : 1;
    for (const label of ["Possible project direction", "Relevance: why it matters", "Feasibility: what is available", "Scope: a small first test", "One tradeoff"]) {
      fireEvent.change(screen.getAllByLabelText(label)[position], { target: { value: index + " " + label } });
    }
  }
  fireEvent.click(screen.getByRole("radio", { name: /Direction A/ }));
  fireEvent.change(screen.getByLabelText("What information or feedback could make you reconsider?"), { target: { value: "A constraint I overlooked" } });
  fireEvent.change(screen.getByLabelText("What specific question would you ask your facilitator?"), { target: { value: "Is this safe and small enough?" } });
  fireEvent.click(screen.getByRole("button", { name: "Review my comparison" }));
  fireEvent.click(screen.getByRole("button", { name: "Use this comparison in my course response" }));
  const response = screen.getByLabelText("Your practice reflection or question for feedback");
  assert.match(response.value, /Permission matters more than a fast public launch/);
  assert.match(response.value, /not a score/);
  assert.equal(db.pll_drafts.length, 0, "Preparing text must not silently save");
  assert.equal(db.pll_submissions.length, 0, "Preparing text must not silently share");
});

function addModuleTwoActivity(title, marker) {
  db.pll_modules.push({ id: "module-2", course_id: "course-1", module_number: 2, title: "Plan & Launch", is_published: true });
  db.pll_activities.push({ id: "m2-activity", course_id: "course-1", module_id: "module-2",
    slug: "m2-formative", title, instructions: marker, is_published: true });
}

test("authenticated Module 2 First Move Card prepares but does not silently submit a formative plan", async () => {
  resetData();
  addModuleTwoActivity("First Move Card", "[[first-move-card]]");
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /First Move Card/ }));
  const review = screen.getByRole("button", { name: "Review my First Move Card" });
  assert.equal(review.disabled, true);
  const prompts = [
    "My project direction", "My purpose and who or what it serves", "The smallest safe first action",
    "What I want to learn", "Three ordered milestones and my first checkpoint",
    "Materials, permission, trusted support and low-resource alternative",
    "One possible constraint and a safe substitute", "Non-sensitive evidence I could collect",
    "What I could learn even if my attempt does not work", "One specific question for facilitator feedback",
  ];
  for (const label of prompts) {
    fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value: `Plan: ${label}` } });
  }
  assert.equal(review.disabled, false);
  fireEvent.click(review);
  assert.ok(screen.getByText(/This check confirms the prompts are filled in/));
  fireEvent.click(screen.getByRole("button", { name: "Use this card in my course response" }));
  const response = screen.getByLabelText("Your practice reflection or question for feedback");
  assert.match(response.value, /FIRST MOVE CARD/);
  assert.match(response.value, /Non-sensitive evidence I could collect/);
  assert.equal(db.pll_drafts.length, 0);
  assert.equal(db.pll_submissions.length, 0);
  fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
  await waitFor(() => assert.equal(db.pll_drafts.length, 1));
  assert.equal(db.pll_drafts[0].activity_id, "m2-activity");
  assert.equal(db.pll_submissions.length, 0);
});

test("long First Move Card supports an explicit incomplete draft without pretending completion", async () => {
  resetData();
  addModuleTwoActivity("First Move Card", "[[first-move-card]]");
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /First Move Card/ }));
  const prepare = screen.getByRole("button", { name: "Prepare working copy for Save draft" });
  assert.equal(prepare.disabled, true);
  fireEvent.change(screen.getByLabelText(/My project direction/), { target: { value: "Try one drawing prompt" } });
  assert.equal(prepare.disabled, false);
  assert.equal(screen.getByRole("button", { name: "Review my First Move Card" }).disabled, true);
  fireEvent.click(prepare);
  const response = screen.getByLabelText("Your practice reflection or question for feedback");
  assert.match(response.value, /INCOMPLETE WORKING COPY/);
  assert.match(response.value, /Try one drawing prompt/);
  assert.equal(db.pll_drafts.length, 0);
  fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
  await waitFor(() => assert.equal(db.pll_drafts.length, 1));
  assert.equal(db.pll_submissions.length, 0);
});

test("real-obstacle path transfers honest conditions and no invented attempt into ungraded draft", async () => {
  resetData();
  addModuleTwoActivity("Evidence or obstacle", "[[first-move-evidence]]");
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Evidence or obstacle/ }));
  const review = screen.getByRole("button", { name: "Review my evidence and decision" });
  assert.equal(review.disabled, true);
  fireEvent.change(screen.getByLabelText(/Project direction \(or a change/), { target: { value: "Sketch a guide for one beginner" } });
  fireEvent.click(screen.getByRole("radio", { name: /A genuine obstacle prevented/ }));
  const obstaclePrompts = [
    "What actually blocked the planned action", "Why I did not push past the barrier",
    "What I learned about the conditions", "A safer or lower-resource alternative", "What remains genuinely untested",
  ];
  for (const label of obstaclePrompts) fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value: `A real condition: ${label}` } });
  fireEvent.click(screen.getByRole("radio", { name: /Not yet—I will record a question/ }));
  fireEvent.change(screen.getByLabelText("What question is still waiting for feedback?"), { target: { value: "Could I check a paper prototype instead?" } });
  fireEvent.change(screen.getByLabelText("My next safe move, based on what I now know"), { target: { value: "Ask a trusted adult about a safe alternative" } });
  assert.equal(review.disabled, false);
  fireEvent.click(review);
  assert.ok(screen.getByText(/A barrier is legitimate evidence/));
  fireEvent.click(screen.getByRole("button", { name: "Use this record in my course response" }));
  const response = screen.getByLabelText("Your practice reflection or question for feedback");
  assert.match(response.value, /A genuine obstacle prevented the first move/);
  assert.match(response.value, /Feedback status: Not received yet/);
  assert.doesNotMatch(response.value, /What I actually did/);
  assert.equal(db.pll_submissions.length, 0);
  fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
  await waitFor(() => assert.equal(db.pll_drafts.length, 1));
  assert.equal(db.pll_drafts[0].activity_id, "m2-activity");
  assert.equal(db.pll_submissions.length, 0);
});

test("actual-attempt path distinguishes observation, limits and feedback-driven revision", () => {
  render(React.createElement(FirstMoveEvidence));
  fireEvent.change(screen.getByLabelText(/Project direction \(or a change/), { target: { value: "Make a three-step sketch guide" } });
  fireEvent.click(screen.getByRole("radio", { name: /I safely tried a small first move/ }));
  const attemptPrompts = [
    "What I actually did", "What I observed—not what I assumed",
    "What differed from my prediction", "What this single attempt cannot tell me", "My non-sensitive evidence record",
  ];
  for (const label of attemptPrompts) fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value: `Observed: ${label}` } });
  fireEvent.click(screen.getByRole("radio", { name: /Yes, I can describe what someone said/ }));
  fireEvent.change(screen.getByLabelText("What feedback did you actually receive?"), { target: { value: "The first picture needs clearer arrows" } });
  fireEvent.click(screen.getByRole("radio", { name: /I revised my plan/ }));
  fireEvent.change(screen.getByLabelText("Explain the change or why you kept the original plan"), { target: { value: "A friend could not follow the first drawing" } });
  fireEvent.change(screen.getByLabelText("My next safe move, based on what I now know"), { target: { value: "Revise the first arrow" } });
  fireEvent.click(screen.getByRole("button", { name: "Review my evidence and decision" }));
  const summary = screen.getByLabelText("Your evidence and reflection (select and copy if useful)").value;
  assert.match(summary, /Honest evidence route: I safely tried a small first move/);
  assert.match(summary, /Actual feedback: The first picture needs clearer arrows/);
  assert.match(summary, /My response to feedback: Revised the plan/);
  assert.doesNotMatch(summary, /Why I did not push past the barrier/);
});

test("pending First Move feedback stays an incomplete working copy and cannot be promoted to final revision", () => {
  render(React.createElement(FirstMoveRevision));
  fireEvent.change(screen.getByLabelText("Original First Move Card action or relevant excerpt"),
    { target: { value: "Draft a paper garden map" } });
  fireEvent.click(screen.getByRole("radio", { name: /Not yet; I am still waiting/ }));
  fireEvent.change(screen.getByLabelText("What question are you waiting to have answered?"),
    { target: { value: "Is a sketch enough to begin?" } });
  fireEvent.change(screen.getByLabelText("What remains uncertain or untested?"),
    { target: { value: "Whether the space is available" } });
  fireEvent.change(screen.getByLabelText("My next safe step or feedback checkpoint"),
    { target: { value: "Ask the facilitator next week" } });
  assert.equal(screen.getByRole("button", { name: "Review my feedback decision" }).disabled, true);
  const workingCopy = screen.getByLabelText("Working note (copy if you need to leave)").value;
  assert.match(workingCopy, /INCOMPLETE WORKING COPY/);
  assert.match(workingCopy, /Awaiting feedback/);
  assert.match(workingCopy, /No claim of revision or retention after feedback/);
  assert.equal(screen.queryByRole("button", { name: /Use my revision record/ }), null);
});

test("a retained plan records actual feedback and a justified decision without requiring fictional changes", () => {
  render(React.createElement(FirstMoveRevision));
  fireEvent.change(screen.getByLabelText("Original First Move Card action or relevant excerpt"),
    { target: { value: "Ask for garden approval before making changes" } });
  fireEvent.click(screen.getByRole("radio", { name: /Yes, feedback has arrived/ }));
  fireEvent.change(screen.getByLabelText(/What feedback did you actually receive/),
    { target: { value: "Check whether we also need a budget" } });
  fireEvent.click(screen.getByRole("radio", { name: /I kept the plan and can explain why/ }));
  fireEvent.change(screen.getByLabelText("Why is keeping the original plan still justified?"),
    { target: { value: "Permission comes before costs; I will ask about budget in that meeting" } });
  fireEvent.change(screen.getByLabelText("What remains uncertain or untested?"),
    { target: { value: "Garden budget and permission" } });
  fireEvent.change(screen.getByLabelText("My next safe step or feedback checkpoint"),
    { target: { value: "Ask the school office next Tuesday" } });
  assert.equal(screen.queryByLabelText("My revised safe first action or changed planning step"), null);
  fireEvent.click(screen.getByRole("button", { name: "Review my feedback decision" }));
  const record = screen.getByLabelText("Your separate feedback and revision record").value;
  assert.match(record, /Retained the plan with reasons/);
  assert.match(record, /Permission comes before costs/);
  assert.doesNotMatch(record, /Revised safe first action or relevant planning change:/);
});

test("separate authenticated feedback follow-up cannot overwrite an earlier final First Move Card", async () => {
  resetData();
  db.pll_modules.push({ id: "module-2", course_id: "course-1", module_number: 2,
    title: "Plan & Launch", is_published: true });
  db.pll_activities.push(
    { id: "first-card", course_id: "course-1", module_id: "module-2", slug: "first-move-card",
      title: "First Move Card", instructions: "[[first-move-card]]", is_published: true },
    { id: "revision-follow-up", course_id: "course-1", module_id: "module-2", slug: "revision-follow-up",
      title: "Feedback revision follow-up", instructions: "[[first-move-revision]]", is_published: true }
  );
  const originalText = "FIRST MOVE CARD: I will sketch one garden area before asking permission.";
  db.pll_submissions.push({ id: "original-final", activity_id: "first-card", course_id: "course-1",
    learner_id: "learner-1", response_text: originalText, submitted_at: "2026-11-18T12:00:00Z" });
  window.confirm = () => true;
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Feedback revision follow-up/ }));
  fireEvent.change(screen.getByLabelText("Original First Move Card action or relevant excerpt"),
    { target: { value: "Sketch one garden area before asking permission" } });
  fireEvent.click(screen.getByRole("radio", { name: /Yes, feedback has arrived/ }));
  fireEvent.change(screen.getByLabelText(/What feedback did you actually receive/),
    { target: { value: "Ask a teacher about site boundaries first" } });
  fireEvent.click(screen.getByRole("radio", { name: "I revised my plan" }));
  fireEvent.change(screen.getByLabelText("What did the feedback change in your reasoning?"),
    { target: { value: "A sketch could imply permission that has not been granted" } });
  fireEvent.change(screen.getByLabelText("My revised safe first action or changed planning step"),
    { target: { value: "Ask for the school's boundaries before drawing" } });
  fireEvent.change(screen.getByLabelText("What remains uncertain or untested?"),
    { target: { value: "Whether any location is approved" } });
  fireEvent.change(screen.getByLabelText("My next safe step or feedback checkpoint"),
    { target: { value: "Request a teacher conversation" } });
  fireEvent.click(screen.getByRole("button", { name: "Review my feedback decision" }));
  fireEvent.click(screen.getByRole("button", { name: "Use my revision record in this course activity" }));
  const draftText = screen.getByLabelText("Your practice reflection or question for feedback").value;
  assert.match(draftText, /Revised the plan/);
  assert.match(draftText, /school's boundaries/);
  assert.equal(db.pll_submissions.length, 1, "A preparation action must not submit anything");
  assert.equal(db.pll_submissions[0].response_text, originalText);
  fireEvent.click(screen.getByRole("button", { name: "Share with facilitator (final)" }));
  await waitFor(() => assert.equal(db.pll_submissions.length, 2));
  assert.equal(db.pll_submissions.find(row => row.activity_id === "first-card").response_text, originalText);
  assert.equal(db.pll_submissions.find(row => row.activity_id === "revision-follow-up").response_text, draftText);
  assert.equal(calls.filter(call => call.table === "pll_submissions" && call.kind === "insert").length, 1);
});

test("Ari transfer scenario remembers earlier choice and its explanatory feedback", () => {
  render(React.createElement(FirstMoveStudio));
  assert.ok(screen.getByText(/Ari wants to make a 30-second practice track/));
  fireEvent.click(screen.getAllByRole("radio")[1]);
  fireEvent.click(screen.getByRole("button", { name: "Show feedback" }));
  assert.ok(screen.getByRole("status").textContent.includes("short sample"));
  fireEvent.click(screen.getByRole("button", { name: "Next decision" }));
  fireEvent.click(screen.getByRole("button", { name: "Previous decision" }));
  assert.equal(screen.getAllByRole("radio")[1].checked, true);
  assert.ok(screen.getByRole("status").textContent.includes("short sample"));
});

test("protected Module 2 preview carries the in-session plan direction into the evidence screen", () => {
  render(React.createElement(ModuleTwoWalkthrough));
  assert.ok(screen.getByText(/Synthetic design review/));
  fireEvent.click(screen.getByRole("button", { name: /06 · First Move Card/ }));
  fireEvent.change(screen.getByLabelText(/My project direction/), { target: { value: "Investigate a tiny sketch guide" } });
  fireEvent.click(screen.getByRole("button", { name: /08 · Action or obstacle/ }));
  assert.match(screen.getByText(/Your draft direction from this preview:/).parentElement.textContent,
    /Investigate a tiny sketch guide/);
  fireEvent.click(screen.getByRole("button", { name: /06 · First Move Card/ }));
  assert.equal(screen.getByLabelText(/My project direction/).value, "Investigate a tiny sketch guide");
});

test("Module 2 teaches planning vocabulary and at least three ordered milestones before application", () => {
  render(React.createElement(FirstStepMiniLesson));
  assert.ok(screen.getByRole("heading", { name: "What makes a first step feasible?" }));
  assert.match(screen.getByText(/Break a larger direction into at least three/).textContent, /three ordered/);
  assert.match(screen.getByText(/First-action checklist:/).parentElement.textContent, /evidence/);
  assert.equal(screen.queryByText(/Submit quiz/), null);
});

test("Maya garden model distinguishes planned action from performed evidence", () => {
  render(React.createElement(MayaGardenModel));
  assert.equal(screen.queryByRole("status", { name: "Annotated garden plan" }), null);
  fireEvent.click(screen.getByRole("button", { name: "Show annotated model" }));
  const model = screen.getByRole("status", { name: "Annotated garden plan" });
  assert.match(model.textContent, /Missing permission or supplies/);
  assert.match(model.textContent, /if collected/);
  assert.match(model.textContent, /not a claim that Maya obtained permission/);
  fireEvent.click(screen.getByRole("button", { name: "Hide annotated model" }));
  assert.equal(screen.queryByRole("status", { name: "Annotated garden plan" }), null);
});

test("Module 2 three guided checks disclose nine answer-specific explanations and support retry", () => {
  const { container } = render(React.createElement(FirstStepChecks));
  const sections = container.querySelectorAll(".foundation-check");
  assert.equal(sections.length, 3);
  const expected = [
    [/Interest explains purpose/, /Permission is a real/, /Plant choice might matter/],
    [/Physical changes before permission/, /Spending money is not needed/, /A sketch and requirements check/],
    [/Confidence is still a prediction/, /observed feedback/, /predicts other people's reactions/],
  ];
  sections.forEach((section, question) => {
    assert.equal(within(section).getByRole("button", { name: "Show explanation" }).disabled, true);
    for (let choice = 0; choice < 3; choice++) {
      fireEvent.click(within(section).getAllByRole("radio")[choice]);
      fireEvent.click(within(section).getByRole("button", { name: "Show explanation" }));
      assert.match(within(section).getByRole("status").textContent, expected[question][choice]);
      fireEvent.click(within(section).getByRole("button", { name: "Try this question again" }));
    }
  });
});

test("Module 2 private walkthrough orders Learn, garden model and checks before fresh Studio scenario", () => {
  render(React.createElement(ModuleTwoWalkthrough));
  fireEvent.click(screen.getByRole("button", { name: /02 · Learn first steps/ }));
  assert.ok(screen.getByRole("heading", { name: "What makes a first step feasible?" }));
  fireEvent.click(screen.getByRole("button", { name: /03 · Maya's garden model/ }));
  fireEvent.click(screen.getByRole("button", { name: "Show annotated model" }));
  fireEvent.click(screen.getByRole("button", { name: /04 · Guided checks/ }));
  assert.ok(screen.getByRole("heading", { name: "Check your first-step reasoning" }));
  fireEvent.click(screen.getByRole("button", { name: /05 · First Move Studio/ }));
  assert.match(screen.getByText(/Transfer to a fresh scenario/).parentElement.textContent, /rhythm guide/);
  fireEvent.click(screen.getByRole("button", { name: /03 · Maya's garden model/ }));
  assert.ok(screen.getByRole("status", { name: "Annotated garden plan" }));
});

test("source-only Module 2 foundation markers render in a hypothetical authenticated lesson without a submission", async () => {
  resetData();
  addModuleTwoActivity("First-step foundations",
    "[[first-step-mini-lesson]]\n\n[[maya-garden-model]]\n\n[[first-step-checks]]");
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /First-step foundations/ }));
  assert.ok(screen.getByRole("heading", { name: "What makes a first step feasible?" }));
  assert.ok(screen.getByRole("heading", { name: "Maya's school garden: a worked decision" }));
  assert.ok(screen.getByRole("heading", { name: "Check your first-step reasoning" }));
  assert.equal(db.pll_submissions.length, 0);
  assert.equal(db.pll_drafts.length, 0);
});

test("academic Launch Portfolio rubric has four distinct criteria with 15/10/5/0 level descriptors", () => {
  assert.equal(academicLaunchPortfolioRubric.length, 4);
  assert.deepEqual([...academicLaunchPortfolioPointBands], [15, 10, 5, 0]);
  assert.equal(academicLaunchPortfolioRubric.reduce((sum, criterion) => sum + criterion.maximumPoints, 0), 60);
  assert.ok(academicLaunchPortfolioRubric.every(criterion => criterion.bands.length === 4));
  assert.match(academicLaunchPortfolioRubric[2].bands[0], /credible documented obstacle/);
  const { container } = render(React.createElement(LaunchPortfolioRubricReview));
  assert.ok(screen.getByRole("heading", { name: /Proposed Launch Portfolio assessment — 60 points/ }));
  assert.equal(container.querySelectorAll("details").length, 4);
  fireEvent.click(screen.getByText(/Criterion 3: First action and evidence interpretation/));
  assert.match(screen.getByText(/Provides inspectable evidence of an attempt or credible documented obstacle/).textContent,
    /recognizes at least one limit/);
  assert.equal(screen.queryByRole("button", { name: /Submit|Publish|Save grade/ }), null);
});

test("live-style three-by-ten rubric fails academic alignment comparison without altering any scores", () => {
  const live = [
    { title: "Feasible plan", maximum_points: "10.00" },
    { title: "First-action evidence", maximum_points: "10.00" },
    { title: "Evidence-informed next step", maximum_points: "10.00" },
  ];
  const mismatch = compareLaunchPortfolioRubric(live);
  assert.equal(mismatch.matchesAcademicDraft, false);
  assert.equal(mismatch.actualTotal, 30);
  assert.equal(mismatch.academicTotal, 60);
  assert.match(mismatch.problems.join(" "), /Expected four criteria/);
  const matched = compareLaunchPortfolioRubric(academicLaunchPortfolioRubric.map(row => ({
    title: row.title, maximum_points: row.maximumPoints,
  })));
  assert.equal(matched.matchesAcademicDraft, true);
  assert.equal(matched.actualTotal, 60);
  assert.equal(matched.problems.length, 0);
});

test("new instructional introduction is first but not an outstanding response", async () => {
  resetData();
  db.pll_activities.push({
    id: "intro-1", course_id: "course-1", module_id: "module-1",
    slug: "uuid-intro", title: "Module 1 Introduction — Discover & Define",
    instructions: "Welcome: read this before practicing.", is_published: true,
  });
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  assert.ok(screen.getByText("of 2 requested responses shared"));
  fireEvent.click(screen.getByRole("button", { name: "Begin exploring" }));
  assert.ok(screen.getByText("Welcome: read this before practicing."));
  assert.match(screen.getByText(/no final shared response is required/i).textContent,
    /no final shared response/i);
});

test("after sharing a response, home returns the learner to the ordered pathway", async () => {
  resetData();
  db.pll_submissions.push({
    id: "shared-practice", course_id: "course-1", activity_id: "practice-1",
    learner_id: "learner-1", response_text: "I chose a smaller step.", submitted_at: "2026-11-18T12:00:00Z",
  });
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  fireEvent.click(screen.getByRole("button", { name: "Open module pathway" }));
  assert.ok(screen.getByRole("navigation", { name: "Module lessons" }));
  assert.ok(screen.getByRole("button", { name: /Practice choosing/ }));
});

test("held Launch Portfolio hides obsolete 30-point rubric across assignments and lesson while preserving drafts", async () => {
  resetData();
  addUnreconciledLaunchPortfolio();
  render(React.createElement(StudioPage));

  fireEvent.click(await screen.findByRole("button", { name: "Assignments" }));
  const heading = screen.getByRole("heading", { name: "Launch Portfolio" });
  const card = heading.closest("article");
  assert.ok(card);
  assert.match(card.textContent, /Assessment on hold/);
  assert.match(card.textContent, /final submission and grading are not available/);
  assert.doesNotMatch(card.textContent, /30 points/);
  const brief = screen.getByRole("heading", { name: "Direction Brief" }).closest("article");
  assert.match(brief.textContent, /10 points/, "Other graded rubrics remain visible");

  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Launch Portfolio/ }));
  assert.equal(screen.queryByText("How your work will be evaluated"), null);
  assert.match(screen.getByRole("status").textContent, /obsolete rubric is hidden/);
  assert.equal(screen.queryByRole("heading", { name: /Proposed Launch Portfolio assessment/ }), null);
  assert.equal(screen.getByRole("button", { name: "Submit final response" }).disabled, true);
  assert.equal(screen.getByRole("button", { name: "Save draft" }).disabled, false);
});

test("instructor can inspect the held academic rubric and all evaluation items before any submissions", async () => {
  resetData();
  currentUserId = "facilitator-1";
  db.pll_memberships = [{ course_id: "course-1", user_id: currentUserId, member_role: "facilitator" }];
  addUnreconciledLaunchPortfolio();
  render(React.createElement(StudioPage));

  fireEvent.click(await screen.findByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Launch Portfolio/ }));
  const rubric = screen.getByRole("region", { name: /Proposed Launch Portfolio assessment — 60 points/ });
  assert.equal(rubric.querySelectorAll("summary").length, 4);
  assert.equal(rubric.querySelectorAll("dt").length, 16);
  assert.equal(screen.queryByRole("button", { name: "Submit final response" }), null);

  fireEvent.click(screen.getByRole("button", { name: "Evaluation" }));
  await screen.findByText("0 responses");
  assert.equal(screen.getAllByRole("listitem").length, 10);
  assert.ok(screen.getByText(/Optional written response/));
  assert.equal(screen.queryByRole("button", { name: "Submit evaluation" }), null);
  assert.equal(calls.length, 0);
});

test("learner can read the configured academic rubric with final submission still held", async () => {
  resetData();
  addUnreconciledLaunchPortfolio();
  db.pll_rubric_criteria = db.pll_rubric_criteria.filter(item => item.activity_id !== "launch-portfolio-1");
  for (const [index, rubric] of academicLaunchPortfolioRubric.entries()) {
    db.pll_rubric_criteria.push({
      id: `configured-${index}`, activity_id: "launch-portfolio-1", course_id: "course-1",
      position: index + 1, title: rubric.title, description: rubric.evidence, maximum_points: 15,
    });
  }
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /^Launch Portfolio/ }));
  assert.match(screen.getByRole("status").textContent, /academic 60-point rubric is configured/);
  const rubric = screen.getByRole("region", { name: /Proposed Launch Portfolio assessment — 60 points/ });
  assert.equal(rubric.querySelectorAll("dt").length, 16);
  assert.equal(screen.getByRole("button", { name: "Submit final response" }).disabled, true);
  assert.equal(calls.length, 0);
});

test("feedback shows a complete published score and omits instructional activities", async () => {
  resetData();
  db.pll_activities.push({
    id: "intro", course_id: "course-1", module_id: "module-1", slug: "module-one-introduction",
    title: "Module 1 Introduction", instructions: "Welcome.", is_published: true,
  });
  db.pll_submissions.push({
    id: "graded-response", activity_id: "graded-1", course_id: "course-1", learner_id: "learner-1",
    response_text: "I compared two directions.", submitted_at: "2026-11-18T12:00:00Z",
  });
  db.pll_feedback.push({
    id: "review", course_id: "course-1", submission_id: "graded-response", summary: "Explain the tradeoff.",
    published_at: "2026-11-18T12:30:00Z",
  });
  db.pll_rubric_scores.push({
    id: "score", course_id: "course-1", submission_id: "graded-response", criterion_id: "criterion-1", awarded_points: 8, criterion_note: "",
  });
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Feedback" }));
  assert.ok(screen.getByText(/8 \/ 10 points/));
  assert.equal(screen.queryByRole("button", { name: "Module 1 Introduction" }), null);
});


test("approved rubric and backend release status enable the Portfolio learner submission", async () => {
  resetData();
  addUnreconciledLaunchPortfolio();
  db.portfolioOpen = true;
  db.pll_rubric_criteria = db.pll_rubric_criteria.filter(item => item.activity_id !== "launch-portfolio-1");
  for (const [index, rubric] of academicLaunchPortfolioRubric.entries()) {
    db.pll_rubric_criteria.push({
      id: `configured-${index}`, activity_id: "launch-portfolio-1", course_id: "course-1",
      position: index + 1, title: rubric.title, description: rubric.evidence, maximum_points: 15,
    });
  }
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /^Launch Portfolio/ }));
  fireEvent.change(screen.getByLabelText("Your project reasoning or response"), { target: { value: "Synthetic Portfolio evidence." } });
  const rubric = screen.getByRole("region", { name: /Launch Portfolio assessment — 60 points/ });
  assert.equal(rubric.querySelectorAll("dt").length, 16);
  assert.equal(screen.getByRole("button", { name: "Submit final response" }).disabled, false);
  assert.equal(calls.length, 0);
});

test("approved Portfolio review publishes all four academic grades and feedback", async () => {
  resetData();
  currentUserId = "facilitator-1";
  db.pll_memberships = [{ course_id: "course-1", user_id: currentUserId, member_role: "facilitator" }];
  db.portfolioOpen = true;
  addUnreconciledLaunchPortfolio();
  db.pll_rubric_criteria = db.pll_rubric_criteria.filter(item => item.activity_id !== "launch-portfolio-1");
  for (const [index, rubric] of academicLaunchPortfolioRubric.entries()) {
    db.pll_rubric_criteria.push({
      id: `academic-${index}`, activity_id: "launch-portfolio-1", course_id: "course-1",
      position: index + 1, title: rubric.title, description: rubric.evidence, maximum_points: 15,
    });
  }
  db.pll_submissions.push({ id: "portfolio-qa", activity_id: "launch-portfolio-1",
    course_id: "course-1", learner_id: "learner-1", response_text: "Synthetic Portfolio test.",
    submitted_at: "2026-11-18T12:00:00Z" });
  window.confirm = () => true;
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Review submissions" }));
  fireEvent.change(screen.getByLabelText("Submission to review"), { target: { value: "portfolio-qa" } });
  const points = [15, 10, 5, 0];
  academicLaunchPortfolioRubric.forEach((criterion, index) => {
    const input = screen.getByLabelText(`${criterion.title} — maximum 15 points`);
    assert.deepEqual(Array.from(input.options, option => option.value), ["", "15", "10", "5", "0"]);
    fireEvent.change(input, { target: { value: String(points[index]) } });
  });
  fireEvent.change(screen.getByLabelText("Overall feedback"), { target: { value: "QA feedback about the evidence." } });
  fireEvent.click(screen.getByRole("button", { name: "Publish complete review" }));
  await waitFor(() => assert.ok(calls.some(call => call.name === "pll_publish_review")));
  const review = calls.find(call => call.name === "pll_publish_review");
  assert.deepEqual(review.values.p_scores.map(score => score.points), points);
  assert.equal(review.values.p_summary, "QA feedback about the evidence.");
});


test("Ari checklist is a separate ungraded artifact that prepares and saves only on explicit learner actions", async () => {
  resetData();
  addModuleTwoActivity("First Move Studio", "[[first-move-studio]]");
  render(React.createElement(StudioPage));
  await screen.findByRole("heading", { name: /Start with curiosity/ });
  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /First Move Studio/ }));
  const labels = [
    "Purpose and learning question", "Resources and permission", "Safe, bounded action",
    "Observable evidence and its limit", "Constraint and fallback", "Privacy and sharing",
  ];
  for (const label of labels) {
    fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value: "Reasoned scenario note: " + label } });
  }
  const prepareName = "Use this checklist in my course response";
  assert.equal(screen.queryByRole("button", { name: prepareName }), null);
  for (const [step, choice] of [1, 0, 1].entries()) {
    fireEvent.click(screen.getAllByRole("radio")[choice]);
    fireEvent.click(screen.getByRole("button", { name: "Show feedback" }));
    if (step < 2) fireEvent.click(screen.getByRole("button", { name: "Next decision" }));
  }
  const prepare = screen.getByRole("button", { name: prepareName });
  fireEvent.click(prepare);
  const response = screen.getByLabelText("Your practice reflection or question for feedback");
  assert.match(response.value, /ARI FIRST-ACTION CHECKLIST/);
  assert.match(response.value, /not evidence of my own project attempt/);
  assert.match(response.value, /Privacy and sharing/);
  assert.equal(db.pll_drafts.length, 0);
  assert.equal(db.pll_submissions.length, 0);
  fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
  await waitFor(() => assert.equal(db.pll_drafts.length, 1));
  assert.equal(db.pll_drafts[0].activity_id, "m2-activity");
  assert.equal(db.pll_submissions.length, 0);
});

test("faculty preview checklist permits reading and copying but not course response preparation", () => {
  render(React.createElement(FirstMoveStudio, { review: true }));
  for (const label of ["Purpose and learning question", "Resources and permission", "Safe, bounded action",
    "Observable evidence and its limit", "Constraint and fallback", "Privacy and sharing"]) {
    fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value: "Practice note" } });
  }
  for (const [step, choice] of [1, 0, 1].entries()) {
    fireEvent.click(screen.getAllByRole("radio")[choice]);
    fireEvent.click(screen.getByRole("button", { name: "Show feedback" }));
    if (step < 2) fireEvent.click(screen.getByRole("button", { name: "Next decision" }));
  }
  assert.match(screen.getByLabelText(/Your scenario checklist/).value, /ARI FIRST-ACTION CHECKLIST/);
  assert.equal(screen.queryByRole("button", { name: /Use this checklist in my course response/ }), null);
});


test("unsaved course response survives cancelled navigation and is not silently submitted", async () => {
  resetData();
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Practice choosing/ }));
  const response = screen.getByLabelText("Your practice reflection or question for feedback");
  fireEvent.change(response, { target: { value: "My unsaved reasoning." } });
  assert.ok(screen.getByText(/Unsaved response changes/));
  let prompts = 0;
  window.confirm = () => { prompts++; return false; };
  fireEvent.click(screen.getByRole("button", { name: /Direction Brief/ }));
  assert.equal(response.value, "My unsaved reasoning.");
  fireEvent.click(screen.getByRole("button", { name: "Resources" }));
  assert.equal(response.value, "My unsaved reasoning.");
  assert.equal(prompts, 2);
  assert.equal(db.pll_drafts.length, 0);
  assert.equal(db.pll_submissions.length, 0);
  fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
  await waitFor(() => assert.ok(screen.getByText("Your draft was saved.")));
  assert.equal(screen.queryByText(/Unsaved response changes/), null);
  fireEvent.click(screen.getByRole("button", { name: /Direction Brief/ }));
  assert.equal(prompts, 2, "A saved response should not trigger the discard prompt");
  fireEvent.click(screen.getByRole("button", { name: /Practice choosing/ }));
  assert.equal(screen.getByLabelText("Your practice reflection or question for feedback").value, "My unsaved reasoning.");
  assert.equal(db.pll_submissions.length, 0);
});

test("confirming discard returns to the previously saved response rather than silently saving", async () => {
  resetData();
  db.pll_drafts.push({ id: "saved-draft", activity_id: "practice-1", course_id: "course-1", learner_id: "learner-1", response_text: "Previously saved work" });
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Practice choosing/ }));
  fireEvent.change(screen.getByLabelText("Your practice reflection or question for feedback"), { target: { value: "Uncommitted edit" } });
  window.confirm = () => true;
  fireEvent.click(screen.getByRole("button", { name: "Resources" }));
  fireEvent.click(screen.getByRole("button", { name: "Modules" }));
  assert.equal(screen.getByLabelText("Your practice reflection or question for feedback").value, "Previously saved work");
  assert.equal(db.pll_drafts[0].response_text, "Previously saved work");
  assert.equal(db.pll_submissions.length, 0);
});


test("module orientation identifies sequence and activity type without implying mastery", async () => {
  resetData();
  render(React.createElement(StudioPage));
  fireEvent.click(await screen.findByRole("button", { name: "Modules" }));
  fireEvent.click(screen.getByRole("button", { name: /Practice choosing/ }));
  const context = document.querySelector(".lesson-context");
  assert.match(context.textContent, /Module 1 · Discover & Define/);
  assert.match(context.textContent, /Activity 1 of 2 in this module · Practice and feedback/);
  assert.match(screen.getByRole("navigation", { name: "Module lessons" }).textContent, /Practice · share response/);
  fireEvent.click(screen.getByRole("button", { name: /Direction Brief/ }));
  assert.match(document.querySelector(".lesson-context").textContent, /Activity 2 of 2 in this module · Graded assignment/);
  assert.equal(db.pll_submissions.length, 0);
});


test("authored reading emphasis is retained without rendering arbitrary HTML", () => {
  const { LessonText } = require("./lesson-text.tsx");
  render(React.createElement(LessonText, {
    text: "## **Decision lenses**\n\n**Relevance:** Why does it matter?\n\n- **Scope:** Focus the idea.\n\n1. **Feasibility:** Check constraints.\n\nLiteral <img src=x onerror=alert(1)>."
  }));
  assert.equal(screen.getByRole("heading", { name: "Decision lenses" }).querySelector("strong").textContent, "Decision lenses");
  for (const label of ["Relevance:", "Scope:", "Feasibility:"]) {
    assert.equal(screen.getByText(label).tagName, "STRONG");
  }
  assert.ok(screen.getByText("Literal <img src=x onerror=alert(1)>."));
  assert.equal(document.querySelector("img"), null);
});
