/* eslint-disable @typescript-eslint/no-require-imports -- The CommonJS harness must create DOM globals before loading React Testing Library. */
/* Synthetic DOM interaction checks for the local-only Module 1 Lesson 1 prototype.
 * They do not replace real-browser accessibility, server persistence or RLS tests. */
const assert = require("node:assert/strict");
const { test, afterEach } = require("node:test");
const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!doctype html><html lang='en'><body></body></html>", { url: "http://localhost" });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });

require("tsx/cjs");
const React = require("react");
const { render, screen, within, fireEvent, cleanup } = require("@testing-library/react");
const { ProjectDirectionLesson } = require("./project-direction-lesson.tsx");

afterEach(() => cleanup());

function mount() {
  return render(React.createElement(ProjectDirectionLesson));
}

function goTo(shortName) {
  fireEvent.click(screen.getByRole("button", { name: new RegExp(shortName) }));
}

test("preserves curiosity and provisional direction while navigating between screens", () => {
  mount();
  fireEvent.change(screen.getByLabelText("Something I care about or like exploring"), { target: { value: "Music and sound" } });
  fireEvent.change(screen.getByLabelText("Something I wonder about or might want to try"), { target: { value: "Can I make a rhythm guide?" } });
  goTo("Consider");
  fireEvent.change(screen.getByLabelText("My possible project direction"), { target: { value: "Make a short rhythm guide" } });
  fireEvent.click(screen.getAllByRole("checkbox")[0]);
  goTo("My draft");
  assert.match(screen.getByLabelText("Plain-text copy of my current draft").value, /Music and sound/);
  assert.equal(screen.getByLabelText("One direction I want to explore").value, "Make a short rhythm guide");
  goTo("Consider");
  assert.equal(screen.getByLabelText("My possible project direction").value, "Make a short rhythm guide");
  assert.equal(screen.getAllByRole("checkbox")[0].checked, true);
});

test("Tessa's feedback stays hidden until choice and provides three different explanations", () => {
  mount();
  goTo("Decide");
  assert.equal(screen.queryByRole("status", { name: "Decision feedback" }), null);
  const options = screen.getAllByRole("radio");
  assert.equal(screen.getByRole("button", { name: "Explore feedback" }).disabled, true);
  const expected = [/schoolwide launch/, /Videos might become useful later/, /fits her available tools/];
  for (let index = 0; index < 3; index++) {
    fireEvent.click(options[index]);
    fireEvent.click(screen.getByRole("button", { name: "Explore feedback" }));
    const feedback = screen.getByRole("status", { name: "Decision feedback" });
    assert.match(feedback.textContent, expected[index]);
    assert.match(feedback.textContent, /not a finished answer/i);
    fireEvent.click(screen.getByRole("button", { name: "Reconsider the options" }));
  }
});

test("all three practice scenarios require some reasoning before showing model and retain revisions", () => {
  mount();
  goTo("Practice A");
  let compare = screen.getByRole("button", { name: "Compare with a model response" });
  assert.equal(compare.disabled, true);
  const fields = screen.getAllByRole("textbox");
  for (let i = 0; i < 3; i++) fireEvent.change(fields[i], { target: { value: `Reason ${i + 1}` } });
  assert.equal(compare.disabled, false);
  fireEvent.click(compare);
  assert.match(screen.getByRole("status", { name: "Scenario model and guidance" }).textContent, /One defensible explanation/);
  goTo("Practice B");
  compare = screen.getByRole("button", { name: "Compare with a model response" });
  assert.equal(compare.disabled, true);
  for (const field of screen.getAllByRole("textbox")) fireEvent.change(field, { target: { value: "Not sure yet; I would ask a teacher." } });
  fireEvent.click(compare);
  assert.match(screen.getByRole("status", { name: "Scenario model and guidance" }).textContent, /permission/);
  goTo("Practice C");
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Meaning, resources and a small comparison" } });
  fireEvent.click(screen.getByRole("button", { name: "Compare with a model response" }));
  assert.match(screen.getByRole("status", { name: "Scenario model and guidance" }).textContent, /allergies/);
  goTo("Practice A");
  assert.equal(screen.getAllByRole("textbox")[0].value, "Reason 1");
});

test("all nine knowledge-check answer branches show distinct corrective feedback after response", () => {
  const { container } = mount();
  goTo("Check");
  const sections = container.querySelectorAll(".direction-quiz-item");
  assert.equal(sections.length, 3);
  const expected = [
    [/Missing permission/, /Permission is a feasibility/, /number of bins/],
    [/does not name a first product/, /large scope/, /one beginner/],
    [/No format is automatically better/, /explains the resources/, /Rejecting videos entirely/],
  ];
  sections.forEach((section, question) => {
    for (let choice = 0; choice < 3; choice++) {
      fireEvent.click(within(section).getAllByRole("radio")[choice]);
      fireEvent.click(within(section).getByRole("button", { name: "Show explanation" }));
      assert.match(within(section).getByRole("status").textContent, expected[question][choice]);
      fireEvent.click(within(section).getByRole("button", { name: "Try this question again" }));
    }
  });
});

test("draft preview includes learner answers and the bridge makes no submission claim", () => {
  mount();
  goTo("My draft");
  fireEvent.change(screen.getByLabelText("One direction I want to explore"), { target: { value: "Compare three notebook designs" } });
  fireEvent.change(screen.getByLabelText("Why it matters to me or someone else"), { target: { value: "To help students find their notes" } });
  assert.match(screen.getByLabelText("Plain-text copy of my current draft").value, /Compare three notebook designs/);
  assert.match(screen.getByLabelText("Plain-text copy of my current draft").value, /To help students find their notes/);
  assert.ok(screen.getByRole("button", { name: /Download my draft/ }));
  goTo("Next moves");
  assert.match(screen.getByText(/does not submit a grade/).textContent, /does not submit a grade/);
});
