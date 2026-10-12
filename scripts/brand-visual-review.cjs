/* One-time review utility. Not a production app dependency. */
const { chromium } = require("playwright");
const fs = require("node:fs");
const crypto = require("node:crypto");
const axePath = require.resolve("axe-core/axe.min.js");
const ROOT = process.env.QA_BASE_URL || "http://127.0.0.1:3000";

async function main() {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_BIN || undefined, args: ["--no-sandbox"] });
  const profiles = [
    { name: "mobile", width: 390, height: 844 },
    { name: "desktop", width: 1440, height: 900 }
  ];
  let failures = 0;
  for (const profile of profiles) {
    const page = await browser.newPage({ viewport: {width:profile.width,height:profile.height},deviceScaleFactor:1, reducedMotion:"reduce" });
    const errors = [];
    page.on("pageerror", e => errors.push(String(e)));
    const response = await page.goto(ROOT, {waitUntil:"networkidle",timeout:60000});
    await page.locator("h1").first().waitFor();
    const data = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector("h1")?.textContent,
      main: document.querySelectorAll("main").length,
      nav: document.querySelectorAll("nav").length,
      bodyWidth: document.documentElement.scrollWidth,
      viewWidth: document.documentElement.clientWidth,
      audience: !!document.querySelector("#who-its-for"),
      primaryCta: [...document.querySelectorAll("main a")].slice(0,2).map(x=>({label:x.textContent.trim(),href:x.getAttribute("href")}))
    }));
    console.log("QA_PAGE",profile.name,JSON.stringify({status:response?.status(),...data,errors}));
    if (data.bodyWidth > data.viewWidth+2) {console.log("QA_FAIL_HORIZONTAL_OVERFLOW",profile.name);failures++}
    if (errors.length) failures++;
    if (!data.audience || !data.h1 || data.main !== 1) failures++;

    await page.addScriptTag({path:axePath});
    const a11y = await page.evaluate(async () => {
      const r = await window.axe.run(document, {runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa","wcag22aa"]}});
      return r.violations.map(v => ({id:v.id,impact:v.impact,nodes:v.nodes.length,examples:v.nodes.slice(0,3).map(n=>n.target.join(" "))}));
    });
    console.log("QA_AXE", profile.name, JSON.stringify(a11y));
    failures += a11y.filter(x=>["critical","serious"].includes(x.impact)).length;

    const path = "/tmp/owll-"+profile.name+".jpg";
    await page.screenshot({path, type:"jpeg",quality:58, fullPage:true, animations:"disabled"});
    const buf = fs.readFileSync(path);
    const base64 = buf.toString("base64");
    console.log("OWLL_SCREENSHOT_BEGIN",profile.name,buf.length,crypto.createHash("sha256").update(buf).digest("hex"));
    for(let i=0;i<base64.length;i+=14000) console.log("OWLL_SCREENSHOT_CHUNK",profile.name,Math.floor(i/14000),base64.slice(i,i+14000));
    console.log("OWLL_SCREENSHOT_END",profile.name,Math.ceil(base64.length/14000));
    await page.close();
  }
  await browser.close();
  console.log("QA_FINAL",JSON.stringify({failures}));
  if(failures)process.exitCode=1;
}
main().catch(e=>{console.error("QA_ERROR",e.stack);process.exitCode=1});
