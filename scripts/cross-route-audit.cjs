/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const path=require('path');
const fs=require('fs');
const axePath=require.resolve('axe-core/axe.min.js');
const BASE="http://127.0.0.1:3000";
const ROUTES=['/','/about','/work','/work/first-landing','/work/locus','/releases','/releases/owll-at-a-glance','/learning-environments','/contact'];
async function run(){
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN || undefined,args:['--no-sandbox']});
 const reports=[];let failures=0;
 for(const [size,width,height] of [['mobile',390,844],['desktop',1440,900]]){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',deviceScaleFactor:1});
   for(const route of ROUTES){
    const page=await context.newPage();
    let jsErrors=[];page.on('pageerror',e=>jsErrors.push(String(e)));
    const res=await page.goto(BASE+route,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(150);
    const data=await page.evaluate(()=>({
      title:document.title,
      h1s:[...document.querySelectorAll('h1')].map(x=>x.textContent.trim()),
      mains:document.querySelectorAll('main').length,
      viewWidth:document.documentElement.clientWidth,
      scrollWidth:document.documentElement.scrollWidth,
      imageCount:document.querySelectorAll('img').length,
      links:[...document.querySelectorAll('a[href]')].filter(a=>a.getAttribute('href')?.startsWith('/')).map(a=>a.getAttribute('href'))
    }));
    await page.addScriptTag({path:axePath});
    const v=await page.evaluate(async()=>{
      const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});
      return r.violations.map(x=>({id:x.id,severity:x.impact,nodes:x.nodes.length,targets:x.nodes.slice(0,2).map(z=>z.target.join(' '))}))
    });
    const problems=[];
    if(res.status()!==200)problems.push('HTTP '+res.status());
    if(data.mains!==1)problems.push('mains '+data.mains);
    if(data.h1s.length!==1)problems.push('h1-count '+data.h1s.length);
    if(data.scrollWidth>data.viewWidth+2)problems.push('overflow '+data.scrollWidth+'/'+data.viewWidth);
    if(jsErrors.length)problems.push('JS '+jsErrors.join('|').slice(0,150));
    if(v.some(x=>['serious','critical'].includes(x.severity)))problems.push('axe-serious '+v.map(x=>x.id).join(','));
    const result={size,route,status:res.status(),h1s:data.h1s,mains:data.mains,overflow:data.scrollWidth-data.viewWidth,axe:v,problems};
    reports.push(result);if(problems.length)failures++;
    console.log('QA_ROUTE',JSON.stringify(result));
    await page.close();
   }
   await context.close();
 }
 await browser.close();
 console.log('QA_SUMMARY',JSON.stringify({routes:reports.length,failures,axeViolations:reports.reduce((n,x)=>n+x.axe.length,0)}));
 if(failures)process.exitCode=1;
}
run().catch(e=>{console.error('QA_FATAL',e.stack);process.exitCode=1});
