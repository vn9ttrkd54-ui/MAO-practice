import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const bundledWebpack = require("next/dist/compiled/webpack/webpack");
const dir=await mkdtemp(join(tmpdir(),"multiplayer-ui-"));
const root=resolve(import.meta.dirname,"..");
const fixture=(name)=>resolve(import.meta.dirname,"browserFixtures",name);
const compiler=bundledWebpack.webpack({ mode:"development",entry:fixture("multiplayer.tsx"),
  output:{path:dir,filename:"client.js"},devtool:false,
  resolve:{extensions:[".tsx",".ts",".js"],alias:{
    "next/navigation":fixture("router.ts"),
    "@/lib/multiplayerRealtime":fixture("realtime.ts"),
    "@/components/math/MathText":fixture("math.tsx"),
    "@/components/multiplayer/RankTheme":fixture("rank.tsx"),"@":root,
  }},module:{rules:[{test:/\.tsx?$/,exclude:/node_modules/,use:fixture("loader.cjs")}]},
});
await new Promise((resolve,reject)=>compiler.run((error,stats)=>error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(resolve)));
const bundle=await readFile(join(dir,"client.js"));
const server=createServer((req,res)=> {
  res.setHeader("Content-Type",req.url==="/client.js"?"text/javascript; charset=utf-8":"text/html; charset=utf-8");
  res.end(req.url==="/client.js"?bundle:'<div id="root"></div><script src="/client.js"></script>');
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage();
  const errors=[];page.on("pageerror",error=>errors.push(error.message));
  const initial={roomId:"test",stateVersion:1,currentPlayerId:"p",questionNumber:1,totalQuestions:2,
    question:{questionId:42,number:1,division:"Mu",topic:"Test",question:"What is 1 + 1?",choices:["2","3","4","5","6"]},
    questionDurationSeconds:60,preparing:true,questionStartedAt:0,questionEndsAt:0,intermissionEndsAt:null,
    players:[{playerId:"p",displayName:"Tester",isGuest:true,score:0,hasSubmittedCurrentQuestion:false}],spectators:[],upcomingQuestion:null};
  let state=initial;let polls=0;let deliveries=0;let submissions=0;const readies=[];
  await page.addInitScript(round=>{window.initialRound=round},initial);
  await page.route("**/api/multiplayer/**",async route=>{
    const req=route.request();
    if(req.url().includes("/delivery")){deliveries++;return route.abort();}
    if(req.url().includes("/ready")){
      readies.push(req.postDataJSON().questionNumber);
      return route.fulfill({json:{ready:true}});
    }
    if(req.method()==="POST") {
      submissions++;
      if(submissions===1)return route.abort();
      return route.fulfill({json:{accepted:true}});
    }
    polls++;
    const version=Number(new URL(req.url()).searchParams.get("version"));
    await route.fulfill({json:{...(version===state.stateVersion?{unchanged:true}:state),serverReceivedAt:Date.now(),serverSentAt:Date.now()}});
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.getByRole("heading",{name:"Preparing…",exact:true}).waitFor();
  await page.waitForTimeout(350);
  assert.deepEqual(readies,[1]);
  assert.equal(await page.getByRole("button",{name:"Submit Answer"}).count(),0);
  const firstReveal=Date.now()+15000;
  state={...initial,stateVersion:2,preparing:false,questionStartedAt:firstReveal,questionEndsAt:firstReveal+65000};
  const signal=async version=>page.evaluate(v=>window.dispatchEvent(new CustomEvent("test-room-event",{detail:{
    roomId:"test",stateVersion:v,kind:"round_staged",questionNumber:1,intermissionEndsAt:null,
  }})),version);
  await signal(2);
  for(const n of [10,9,8,7,6,5,4,3,2,1]) await page.getByRole("heading",{name:`Question 1 starts in ${n}s`,exact:true}).waitFor({timeout:6500});
  await page.getByRole("heading",{name:"Question 1 of 2"}).waitFor();
  const answer=page.getByRole("button").first();
  assert.equal(await answer.isEnabled(),true);
  await answer.click();
  await page.getByRole("button",{name:"Submit Answer"}).click();
  await page.getByText("Answer submitted",{exact:true}).waitFor({timeout:5000});
  assert.equal(submissions,2);
  state={...state,stateVersion:3,upcomingQuestion:{questionNumber:2,preparing:true,
    question:{...initial.question,questionId:43,number:2},questionStartedAt:0,questionEndsAt:0}};
  await signal(3);
  await page.getByText("Preparing next question…",{exact:true}).waitFor();
  await page.waitForTimeout(350);
  assert.deepEqual(readies,[1,2]);
  const reveal=Date.now()+10000;
  state={...state,stateVersion:4,intermissionEndsAt:reveal,upcomingQuestion:{...state.upcomingQuestion,
    preparing:false,questionStartedAt:reveal,questionEndsAt:reveal+65000}};
  await page.evaluate(end=>window.dispatchEvent(new CustomEvent("test-room-event",{detail:{roomId:"test",stateVersion:4,
    kind:"round_staged",questionNumber:1,intermissionEndsAt:end}})),reveal);
  for(const n of [5,4,3,2,1])await page.getByText(`Next question in ${n}s`,{exact:true}).waitFor({timeout:6500});
  await page.getByRole("heading",{name:"Question 2 of 2"}).waitFor({timeout:2500});
  assert.equal(await answer.isEnabled(),true);
  // An old event cannot restore the previous round or countdown.
  await page.evaluate(()=>window.dispatchEvent(new CustomEvent("test-room-event",{detail:{roomId:"test",stateVersion:1,
    kind:"round_staged",questionNumber:1,intermissionEndsAt:Date.now()+5000}})));
  await page.waitForTimeout(350);
  assert.equal(await page.getByRole("heading",{name:"Question 2 of 2"}).isVisible(),true);
  assert.equal(deliveries,0);
  assert.ok(polls<=6,`Unexpected polling burst: ${polls}`);
  assert.deepEqual(errors,[]);
  console.log("PASS: actual MatchQuestion UI, preparation acknowledgements, full 10/5 countdowns, immediate controls, failed-request retry, local reveal, stale-event rejection, and no receipt/boundary request storm.");
} finally {
  await browser.close();await new Promise(resolve=>server.close(resolve));
}
