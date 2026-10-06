// Real QuestionClient, state/save services and KaTeX; only auth/network are local mocks.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";
const require = createRequire(import.meta.url);
const webpack = require("next/dist/compiled/webpack/webpack");
const root = resolve(import.meta.dirname,"..");
const dir = await mkdtemp(join(tmpdir(),"stage-eight-ui-"));
const fixture = name => resolve(import.meta.dirname,"browserFixtures",name);
const compiler = webpack.webpack({ mode:"development",entry:fixture("stageEight.tsx"),output:{path:dir,filename:"client.js"},devtool:false,
  resolve:{extensions:[".tsx",".ts",".js"],alias:{"next/navigation":fixture("questionRouter.ts"),"next/link":fixture("link.tsx"),"next/image":fixture("image.tsx"),"@/lib/supabase/client":fixture("questionStateSupabase.ts"),"@/lib/supabase/browserOwnerHint":fixture("questionStateSupabase.ts"),"@":root}},
  module:{rules:[{test:/\.tsx?$/,exclude:/node_modules/,use:fixture("loader.cjs")},{test:/\.css$/,use:fixture("css.cjs")}]},
});
await new Promise((resolve,reject)=>compiler.run((error,stats)=>error||stats.hasErrors()?reject(error??new Error(stats.toString())):compiler.close(resolve)));
const bundle=await readFile(join(dir,"client.js"));
const cssDir=join(root,".next/static/css");
const css=(await Promise.all((await readdir(cssDir)).filter(n=>n.endsWith(".css")).map(n=>readFile(join(cssDir,n),"utf8")))).join("\n");
const server=createServer((req,res)=>{
  res.setHeader("Content-Type",req.url==="/client.js"?"text/javascript; charset=utf-8":"text/html; charset=utf-8");
  res.end(req.url==="/client.js"?bundle:`<style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise((resolve,reject)=>{server.once("error",reject);server.listen(0,"127.0.0.1",resolve);});
const origin=`http://127.0.0.1:${server.address().port}`;
const progress=(attempts=7)=>({attempts,correct:3,times:[],lastResult:"correct",lastCorrectAt:1770000000000,timing:{count:3,totalSeconds:45,bestSeconds:10}});
let browser;
try {
  browser=await chromium.launch({headless:true});
  async function open(mode="saved",query="") {
    const page=await browser.newPage({viewport:{width:1280,height:1000}});page.setDefaultTimeout(15000);
    const state={mode,bookmarkMode:"saved",resultMode:"saved",reads:[],writes:[],attempts:[],results:[],held:[],errors:[],scripts:[],bookmarked:true};
    page.on("pageerror",error=>state.errors.push(error.message));
    page.on("request",req=>{if(req.resourceType()==="script")state.scripts.push(req.url());});
    await page.clock.install();await page.clock.pauseAt(new Date());
    await page.route("**/*",route=>{
      const req=route.request(),url=new URL(req.url());
      if(url.origin!==origin)return route.abort();
      if(url.pathname==="/api/practice/question-bank/state") {
        const body={owner:url.searchParams.get("owner"),questionId:Number(url.searchParams.get("questionId"))};state.reads.push(body);assert.equal(req.method(),"GET");
        const data={userId:body.owner,questionId:body.questionId,progress:progress(),bookmarked:state.bookmarked};
        if(state.mode==="hold"){state.held.push({route,json:data,kind:"read"});return;}
        if(state.mode==="error")return route.fulfill({status:503,json:{code:"42501",error:"private details"}});
        if(state.mode==="wrong-owner")data.userId="second";
        return route.fulfill({json:data});
      }
      if(url.pathname==="/fixture/bookmark") {
        const body=req.postDataJSON();state.writes.push(body);state.bookmarked=body.action==="add";
        if(state.bookmarkMode==="hold"){state.held.push({route,json:{error:null},kind:"bookmark"});return;}
        return route.fulfill({json:{error:null}});
      }
      if(url.pathname==="/api/practice/attempt") {
        state.attempts.push(req.postDataJSON());return route.fulfill({json:{attemptId:crypto.randomUUID()}});
      }
      if(url.pathname==="/api/practice/result") {
        state.results.push(req.postDataJSON());
        if(state.resultMode==="error")return route.fulfill({status:503,json:{error:"Fixture interrupted answer save."}});
        const json={progress:progress(8),isCorrect:false,levelChange:null,tutorRevealToken:null};
        if(state.resultMode==="hold"){state.held.push({route,json,kind:"result"});return;}
        return route.fulfill({json});
      }
      return route.continue();
    });
    await page.goto(origin+query);
    await page.getByRole("heading",{name:"Question 1",exact:true}).waitFor();
    if (!query.includes("guest")) await expect.poll(()=>state.reads.length).toBe(1);
    return {page,state};
  }
  {
    const {page,state}=await open("saved","?stalled-auth");
    await page.getByRole("button",{name:"Remove bookmark",exact:true}).waitFor();
    assert.equal(state.reads.length,1,"stalled browser Auth must not hold up saved statistics");
    assert.deepEqual(state.errors,[]);await page.close();
  }
  const stat=(page,name)=>page.getByText(name,{exact:true}).locator("..").locator("span").last();
  async function ready(page) { await page.getByRole("button",{name:"Remove bookmark",exact:true}).waitFor(); }
  async function refresh(page) {
    await page.clock.runFor(2100);
    await page.evaluate(()=>{for(let n=0;n<30;n++){window.dispatchEvent(new Event("focus"));window.dispatchEvent(new Event("pageshow"));}});
  }
  async function close(page,state) {
    for(const held of state.held)await held.route.abort().catch(()=>undefined);
    assert.deepEqual(state.errors,[]);await page.close();
  }
  {
    const {page,state}=await open("hold");
    await page.getByText(/Fixture question 10001:/).waitFor();
    assert.equal(await page.getByText("Attempts",{exact:true}).count(),0,"unknown state cannot display zero attempts");
    assert.equal(await page.getByRole("button",{name:"Bookmark status unavailable"}).isDisabled(),true);
    await page.getByRole("button",{name:"A. 4",exact:true}).click();
    assert.equal(await page.getByRole("button",{name:"Submit",exact:true}).isDisabled(),true);
    assert.equal(state.attempts.length,0,"no attempt write until identity/state is ready");
    await page.screenshot({path:join(dir,"loading-desktop.png"),fullPage:true});
    await page.clock.runFor(12100);
    await page.getByRole("alert").filter({hasText:"QB-DETAIL-TIMEOUT"}).waitFor();
    assert.equal(state.reads.length,1,"Strict Mode and initial event bursts share one active read");
    const sent=page.waitForRequest("**/api/practice/question-bank/state*");
    await page.getByRole("button",{name:"Retry saved state",exact:true}).evaluate(button=>{button.click();button.click();});
    await sent;await expect.poll(()=>state.reads.length).toBe(2);
    await state.held[0].route.fulfill({json:state.held[0].json}).catch(()=>undefined);
    assert.equal(await page.getByText("Attempts",{exact:true}).count(),0);
    await state.held[1].route.fulfill({json:state.held[1].json});await ready(page);
    assert.equal(await stat(page,"Attempts").textContent(),"7");
    state.mode="error";await refresh(page);
    await page.getByRole("alert").filter({hasText:"QB-DETAIL-PERMISSION"}).waitFor();
    assert.equal(await stat(page,"Attempts").textContent(),"7");
    assert.equal(await page.getByRole("button",{name:"Remove bookmark",exact:true}).count(),1);
    assert.equal(state.reads.length,3);
    await page.setViewportSize({width:390,height:844});await page.screenshot({path:join(dir,"error-mobile.png"),fullPage:true});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.equal(state.attempts.length,1,"read refreshes must not prepare extra attempts");
    await close(page,state);
  }
  {
    const {page,state}=await open();await ready(page);
    state.bookmarkMode="hold";
    const sent=page.waitForRequest("**/fixture/bookmark");
    await page.getByRole("button",{name:"Remove bookmark",exact:true}).evaluate(button=>{button.click();button.click();});await sent;
    await expect.poll(()=>state.writes.length).toBe(1);assert.equal(state.bookmarked,false);
    await page.clock.runFor(12100);await page.getByRole("button",{name:"Retry bookmark",exact:true}).waitFor();
    await refresh(page);assert.equal(state.reads.length,1,"unconfirmed bookmark prevents focus from overriding pending intent");
    state.bookmarkMode="saved";
    await page.getByRole("button",{name:"Retry bookmark",exact:true}).evaluate(button=>{button.click();button.click();});
    await page.getByRole("button",{name:"Bookmark question",exact:true}).waitFor();
    assert.deepEqual(state.writes[0],state.writes[1]);assert.equal(state.bookmarked,false);
    await page.getByRole("button",{name:"Bookmark question",exact:true}).click();await ready(page);
    assert.equal(state.writes[2].action,"add");assert.equal(state.writes[2].options.ignoreDuplicates,true);
    await close(page,state);
  }
  {
    const {page,state}=await open();await ready(page);
    state.mode="hold";await refresh(page);
    state.resultMode="error";
    await page.getByRole("button",{name:"Give Up",exact:true}).click();
    await page.getByRole("button",{name:"Retry save",exact:true}).waitFor();
    assert.equal(await page.getByRole("heading",{name:"Solution",exact:true}).count(),0);
    state.resultMode="saved";
    await page.getByRole("button",{name:"Retry save",exact:true}).click();
    await page.getByRole("heading",{name:"Gave Up",exact:true}).waitFor();
    assert.deepEqual(state.results[0],state.results[1]);
    await state.held[0].route.fulfill({json:state.held[0].json});
    assert.equal(await stat(page,"Attempts").textContent(),"8","late refresh cannot replace newly saved progress");
    await refresh(page);
    await page.getByRole("button",{name:"Remove bookmark",exact:true}).click();
    await page.getByRole("button",{name:"Bookmark question",exact:true}).waitFor();
    await state.held[1].route.fulfill({json:state.held[1].json});
    await page.getByRole("button",{name:"Bookmark question",exact:true}).waitFor();
    await page.screenshot({path:join(dir,"saved-desktop.png"),fullPage:true});
    await close(page,state);
  }
  for(const action of ["account","unmount","switch-question","same-owner"]) {
    const {page,state}=await open("hold");
    if(action==="unmount")await page.getByRole("button",{name:"Unmount question"}).click();
    else if(action==="switch-question") {state.mode="saved";await page.getByRole("button",{name:"Switch question"}).click();}
    else await page.evaluate(owner=>window.dispatchEvent(new CustomEvent("question-account",{detail:owner})),action==="account"?"second":"first");
    await state.held[0].route.fulfill({json:state.held[0].json}).catch(()=>undefined);
    if(action==="same-owner")await ready(page);
    else if(action==="account")await page.getByRole("heading",{name:"Reload this question"}).waitFor();
    else if(action==="switch-question") {await page.getByRole("heading",{name:"Question 2",exact:true}).waitFor();await ready(page);}
    else await page.getByText("Unmounted",{exact:true}).waitFor();
    if(["account","unmount"].includes(action))assert.equal(state.attempts.length,0);
    await close(page,state);
  }
  for(const kind of ["bookmark","answer"]) {
    const {page,state}=await open();await ready(page);
    const sent=page.waitForRequest(kind==="bookmark"?"**/fixture/bookmark":"**/api/practice/result");
    if(kind==="bookmark") {state.bookmarkMode="hold";await page.getByRole("button",{name:"Remove bookmark",exact:true}).click();}
    else {state.resultMode="hold";await page.getByRole("button",{name:"Give Up",exact:true}).click();}
    await sent;
    await expect.poll(()=>state.held.length).toBe(1);
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent("question-account",{detail:"second"})));
    await page.getByRole("heading",{name:"Reload this question"}).waitFor();
    await state.held[0].route.fulfill({json:state.held[0].json}).catch(()=>undefined);
    assert.equal(await page.getByRole("heading",{name:"Solution",exact:true}).count(),0);
    assert.equal(await page.getByText("Attempts",{exact:true}).count(),0);
    await close(page,state);
  }
  {
    const {page,state}=await open();await ready(page);
    await page.clock.runFor(2100);
    await page.evaluate(()=>{
      Object.defineProperty(document,"visibilityState",{value:"hidden",configurable:true});
      window.dispatchEvent(new Event("focus"));document.dispatchEvent(new Event("visibilitychange"));
    });
    assert.equal(state.reads.length,1,"hidden pages do not refresh");
    const sent=page.waitForResponse("**/api/practice/question-bank/state*");
    await page.evaluate(()=>{
      Object.defineProperty(document,"visibilityState",{value:"visible",configurable:true});document.dispatchEvent(new Event("visibilitychange"));
    });
    await sent;assert.equal(state.reads.length,2);
    await close(page,state);
  }
  {
    const {page,state}=await open("saved","?guest");
    await page.getByRole("button",{name:"Bookmark question",exact:true}).waitFor();
    await page.getByRole("button",{name:"Bookmark question",exact:true}).click();await ready(page);
    const scripts=state.scripts.length;
    await page.getByRole("button",{name:"A. 4",exact:true}).click();
    await page.getByRole("button",{name:"Submit",exact:true}).click();
    await page.getByRole("heading",{name:"Correct!",exact:true}).waitFor();
    assert.equal(await stat(page,"Attempts").textContent(),"1");
    assert.equal(state.scripts.length,scripts,"guest answer must not fetch the full catalog");
    assert.deepEqual([state.reads,state.writes,state.attempts,state.results],[[],[],[],[]]);
    await close(page,state);
  }
  console.log(`PASS: real question UI with Strict Mode, no false-zero state, bounded reads, timeout/manual recovery, focus coalescing, frozen bookmark retries, answer retry identity, stale-response/account/unmount isolation, guest-local writes and no guest catalog download. Screenshots: ${dir}`);
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
