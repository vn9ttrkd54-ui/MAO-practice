// Actual components and generated application CSS, mock endpoints only.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";
import { muQuestions } from "../data/questions/mu.ts";
const require=createRequire(import.meta.url);
const dir=await mkdtemp(join(tmpdir(),"multiplayer-feedback-"));
const root=resolve(import.meta.dirname,"..");
const fixture=name=>resolve(import.meta.dirname,"browserFixtures",name);
const compiler=require("next/dist/compiled/webpack/webpack").webpack({mode:"development",entry:fixture("roundFeedback.tsx"),
  output:{path:dir,filename:"client.js"},devtool:false,
  resolve:{extensions:[".tsx",".ts",".js"],alias:{
    "next/navigation":fixture("router.ts"),"next/link":fixture("link.tsx"),"next/image":fixture("googleImage.tsx"),
    "@/lib/multiplayerRealtime":fixture("realtime.ts"),"@/components/math/MathText":fixture("math.tsx"),"@":root,
  }},module:{rules:[{test:/\.tsx?$/,exclude:/node_modules/,use:fixture("loader.cjs")},{test:/\.css$/,use:fixture("css.cjs")}]},
});
await new Promise((resolve,reject)=>compiler.run((error,stats)=>error||stats.hasErrors()
  ?reject(error??new Error(stats.toString())):compiler.close(resolve)));
const bundle=await readFile(join(dir,"client.js"));
const illustratedQuestion=muQuestions.find(q=>q.id===10238);
const diagram=await readFile(join(root,"public",illustratedQuestion.illustration.src));
const cssRoot=join(root,".next/static");
const css=(await Promise.all((await readdir(cssRoot,{recursive:true})).filter(f=>f.endsWith(".css")).map(f=>readFile(join(cssRoot,f),"utf8")))).join("\n");
const server=createServer((req,res)=>{
  if(req.url===illustratedQuestion.illustration.src) {
    res.setHeader("Content-Type","image/svg+xml");res.end(diagram);return;
  }
  const script=req.url==="/client.js";
  res.setHeader("Content-Type",script?"text/javascript; charset=utf-8":"text/html; charset=utf-8");
  res.end(script?bundle:`<meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
let browser;
try {
  browser=await chromium.launch({headless:true});
  const errors=[];
  const base=()=>({roomId:"test",scoringVersion:2,stateVersion:1,currentPlayerId:"p0",questionNumber:1,totalQuestions:2,
    roundClosed:false,question:{questionId:42,number:1,division:"Mu",topic:"Algebra",difficulty:2,question:"What is 1 + 1?",choices:["2","3","4","5","6"]},
    questionDurationSeconds:90,preparing:false,questionStartedAt:Date.now()-1000,questionEndsAt:Date.now()+89000,
    intermissionEndsAt:null,players:["Ada","Ben","Guest","Dana"].map((name,i)=>({playerId:`p${i}`,userId:i===2?null:`u${i}`,
      displayName:name,isGuest:i===2,rankTier:["Gold","Silver",null,"Bronze"][i],rp:400,score:0,placement:null,roundResult:null,
      hasSubmittedCurrentQuestion:i<3})),spectators:[],upcomingQuestion:null});
  const close=state=>({...state,stateVersion:state.stateVersion+1,roundClosed:true,players:state.players.map((p,i)=>({...p,
    score:[1250,-300,0,0][i],roundResult:{questionNumber:state.questionNumber,outcome:["correct","incorrect","give-up","blank"][i],
      pointsEarned:[1250,-300,0,0][i],answerTimeMs:[45000,12000,12500,null][i]}}))});
  async function setup({width=1280,spectator=false,final=false,result=false,illustrated=false}={}) {
    const page=await browser.newPage({viewport:{width,height:1000}});
    page.on("pageerror",e=>errors.push(e.message));
    let state=base(),failure=false,reads=0;
    if(illustrated) {
      const q=illustratedQuestion;
      state.question={questionId:q.id,number:1,division:q.division,topic:q.topic,difficulty:q.difficulty,
        question:q.question,choices:q.choices,illustration:q.illustration};
      state.players=state.players.map(p=>({...p,hasSubmittedCurrentQuestion:false}));
    }
    if(final)state.totalQuestions=1;
    const initial=structuredClone(state);
    const finalData={roomId:"test",viewerMode:spectator?"spectator":"player",placement:2,score:-300,ranked:false,ratingChange:null,
      finalLeaderboard:close(state).players.map((p,i)=>({...p,placement:[1,4,2,3][i]})),rounds:[{questionId:42,questionNumber:1,
        question:state.question.question,illustration:state.question.illustration,choices:state.question.choices,
        selectedAnswer:"B",correctAnswer:"A",correct:false,answerTimeMs:12000,pointsEarned:-300,solution:"Two."}]};
    await page.addInitScript(({initial,spectator,result,finalData})=>{
      window.initialRound=initial;if(spectator)window.initialSpectator=initial;if(result)window.initialResult=finalData;
    },{initial,spectator,result,finalData});
    await page.route("**/api/multiplayer/**",async route=>{
      if(route.request().method()!=="GET") {
        if(illustrated&&route.request().url().endsWith("/round")) {
          state={...state,stateVersion:state.stateVersion+1,players:state.players.map((p,i)=>i===0?{...p,hasSubmittedCurrentQuestion:true}:p)};
        }
        return route.fulfill({json:{accepted:true}});
      }
      reads++;if(failure)return route.fulfill({status:503,json:{error:"Offline"}});
      if(state.completed)return spectator?route.fulfill({json:{completed:true}}):route.fulfill({status:204});
      if(new URL(route.request().url()).searchParams.get("version")===String(state.stateVersion)) {
        return route.fulfill({json:{unchanged:true,serverReceivedAt:Date.now(),serverSentAt:Date.now()}});
      }
      return route.fulfill({json:{...state,serverReceivedAt:Date.now(),serverSentAt:Date.now()}});
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    return {page,get:()=>state,set:s=>{state=s;},reads:()=>reads,fail:value=>{failure=value;},
      signal:()=>page.evaluate(v=>window.dispatchEvent(new CustomEvent("test-room-event",{detail:{stateVersion:v}})),state.stateVersion)};
  }
  const assertFeedback=async page=>{
    const list=page.getByRole("list",{name:/standings/});
    for(const text of ["Correct","Incorrect","Gave up","Blank","+1250 pts","-300 pts","45.0s","12.0s","12.5s","Time expired"])
      await expect(list.getByText(text,{exact:true}).first()).toBeVisible();
  };
  const assertRemovedCopy=async page=>{
    for(const text of ["This question’s points are included in each total.",
      "Totals show completed questions. Results appear when this round closes."])
      await expect(page.getByText(text,{exact:true})).toHaveCount(0);
  };
  for(const width of [1280,390]) {
    // Exact reported diagram, with real SVG bytes and the actual multiplayer UI.
    const live=await setup({width,illustrated:true});
    const graph=live.page.getByRole("img",{name:illustratedQuestion.illustration.alt});
    await expect(graph).toBeVisible();
    await expect(graph).toHaveAttribute("src",illustratedQuestion.illustration.src);
    await graph.evaluate(img=>img.decode());
    assert.ok(await graph.evaluate(img=>img.naturalWidth>0));
    assert.equal(await live.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await live.page.screenshot({path:join(dir,`question-10238-${width}.png`),fullPage:true});
    await live.page.getByRole("button",{name:"A 3",exact:true}).click();
    await live.page.getByRole("button",{name:"Submit Answer",exact:true}).click();
    const liveList=live.page.getByRole("list",{name:"Round standings"});
    await expect(liveList.getByText("Answered",{exact:true})).toHaveCount(1);
    await expect(liveList.getByText("Still answering",{exact:true})).toHaveCount(3);
    live.set({...live.get(),stateVersion:3,players:live.get().players.map((p,i)=>i===1?{...p,hasSubmittedCurrentQuestion:true}:p)});
    await live.signal();
    await expect(liveList.getByText("Answered",{exact:true})).toHaveCount(2);
    await expect(liveList.getByText("Still answering",{exact:true})).toHaveCount(2);
    assert.equal(await liveList.getByText("Correct",{exact:true}).count(),0);
    const beforeBurst=live.reads();
    live.set({...live.get(),stateVersion:4,players:live.get().players.map((p,i)=>i===2?{...p,hasSubmittedCurrentQuestion:true}:p)});
    await live.page.evaluate(()=>{for(let i=0;i<30;i++)window.dispatchEvent(new CustomEvent("test-room-event",{detail:{stateVersion:4}}));});
    await expect(liveList.getByText("Answered",{exact:true})).toHaveCount(3);
    assert.ok(live.reads()-beforeBurst<=2,"a burst of submission signals must coalesce instead of fetching per signal");
    await live.page.reload();
    await expect(live.page.getByRole("list",{name:"Round standings"}).getByText("Answered",{exact:true})).toHaveCount(3);
    await live.page.close();
    for(const mode of [{spectator:true},{result:true}]) {
      const shown=await setup({width,illustrated:true,...mode});
      const image=shown.page.getByRole("img",{name:illustratedQuestion.illustration.alt});
      await expect(image).toBeVisible();await image.evaluate(img=>img.decode());
      assert.ok(await image.evaluate(img=>img.naturalWidth>0));
      await shown.page.close();
    }
    const f=await setup({width}),{page}=f;
    await expect(page.getByTestId("remaining-time")).toBeVisible();
    const standings=page.getByRole("list",{name:"Round standings"});
    await expect(standings.getByText("Answered",{exact:true})).toHaveCount(3);
    await expect(standings.getByText("Still answering",{exact:true})).toHaveCount(1);
    await assertRemovedCopy(page);
    const start=await page.getByTestId("remaining-time").textContent(),reads=f.reads();
    await expect(page.getByTestId("remaining-time")).not.toHaveText(start);
    assert.equal(f.reads(),reads,"countdown ticks locally, no per-second requests");
    assert.equal(await page.getByText("Correct",{exact:true}).count(),0);
    assert.equal(await page.getByRole("button",{name:/skip/i}).count(),0);
    await page.screenshot({path:join(dir,`waiting-${width}.png`),fullPage:true});
    // Zero on the local clock must not reveal feedback, even if a malformed fixture includes it.
    f.set({...close(f.get()),roundClosed:false,questionStartedAt:Date.now()-95000,questionEndsAt:Date.now()-5000});await f.signal();
    await expect(page.getByText("Waiting for the round to close…")).toBeVisible();
    assert.equal(await page.getByText("Correct",{exact:true}).count(),0);
    f.set(close(f.get()));await f.signal();
    await expect(page.getByRole("heading",{name:"Question 1 results"})).toBeVisible();await assertFeedback(page);
    await assertRemovedCopy(page);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:join(dir,`results-${width}.png`),fullPage:true});
    // Refresh preserves the server-confirmed result rather than a local score calculation.
    await page.reload();await assertFeedback(page);
    const current=f.get();f.set({...current,stateVersion:current.stateVersion-1,roundClosed:false,players:base().players});await f.signal();
    await expect(page.getByRole("heading",{name:"Question 1 results"})).toBeVisible();
    // Preloaded reveal must not inherit question 1's outcome flags.
    const startAt=Date.now()+1200;
    f.set({...current,stateVersion:current.stateVersion+1,intermissionEndsAt:startAt,upcomingQuestion:{questionNumber:2,preparing:false,
      question:{...current.question,number:2,questionId:43},questionStartedAt:startAt,questionEndsAt:startAt+90000}});await f.signal();
    await expect(page.getByRole("heading",{name:"Question 2 of 2"})).toBeVisible({timeout:6000});
    await expect(page.getByRole("button",{name:"Submit Answer",exact:true})).toBeVisible();
    assert.equal(await page.getByText("Correct",{exact:true}).count(),0);
    await page.getByRole("button",{name:"A 2",exact:true}).click();
    await page.getByRole("button",{name:"Submit Answer",exact:true}).click();
    await expect(standings.getByText("Answered",{exact:true})).toHaveCount(1);
    await expect(standings.getByText("Still answering",{exact:true})).toHaveCount(3);
    assert.equal(await page.getByText("Correct",{exact:true}).count(),0,"new round never inherits earlier feedback");
    await assertRemovedCopy(page);
    await page.close();
  }
  const final=await setup({final:true});
  await expect(final.page.getByRole("heading",{name:"Waiting for final results"})).toBeVisible();
  await expect(final.page.getByTestId("remaining-time")).toBeVisible();
  final.set({...final.get(),stateVersion:2,completed:true});await final.signal();
  await expect(final.page.locator("body")).toHaveAttribute("data-destination","/multiplayer/room/test/results");await final.page.close();
  const retry=await setup();await expect(retry.page.getByTestId("remaining-time")).toBeVisible();
  retry.fail(true);retry.set({...retry.get(),stateVersion:2});await retry.signal();
  // A transport failure needs a visible retry on the waiting screen.
  await retry.page.route("**/round?*",route=>route.abort());await retry.signal();
  await expect(retry.page.getByRole("button",{name:"Retry now"})).toBeVisible();
  await retry.page.unroute("**/round?*");retry.fail(false);
  await retry.page.getByRole("button",{name:"Retry now"}).click();
  await expect(retry.page.getByRole("button",{name:"Retry now"})).toHaveCount(0);await retry.page.close();
  const spectator=await setup({spectator:true,final:true});
  await expect(spectator.page.getByRole("list",{name:"Round standings"}).getByText("Answered",{exact:true})).toHaveCount(3);
  await assertRemovedCopy(spectator.page);
  assert.equal(await spectator.page.getByText("Correct",{exact:true}).count(),0);
  spectator.set(close(spectator.get()));await spectator.signal();await assertFeedback(spectator.page);
  await assertRemovedCopy(spectator.page);
  spectator.set({...spectator.get(),stateVersion:1,roundClosed:false});await spectator.signal();
  await expect(spectator.page.getByRole("heading",{name:"Question 1 results"})).toBeVisible();await spectator.page.close();
  for(const spectator of [false,true]) {
    const f=await setup({result:true,spectator,width:390});await assertFeedback(f.page);
    assert.equal(await f.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await f.page.close();
  }
  assert.deepEqual(errors,[]);
  console.log("PASS: real 10238 graph in player/spectator/review, live peer submission updates, coalesced bursts, waiting timer, feedback, refresh, stale snapshots, preload reset, final wait and reconnect; desktop/mobile.");
  console.log(`Screenshots: ${dir}`);
} finally { await browser?.close();await new Promise(resolve=>server.close(resolve)); }
