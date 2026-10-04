// Actual components and generated application CSS, mock endpoints only.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";
const require=createRequire(import.meta.url);
const dir=await mkdtemp(join(tmpdir(),"multiplayer-fast-handoffs-"));
const root=resolve(import.meta.dirname,"..");
const fixture=name=>resolve(import.meta.dirname,"browserFixtures",name);
const compiler=require("next/dist/compiled/webpack/webpack").webpack({mode:"development",entry:fixture("fastHandoffs.tsx"),
  output:{path:dir,filename:"client.js"},devtool:false,
  resolve:{extensions:[".tsx",".ts",".js"],alias:{
    "next/navigation":fixture("router.ts"),"next/link":fixture("link.tsx"),"next/image":fixture("image.tsx"),
    "@/lib/multiplayerRealtime":fixture("realtime.ts"),"@/components/math/MathText":fixture("math.tsx"),"@":root,
  }},module:{rules:[{test:/\.tsx?$/,exclude:/node_modules/,use:fixture("loader.cjs")},{test:/\.css$/,use:fixture("css.cjs")}]},
});
await new Promise((resolve,reject)=>compiler.run((error,stats)=>error||stats.hasErrors()
  ?reject(error??new Error(stats.toString())):compiler.close(resolve)));
const bundle=await readFile(join(dir,"client.js"));
const cssRoot=join(root,".next/static");
const css=(await Promise.all((await readdir(cssRoot,{recursive:true})).filter(f=>f.endsWith(".css")).map(f=>readFile(join(cssRoot,f),"utf8")))).join("\n");
const server=createServer((req,res)=>{
  const script=req.url==="/client.js";
  res.setHeader("Content-Type",script?"text/javascript; charset=utf-8":"text/html; charset=utf-8");
  res.end(script?bundle:`<meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));

let browser;
try {
  browser=await chromium.launch({headless:true});
  const errors=[];
  const makeRound=()=>({roomId:"test",stateVersion:1,scoringVersion:2,currentPlayerId:"p",questionNumber:1,totalQuestions:2,
    question:{questionId:42,number:1,division:"Mu",topic:"Test",difficulty:3,question:"What is 1 + 1?",choices:["2","3","4","5","6"]},
    questionDurationSeconds:90,preparing:false,questionStartedAt:Date.now()+8000,questionEndsAt:Date.now()+103000,intermissionEndsAt:null,
    players:[{playerId:"p",displayName:"Tester",isGuest:true,score:0,hasSubmittedCurrentQuestion:false}],spectators:[],upcomingQuestion:null});
  async function setup({width=1280,final=false,blank=false,preparing=false,pending=false}={}){
    const page=await browser.newPage({viewport:{width,height:900}});page.on("pageerror",e=>errors.push(e.message));
    const state=makeRound();if(final){state.totalQuestions=1;state.questionStartedAt=Date.now()-1000;state.questionEndsAt=Date.now()+94000;state.players[0].hasSubmittedCurrentQuestion=true;}
    if(blank){state.totalQuestions=1;state.questionDurationSeconds=1;state.questionStartedAt=Date.now();state.questionEndsAt=Date.now()+6000;}
    if(preparing){state.preparing=true;state.questionStartedAt=0;state.questionEndsAt=0;}
    let reads=0,ready=0,complete=false;const started=Date.now();
    await page.addInitScript(({state,pending})=>{window.initialRound=state;window.pendingResults=pending;},{state,pending});
    await page.route("**/api/multiplayer/**",async route=>{
      if(route.request().url().includes("/ready")){ready++;return route.fulfill({json:{ready:true}});}
      if(route.request().method()==="POST")return route.fulfill({json:{accepted:true}});
      reads++;
      if(complete)return route.fulfill({status:204});
      return route.fulfill({json:{...state,serverReceivedAt:Date.now(),serverSentAt:Date.now()}});
    });
    await page.goto("http://127.0.0.1:"+server.address().port+"/");
    return {page,state,started,reads:()=>reads,ready:()=>ready,finish:()=>{complete=true;}};
  }
  for(const width of [1280,390]){
    const f=await setup({width});const {page}=f;
    await expect(page.getByRole("heading",{name:"Preparing…",exact:true})).toBeVisible();
    assert.equal(await page.getByRole("button",{name:"Submit Answer",exact:true}).count(),0);
    await page.screenshot({path:join(dir,"preparing-"+width+".png"),fullPage:true});
    await expect(page.getByRole("heading",{name:"Question 1 starts in 5s",exact:true})).toBeVisible({timeout:4000});
    const firstCountdown=Date.now()-f.started;assert.ok(firstCountdown>=2400&&firstCountdown<=4000,String(firstCountdown));
    const readsBeforeCountdown=f.reads();
    for(const n of [4,3,2,1])await expect(page.getByRole("heading",{name:"Question 1 starts in "+n+"s",exact:true})).toBeVisible({timeout:1500});
    await expect(page.getByRole("heading",{name:"Question 1 of 2",exact:true})).toBeVisible({timeout:1500});
    assert.ok(Date.now()-f.started<9000,"3s preparation + 5s countdown");
    assert.equal(f.ready(),0,"pre-scheduled first question does not wait for ACK");
    assert.ok(readsBeforeCountdown<=2,"initial read plus optional pageshow recovery");
    assert.equal(f.reads(),readsBeforeCountdown,"countdown is local, not a per-second server request");
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.close();
  }
  // No broadcast: completion becomes visible on the short fallback, not the 15s poll.
  const final=await setup({final:true});await expect(final.page.getByTestId("remaining-time")).toBeVisible();
  await final.page.waitForTimeout(1000);const completedAt=Date.now();final.finish();
  await expect(final.page.locator("body")).toHaveAttribute("data-destination","/multiplayer/room/test/results",{timeout:2500});
  assert.ok(Date.now()-completedAt<2200);
  const readsAtNavigation=final.reads();await final.page.waitForTimeout(1600);
  assert.equal(final.reads(),readsAtNavigation,"stop reads once navigation starts");
  await final.page.close();
  // Blank final answer: no submission event, preserve the 5s server grace, then
  // recover promptly after the actual hard deadline even without a broadcast.
  const blank=await setup({blank:true});
  await expect(blank.page.getByText("Time expired",{exact:true})).toBeVisible({timeout:2000});
  await blank.page.waitForTimeout(Math.max(0,blank.state.questionEndsAt-Date.now()));
  const blankCompletedAt=Date.now();blank.finish();
  await expect(blank.page.locator("body")).toHaveAttribute("data-destination","/multiplayer/room/test/results",{timeout:2500});
  assert.ok(Date.now()-blankCompletedAt<2200,"blank final-question deadline triggers bounded recovery");
  await blank.page.close();
  // Old preparing room stays compatible, but recovery reads stop after the short burst.
  const slow=await setup({preparing:true});await slow.page.waitForTimeout(400);
  const initialReads=slow.reads();await slow.page.waitForTimeout(3600);
  assert.equal(slow.ready(),1);assert.equal(slow.reads(),initialReads+3);
  await slow.page.waitForTimeout(1200);assert.equal(slow.reads(),initialReads+3);await slow.page.close();
  const pending=await setup({pending:true});await pending.page.waitForTimeout(2200);
  const refreshes=Number(await pending.page.locator("body").getAttribute("data-refreshes"));
  assert.equal(refreshes,2,"two short result-page recovery attempts");
  await pending.page.evaluate(()=>{for(let i=0;i<20;i++)window.dispatchEvent(new CustomEvent("test-room-event"));});
  assert.equal(Number(await pending.page.locator("body").getAttribute("data-refreshes")),2,"coalesce duplicate events");
  await pending.page.close();
  assert.deepEqual(errors,[]);
  console.log("PASS actual component: 3s prep + 5s countdown, no early controls, no first ACK dependency, no per-second reads, missed completion event recovery and bounded pending-result retries; desktop/mobile.");
  console.log("Screenshots: "+dir);
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
