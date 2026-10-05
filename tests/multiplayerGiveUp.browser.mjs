// Actual components, mock API, isolated Chromium. No hosted database requests.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";
const require = createRequire(import.meta.url);
const dir=await mkdtemp(join(tmpdir(),"multiplayer-give-up-"));
const root=resolve(import.meta.dirname,"..");
const fixture=name=>resolve(import.meta.dirname,"browserFixtures",name);
const compiler=require("next/dist/compiled/webpack/webpack").webpack({mode:"development",entry:fixture("scoring.tsx"),
  output:{path:dir,filename:"client.js"},devtool:false,
  resolve:{extensions:[".tsx",".ts",".js"],alias:{
    "next/navigation":fixture("router.ts"),"next/link":fixture("link.tsx"),"next/image":fixture("image.tsx"),
    "@/lib/multiplayerRealtime":fixture("realtime.ts"),
    "@/components/math/MathText":fixture("math.tsx"),
    "@/components/multiplayer/RankTheme":fixture("rank.tsx"),"@":root,
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
  const base=()=>({roomId:"test",scoringVersion:2,stateVersion:1,currentPlayerId:"p",questionNumber:1,totalQuestions:2,
    question:{questionId:42,number:1,division:"Mu",topic:"Algebra",difficulty:2,question:"What is 1 + 1?",choices:["2","3","4","5","6"]},
    questionDurationSeconds:90,preparing:false,questionStartedAt:Date.now()-1000,questionEndsAt:Date.now()+94000,
    intermissionEndsAt:null,players:[{playerId:"p",displayName:"Tester",isGuest:true,score:0,hasSubmittedCurrentQuestion:false}],
    spectators:[],upcomingQuestion:null});
  const errors=[];
  async function setup({version=2,duration=90,width=1280,failures=0,staleSubmissionSnapshot=false,result}={}) {
    const page=await browser.newPage({viewport:{width,height:1000}});
    page.on("pageerror",e=>errors.push(e.message));
    const initial={...base(),scoringVersion:version,questionDurationSeconds:duration,
      questionStartedAt:Date.now()-1000,questionEndsAt:Date.now()+(duration+4)*1000};
    let state=initial, failCount=failures;
    const posts=[];
    await page.addInitScript(({initial,result})=>{window.initialRound=initial;window.initialResult=result;},{initial,result});
    await page.route("**/api/multiplayer/**",async route=>{
      if(route.request().method()==="POST") {
        const body=route.request().postDataJSON();posts.push(body);
        if(failCount>0){failCount--;return route.abort();}
        state={...state,stateVersion:2,players:state.players.map(p=>({...p,hasSubmittedCurrentQuestion:!staleSubmissionSnapshot}))};
        return route.fulfill({json:{accepted:true}});
      }
      return route.fulfill({json:{...state,serverReceivedAt:Date.now(),serverSentAt:Date.now()}});
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    return {page,posts,succeed:()=>{failCount=0;}};
  }
  const giveUp=page=>page.getByRole("button",{name:"Give up · 0 points",exact:true});
  const removedCopy="Correct: 1,000 + up to 500 speed bonus · Wrong: −300 · Blank / Give up: 0";
  const answered=page=>page.getByRole("list",{name:"Round standings"}).getByText("Answered",{exact:true});
  for(const width of [1280,390]) {
    const f=await setup({width,failures:1,staleSubmissionSnapshot:true}), {page}=f;
    await expect(giveUp(page)).toBeEnabled();
    assert.equal(await page.getByRole("button",{name:/skip/i}).count(),0);
    await expect(page.getByText(removedCopy,{exact:true})).toHaveCount(0);
    if(process.env.SCORING_SCREENSHOT_DIR)await page.screenshot({path:join(process.env.SCORING_SCREENSHOT_DIR,`question-${width}.png`),fullPage:true});
    await page.getByRole("button",{name:"B 3",exact:true}).click();
    await giveUp(page).click();
    await expect(page.getByRole("group",{name:"Confirm Give up"})).toHaveCount(0);
    await expect(page.getByRole("button",{name:"Confirm Give up",exact:true})).toHaveCount(0);
    await expect(answered(page)).toBeVisible();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.getByText("Give up recorded · 0 points",{exact:true}).waitFor();
    assert.equal(f.posts.length,2);
    assert.deepEqual(f.posts,[{questionId:42,selectedAnswer:null},{questionId:42,selectedAnswer:null}]);
    await expect(page.getByRole("heading",{name:"Live leaderboard"})).toBeVisible();
    await expect(page.getByText("Waiting for the other players…",{exact:true})).toBeVisible();
    await expect(answered(page)).toBeVisible();
    await expect(page.getByText("Still answering",{exact:true})).toHaveCount(0);
    await expect(page.getByText("Totals show completed questions. Results appear when this round closes.",{exact:true})).toHaveCount(0);
    if(process.env.SCORING_SCREENSHOT_DIR)await page.screenshot({path:join(process.env.SCORING_SCREENSHOT_DIR,`answered-${width}.png`),fullPage:true});
    assert.equal(await giveUp(page).count(),0);
    await page.close();
  }
  for(const selectedAnswer of [null,"B"]) {
    const f=await setup({failures:20}),{page}=f;
    await expect(giveUp(page)).toBeEnabled();
    if(selectedAnswer===null)await giveUp(page).click();
    else {await page.getByRole("button",{name:"B 3",exact:true}).click();await page.getByRole("button",{name:"Submit Answer"}).click();}
    await expect(answered(page)).toBeVisible();
    await page.getByRole("button",{name:"Retry saved answer"}).waitFor({timeout:15000});
    assert.equal(f.posts.length,4);
    await page.reload();
    await page.getByRole("button",{name:"Retry saved answer"}).waitFor();
    await expect(answered(page)).toBeVisible();
    assert.equal(await giveUp(page).count(),0,"pending answer cannot be replaced by Give up after refresh");
    assert.equal(await page.getByRole("button",{name:"Submit Answer"}).count(),0);
    f.succeed();
    await page.getByRole("button",{name:"Retry saved answer"}).click();
    await page.getByText(selectedAnswer===null?"Give up recorded · 0 points":"Answer submitted",{exact:true}).waitFor();
    await expect(answered(page)).toBeVisible();
    assert.equal(f.posts.length,5);assert.ok(f.posts.every(p=>p.selectedAnswer===selectedAnswer));
    await page.close();
  }
  const blank=await setup({duration:3});
  await expect(giveUp(blank.page)).toBeEnabled();
  await blank.page.getByText("Time expired",{exact:true}).waitFor({timeout:6000});
  assert.equal(blank.posts.length,0,"timeout stays blank; no automatic guess or Give up request");
  await blank.page.close();
  const legacy=await setup({version:1});
  await expect(legacy.page.getByRole("heading",{name:"Question 1 of 2"})).toBeVisible();
  assert.equal(await giveUp(legacy.page).count(),0);
  await expect(legacy.page.getByText(/Legacy scoring:/)).toBeVisible();
  await legacy.page.close();
  const final=await setup({result:{
    roomId:"test",viewerMode:"player",placement:2,score:-300,ranked:false,ratingChange:null,
    finalLeaderboard:[{...base().players[0],score:-300,placement:2}],
    rounds:[[null,false,0],["B",false,-300],["A",true,1250]].map(([selectedAnswer,correct,pointsEarned],i)=>({
      questionId:42+i,questionNumber:i+1,question:"What is 1 + 1?",choices:["2","3"],selectedAnswer,
      correctAnswer:"A",correct,answerTimeMs:1000,pointsEarned,solution:"Two.",
    })),
  }});
  for(const text of ["-300 total points","-300 pts","Blank / Give up · 0","Incorrect · -300","Correct · +1250"])
    await expect(final.page.getByText(text,{exact:true})).toBeVisible();
  await final.page.close();
  assert.deepEqual(errors,[]);
  console.log("PASS: one-click Give up, removed scoring copy, accurate Answered status, stale snapshots, immutable network retries, refresh recovery, timeout blanks, legacy rooms, negative results and desktop/mobile layout.");
} finally {
  await browser?.close();
  await new Promise(resolve=>server.close(resolve));
}
