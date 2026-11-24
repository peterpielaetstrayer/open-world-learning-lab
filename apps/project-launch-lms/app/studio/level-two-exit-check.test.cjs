/* eslint-disable @typescript-eslint/no-require-imports -- Test-only CJS harness loads client JSX in jsdom. */
const assert = require("node:assert/strict");
const { test, afterEach } = require("node:test");
const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!doctype html><html lang='en'><body></body></html>", { url: "https://example.test/studio" });
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
require("tsx/cjs");

const React = require("react");
const { render, screen, within, fireEvent, cleanup } = require("@testing-library/react");
const { LevelTwoExitCheck } = require("./level-two-exit-check.tsx");
const { LessonText } = require("./lesson-text.tsx");
afterEach(cleanup);

function fillReflection() {
  const confidence = screen.getByRole("group", { name: /How confident are you/ });
  const willingness = screen.getByRole("group", { name: /If a small test gives an unexpected result/ });
  fireEvent.click(within(confidence).getByRole("radio", { name: "4" }));
  fireEvent.change(screen.getByLabelText("What is one reason for your rating?"), { target: { value: "I can make a plan with available resources." } });
  fireEvent.click(within(willingness).getByRole("radio", { name: "5" }));
  fireEvent.change(screen.getByLabelText("What might make revising a plan difficult?"), { target: { value: "I may feel attached to my first idea." } });
  fireEvent.click(screen.getByRole("radio", { name: /Identify a resource or barrier before acting/ }));
  fireEvent.change(screen.getByLabelText(/Name the smallest possible step or explain a genuine barrier/), {
    target: { value: "I need to ask whether the space is available first." },
  });
  fireEvent.change(screen.getByLabelText(/Try the approach in a new setting/), {
    target: { value: "Ask for permission and test one paper mockup in the hour available." },
  });
}

test("ungraded exit reflection requires distinct confidence, disposition, intention and transfer responses", () => {
  render(React.createElement(LevelTwoExitCheck));
  const review = screen.getByRole("button", { name: "Review my next move" });
  assert.equal(review.disabled, true);
  assert.match(screen.getByText(/not graded and does not replace the knowledge check/).textContent, /not graded/);
  fillReflection();
  assert.equal(review.disabled, false);
  fireEvent.click(review);
  assert.ok(screen.getByText(/ratings describe how you feel now/));
  const summary = screen.getByLabelText(/Your reflection \(select and copy/).value;
  assert.match(summary, /Confidence.*4/);
  assert.match(summary, /Willingness.*5/);
  assert.match(summary, /Identify a resource or barrier before acting/);
  assert.match(summary, /Ask for permission and test one paper mockup/);
  assert.match(summary, /self-reports, not proof of behavior or learning gains/);
});

test("course response handoff is deliberate, explicit and invalidated by subsequent edits", () => {
  let prepared = "";
  render(React.createElement(LevelTwoExitCheck, { onPrepareResponse: value => { prepared = value; return true; } }));
  fillReflection();
  fireEvent.click(screen.getByRole("button", { name: "Review my next move" }));
  assert.equal(prepared, "");
  fireEvent.click(screen.getByRole("button", { name: "Use these answers in my course response" }));
  assert.match(prepared, /Your Next Move/);
  assert.ok(screen.getByText(/not saved or submitted yet/));
  fireEvent.change(screen.getByLabelText("What is one reason for your rating?"), { target: { value: "New reason" } });
  assert.equal(screen.queryByText(/not saved or submitted yet/), null);
  assert.equal(screen.queryByRole("button", { name: "Use these answers in my course response" }), null);
});

test("lesson shortcode mounts exit assessment without promising persistence", () => {
  render(React.createElement("div", null, LessonText({ text: "[[level-two-exit-check]]" })));
  assert.ok(screen.getByRole("heading", { name: "Your Next Move" }));
  fillReflection();
  fireEvent.click(screen.getByRole("button", { name: "Review my next move" }));
  assert.ok(screen.getByText(/This preview does not save answers to a learner account/).textContent);
});
