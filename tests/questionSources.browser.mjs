// Actual UI and KaTeX; isolated fixtures, no hosted database or account writes.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";
const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");
const februaryOnly=process.argv.includes("--february-2025-only");
const marchOnly=process.argv.includes("--march-2025-only");
const january2024Only=process.argv.includes("--january-2024-only");
const regional2024Only=process.argv.includes("--january-regional-2024-only");
const february2024Only=process.argv.includes("--february-regional-2024-only");
const king2024Only=process.argv.includes("--king-statewide-2024-only");
const march2024Only=process.argv.includes("--march-regional-2024-only");
const nsu2024Only=process.argv.includes("--nsu-statewide-2024-only");
const dir = await mkdtemp(join(tmpdir(), "question-sources-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = require("next/dist/compiled/webpack/webpack").webpack({
  mode: "development", entry: fixture("questionSources.tsx"), devtool: false,
  output: { path: dir, filename: "client.js", publicPath: "/" },
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/navigation": fixture("sourceCreditRouter.ts"), "next/link": fixture("link.tsx"),
    "next/image": fixture("googleImage.tsx"), "@/lib/multiplayerRealtime": fixture("realtime.ts"),
    "@/lib/supabase/client": fixture("questionStateSupabase.ts"),
    "@/lib/supabase/browserOwnerHint": fixture("questionStateSupabase.ts"), "@": root,
  } },
  module: { rules: [
    { test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") },
    { test: /\.css$/, use: fixture("css.cjs") }, { test: /\.(png|svg)$/, type: "asset/resource" },
  ] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(resolve)));
const bundle = await readFile(join(dir, "client.js"));
assert.equal(bundle.includes(Buffer.from("muNationalReferences")),false,"internal references are not bundled");
assert.equal(bundle.includes(Buffer.from("Clayton decides to stop teasing Anagh")),false,"withheld national prose is not bundled");
const cssRoot = join(root, ".next/static");
const cssFiles = (await readdir(cssRoot, { recursive: true })).filter(f => f.endsWith(".css"));
const css = (await Promise.all(cssFiles.map(f => readFile(join(cssRoot, f), "utf8")))).join("\n");
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, "http://fixture.test").pathname;
  try {
    if (/^\/questions\/mu-[\w-]+\.svg$/.test(pathname)) {
      res.setHeader("Content-Type", "image/svg+xml"); return res.end(await readFile(join(root, "public", pathname)));
    }
    if (/^\/[a-f0-9]+\.png$/.test(pathname)) {
      res.setHeader("Content-Type", "image/png"); return res.end(await readFile(join(dir, pathname)));
    }
    res.setHeader("Content-Type", pathname === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
    res.end(pathname === "/client.js" ? bundle : `<meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
  } catch { res.statusCode = 404; res.end(); }
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const errors = [];
try {
  browser = await chromium.launch({ headless: true });
  const vectorSources=[await readFile(join(root,"data/questions/mu.ts"),"utf8"),await readFile(join(root,"components/math/MathText.tsx"),"utf8")];
  const currentVectors=[...new Set(vectorSources.flatMap(source=>[...source.matchAll(/src: "\/questions\/(mu-[\w-]+\.svg)"/g)].map(match=>match[1])))];
  assert.ok(currentVectors.length>=23,"all active Mu question and solution diagrams are included");
  for(const width of [390,1280]){
    for(let start=0;start<currentVectors.length;start+=6){
      const page=await browser.newPage({viewport:{width,height:1000}});
      await page.goto(origin);
      await page.setContent(`<style>body{margin:16px;background:#eee;font:14px sans-serif}.gallery{display:grid;grid-template-columns:repeat(${width>600?2:1},minmax(0,1fr));gap:16px}figure{margin:0;background:white;padding:12px}img{display:block;max-width:100%;height:auto;max-height:360px;margin:8px auto;object-fit:contain}</style><div class="gallery">${currentVectors.slice(start,start+6).map(name=>`<figure><figcaption>${name}</figcaption><img src="${origin}/questions/${name}"></figure>`).join("")}</div>`);
      const checks=await page.evaluate(async()=>{
        return Promise.all([...document.images].map(async img=>{
          await img.decode();
          const source=await (await fetch(img.src)).text();
          const xml=new DOMParser().parseFromString(source,"image/svg+xml");
          const canvas=document.createElement("canvas");canvas.width=200;canvas.height=150;
          const context=canvas.getContext("2d");context.drawImage(img,0,0,200,150);
          const pixels=context.getImageData(0,0,200,150).data;let ink=0;
          for(let i=0;i<pixels.length;i+=4)if(pixels[i+3]>0&&Math.min(pixels[i],pixels[i+1],pixels[i+2])<220)ink++;
          return {src:img.src,valid:!xml.querySelector("parsererror"),ink,loaded:img.naturalWidth>0};
        }));
      });
      for(const result of checks){assert.ok(result.valid&&result.loaded,result.src);assert.ok(result.ink>100,result.src+" is nonblank");}
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.screenshot({path:join(dir,`vectors-${start/6+1}-${width}.png`),fullPage:true});
      await page.close();
    }
  }
  async function open(view, id, width, revealed = false) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    page.on("pageerror", error => errors.push(error.message));
    page.on("request",request=>assert.ok(!/\/questions\/.*\.png(?:\?|$)/.test(request.url()),"question views never request raster assets"));
    await page.route("**/api/multiplayer/**", async route => {
      if (route.request().method() !== "GET") return route.fulfill({ json: { accepted: true } });
      return route.fulfill({ json: await page.evaluate(() => window.sourceCreditRound) });
    });
    await page.goto(`${origin}/?guest&view=${view}&id=${id}${revealed ? "&revealed" : ""}`);
    const credit = page.getByLabel("Question source", { exact: true });
    const march2025 = id >= 10475 && id <= 10504;
    const february2025 = id >= 10445 && id <= 10474;
    const king2025 = id >= 10416 && id <= 10444;
    const january2025 = id >= 10386 && id <= 10415;
    const chiles = id >= 10356 && id <= 10385;
    const march = id >= 10326 && id <= 10355;
    const states2024 = id >= 10177 && id <= 10206;
    const states2025 = id >= 10148 && id <= 10176;
    const states = id >= 10119 && id <= 10147;
    const statewide = id >= 10207 && id <= 10235;
    const january = id >= 10236 && id <= 10265;
    const regional = id >= 10266 && id <= 10295;
    const competition = march2025 ? "2025 March Regional" : february2025 ? "2025 February Regional" : king2025 ? "2025 February King Statewide" : january2025 ? "2025 January Regional" : chiles ? "2025 Chiles Statewide" : march ? "2026 March Regional" : states2024 ? "2024 FAMAT State Convention" : states2025 ? "2025 FAMAT State Convention" : states ? "2026 FAMAT State Convention" : statewide ? "2026 January Statewide" : january ? "2026 January Regional" : `2026 February ${regional ? "Regional" : "King Invitational"}`;
    const originalNumber = march2025 ? id-10474 : february2025 ? id-10444 : king2025 ? id-10415 : january2025 ? id-10385 : chiles ? id-10355 : march ? id-10325 : states2024 ? id-10176 : states2025 ? id-(id<=10163?10147:10146) : states ? id - (id<=10143 ? 10118 : 10117) : statewide ? id - (id < 10234 ? 10206 : 10205) : id - (january ? 10235 : regional ? 10265 : 10295);
    const january2024 = id >= 10505 && id <= 10534;
    const regional2024=id>=10535&&id<=10564;
    const february2024=id>=10565&&id<=10594;
    const king2024=id>=10595&&id<=10621;
    const march2024=id>=10622&&id<=10651;
    const nsu2024=id>=10652&&id<=10681;
    const king2024Originals=Array.from({length:30},(_,i)=>i+1).filter(n=>![12,25,28].includes(n));
    const expectedCompetition=nsu2024 ? "2024 March NSU Statewide" : march2024 ? "2024 March Regional" : king2024 ? "2024 February King Statewide" : february2024 ? "2024 February Regional" : regional2024 ? "2024 January Regional" : january2024 ? "2024 FAMAT January Invitational" : competition;
    const expectedNumber=nsu2024 ? id-10651 : march2024 ? id-10621 : king2024 ? king2024Originals[id-10595] : february2024 ? id-10564 : regional2024 ? id-10534 : january2024 ? id-10504 : originalNumber;
    await expect(credit).toHaveText(`Source: ${expectedCompetition} · Calculus Individual · Question ${expectedNumber}`);
    if(march2024){
      const asset=id>=10630&&id<=10632?["function",660]:id>=10635&&id<=10637?["derivative",460]:id>=10642&&id<=10644?["table",620]:null;
      if(asset){
        const picture=page.locator(`img[src="/questions/mu-march-regional-2024-${asset[0]}.svg"]`);
        await picture.scrollIntoViewIfNeeded();
        await expect.poll(()=>picture.evaluate((img,width)=>img.complete&&img.naturalWidth===width,asset[1])).toBe(true);
      }
    }
    if(id===10656||id===10657){
      const picture=page.locator('img[src="/questions/mu-nsu-statewide-2024-table.svg"]');
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(()=>picture.evaluate(img=>img.complete&&img.naturalWidth===620)).toBe(true);
    }
    assert.equal(await page.locator(".katex-error").count(), 0, "no broken math");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) {
      await page.screenshot({ path: join(dir, `overflow-${view}-${id}-${width}.png`), fullPage: true });
      console.error(await page.evaluate(() => [...document.querySelectorAll("body *")]
        .filter(node => node.getBoundingClientRect().right > innerWidth + 1)
        .slice(0, 8).map(node => ({ tag: node.tagName, className: node.className, text: node.textContent?.slice(0, 70) }))));
    }
    assert.equal(overflow, false, `no page overflow: ${view}, ${id}, ${width}; screenshots: ${dir}`);
    return page;
  }
  if(!februaryOnly&&!marchOnly&&!january2024Only&&!regional2024Only&&!february2024Only&&!king2024Only&&!march2024Only&&!nsu2024Only){
  for(const width of [1280,320]){
    const page=await open("bank",10119,width);
    await expect(page.getByRole("heading",{name:"Question 1",exact:true})).toBeVisible();
    await page.screenshot({path:join(dir,`renumbered-mu-1-${width}.png`),fullPage:true});
    await page.close();
  }
  for (const view of ["bank", "trainer", "play", "spectate", "results"]) {
    for (const width of [1280, 390, 320]) {
      const page = await open(view, 10302, width);
      if (view !== "results") assert.equal(await page.locator('img[src*="-solution.svg"]').count(), 0, "solutions stay hidden before reveal");
      if (view === "trainer") {
        await page.getByRole("button", { name: "Give Up", exact: true }).click();
        await expect(page.locator('img[src="/questions/mu-302-solution.svg"]')).toBeVisible();
      }
      await page.screenshot({ path: join(dir, `${view}-${width}.png`), fullPage: true });
      await page.close();
    }
  }
  for (const id of [10302, 10313, 10320, 10325]) {
    const page = await open("trainer", id, 390, true);
    const picture = page.locator(`img[src="/questions/mu-${id - 10000}-solution.svg"]`);
    await picture.scrollIntoViewIfNeeded();
    await expect.poll(() => picture.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    await page.screenshot({ path: join(dir, `diagram-${id}.png`), fullPage: true });
    await page.close();
  }
  for (const id of [10310, 10317, 10324]) {
    const page = await open("trainer", id, 320, true);
    await page.screenshot({ path: join(dir, `long-math-${id}.png`), fullPage: true });
    await page.close();
  }
  for (const view of ["bank", "trainer", "play", "spectate", "results"]) {
    for (const width of [1280, 320]) {
      const page = await open(view, 10293, width, true);
      await page.screenshot({ path: join(dir, `regional-${view}-${width}.png`), fullPage: true });
      await page.close();
    }
  }
  for (const id of [10276, 10281, 10284, 10289, 10295]) {
    const page = await open("trainer", id, 320, true);
    await page.screenshot({ path: join(dir, `regional-solution-${id}.png`), fullPage: true });
    await page.close();
  }
  for (const view of ["bank", "trainer", "play", "spectate", "results"]) {
    for (const width of [1280, 320]) {
      const page = await open(view, 10238, width);
      const picture = page.locator('img[src="/questions/mu-238-240-original.svg"]');
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(() => picture.evaluate(img => img.complete && img.naturalWidth === 374)).toBe(true);
      await page.screenshot({ path: join(dir, `january-${view}-${width}.png`), fullPage: true });
      await page.close();
    }
  }
  for (const id of [10247, 10250, 10254, 10256, 10259, 10262]) {
    const page = await open("trainer", id, 320, true);
    if (id === 10250) {
      const picture = page.locator('img[src="/questions/mu-250-original.svg"]');
      await expect.poll(() => picture.evaluate(img => img.complete && img.naturalWidth === 440)).toBe(true);
    }
    await page.screenshot({ path: join(dir, `january-solution-${id}.png`), fullPage: true });
    await page.close();
  }
  for (const view of ["bank", "trainer", "play", "spectate", "results"]) {
    for (const width of [1280, 320]) {
      const page = await open(view, 10207, width);
      const picture = page.locator('img[src="/questions/mu-207-210-original.svg"]');
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(() => picture.evaluate(img => img.complete && img.naturalWidth === 1380)).toBe(true);
      await page.screenshot({ path: join(dir, `statewide-${view}-${width}.png`), fullPage: true });
      await page.close();
    }
  }
  for (const id of [10212,10217,10221,10222,10227,10231,10233,10234,10235]) {
    const page = await open("trainer", id, 320, true);
    if ([10217,10227].includes(id)) {
      const picture = page.locator(`img[src="/questions/mu-${id-10000}-original-solution.svg"]`);
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(() => picture.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    await page.screenshot({ path: join(dir, `statewide-solution-${id}.png`), fullPage: true });
    await page.close();
  }
  for (const view of ["bank", "trainer", "play", "spectate", "results"]) {
    for (const width of [1280,320]) {
      const page = await open(view,10146,width);
      const picture=page.locator('img[src="/questions/mu-146-original.svg"]');
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(()=>picture.evaluate(img=>img.complete&&img.naturalWidth===600)).toBe(true);
      await page.screenshot({path:join(dir,`states-${view}-${width}.png`),fullPage:true});
      await page.close();
    }
  }
  for (const id of [10129,10131,10137,10138,10140,10142,10143,10144]) {
    const page = await open("trainer",id,320,true);
    await page.screenshot({path:join(dir,`states-solution-${id}.png`),fullPage:true});
    await page.close();
  }
  for(const view of ["bank","trainer","play","spectate","results"]){
    for(const width of [1280,320]){
      const page=await open(view,10158,width);
      await page.screenshot({path:join(dir,`states2025-${view}-${width}.png`),fullPage:true});
      await page.close();
    }
  }
  for(const id of [10153,10156,10159,10162,10165,10167,10168,10172,10173,10176]){
    const page=await open("trainer",id,320,true);
    await page.screenshot({path:join(dir,`states2025-solution-${id}.png`),fullPage:true});
    await page.close();
  }
  for(const view of ["bank","trainer","play","spectate","results"]){
    for(const width of [1280,320]){
      const page=await open(view,10196,width);
      if(view!=="results")assert.equal(await page.locator('img[src*="original-solution"]').count(),0);
      await page.screenshot({path:join(dir,`states2024-${view}-${width}.png`),fullPage:true});
      await page.close();
    }
  }
  for(const id of [10178,10189,10192,10194,10195,10196,10197,10201,10203,10205,10206]){
    const page=await open("trainer",id,320,true);
    if([10194,10196,10201].includes(id)){
      const picture=page.locator(`img[src="/questions/mu-${id-10000}-original-solution.svg"]`);
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(()=>picture.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
    }
    await page.screenshot({path:join(dir,`states2024-solution-${id}.png`),fullPage:true});
    await page.close();
  }
  for(const view of ["bank","trainer","play","spectate","results"]){
    for(const width of [1280,320]){
      for(const [id,src] of [[10336,"mu-336-338-original.svg"],[10348,"mu-348-original.svg"]]){
        const page=await open(view,id,width);
        const picture=page.locator('img[src="/questions/'+src+'"]');
        await picture.scrollIntoViewIfNeeded();
        await expect.poll(()=>picture.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
        if(view==="bank")await expect(page.getByRole("heading",{name:"Question "+(id-10122),exact:true})).toBeVisible();
        await page.screenshot({path:join(dir,`march-${id}-${view}-${width}.png`),fullPage:true});
        await page.close();
      }
    }
  }
  for(const id of [10332,10337,10338,10339,10340,10342,10343,10345,10347,10349,10351,10352,10353,10354,10355]){
    const page=await open("trainer",id,320,true);
    if(id===10345){
      const picture=page.locator('img[src="/questions/mu-345-original-solution.svg"]');
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(()=>picture.evaluate(img=>img.complete&&img.naturalWidth===558)).toBe(true);
    }
    await page.screenshot({path:join(dir,`march-solution-${id}.png`),fullPage:true});
    await page.close();
  }
  for(const view of ["bank","trainer","play","spectate"]){
    const page=await open(view,10345,320);
    assert.equal(await page.locator('img[src="/questions/mu-345-original-solution.svg"]').count(),0,"inverse-function diagram remains solution-only");
    await page.close();
  }
  for(let id=10326;id<=10355;id++){
    const page=await open("trainer",id,320);
    await page.screenshot({path:join(dir,`march-question-${id}.png`),fullPage:true});
    await page.close();
  }
  for(const view of ["bank","trainer","play","spectate","results"]){
    for(const width of [1280,320]){
      const page=await open(view,10361,width);
      const picture=page.locator('img[src="/questions/mu-360-362-original.svg"]');
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(()=>picture.evaluate(img=>img.complete&&img.naturalWidth===906)).toBe(true);
      if(view==="bank")await expect(page.getByRole("heading",{name:"Question 239",exact:true})).toBeVisible();
      await page.screenshot({path:join(dir,`chiles-table-${view}-${width}.png`),fullPage:true});
      await page.close();
    }
  }
  for(let id=10356;id<=10385;id++){
    const page=await open("trainer",id,320,true);
    await page.screenshot({path:join(dir,`chiles-solution-${id}.png`),fullPage:true});
    await page.close();
  }
  for(const view of ["bank","trainer","play","spectate","results"]){
    for(const width of [1280,320]){
      const page=await open(view,10412,width);
      if(view==="bank")await expect(page.getByRole("heading",{name:"Question 290",exact:true})).toBeVisible();
      await page.screenshot({path:join(dir,`january2025-${view}-${width}.png`),fullPage:true});
      await page.close();
    }
  }
  for(let id=10386;id<=10415;id++){
    const page=await open("trainer",id,320,true);
    await page.screenshot({path:join(dir,`january2025-solution-${id}.png`),fullPage:true});
    await page.close();
  }
  for(const view of ["bank","trainer","play","spectate","results"]){
    for(const width of [1280,320]){
      const page=await open(view,10442,width);
      const picture=page.locator('img[src="/questions/mu-442-444-original.svg"]');
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(()=>picture.evaluate(img=>img.complete&&img.naturalWidth===290)).toBe(true);
      if(view==="bank")await expect(page.getByRole("heading",{name:"Question 320",exact:true})).toBeVisible();
      await page.screenshot({path:join(dir,`king2025-graph-${view}-${width}.png`),fullPage:true});
      await page.close();
    }
  }
  for(let id=10416;id<=10444;id++){
    const page=await open("trainer",id,320,true);
    await page.screenshot({path:join(dir,`king2025-solution-${id}.png`),fullPage:true});
    await page.close();
  }
  }
  if(!marchOnly&&!january2024Only&&!regional2024Only&&!february2024Only&&!king2024Only&&!march2024Only&&!nsu2024Only){
  for(const view of ["bank","trainer","play","spectate","results"]){
    for(const width of [1280,320]){
      const page=await open(view,10465,width);
      if(view==="bank")await expect(page.getByRole("heading",{name:"Question 343",exact:true})).toBeVisible();
      await page.screenshot({path:join(dir,`february2025-${view}-${width}.png`),fullPage:true});
      await page.close();
    }
  }
  for(let id=10445;id<=10474;id++){
    for(const view of ["trainer","results"]){
    for(const width of [1280,320]){
      const page=await open(view,id,width,true);
      await page.screenshot({path:join(dir,`february2025-solution-${id}-${view}-${width}.png`),fullPage:true});
      await page.close();
    }
    }
  }

  }
  if(!februaryOnly&&!january2024Only&&!regional2024Only&&!february2024Only&&!king2024Only&&!march2024Only&&!nsu2024Only){
  for(const view of ["bank","trainer","play","spectate","results"]){
    for(const width of [1280,320]){
      for(const [id,src,naturalWidth,number] of [[10483,"mu-483-table.svg",600,360],[10502,"mu-502-fold.svg",560,379]]){
        const page=await open(view,id,width);
        const picture=page.locator('img[src="/questions/'+src+'"]');
        await picture.scrollIntoViewIfNeeded();
        await expect.poll(()=>picture.evaluate((img,expectedWidth)=>img.complete&&img.naturalWidth===expectedWidth,naturalWidth)).toBe(true);
        if(view==="bank")await expect(page.getByRole("heading",{name:"Question "+number,exact:true})).toBeVisible();
        if(view!=="results")assert.equal(await page.locator('img[src="/questions/mu-502-solution.svg"]').count(),0,"fold annotations remain solution-only");
        await page.screenshot({path:join(dir,`march2025-${id}-${view}-${width}.png`),fullPage:true});
        await page.close();
      }
    }
  }
  for(const id of Array.from({length:30},(_,i)=>10475+i).filter(id=>id!==10476)){
    for(const view of ["trainer","results"]){
      for(const width of [1280,320]){
        const page=await open(view,id,width,true);
        if(id===10502){
          const picture=page.locator('img[src="/questions/mu-502-solution.svg"]');
          await picture.scrollIntoViewIfNeeded();
          await expect.poll(()=>picture.evaluate(img=>img.complete&&img.naturalWidth===620)).toBe(true);
        }
        await page.screenshot({path:join(dir,`march2025-solution-${id}-${view}-${width}.png`),fullPage:true});
        await page.close();
      }
    }
  }
  }
  if(!februaryOnly&&!marchOnly&&!regional2024Only&&!february2024Only&&!king2024Only&&!march2024Only&&!nsu2024Only){
    for(const view of ["bank","trainer","play","spectate","results"]){
      for(const width of [1280,320]){
        const page=await open(view,10505,width);
        if(view==="bank")await expect(page.getByRole("heading",{name:"Question 382",exact:true})).toBeVisible();
        await page.screenshot({path:join(dir,`january2024-${view}-${width}.png`),fullPage:true});
        await page.close();
      }
    }
    for(let id=10505;id<=10534;id++){
      for(const view of ["trainer","results"]){
        for(const width of [1280,320]){
          const page=await open(view,id,width,true);
          await page.screenshot({path:join(dir,`january2024-solution-${id}-${view}-${width}.png`),fullPage:true});
          await page.close();
        }
      }
    }
  }
  if(!februaryOnly&&!marchOnly&&!january2024Only&&!february2024Only&&!king2024Only&&!march2024Only&&!nsu2024Only){
    for(const id of [10554,10558]){
      for(const view of ["bank","trainer","play","spectate","results"]){
        for(const width of [1280,320]){
          const page=await open(view,id,width);
          if(view==="bank")await expect(page.getByRole("heading",{name:"Question "+(id-10123),exact:true})).toBeVisible();
          if(id===10554){
            const picture=page.locator('img[src="/questions/mu-554-parabolas.svg"]');
            await picture.scrollIntoViewIfNeeded();
            await expect.poll(()=>picture.evaluate(img=>img.complete&&img.naturalWidth===480)).toBe(true);
          }
          if(view!=="results")assert.equal(await page.locator('img[src="/questions/mu-558-solution.svg"]').count(),0,"tangent graph remains solution-only");
          await page.screenshot({path:join(dir,`regional2024-${id}-${view}-${width}.png`),fullPage:true});
          await page.close();
        }
      }
    }
    for(let id=10535;id<=10564;id++){
      for(const view of ["trainer","results"]){
        for(const width of [1280,320]){
          const page=await open(view,id,width,true);
          if(id===10558){
            const picture=page.locator('img[src="/questions/mu-558-solution.svg"]');
            await picture.scrollIntoViewIfNeeded();
            await expect.poll(()=>picture.evaluate(img=>img.complete&&img.naturalWidth===620)).toBe(true);
          }
          await page.screenshot({path:join(dir,`regional2024-solution-${id}-${view}-${width}.png`),fullPage:true});
          await page.close();
        }
      }
    }
  }
  if(!februaryOnly&&!marchOnly&&!january2024Only&&!regional2024Only&&!king2024Only&&!march2024Only&&!nsu2024Only){
    for(const id of [10581,10585,10587,10590,10591]){
      for(const view of ["bank","trainer","play","spectate","results"]){
        for(const width of [1280,320]){
          const page=await open(view,id,width);
          if(view==="bank")await expect(page.getByRole("heading",{name:"Question "+(id-10123),exact:true})).toBeVisible();
          await page.screenshot({path:join(dir,`february2024-${id}-${view}-${width}.png`),fullPage:true});
          await page.close();
        }
      }
    }
    for(let id=10565;id<=10594;id++){
      for(const view of ["trainer","results"]){
        for(const width of [1280,320]){
          const page=await open(view,id,width,true);
          await page.screenshot({path:join(dir,`february2024-solution-${id}-${view}-${width}.png`),fullPage:true});
          await page.close();
        }
      }
    }
  }
  if(!februaryOnly&&!marchOnly&&!january2024Only&&!regional2024Only&&!february2024Only&&!march2024Only&&!nsu2024Only){
    for(const id of [10599,10605,10613,10614,10620,10621]){
      for(const view of ["bank","trainer","play","spectate","results"]){
        for(const width of [1280,320]){
          const page=await open(view,id,width);
          if(view==="bank")await expect(page.getByRole("heading",{name:"Question "+(id-10123),exact:true})).toBeVisible();
          await page.screenshot({path:join(dir,`king2024-${id}-${view}-${width}.png`),fullPage:true});
          await page.close();
        }
      }
    }
    for(let id=10595;id<=10621;id++){
      for(const view of ["trainer","results"]){
        for(const width of [1280,320]){
          const page=await open(view,id,width,true);
          await page.screenshot({path:join(dir,`king2024-solution-${id}-${view}-${width}.png`),fullPage:true});
          await page.close();
        }
      }
    }
  }
  if(!februaryOnly&&!marchOnly&&!january2024Only&&!regional2024Only&&!february2024Only&&!king2024Only&&!nsu2024Only){
    for(const id of [10631,10636,10644,10646,10649,10651]){
      for(const view of ["bank","trainer","play","spectate","results"]){
        for(const width of [1280,320]){
          const page=await open(view,id,width);
          if(view==="bank")await expect(page.getByRole("heading",{name:"Question "+(id-10123),exact:true})).toBeVisible();
          await page.screenshot({path:join(dir,`march2024-${id}-${view}-${width}.png`),fullPage:true});
          await page.close();
        }
      }
    }
    for(let id=10622;id<=10651;id++){
      for(const view of ["trainer","results"]){
        for(const width of [1280,320]){
          const page=await open(view,id,width,true);
          await page.screenshot({path:join(dir,`march2024-solution-${id}-${view}-${width}.png`),fullPage:true});
          await page.close();
        }
      }
    }
  }
  if(!februaryOnly&&!marchOnly&&!january2024Only&&!regional2024Only&&!february2024Only&&!king2024Only&&!march2024Only){
    for(const id of [10656,10664,10667,10668,10676,10679,10681]){
      for(const view of ["bank","trainer","play","spectate","results"]){
        for(const width of [1280,320]){
          const page=await open(view,id,width);
          if(view==="bank")await expect(page.getByRole("heading",{name:"Question "+(id-10123),exact:true})).toBeVisible();
          await page.screenshot({path:join(dir,`nsu2024-${id}-${view}-${width}.png`),fullPage:true});
          await page.close();
        }
      }
    }
    for(let id=10652;id<=10681;id++){
      for(const view of ["trainer","results"]){
        for(const width of [1280,320]){
          const page=await open(view,id,width,true);
          await page.screenshot({path:join(dir,`nsu2024-solution-${id}-${view}-${width}.png`),fullPage:true});
          await page.close();
        }
      }
    }
  }
  assert.deepEqual(errors, []);
  console.log(`PASS (${nsu2024Only?"NSU March Statewide 2024 and SVG assets":march2024Only?"March Regional 2024 and SVG assets":king2024Only?"King Statewide 2024 and SVG assets":february2024Only?"February Regional 2024 and SVG assets":regional2024Only?"January Regional 2024 and SVG assets":january2024Only?"January Invitational 2024 and SVG assets":marchOnly?"March Regional 2025 and SVG assets":februaryOnly?"February Regional 2025 and SVG assets":"all source sets"}): original-number credits in Question Bank, Trainer, play, spectators and results; diagrams, reveal gating and real KaTeX at desktop/mobile widths. Screenshots: ${dir}`);
} finally {
  await browser?.close(); await new Promise(resolve => server.close(resolve));
}
