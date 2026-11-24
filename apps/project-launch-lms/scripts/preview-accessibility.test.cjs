/* eslint-disable @typescript-eslint/no-require-imports -- This CJS test initializes a DOM before JSX imports. */
// Synthetic accessibility/sequence audit. jsdom cannot validate rendered contrast,
// keyboard/device behavior or authenticated persistence. Manual browser QA remains mandatory.
const assert = require("node:assert/strict");
const { test, afterEach } = require("node:test");
const Module = require("node:module");
const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!doctype html><html lang='en'><body></body></html>", {
  url: "https://example.test/module-one-preview",
  runScripts: "outside-only",
  pretendToBeVisual: true,
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

// Preview components never issue backend writes. Stub the browser client import
// only so the JSX modules can be loaded without real course configuration.
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === "@/lib/supabase-browser" || request.endsWith("/lib/supabase-browser")) {
    return { browserSupabase: () => ({}) };
  }
  if (request === "next/link") {
    // Keep the native anchor semantics, without Next's asynchronous prefetch
    // effects unrelated to this synthetic accessibility audit.
    return function Link({ href, children, ...props }) {
      return require("react").createElement("a", { ...props, href }, children);
    };
  }
  return originalLoad.call(this, request, parent, isMain);
};
require("tsx/cjs");
const React = require("react");
const { render, screen, fireEvent, cleanup, act } = require("@testing-library/react");
const { ModuleOneWalkthrough } = require("../app/module-one-preview/walkthrough.tsx");
const { ModuleTwoWalkthrough } = require("../app/module-two-preview/walkthrough.tsx");
Module._load = originalLoad;

const axe = require("axe-core");
dom.window.eval(axe.source);
afterEach(() => cleanup());

const checks = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  rules: { "color-contrast": { enabled: false } }, // jsdom lacks a real visual layout engine.
};

async function auditSteps(component, navLabel, expectedSteps) {
  const root = render(React.createElement(component));
  const nav = screen.getByRole("navigation", { name: navLabel });
  assert.equal(nav.getElementsByTagName("button").length, expectedSteps.length);

  for (let i = 0; i < expectedSteps.length; i++) {
    if (i > 0) {
      const tab = Array.from(nav.querySelectorAll("button"))[i];
      await act(async () => { fireEvent.click(tab); });
    }
    const heading = screen.getByRole("heading", { level: 2 });
    assert.equal(heading.textContent, expectedSteps[i], `Step ${i + 1} heading`);
    assert.equal(nav.querySelectorAll('[aria-current="step"]').length, 1, "Exactly one current step");
    assert.equal(nav.querySelector('[aria-current="step"]').textContent.includes(expectedSteps[i]), true);
    if (i > 0) assert.equal(document.activeElement, heading, "Navigation moves focus to the new step heading");
    const result = await dom.window.axe.run(root.container, checks);
    const failures = result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }));
    // axe runs in the jsdom realm; avoid cross-realm Array prototype comparisons.
    assert.equal(failures.length, 0,
      `No detectable semantic WCAG A/AA violations in ${expectedSteps[i]}: ${JSON.stringify(failures)}`);
  }
  return root;
}

test("Module 1 five-step journey has focus continuity and no detectable semantic WCAG A/AA failures", async () => {
  await auditSteps(ModuleOneWalkthrough, "Module 1 learning sequence", [
    "Welcome", "Starting point", "Learn the lenses", "Compare ideas", "Direction Brief",
  ]);
});

test("Module 2 nine-step journey has focus continuity and no detectable semantic WCAG A/AA failures", async () => {
  const root = await auditSteps(ModuleTwoWalkthrough, "Module 2 learning sequence", [
    "Welcome", "Learn first steps", "Maya's garden model", "Guided checks", "First Move Studio",
    "First Move Card", "Feedback & revision", "Action or obstacle", "Portfolio & transfer",
  ]);
  assert.match(root.container.textContent, /Rubric mismatch not resolved/);
});

test("Module 2 keeps a learner's working plan when visiting another step and returning", async () => {
  render(React.createElement(ModuleTwoWalkthrough));
  const nav = screen.getByRole("navigation", { name: "Module 2 learning sequence" });
  const tabs = Array.from(nav.querySelectorAll("button"));
  fireEvent.click(tabs[5]);
  const direction = screen.getByLabelText(/My project direction/);
  fireEvent.change(direction, { target: { value: "Test a small herb garden sketch" } });
  fireEvent.click(tabs[6]);
  assert.equal(screen.getByRole("heading", { level: 2 }).textContent, "Feedback & revision");
  fireEvent.click(tabs[5]);
  assert.equal(screen.getByLabelText(/My project direction/).value, "Test a small herb garden sketch");
});
