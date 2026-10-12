/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const axePath = require.resolve("axe-core/axe.min.js");
async function main() {
  const browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN || undefined,args:["--no-sandbox"]});
  let failures = 0;
  for (const size of [390,1440]) {
    const page=await browser.newPage({viewport:{width:size,height:900},reducedMotion:"reduce"});
    for (const route of ["/","/start"]) {
      const response=await page.goto("http://127.0.0.1:3000"+route,{waitUntil:"networkidle"});
      const data=await page.evaluate(()=>({
        h1:document.querySelectorAll("h1").length,
        main:document.querySelectorAll("main").length,
        overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
        title:document.title,
        links:[...document.querySelectorAll("a[href]")].filter(a=>a.getAttribute("href")==="/start").length
      }));
      await page.addScriptTag({path:axePath});
      const violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa","wcag22aa"]}})).violations.map(v=>({id:v.id,impact:v.impact})));
      const fail=response.status()!==200||data.h1!==1||data.main!==1||data.overflow>2||violations.some(v=>["critical","serious"].includes(v.impact));
      console.log("OWLL_START_QA",JSON.stringify({size,route,http:response.status(),...data,violations,pass:!fail}));
      if(fail)failures++;
    }
    if(size===390){
      await page.getByRole("button",{name:"Open menu"}).click();
      const navLink=page.getByRole("navigation",{name:"Mobile navigation"}).getByRole("link",{name:"Start Learning"});
      if(!(await navLink.isVisible())){failures++;console.log("OWLL_START_NAV_FAILURE");}
      await navLink.click();
      if(!page.url().endsWith("/start")){failures++;console.log("OWLL_START_NAV_ROUTE_FAILURE",page.url());}
      console.log("OWLL_START_NAV",page.url());
    }
    await page.close();
  }
  await browser.close();
  console.log("OWLL_START_SUMMARY",JSON.stringify({failures}));
  if(failures)process.exitCode=1;
}
main().catch(e=>{console.error("OWLL_START_ERROR",e.stack);process.exitCode=1;});
