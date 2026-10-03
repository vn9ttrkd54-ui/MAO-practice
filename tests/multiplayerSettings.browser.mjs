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

  const player={playerId:'me',isHost:true,isGuest:true,displayName:'Host',connected:true,score:0};
  const friend={...player,playerId:'friend',isHost:false,displayName:'Friend'};
  let lobby={room:{id:'test',status:'waiting',visibility:'public',capacity:20,stateVersion:1,settingsVersion:0,countdownEndsAt:null,
    settings:{division:'Mu',questionCount:5,secondsPerQuestion:90,difficultyBand:'2-4',mode:'ranked'}},currentPlayer:player,players:[player,friend]};
  const page=await browser.newPage({viewport:{width:390,height:900}});
  const errors=[],patches=[],connections=[];let rejectSave=false;
  page.on('pageerror',error=>errors.push(error.message));
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.addInitScript(data=>Object.assign(window,data),{mode:'lobby',initialLobby:lobby});
  await page.route('**/*',route=>{
    const request=route.request();
    if(!request.url().startsWith(url))return route.abort();
    if(!request.url().includes('/api/'))return route.continue();
    if(request.method()==='PATCH') {
      const body=request.postDataJSON();patches.push(body);
      if(rejectSave)return route.fulfill({status:409,json:{error:'Settings changed. Reload the lobby and try again.'}});
      lobby={...lobby,room:{...lobby.room,stateVersion:lobby.room.stateVersion+1,settingsVersion:lobby.room.settingsVersion+1,
        settings:{...lobby.room.settings,difficultyBand:body.difficultyBand}}};
      return route.fulfill({json:lobby});
    }
    if(request.method()==='POST'){
      const body=request.postDataJSON();connections.push(body);
      return route.fulfill({json:body.action==='disconnect'?{status:'disconnected'}:{status:'connected',lobby}});
    }
    return route.fulfill({json:lobby});
  });
  await page.goto(url);
  const select=page.getByLabel('Question difficulty',{exact:true});
  const save=page.getByRole('button',{name:'Save difficulty',exact:true});
  await save.waitFor();await page.waitForFunction(()=>!document.querySelector('select').disabled);
  assert.deepEqual(await select.locator('option').evaluateAll(options=>options.map(o=>o.value)),['1-3','2-4','3-5']);
  assert.equal(await page.getByRole('button',{name:'Start Game',exact:true}).count(),0,'public host cannot manually start');
  assert.equal(await page.getByRole('button',{name:/skip|give up/i}).count(),0,'Stage 1 does not add answer actions');
  await select.selectOption('1-3');await save.click();
  await page.getByText('Difficulty: 1–3 · 90s per question',{exact:true}).waitFor();
  assert.equal(patches.length,1);assert.equal(patches[0].settingsVersion,0);
  assert.equal(patches[0].connectionId,connections[0].connectionId);assert.equal(patches[0].playerId,'me');
  rejectSave=true;await select.selectOption('3-5');await save.click();
  await page.getByRole('alert').filter({hasText:'Settings changed'}).waitFor();
  assert.equal(await page.getByText('Difficulty: 1–3 · 90s per question',{exact:true}).isVisible(),true,'failed save must not change confirmed settings');
  rejectSave=false;await save.click();await page.getByText('Difficulty: 3–5 · 90s per question',{exact:true}).waitFor();
  for(const width of [390,1280]){
    await page.setViewportSize({width,height:900});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  if(process.env.SETTINGS_SCREENSHOT)await page.screenshot({path:process.env.SETTINGS_SCREENSHOT,fullPage:true});
  const signal=async()=>{
    await page.evaluate(v=>window.dispatchEvent(new CustomEvent('test-room-event',{detail:{roomId:'test',stateVersion:v}})),lobby.room.stateVersion);
    await page.clock.runFor(200);
  };
  lobby={...lobby,room:{...lobby.room,stateVersion:4},currentPlayer:{...player,isHost:false},players:[{...player,isHost:false},{...friend,isHost:true}]};
  await signal();await save.waitFor({state:'detached'});
  assert.equal(await page.getByText('The host chooses the difficulty.',{exact:true}).isVisible(),true);
  assert.equal(await page.getByText('Difficulty: 3–5 · 90s per question',{exact:true}).isVisible(),true);

  const time=await page.evaluate(()=>Date.now());
  lobby={...lobby,currentPlayer:player,players:[player,friend],room:{...lobby.room,status:'countdown',stateVersion:5,countdownEndsAt:time+5000}};
  await signal();await page.clock.runFor(250);
  assert.equal(await select.isDisabled(),true);
  assert.equal(await save.isDisabled(),true);
  await page.getByText(/Match begins in [45]s/).waitFor();
  lobby={...lobby,room:{...lobby.room,stateVersion:6,status:'waiting',visibility:'private',countdownEndsAt:null,
    settings:{...lobby.room.settings,secondsPerQuestion:180,mode:'unranked'}}};
  await signal();await page.getByRole('button',{name:'Start Game',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Start Game',exact:true}).isEnabled(),true);
  await page.getByText('Difficulty: 3–5 · 180s per question',{exact:true}).waitFor();
  assert.deepEqual(errors,[]);
  console.log('PASS: real lobby controls, fenced saves, error/retry, live host transfer, five-second lock, public/private start controls and mobile/desktop layout.');
  await page.close();
} finally {
  await browser?.close();await new Promise(resolve=>server.close(resolve));
}
