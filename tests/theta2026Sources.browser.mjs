// Actual question components with local account/API fixtures; no hosted writes.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";

const require=createRequire(import.meta.url);
const root=resolve(import.meta.dirname,"..");
const dir=await mkdtemp(join(tmpdir(),"theta-2026-sources-"));
const fixture=name=>resolve(import.meta.dirname,"browserFixtures",name);
const compiler=require("next/dist/compiled/webpack/webpack").webpack({
  mode:"development",entry:fixture("questionSources.tsx"),devtool:false,
  output:{path:dir,filename:"client.js",publicPath:"/"},
  resolve:{extensions:[".tsx",".ts",".js"],alias:{
    "next/navigation":fixture("sourceCreditRouter.ts"),"next/link":fixture("link.tsx"),
    "next/image":fixture("googleImage.tsx"),"@/lib/multiplayerRealtime":fixture("realtime.ts"),
    "@/lib/supabase/client":fixture("questionStateSupabase.ts"),
    "@/lib/supabase/browserOwnerHint":fixture("questionStateSupabase.ts"),"@":root,
  }},
  module:{rules:[
    {test:/\.tsx?$/,exclude:/node_modules/,use:fixture("loader.cjs")},
    {test:/\.css$/,use:fixture("css.cjs")},{test:/\.(png|svg)$/,type:"asset/resource"},
  ]},
});
await new Promise((resolve,reject)=>compiler.run((error,stats)=>error||stats.hasErrors()
  ?reject(error??new Error(stats.toString())):compiler.close(resolve)));
const bundle=await readFile(join(dir,"client.js"));
assert.equal(bundle.includes(Buffer.from("muNationalReferences")),false);
assert.equal(bundle.includes(Buffer.from("Clayton decides to stop teasing Anagh")),false);
const cssRoot=join(root,".next/static");
const cssFiles=(await readdir(cssRoot,{recursive:true})).filter(f=>f.endsWith(".css"));
const css=(await Promise.all(cssFiles.map(f=>readFile(join(cssRoot,f),"utf8")))).join("\n");
const assets=["theta-january-statewide-2026-table.svg","theta-feb-2026-11-solution.svg","theta-feb-2026-28-solution.svg","theta-feb-2026-29-solution.svg","theta-feb-2026-21-solution.svg","theta-nsu-2026-14-solution.svg","theta-feb-2026-6-solution.svg","theta-feb-2026-27-solution.svg"];
const source=await readFile(join(root,"data/questions/theta.ts"),"utf8");
const js=source.replace(/^import type .*;\s*/m,"").replace(": Question[]","");
const {thetaQuestions}=await import("data:text/javascript;base64,"+Buffer.from(js).toString("base64"));
const reviewed=thetaQuestions.filter(q=>(q.id>=30031&&q.id<=30179)||q.id>=30420);
assert.equal(reviewed.length,178);
const solutionNumbers=[65,70,80,86,87,88,163];
const server=createServer(async(req,res)=>{
  const pathname=new URL(req.url,"http://fixture.test").pathname;
  try {
    if(assets.some(name=>pathname==="/questions/"+name)) {
      res.setHeader("Content-Type","image/svg+xml");return res.end(await readFile(join(root,"public",pathname)));
    }
    if(/^\/[a-f0-9]+\.png$/.test(pathname)) {
      res.setHeader("Content-Type","image/png");return res.end(await readFile(join(dir,pathname)));
    }
    res.setHeader("Content-Type",pathname==="/client.js"?"text/javascript; charset=utf-8":"text/html; charset=utf-8");
    res.end(pathname==="/client.js"?bundle:`<meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
  } catch {res.statusCode=404;res.end();}
});
await new Promise((resolve,reject)=>{server.once("error",reject);server.listen(0,"127.0.0.1",resolve);});
const origin=`http://127.0.0.1:${server.address().port}`;
let browser;
const errors=[];
try {
  browser=await chromium.launch({headless:true});
  async function imagesReady(page) {
    for(const img of await page.locator('img[src^="/questions/"]').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
    }
  }
  async function open(view,number,width,revealed=false) {
    const page=await browser.newPage({viewport:{width,height:1000}});
    page.on("pageerror",error=>errors.push(error.message));
    page.on("request",request=>assert.ok(!/\/questions\/.*\.(png|jpe?g|webp)(?:\?|$)/i.test(request.url())));
    await page.route("**/api/multiplayer/**",async route=>{
      if(route.request().method()!=="GET")return route.fulfill({json:{accepted:true}});
      return route.fulfill({json:await page.evaluate(()=>window.sourceCreditRound)});
    });
    await page.goto(`${origin}/?guest&view=${view}&id=${30000+number}${revealed?"&revealed":""}`);
    await expect(page.getByLabel("Question source",{exact:true})).toHaveText(
      `Source: ${reviewed.find(q=>q.number===number).source.competition} · Algebra 2 Individual · Question ${reviewed.find(q=>q.number===number).source.questionNumber}`);
    if(view==="bank")await expect(page.getByRole("heading",{name:`Question ${number}`,exact:true})).toBeVisible();
    await imagesReady(page);
    assert.equal(await page.locator(".katex-error").count(),0);
    assert.equal((await page.locator("body").innerText()).includes("[[solution-diagram:"),false,"tokens are rendered, not printed");
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    await page.screenshot({path:join(dir,`${view}-${number}-${width}-${revealed?"solution":"question"}.png`),fullPage:true});
    assert.equal(overflow,false,`page overflow: ${view} #${number} at ${width}; ${dir}`);
    return page;
  }
  for(const width of [1280,320]) {
    for(const number of reviewed.map(q=>q.number)) {
      for(const view of ["trainer","results"]) {
        const page=await open(view,number,width,true);
        if(solutionNumbers.includes(number))await expect(page.locator('img[src$="-solution.svg"]')).toBeVisible();
        await page.close();
      }
    }
    for(const number of [34,65,70,80,85,86,87,88,163,420,449]) {
      for(const view of ["bank","play","spectate"]) {
        const page=await open(view,number,width);
        assert.equal(await page.locator('img[src$="-solution.svg"]').count(),0,"solution figures stay hidden");
        await page.close();
      }
    }
    for(const number of solutionNumbers) {
      const page=await open("trainer",number,width);
      assert.equal(await page.locator('img[src$="-solution.svg"]').count(),0);
      await page.getByRole("button",{name:"Give Up",exact:true}).click();
      await expect(page.locator('img[src$="-solution.svg"]')).toBeVisible();
      await imagesReady(page);
      await page.screenshot({path:join(dir,`reveal-${number}-${width}.png`),fullPage:true});
      await page.close();
    }
  }
  for(const width of [1280,320]) {
    const page=await browser.newPage({viewport:{width,height:1000}});
    await page.goto(origin+"/?guest&id=30001");
    await page.setContent(`<style>body{margin:12px;background:#eee;font:14px sans-serif}.gallery{display:grid;grid-template-columns:repeat(${width>600?3:1},minmax(0,1fr));gap:12px}figure{margin:0;background:white;padding:8px}img{width:100%;height:auto}</style><div class="gallery">${assets.map(name=>`<figure><figcaption>${name}</figcaption><img src="${origin}/questions/${name}"></figure>`).join("")}</div>`);
    const checks=await page.evaluate(async()=>Promise.all([...document.images].map(async img=>{
      await img.decode();
      const xml=new DOMParser().parseFromString(await(await fetch(img.src)).text(),"image/svg+xml");
      const canvas=document.createElement("canvas");canvas.width=300;canvas.height=200;
      const ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,300,200);
      const pixels=ctx.getImageData(0,0,300,200).data;let ink=0;
      for(let i=0;i<pixels.length;i+=4)if(pixels[i+3]&&Math.min(pixels[i],pixels[i+1],pixels[i+2])<220)ink++;
      return {src:img.src,valid:!xml.querySelector("parsererror"),ink,width:img.naturalWidth};
    })));
    for(const check of checks){assert.ok(check.valid,check.src);assert.ok(check.ink>150,check.src);assert.ok(check.width>=600);}
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:join(dir,`vectors-${width}.png`),fullPage:true});
    await page.close();
  }
  assert.deepEqual(errors,[]);
  console.log(`PASS: 178 retained Theta 2026 source solutions in Trainer/results, representative prompts across all views, original-number credits, SVG decoding/nonblank pixels, reveal gating, real KaTeX, and no page overflow at 1280/320px. Screenshots: ${dir}`);
} finally {
  await browser?.close();await new Promise(resolve=>server.close(resolve));
}
