// Run after a fresh production build. All API traffic is mocked; no Supabase writes.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const webpack = require("next/dist/compiled/webpack/webpack");
const root = resolve(import.meta.dirname, "..");
const dir = await mkdtemp(join(tmpdir(), "lobby-ready-ui-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = webpack.webpack({
  mode: "development", entry: fixture("stageOne.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/navigation": fixture("router.ts"),
    "next/image": fixture("image.tsx"),
    "next/link": fixture("link.tsx"),
    "@/app/multiplayer/actions": fixture("actions.ts"),
    "@/lib/multiplayerRealtime": fixture("realtime.ts"),
    "@/lib/supabase/client": fixture("publicRealtime.ts"),
    "@/components/multiplayer/RankTheme": fixture("rank.tsx"), "@": root,
  } },
  module: { rules: [
    { test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") },
    { test: /\.css$/, use: fixture("css.cjs") },
  ] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(resolve)));
const bundle = await readFile(join(dir, "client.js"));
const cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(req.url === "/client.js" ? bundle : `<style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const url = `http://127.0.0.1:${server.address().port}`;


  const player={playerId:'me',isHost:true,isGuest:false,rankTier:'Novice',rp:0,displayName:'Host',connected:true,score:0,lobbyReady:false};
  const friend={...player,playerId:'friend',isHost:false,displayName:'Friend'};
  let lobby={room:{id:'test',status:'countdown',visibility:'public',capacity:20,stateVersion:1,settingsVersion:0,countdownEndsAt:Date.now()+60000,
    settings:{division:'Mu',questionCount:5,secondsPerQuestion:90,difficultyBand:'2-4',mode:'ranked'}},currentPlayer:player,players:[player,friend]};
  const page=await browser.newPage({viewport:{width:390,height:1000}});
  const errors=[],readyCalls=[],connections=[],reads=[];
  let rejectReady=false, holdReady=false, readyReceipt=null, releaseReady, releaseConnect;
  const connectGate=new Promise(resolve=>{releaseConnect=resolve;});
  page.on('pageerror',error=>errors.push(error.message));
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.addInitScript(data=>Object.assign(window,data),{mode:'lobby',initialLobby:lobby});
  const change=(changes={})=>{lobby={...lobby,...changes,room:{...lobby.room,...changes.room,stateVersion:lobby.room.stateVersion+1}};};
  const ownReady=value=>{
    const currentPlayer={...lobby.currentPlayer,lobbyReady:value};
    change({currentPlayer,players:lobby.players.map(p=>p.playerId==='me'?currentPlayer:p)});
  };
  await page.route('**/*',async route=>{
    const request=route.request();
    if(!request.url().startsWith(url))return route.abort();
    if(!request.url().includes('/api/'))return route.continue();
    if(request.url().endsWith('/lobby/ready')) {
      const body=request.postDataJSON();readyCalls.push(body);
      if(rejectReady)return route.fulfill({status:503,json:{error:'Ready was not confirmed. Please retry.'}});
      if(holdReady) {
        readyReceipt=structuredClone(lobby);readyReceipt.currentPlayer.lobbyReady=body.ready;
        readyReceipt.players=readyReceipt.players.map(p=>p.playerId==='me'?readyReceipt.currentPlayer:p);
        readyReceipt.room.stateVersion++;
        await new Promise(resolve=>{releaseReady=resolve;});
        return route.fulfill({json:readyReceipt});
      }
      ownReady(body.ready);
      const now=await page.evaluate(()=>Date.now());
      if(lobby.players.every(p=>p.lobbyReady) && lobby.players.length>=2 && lobby.room.countdownEndsAt>now+10000)
        lobby.room.countdownEndsAt=now+10000;
      return route.fulfill({json:lobby});
    }
    if(request.method()==='PATCH') {
      const body=request.postDataJSON();
      ownReady(false);change({players:lobby.players.map(p=>({...p,lobbyReady:false})),
        room:{settingsVersion:lobby.room.settingsVersion+1,settings:{...lobby.room.settings,difficultyBand:body.difficultyBand}}});
      return route.fulfill({json:lobby});
    }
    if(request.method()==='POST') {
      const body=request.postDataJSON();connections.push(body);
      if(body.action==='disconnect')return route.fulfill({json:{status:'disconnected'}});
      if(body.action==='connect') { await connectGate;ownReady(false); }
      return route.fulfill({json:{status:'connected',lobby}});
    }
    reads.push(request.url());return route.fulfill({json:lobby});
  });
  const signal=async()=>{
    await page.evaluate(v=>window.dispatchEvent(new CustomEvent('test-room-event',{detail:{roomId:'test',stateVersion:v}})),lobby.room.stateVersion);
    await page.clock.runFor(200);
  };
  await page.goto(url);
  const readyButton=()=>page.getByRole('button',{name:"I'm ready",exact:true});
  await readyButton().waitFor();assert.equal(await readyButton().isDisabled(),true,'must connect first');
  releaseConnect();
  await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==="I'm ready"&&!b.disabled));
  assert.equal(await page.getByLabel('Question difficulty',{exact:true}).isEnabled(),true,
    'a confirmed long countdown unlocks difficulty before the first display-clock tick');
  rejectReady=true;await readyButton().click();
  await page.getByRole('alert').filter({hasText:'not confirmed'}).waitFor();
  assert.equal(await page.getByText('0/2 ready',{exact:true}).isVisible(),true,'no optimistic readiness');
  rejectReady=false;await page.getByRole('button',{name:'Retry Ready',exact:true}).click();
  await page.getByText('1/2 ready',{exact:true}).waitFor();
  assert.deepEqual(readyCalls.map(c=>c.ready),[true,true],'failure retry repeats intent');
  assert.equal(readyCalls[0].connectionId,connections[0].connectionId);
  assert.equal(readyCalls[0].playerId,'me');assert.equal(readyCalls[0].settingsVersion,0);
  assert.equal(await page.getByRole('button',{name:'Not ready',exact:true}).getAttribute('aria-pressed'),'true');
  assert.equal(await page.getByRole('button',{name:/skip|give up/i}).count(),0);
  const select=page.getByLabel('Question difficulty',{exact:true});
  await select.selectOption('1-3');await page.getByRole('button',{name:'Save difficulty',exact:true}).click();
  await page.getByText('0/2 ready',{exact:true}).waitFor();
  await page.getByText('Difficulty: 1–3 · 90s per question',{exact:true}).waitFor();

  // Non-hosts have the same Ready control; an old response cannot roll back a new snapshot.
  change({currentPlayer:{...lobby.currentPlayer,isHost:false},
    players:lobby.players.map(p=>({...p,isHost:p.playerId==='friend'}))});
  await signal();await select.waitFor({state:'detached'});
  holdReady=true;const pending=page.waitForRequest(r=>r.url().endsWith('/lobby/ready'));
  await readyButton().click();await pending;
  await page.getByRole('button',{name:'Saving Ready…',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Saving Ready…',exact:true}).isDisabled(),true);
  assert.equal(await page.getByText('0/2 ready',{exact:true}).isVisible(),true);
  change({room:{settingsVersion:2,settings:{...lobby.room.settings,difficultyBand:'3-5'}}});change();
  await signal();await page.getByText('Difficulty: 3–5 · 90s per question',{exact:true}).waitFor();
  releaseReady();holdReady=false;
  await readyButton().waitFor();
  assert.equal(await page.getByText('0/2 ready',{exact:true}).isVisible(),true,'old Ready receipt ignored');
  change({players:lobby.players.map(p=>p.playerId==='friend'?{...p,lobbyReady:true}:p)});
  await signal();await page.getByText('1/2 ready',{exact:true}).waitFor();
  await page.clock.runFor(125); // Ready arrives between the 250 ms display ticks.
  await readyButton().click();await page.getByText('2/2 ready',{exact:true}).waitFor();
  assert.equal(await page.getByText('Match begins in 10s',{exact:true}).isVisible(),true,'a fresh deadline must never flash 11 seconds');
  await page.clock.runFor(250);await page.getByText(/Match begins in (9|10)s/).waitFor();
  const shortDeadline=lobby.room.countdownEndsAt;
  await page.getByRole('button',{name:'Not ready',exact:true}).click();
  await page.getByText('1/2 ready',{exact:true}).waitFor();
  assert.equal(lobby.room.countdownEndsAt,shortDeadline,'Not ready never extends the timer');
  change({room:{countdownEndsAt:await page.evaluate(()=>Date.now()+5000)}});
  await signal();await page.clock.runFor(250);await page.getByText(/Match begins in [45]s/).waitFor();
  const fiveDeadline=lobby.room.countdownEndsAt;
  await readyButton().click();await page.getByText('2/2 ready',{exact:true}).waitFor();
  assert.equal(lobby.room.countdownEndsAt,fiveDeadline,'final Ready below five seconds leaves deadline unchanged');
  for(const width of [390,1280]) {
    await page.setViewportSize({width,height:1000});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no horizontal overflow');
  }
  if(process.env.READY_SCREENSHOT)await page.screenshot({path:process.env.READY_SCREENSHOT,fullPage:true});

  // A fresh connection clears the server-confirmed Ready and fences old requests.
  const priorConnection=connections[0].connectionId;
  await page.reload();await readyButton().waitFor();
  await page.getByText('1/2 ready',{exact:true}).waitFor();
  const latestConnection=connections.filter(c=>c.action==='connect').at(-1).connectionId;
  assert.notEqual(latestConnection,priorConnection);
  change({currentPlayer:{...lobby.currentPlayer,isHost:true},room:{status:'waiting',visibility:'private',countdownEndsAt:null,
    settings:{...lobby.room.settings,secondsPerQuestion:180,mode:'unranked'}}});
  await signal();await page.getByRole('button',{name:'Start Game',exact:true}).waitFor();
  assert.equal(await readyButton().count(),0,'private rooms keep host Start Game');
  assert.equal(await page.getByRole('button',{name:'Start Game',exact:true}).isEnabled(),true);
  const beforeReady=readyCalls.length,beforeHeartbeats=connections.filter(c=>c.action==='heartbeat').length;
  const beforeReads=reads.length;
  await page.clock.runFor(10100);
  assert.equal(readyCalls.length,beforeReady,'no periodic Ready requests');
  assert.ok(connections.filter(c=>c.action==='heartbeat').length-beforeHeartbeats<=3,'existing five-second heartbeat retained');
  assert.equal(reads.length,beforeReads,'no new periodic roster polling');
  assert.deepEqual(errors,[]);
  console.log('PASS: Ready connection gating, confirmed state, retry, host/non-host access, difficulty invalidation, stale responses, ten/five-second timers, reconnect, private controls and mobile/desktop layout.');
  await page.close();
} finally {
  await browser?.close();await new Promise(resolve=>server.close(resolve));
}
