/* OWLL Visual Review — source-rendered browser audit, no Vercel requests. */
/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const axePath = require.resolve("axe-core/axe.min.js");

const baseUrl = process.env.OWLL_PREVIEW_BASE || "http://127.0.0.1:3000";
const scope = process.env.OWLL_VISUAL_SCOPE || "all";
const sha = process.env.GITHUB_SHA || "local";
const routes = [
  ["/", "Home"],
  ["/start", "Start Learning"],
  ["/about", "About"],
  ["/work", "Current Work"],
  ["/work/first-landing", "First Landing"],
  ["/work/locus", "LOCUS"],
  ["/releases", "Releases"],
  ["/learning-environments", "Learning Environments"],
  ["/contact", "Contact"],
];
const tested = scope === "home" ? routes.slice(0, 2) : routes;
const profiles = [
  { label: "mobile", width: 390, height: 844 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "desktop", width: 1440, height: 900 },
];
const outputDir = path.resolve("visual-review-output");
const screenshotsDir = path.join(outputDir, "screenshots");
fs.mkdirSync(screenshotsDir, { recursive: true });
const results = [];

function safeName(p) {
  return p === "/" ? "home" : p.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-");
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function printPreviewImage(label, bytes) {
  // Small above-the-fold images can be inspected in ChatGPT through action logs.
  const encoded = bytes.toString("base64");
  console.log("OWLL_PREVIEW_BEGIN", label, bytes.length);
  for (let i = 0; i < encoded.length; i += 14000) {
    console.log("OWLL_PREVIEW_CHUNK", label, Math.floor(i / 14000), encoded.slice(i, i + 14000));
  }
  console.log("OWLL_PREVIEW_END", label);
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN || undefined,
    args: ["--no-sandbox"],
  });
  for (const profile of profiles) {
    const context = await browser.newContext({
      viewport: { width: profile.width, height: profile.height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    for (const [route, name] of tested) {
      const page = await context.newPage();
      const pageErrors = [];
      page.on("pageerror", error => pageErrors.push(String(error).slice(0, 200)));
      let response;
      try {
        response = await page.goto(baseUrl + route, { waitUntil: "networkidle", timeout: 60000 });
        await page.locator("main").first().waitFor({ timeout: 12000 });
      } catch (error) {
        results.push({ route, name, profile: profile.label, issues: [String(error)], screenshot: null, violations: [] });
        console.log("OWLL_AUDIT_ROW", JSON.stringify(results[results.length - 1]));
        await page.close();
        continue;
      }
      const structure = await page.evaluate(() => ({
        title: document.title,
        h1Count: document.querySelectorAll("h1").length,
        mainCount: document.querySelectorAll("main").length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        linkCount: document.querySelectorAll("main a[href]").length,
      }));
      await page.addScriptTag({ path: axePath });
      const violations = await page.evaluate(async () => {
        const report = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] }
        });
        return report.violations.map(v => ({
          id: v.id, impact: v.impact, count: v.nodes.length,
          examples: v.nodes.slice(0, 2).map(n => n.target.join(" "))
        }));
      });
      const issues = [];
      if (response?.status() !== 200) issues.push("HTTP " + response?.status());
      if (structure.h1Count !== 1) issues.push("Expected one H1, got " + structure.h1Count);
      if (structure.mainCount !== 1) issues.push("Expected one main, got " + structure.mainCount);
      if (structure.overflow > 2) issues.push("Horizontal overflow: " + structure.overflow + "px");
      if (pageErrors.length) issues.push("JS: " + pageErrors.join(", "));
      for (const v of violations.filter(v => ["critical", "serious"].includes(v.impact))) {
        issues.push("Accessibility: " + v.id + " (" + v.count + " nodes)");
      }

      // Trigger lazy image loading before full-page capture.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 750) {
          window.scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 20));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(350);
      const screenshot = "screenshots/" + safeName(route) + "--" + profile.label + ".jpg";
      await page.screenshot({
        path: path.join(outputDir, screenshot),
        type: "jpeg",
        quality: 68,
        fullPage: true,
        animations: "disabled",
      });
      // Emit only a manageable first-screen sample for quick in-chat review.
      if ((route === "/" || route === "/start") && profile.label !== "tablet") {
        const image = await page.screenshot({
          type: "jpeg", quality: 55, fullPage: false, animations: "disabled"
        });
        printPreviewImage(safeName(route) + "-" + profile.label, image);
      }
      const row = {
        route, name, profile: profile.label, http: response.status(),
        title: structure.title, h1: structure.h1Count, main: structure.mainCount,
        overflow: structure.overflow, screenshot, violations, issues,
      };
      results.push(row);
      console.log("OWLL_AUDIT_ROW", JSON.stringify(row));
      await page.close();
    }
    if (profile.label === "mobile") {
      const page = await context.newPage();
      try {
        await page.goto(baseUrl, { waitUntil: "networkidle" });
        const menu = page.getByRole("button", { name: "Open menu" });
        await menu.click();
        const open = await page.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded");
        const startLink = page.getByRole("navigation", { name: "Mobile navigation" })
          .getByRole("link", { name: "Start Learning" });
        const reachable = await startLink.isVisible();
        await page.keyboard.press("Escape");
        const closed = await page.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded");
        const pass = open === "true" && closed === "false" && reachable;
        console.log("OWLL_MOBILE_NAV", JSON.stringify({ open, closed, reachable, pass }));
        if (!pass) results.push({route: "/", name: "Mobile menu", profile: "mobile", issues:["Mobile menu failed"], screenshot:null,violations:[]});
      } catch (error) {
        console.log("OWLL_MOBILE_NAV", JSON.stringify({ error: String(error) }));
        results.push({route:"/",name:"Mobile menu",profile:"mobile",issues:[String(error)],screenshot:null,violations:[]});
      } finally { await page.close(); }
    }
    await context.close();
  }
  await browser.close();
  const failed = results.filter(r => r.issues.length);
  const summary = {
    sha, scope, testedViews: results.length, passed: results.length - failed.length,
    failed: failed.length, allViolations: results.reduce((n,r) => n + r.violations.length,0),
    timeUTC: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(outputDir,"report.json"),JSON.stringify({summary, results},null,2));
  const tiles = results.map(row => {
    const passed = row.issues.length === 0;
    const list = row.issues.length ? '<p class="error">'+escapeHTML(row.issues.join(" · "))+'</p>' : "";
    return '<article class="tile"><div class="tiletop"><strong>'+escapeHTML(row.name)+'</strong><span>'+escapeHTML(row.profile)+'</span></div>' +
      (row.screenshot ? '<a href="'+escapeHTML(row.screenshot)+'"><img loading="lazy" alt="Screenshot: '+escapeHTML(row.name)+' '+escapeHTML(row.profile)+'" src="'+escapeHTML(row.screenshot)+'"></a>' : '') +
      '<p class="'+(passed?'pass':'fail')+'">'+(passed?'PASS':'REVIEW')+'</p>'+list+'</article>';
  }).join("");
  const report = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>OWLL Visual Review</title>
<style>
:root{font-family:system-ui,sans-serif;background:#f2efe6;color:#17201d}
*{box-sizing:border-box}body{margin:0 auto;padding:clamp(1rem,4vw,3rem);max-width:1440px}
h1,h2{font-family:Georgia,serif}h1{font-size:clamp(2rem,4vw,3.4rem);margin:.5rem 0}
header{border-bottom:1px solid #a4aba3;padding-bottom:1.5rem;margin-bottom:2rem}
.eyebrow{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:#2f6672}
.meta{color:#526058;font-size:.9rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:1.2rem}
.tile{background:#faf8f3;border:1px solid #c8cfc6;border-radius:10px;padding:1rem}
.tiletop{display:flex;justify-content:space-between;gap:.8rem}
.tiletop span{font-size:.8rem;color:#526058}
img{display:block;width:100%;height:420px;object-fit:cover;object-position:top;border:1px solid #c8cfc6;margin-top:.8rem;background:white}
.tile a:focus-visible{outline:3px solid #2f6672}.pass{color:#315e40}.fail,.error{color:#9b3030}
small{color:#526058}
</style></head><body><header><p class="eyebrow">Open World Learning Lab / source-rendered QA</p>
<h1>Visual Review Gallery</h1><p>Commit: <code>${escapeHTML(sha.slice(0,12))}</code> ·
${summary.passed}/${summary.testedViews} views passed · ${summary.allViolations} axe findings ·
${escapeHTML(summary.timeUTC)}</p>
<p class="meta">This gallery was rendered from a local GitHub Actions production build,
not a Vercel deployment. These automated checks do not replace manual screen-reader,
usability or full accessibility review.</p></header><main><div class="grid">${tiles}</div></main>
<footer><p><small>Click any image to see its full-page screenshot. Raw findings in report.json.</small></p></footer>
</body></html>`;
  fs.writeFileSync(path.join(outputDir,"index.html"),report);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const issues = failed.map(r => '- ' + r.profile + ' ' + r.route + ': ' + r.issues.join('; ')).join("\n");
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      "## OWLL source-rendered visual review\n" +
      "**Commit:** `" + sha.slice(0,12) + "`\n\n" +
      "**Results:** " + summary.passed + "/" + summary.testedViews + " pass; " +
      summary.allViolations + " automated axe findings.\n\n" +
      (issues ? "### Problems\n"+issues+"\n\n" : "") +
      "Download the **OWLL Visual Review Gallery** artifact and open `index.html` to inspect screenshots. This does not use Vercel.\n");
  }
  console.log("OWLL_AUDIT_SUMMARY", JSON.stringify(summary));
  if (failed.length) process.exitCode = 1;
}
run().catch(e => { console.error("OWLL_AUDIT_FATAL", e.stack); process.exitCode = 1; });
