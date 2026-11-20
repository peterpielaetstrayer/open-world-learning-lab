/* eslint-disable @typescript-eslint/no-require-imports -- Node's built-in test runner reads the actual CSS source. */
// Representative static text/background checks, not a rendered-page contrast audit.
// Inherited and composited styles, focus, opacity, gradients, images and responsive
// overlays still need real-browser accessibility review before release.
const assert = require("node:assert/strict");
const { test } = require("node:test");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const css = readFileSync(join(__dirname, "../app/globals.css"), "utf8");

function ruleProperty(selector, property) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rule = css.match(new RegExp(`(?:^|})\\s*${escaped}\\s*\\{([^}]*)\\}`, "m"));
  assert.ok(rule, `Stylesheet must contain a rule for ${selector}`);
  const declaration = rule[1].split(";").map(value => value.trim())
    .find(value => value.startsWith(`${property}:`));
  assert.ok(declaration, `${selector} must declare ${property}`);
  return declaration.slice(property.length + 1).trim();
}

function color(value) {
  const resolved = value.startsWith("var(")
    ? ruleProperty(":root", value.slice(4, -1)) : value;
  assert.match(resolved, /^#(?:[a-f\d]{3}|[a-f\d]{6})$/i,
    `The sampled color must resolve to an opaque hex value: ${resolved}`);
  return resolved.length === 4
    ? `#${[...resolved.slice(1)].map(n => n + n).join("")}` : resolved;
}

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255);
  const linear = channels.map(channel => channel <= 0.04045
    ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const first = luminance(color(foreground));
  const second = luminance(color(background));
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

// Each row samples an actual CSS foreground declaration and the explicitly
// defined background of its own rule or a documented surrounding surface.
const samples = [
  ["Global reading text", "body", "body"],
  ["Default links on paper", "a", "body"],
  ["Hero introduction on paper", ".lead", "body"],
  ["Primary link", ".primary-link", ".primary-link"],
  ["Practice lab header", ".lab-header", ".lab-header"],
  ["Error feedback", ".form-error,.form-success", ".form-error,.form-success"],
  ["Success feedback", ".form-success", ".form-success"],
  ["Lesson tabs", ".module-one-tabs button", ".module-one-tabs button"],
  ["Active lesson tab", ".module-one-tabs button", ".module-one-tabs button[aria-current=step]"],
  ["Direction screen tabs", ".direction-steps button", ".direction-steps"],
  ["Current direction screen", ".direction-steps button[aria-current=step]", ".direction-steps button[aria-current=step]"],
  ["Direction step number", ".direction-step-number", ".direction-steps"],
  ["Course progress caution", ".course-activity-status .course-status-caution", "body"],
  ["Small preview note", ".preview-note", "body"],
  ["Course dashboard action", ".course-journey-card .text-button", ".course-journey-card"],
  ["Worked model summary", ".launch-model summary", ".launch-model"],
];

test("sixteen representative LMS text/background pairs meet WCAG AA 4.5:1 minimum", () => {
  const checked = samples.map(([name, foregroundSelector, backgroundSelector]) => {
    // The lab header and tabs declare their own foreground/background. The
    // inherited text colors here are intentionally sampled from the body.
    const foreground = ruleProperty(foregroundSelector, "color");
    const background = ruleProperty(backgroundSelector, "background");
    const ratio = contrastRatio(foreground, background);
    assert.ok(ratio >= 4.5, `${name}: ${ratio.toFixed(2)}:1 is below 4.5:1`);
    return { name, ratio: ratio.toFixed(2) };
  });
  assert.equal(checked.length, 16);
  console.log(`Static CSS color samples passed: ${checked.map(row => `${row.name} ${row.ratio}:1`).join(" · ")}`);
});
