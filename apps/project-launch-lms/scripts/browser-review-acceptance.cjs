/* eslint-disable @typescript-eslint/no-require-imports -- standalone CI-only browser harness */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLL_PLAYWRIGHT_MODULE || "playwright-core");

const courseId = "99dc9de5-bfbf-4891-8f5e-444212ec2073";
const reviewPath = "/review/project-launch-course";
const liveUrl = "https://project-launch-lms.vercel.app/studio?course=" + courseId;
const localOrigin = "http://127.0.0.1:3210";
const output = process.env.PLL_BROWSER_OUTPUT || "browser-review-evidence";
const widths = [1920, 1440, 1280, 1024, 768, 390, 320];

async function checkLayout(page, label) {
  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    width: document.documentElement.scrollWidth,
  }));
  assert.ok(layout.width <= layout.viewport + 2,
    label + ": horizontal page overflow " + JSON.stringify(layout));
}

async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.PLL_CHROME || "/usr/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox"],
  });
  try {
    // Independent signed-out check of the unchanged Canvas submission URL.
    // No cookies, account credentials, bypass token, or database writes.
    const live = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      const response = await live.goto(liveUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      assert.equal(response.status(), 200, "Submitted URL returns success in fresh browser");
      assert.equal(new URL(live.url()).pathname, reviewPath);
      await live.getByRole("heading", { name: "Project Launch Lab: From Curiosity to Action", exact: true }).waitFor();
      await live.getByRole("button", { name: "Modules", exact: true }).click();
      await live.getByRole("navigation", { name: "Module lessons" }).waitFor();
      assert.equal(await live.getByRole("navigation", { name: "Module lessons" }).getByRole("button").count(), 18);
      console.log("PASS: independent signed-out production URL and 18 lesson outline");
    } finally { await live.close(); }

    // Render exact branch build locally, with no Supabase credentials or
    // deployment-protection bypass. This is a public-review browser test,
    // not an authenticated course or live preview acceptance test.
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(localOrigin + reviewPath, { waitUntil: "domcontentloaded" });
      await page.getByRole("heading", { name: "Project Launch Lab: From Curiosity to Action", exact: true }).waitFor();
      await checkLayout(page, width + " home");
      if (width === 1440 || width === 390) await page.screenshot({ path: path.join(output, "home-" + width + ".png"), fullPage: true });
      await page.getByRole("button", { name: "Modules", exact: true }).click();
      const outline = page.getByRole("navigation", { name: "Module lessons" });
      assert.equal(await outline.getByRole("button").count(), 18);
      await page.getByRole("button", { name: "Begin Module 1" }).click();
      const title = page.locator("#review-lesson-title");
      for (let i = 0; i < 18; i++) {
        await title.waitFor();
        assert.equal(await outline.locator('[aria-current="page"]').count(), 1);
        await page.waitForFunction(() => document.activeElement?.id === "review-lesson-title");
        await checkLayout(page, width + " lesson " + (i + 1));
        if ((width === 1440 || width === 390) && [0, 2, 7, 11, 15].includes(i)) {
          await page.screenshot({ path: path.join(output, "lesson-" + (i + 1) + "-" + width + ".png"), fullPage: true });
        }
        if (i < 17) await page.getByRole("button", { name: "Next lesson", exact: true }).click();
      }
      for (const section of ["Assignments", "Resources", "Discussions", "Quiz", "Evaluation"]) {
        await page.getByRole("navigation", { name: "Course navigation" }).getByRole("button", { name: section, exact: true }).click();
        await checkLayout(page, width + " " + section);
      }
      assert.equal(await page.locator(".review-questions > li").count(), 11);
      console.log("PASS: " + width + "px home, 18 lessons, five other sections, lesson focus, no page overflow");
    }
    assert.deepEqual(errors, [], "No uncaught browser page errors");
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error.message); process.exitCode = 1; });
