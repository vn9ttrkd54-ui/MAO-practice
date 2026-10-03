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
const dir = await mkdtemp(join(tmpdir(), "stage-one-ui-"));
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
  const player = { playerId: "me", isGuest: true, displayName: "Tester", connected: true, score: 0 };
  const lobby = { room: { id: "test", status: "waiting", visibility: "public", capacity: 20, stateVersion: 1, settingsVersion: 0, countdownEndsAt: null,
    settings: { division: "Mu", questionCount: 5, secondsPerQuestion: 90, difficultyBand: "2-4", mode: "ranked" } }, currentPlayer: player, players: [player] };
  const spectator = { roomId: "test", questionNumber: 1, totalQuestions: 2,
    question: { question: "What is 1 + 1?", choices: ["2", "3"] }, questionDurationSeconds: 60,
    questionStartedAt: Date.now(), questionEndsAt: Date.now() + 60_000, players: [player], spectators: [] };

  for (const mode of ["lobby", "spectator"]) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => { errors.push(error.message); console.error(error.stack); });
    await page.clock.install();
    await page.addInitScript(data => Object.assign(window, data), { mode, initialLobby: lobby, initialSpectator: spectator });
    let requests = 0;
    let blocked = true;
    const stalled = [];
    await page.route("**/*", async route => {
      const request = route.request();
      if (!request.url().startsWith(url)) return route.abort();
      if (!request.url().includes("/api/")) return route.continue();
      if (request.method() === "DELETE") return route.fulfill({ json: { status: "left" } });
      if (request.method() === "POST" && request.postDataJSON()?.action === "disconnect") return route.fulfill({ json: { status: "disconnected" } });
      requests++;
      if (blocked) { stalled.push(route); return; }
      return route.fulfill({ json: mode === "lobby" ? (request.method() === "POST" ? { status: "connected", lobby } : lobby) : spectator });
    });
    await page.goto(url);
    await page.clock.runFor(100);
    await page.getByRole("button", { name: "Unmount fixture" }).waitFor({ timeout: 5_000 });
    // Spectators first poll after five seconds; lobbies poll on mount.
    if (mode === "spectator") await page.clock.runFor(5_000);
    await page.waitForFunction(() => document.querySelector("h2, h1") !== null);
    await page.clock.runFor(8_100);
    await page.getByRole("button", { name: "Retry now" }).waitFor();
    assert.ok(requests <= 2, `A stalled ${mode} created ${requests} requests`);
    blocked = false;
    // The timeout releases the single-flight slot; the next heartbeat recovers.
    await page.clock.runFor(8_100);
    await page.waitForFunction(() => !document.body.textContent.includes("Connection interrupted"));
    assert.ok(requests >= 2);
    await page.getByRole("button", { name: "Unmount fixture" }).click();
    await page.getByText("Unmounted", { exact: true }).waitFor();
    const countAfterUnmount = requests;
    await page.clock.runFor(20_000);
    assert.equal(requests, countAfterUnmount);
    for (const route of stalled) await route.abort().catch(() => undefined);
    assert.deepEqual(errors, []);
    await page.close();
  }

  // Confirmed leave and event-driven roster updates: use real client components,
  // fake network responses and a controlled clock, never the hosted database.
  async function lobbyPage(onApi) {
    const page = await browser.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await page.addInitScript(data=>Object.assign(window,data),{mode:'lobby',initialLobby:lobby});
    await page.route('**/*',route=> {
      if(!route.request().url().startsWith(url))return route.abort();
      return route.request().url().includes('/api/')?onApi(route):route.continue();
    });
    await page.goto(url);
    return {page,errors};
  }
  {
    let current={...lobby,players:[player,{...player,playerId:'friend',displayName:'Friend'}]};
    const requests=[];
    const {page,errors}=await lobbyPage(route=>{
      const req=route.request(),method=req.method(); requests.push(method);
      const body=method==='POST'?req.postDataJSON():null;
      return route.fulfill({json:body?.action==='disconnect'?{status:'disconnected'}:method==='POST'?{status:'connected',lobby:current}:current});
    });
    await page.getByRole('button',{name:'Leave Room',exact:true}).waitFor();
    await page.getByText('Friend',{exact:true}).waitFor();
    const before=requests.length;
    current={...current,room:{...current.room,stateVersion:2},players:[player]};
    await page.evaluate(()=>{for(let i=0;i<200;i++)window.dispatchEvent(new CustomEvent('test-room-event',{detail:{stateVersion:2}}));});
    await page.clock.runFor(200);
    await page.getByText('Friend',{exact:true}).waitFor({state:'detached'});
    assert.equal(requests.length-before,1,'burst should coalesce to one authenticated read');
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('test-room-event',{detail:{stateVersion:1}})));
    await page.clock.runFor(3000);
    assert.equal(requests.length-before,1,'no one-second polling and no stale-event reread');
    assert.deepEqual(errors,[]);await page.close();
  }
  {
    let requests=0;
    const countdown={...lobby,room:{...lobby.room,status:'countdown',countdownEndsAt:Date.now()-60_000}};
    const {page,errors}=await lobbyPage(route=>{
      requests++;
      return route.fulfill({json:route.request().method()==='POST'?{status:'connected',lobby:countdown}:countdown});
    });
    await page.getByRole('button',{name:'Leave Room',exact:true}).waitFor();
    await page.clock.runFor(3500);
    assert.ok(requests<=3,`An apparently past countdown must not loop fast: ${requests} requests`);
    assert.deepEqual(errors,[]);await page.close();
  }
  {
    const deletions=[],presences=[],held=[];
    const {page,errors}=await lobbyPage(route=>{
      const req=route.request();
      if(req.method()==='DELETE') {
        deletions.push(req.postDataJSON());
        if(deletions.length===1){held.push(route);return;}
        return route.fulfill({json:{status:'left'}});
      }
      const body=req.method()==='POST'?req.postDataJSON():null;
      if(body)presences.push(body);
      return route.fulfill({json:body?.action==='disconnect'?{status:'disconnected'}:body?{status:'connected',lobby}:lobby});
    });
    await page.getByRole('button',{name:'Leave Room',exact:true}).click();
    await page.getByRole('button',{name:'Leaving room…',exact:true}).waitFor();
    assert.equal(await page.getByRole('button',{name:'Leaving room…',exact:true}).isDisabled(),true);
    assert.equal(await page.evaluate(()=>document.body.dataset.destination),undefined);
    await page.clock.runFor(8100);
    await page.getByRole('button',{name:'Retry leave',exact:true}).waitFor();
    const count=presences.length;
    await page.clock.runFor(15_000);
    assert.equal(presences.length,count,'ambiguous leave must never revive membership with heartbeats');
    await page.getByRole('button',{name:'Retry leave',exact:true}).click();
    await page.waitForFunction(()=>document.body.dataset.destination?.includes('?left='));
    assert.deepEqual(deletions[0],deletions[1],'retry uses identical fenced connection');
    for(const route of held)await route.abort().catch(()=>undefined);
    assert.deepEqual(errors,[]);await page.close();
  }
  {
    const {page,errors}=await lobbyPage(route=>{
      const req=route.request();
      return route.fulfill({json:req.method()==='DELETE'?{status:'started'}:req.method()==='POST'?{status:'connected',lobby}:lobby});
    });
    await page.getByRole('button',{name:'Leave Room',exact:true}).click();
    await page.getByRole('link',{name:'Rejoin Game',exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>document.body.dataset.destination),undefined);
    assert.equal(await page.getByRole('button',{name:'Leave Room',exact:true}).isDisabled(),true);
    assert.deepEqual(errors,[]);await page.close();
  }
  {
    const sent=[];
    const {page,errors}=await lobbyPage(route=>{
      const req=route.request(),body=req.method()==='POST'?req.postDataJSON():null;
      if(body)sent.push(body);
      return route.fulfill({json:body?.action==='disconnect'?{status:'disconnected'}:body?{status:'connected',lobby}:lobby});
    });
    await page.getByRole('button',{name:'Leave Room',exact:true}).waitFor();
    const disconnected=page.waitForResponse(r=>r.request().method()==='POST' && r.request().postDataJSON()?.action==='disconnect');
    await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
    await disconnected;
    const reconnected=page.waitForResponse(r=>r.request().method()==='POST' && r.request().postDataJSON()?.action==='connect');
    await page.evaluate(()=>window.dispatchEvent(new Event('pageshow')));
    await reconnected;
    await page.clock.runFor(200);
    await page.waitForFunction(()=>document.querySelector('button[aria-busy="false"]')!==null);
    const connects=sent.filter(s=>s.action==='connect'),disconnects=sent.filter(s=>s.action==='disconnect');
    assert.equal(connects.length,2);assert.equal(disconnects.length,1);
    assert.equal(connects[0].tabId,connects[1].tabId);
    assert.ok(connects[1].generation>connects[0].generation);
    assert.notEqual(connects[0].connectionId,connects[1].connectionId);
    assert.equal(disconnects[0].connectionId,connects[0].connectionId);
    assert.deepEqual(errors,[]);await page.close();
  }
  {
    const page=await browser.newPage();
    await page.clock.install();await page.addInitScript(()=>{window.mode='directory';});
    let count=2,requests=0;
    await page.route('**/*',route=>{
      if(!route.request().url().startsWith(url))return route.abort();
      if(!route.request().url().includes('/api/'))return route.continue();
      requests++;return route.fulfill({json:[{playerCount:count}]});
    });
    await page.goto(url);await page.locator('#room-count').filter({hasText:'2'}).waitFor();
    await page.clock.runFor(300);const before=requests;
    count=1;
    await page.evaluate(()=>{for(let i=0;i<200;i++)window.dispatchEvent(new CustomEvent('test-public-event',{detail:{eventType:'UPDATE',new:{id:'public',status:'waiting'}}}));});
    await page.clock.runFor(1500);await page.locator('#room-count').filter({hasText:'1'}).waitFor();
    assert.ok(requests-before<=2,'public burst is coalesced plus a single CDN-expiry followup');
    assert.equal(await page.evaluate(()=>Number(document.body.dataset.refreshes??0)),0,'roster changes must not reload the full page');
    const settled=requests;await page.clock.runFor(3000);assert.equal(requests,settled);
    await page.clock.runFor(1000);
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('test-public-event',{detail:{new:{id:'public',status:'in-progress'}}})));
    await page.clock.runFor(200);
    assert.equal(await page.evaluate(()=>Number(document.body.dataset.refreshes??0)),1);
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('test-public-event',{detail:{new:{id:'public',status:'in-progress'}}})));
    await page.clock.runFor(6000);
    assert.equal(await page.evaluate(()=>Number(document.body.dataset.refreshes??0)),1,'answers during an already-known match must not reload the page');
    await page.getByRole('button',{name:'Unmount fixture'}).click();const end=requests;
    await page.clock.runFor(65_000);assert.equal(requests,end);
    await page.close();
  }
  {
    const page=await browser.newPage();
    await page.clock.install();await page.clock.pauseAt(new Date());
    const current={id:'public',stateVersion:3,settings:{division:'Mu',questionCount:5},status:'waiting',players:[],playerCount:0,capacity:20};
    const cached={...current,stateVersion:2,playerCount:1,players:[{playerId:'old',displayName:'Departed',rankTier:null}]};
    await page.addInitScript(data=>Object.assign(window,data),{mode:'cards',initialRooms:[current]});
    let requests=0;
    await page.route('**/*',route=>{
      if(!route.request().url().startsWith(url))return route.abort();
      if(!route.request().url().includes('/api/'))return route.continue();
      requests++;return route.fulfill({json:[cached]});
    });
    await page.goto(url);await page.getByText('Empty room',{exact:true}).waitFor();
    await page.clock.runFor(1500);
    assert.ok(requests>0);
    assert.equal(await page.getByText('Empty room',{exact:true}).count(),1);
    assert.equal(await page.locator('[title^="Departed"]').count(),0,'older CDN response must not revive a departed avatar');
    await page.close();
  }
  console.log('PASS: coalesced live roster removal, confirmed leave, lost-ack retry, start-wins feedback, page-generation fencing, stale-cache protection and lightweight public directory refreshes.');

  const page = await browser.newPage();
  await page.route("**/*", route => route.request().url().startsWith(url) ? route.continue() : route.abort());
  await page.goto(url);
  await page.getByRole("status").waitFor();
  for (const colorScheme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme });
    const colors = await page.evaluate(() => ({
      text: getComputedStyle(document.querySelector("#question-copy")).color,
      math: getComputedStyle(document.querySelector("#question-copy .katex")).color,
      card: getComputedStyle(document.querySelector("#question-card")).backgroundColor,
      scheme: getComputedStyle(document.documentElement).colorScheme,
    }));
    assert.equal(colors.text, "rgb(23, 23, 23)");
    assert.equal(colors.math, colors.text);
    assert.equal(colors.card, "rgb(248, 250, 252)");
    assert.equal(colors.scheme, "light");
    console.log(`${colorScheme}: dark question text and formulas on light cards verified.`);
  }
  console.log("PASS: lobby/spectator timeout recovery, single-flight polling, unmount cleanup, visible practice loading, and light/dark contrast using production CSS.");
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
