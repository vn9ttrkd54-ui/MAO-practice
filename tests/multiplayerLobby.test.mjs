import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInThisContext } from "node:vm";
import { createHash, randomUUID } from "node:crypto";
import ts from "typescript";
import { nextLobbyConnection } from "../lib/multiplayerLobbyConnection.ts";
import { createApiObserver } from "../lib/apiMetrics.ts";

const require = createRequire(import.meta.url);
const compiled = new Map();
function load(path, dependencies) {
  if (!compiled.has(path)) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    compiled.set(path, runInThisContext(`(function(exports, require){${output}\n})`));
  }
  const exports = {};
  compiled.get(path)(exports, name => { assert.ok(name in dependencies, `Unexpected dependency ${name}`); return dependencies[name]; });
  return exports;
}
const security = load("lib/security/request.ts", { "server-only": {} });
const publicNames = load("lib/auth/publicNames.ts", { "./publicNameRules.json": { default: require("../lib/auth/publicNameRules.json") } });
const roomId = randomUUID(), userId = randomUUID(), tabId = randomUUID(), connectionId = randomUUID();
const row = { id:roomId, visibility:'public', mode:'ranked', division:'Mu', question_count:5,
  seconds_per_question:60, capacity:20, status:'waiting', state_version:5, created_at:new Date().toISOString() };
const player = { id:randomUUID(),user_id:userId,display_name:'Tester',rp:450,connected:true };
const snapshot = { room:row,currentPlayer:player,players:[player] };
function serviceFixture({ user = {id:userId}, authError = null, token, error = null, reply, catalog = [] } = {}) {
  const calls = [], auth = [], cookies = [];
  const admin = { rpc:async(name,args) => {
    calls.push({name,args});
    const data=reply ? reply(name,args) : name==='read_multiplayer_lobby' ? snapshot
      : name==='leave_multiplayer_lobby' ? 'left' : name==='join_public_multiplayer_lobby' ? {...row,player_count:1}
      : {status:'connected',lobby:snapshot};
    return {data,error};
  } };
  const service = load("lib/services/multiplayerService.ts", {
    "server-only": {}, "node:crypto": require("node:crypto"),
    "next/headers": {cookies:async()=>({get:()=>token?{value:token}:undefined,delete:key=>cookies.push(key)})},
    "@/data/questions": {questions:catalog}, "@/lib/security/request": security,
    "@/lib/auth/publicNames": publicNames,
    "@/lib/supabase/admin": {createAdminClient:()=>admin},
    "@/lib/supabase/server": {createClient:async()=>({auth:{getUser:async()=>{auth.push(1);return {data:{user},error:authError};}}})},
  });
  return {service,calls,auth,cookies};
}
test("settings PATCH validates ranges, version, origin and connection, ignoring supplied authority", async () => {
  const f=routeFixture();
  const body={difficultyBand:'1-3',settingsVersion:2,connectionId,playerId:player.id};
  for(const change of [{difficultyBand:'1-5'},{settingsVersion:-1},{settingsVersion:1.5},{connectionId:null},{playerId:null}]) {
    assert.equal((await f.invoke('PATCH',{...body,...change})).status,400);
  }
  assert.equal((await f.invoke('PATCH',body,{origin:'https://evil.test'})).status,403);
  assert.equal((await f.invoke('PATCH',{...body,extra:'x'.repeat(2000)})).status,413);
  assert.equal(f.calls.length,0);
  const response=await f.invoke('PATCH',{...body,userId:'victim',isHost:true});
  assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
  assert.deepEqual(f.calls[0].args,[roomId,'1-3',2,connectionId,player.id]);
});

const catalog=[...load('data/questions/mu.ts',{}).muQuestions,...load('data/questions/alpha.ts',{}).alphaQuestions,...load('data/questions/theta.ts',{}).thetaQuestions];
test("Ready uses one verified identity and one RPC; legacy snapshots default to not ready",async()=>{
  for(const value of [false,true]) {
    const confirmed={...snapshot,currentPlayer:{...player,lobby_ready:value},players:[{...player,lobby_ready:value}]};
    const f=serviceFixture({reply:()=>confirmed});
    const result=await f.service.updateMultiplayerLobbyReady(roomId,value,2,connectionId,player.id);
    assert.equal(f.auth.length,1);assert.equal(f.calls.length,1);
    assert.deepEqual(f.calls[0],{name:'set_multiplayer_lobby_ready',args:{p_room_id:roomId,p_user_id:userId,p_ready:value,p_settings_version:2,p_connection_id:connectionId,p_player_id:player.id}});
    assert.equal(result.currentPlayer.lobbyReady,value);assert.equal(result.players[0].lobbyReady,value);
  }
  assert.equal((await serviceFixture().service.getPrivateLobby(roomId)).currentPlayer.lobbyReady,false);
});
test("Ready rejects missing or guest identity, auth failure, invalid versions and malformed or failed receipts",async()=>{
  for(const config of [{user:null},{user:null,token:'guest'},{authError:{name:'AuthRetryableFetchError'}}]) {
    const f=serviceFixture(config);
    await assert.rejects(f.service.updateMultiplayerLobbyReady(roomId,true,0,connectionId,player.id),/Sign in|verify/);
    assert.equal(f.calls.length,0);
  }
  for(const version of [-1,0.1,Number.MAX_SAFE_INTEGER+1]) {
    const f=serviceFixture();await assert.rejects(f.service.updateMultiplayerLobbyReady(roomId,true,version,connectionId,player.id),/Invalid/);
    assert.equal(f.calls.length,0);
  }
  for(const config of [{reply:()=>null},{reply:()=>({})},{error:{message:'secret database details'}}])
    await assert.rejects(serviceFixture(config).service.updateMultiplayerLobbyReady(roomId,true,0,connectionId,player.id),/Unable to confirm/);
  await assert.rejects(serviceFixture({error:{code:'P0001',message:'Settings changed.'}}).service.updateMultiplayerLobbyReady(roomId,true,0,connectionId,player.id),error=>error.status===409);
});
test("full public room heartbeats do not start before the deadline; due rooms still start",async()=>{
  for(const due of [false,true]) {
    const full={...snapshot,room:{...row,status:'countdown',difficulty_band:'2-4',settings_version:0,countdown_ends_at:new Date(Date.now()+(due?-1000:60000)).toISOString()},players:Array.from({length:20},()=>player)};
    const f=serviceFixture({catalog,reply:name=>name==='change_multiplayer_lobby_presence'?{status:'connected',lobby:full}:name==='read_multiplayer_lobby'?full:full.room});
    await f.service.changeMultiplayerLobbyPresence(roomId,'heartbeat',tabId,connectionId,1,player.id);
    assert.equal(f.calls.some(call=>call.name==='start_multiplayer_lobby'),due);
  }
});
test("Ready route fences input and origin, ignores supplied identity, and hides unexpected errors",async()=>{
  const calls=[];let failure=null;
  const route=load('app/api/multiplayer/rooms/[id]/lobby/ready/route.ts',{
    '@/lib/serverPerformance':{observeApi:createApiObserver()},'next/server':{NextResponse:{json:Response.json}},
    '@/lib/security/request':security,'@/lib/services/multiplayerService':{updateMultiplayerLobbyReady:(...args)=>{calls.push(args);if(failure)throw failure;return snapshot;}},
  });
  const invoke=(body,headers={},id=roomId)=>route.POST(new Request('https://local.test/api/lobby/ready',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)}),{params:Promise.resolve({id})});
  const body={ready:true,settingsVersion:0,connectionId,playerId:player.id};
  assert.equal((await invoke(body,{origin:'https://evil.test'})).status,403);
  assert.equal((await invoke({...body,extra:'x'.repeat(2000)})).status,413);
  for(const change of [{ready:'true'},{ready:null},{settingsVersion:-1},{settingsVersion:1.5},{settingsVersion:Number.MAX_SAFE_INTEGER+1},{playerId:null},{connectionId:'bad'}])
    assert.equal((await invoke({...body,...change})).status,400);
  assert.equal((await invoke(body,{},'bad')).status,400);assert.equal(calls.length,0);
  const response=await invoke({...body,userId:'victim',isHost:true});assert.equal(response.status,200);
  assert.equal(response.headers.get('cache-control'),'no-store');assert.deepEqual(calls[0],[roomId,true,0,connectionId,player.id]);
  failure=new Error('private credentials');const failed=await invoke(body);
  assert.equal(failed.status,503);assert.ok(!(await failed.text()).includes('credentials'));
  failure=new security.RequestBodyError('Settings changed.',409);assert.equal((await invoke(body)).status,409);
});
test("every division and difficulty band has 30 unique questions; starts select only the requested pool", async () => {
  for(const division of ['Mu','Alpha','Theta']) for(const band of ['1-3','2-4','3-5']) {
    const pool=catalog.filter(q=>q.division===division && q.difficulty>=Number(band[0]) && q.difficulty<=Number(band[2]));
    assert.ok(new Set(pool.map(q=>q.id)).size>=30,`${division} ${band} lacks 30 questions`);
    const configured={...snapshot,room:{...row,visibility:'private',division,question_count:30,difficulty_band:band,settings_version:7},currentPlayer:{...player,is_host:true}};
    const f=serviceFixture({catalog,reply:name=>name==='read_multiplayer_lobby'?configured:configured.room});
    await f.service.beginPrivateRoom(roomId);
    const call=f.calls.find(call=>call.name==='start_multiplayer_lobby');
    assert.equal(call.args.p_settings_version,7);
    assert.equal(new Set(call.args.p_question_ids).size,30);
    assert.ok(call.args.p_question_ids.every(id=>pool.some(q=>q.id===id)));
    assert.ok(call.args.p_difficulties.every(d=>d>=Number(band[0]) && d<=Number(band[2])));
  }
});
test("an insufficient pool fails without silently broadening difficulty or starting a match", async () => {
  const configured={...snapshot,room:{...row,visibility:'private',difficulty_band:'3-5'},currentPlayer:{...player,is_host:true}};
  const f=serviceFixture({catalog:catalog.slice(0,1),reply:()=>configured});
  await assert.rejects(f.service.beginPrivateRoom(roomId),/not enough questions/);
  assert.equal(f.calls.filter(call=>call.name==='start_multiplayer_lobby').length,0);
});
test("settings saves derive identity on the server and send the fenced version to the database", async () => {
  const f=serviceFixture({catalog,reply:()=>snapshot});
  await f.service.updateMultiplayerDifficulty(roomId,'1-3',2,connectionId,player.id);
  assert.equal(f.auth.length,1);
  assert.deepEqual(f.calls[1],{name:'set_multiplayer_lobby_difficulty',args:{p_room_id:roomId,p_user_id:userId,p_guest_hash:null,p_difficulty_band:'1-3',p_settings_version:2,p_connection_id:connectionId,p_player_id:player.id}});
  await assert.rejects(serviceFixture({user:null}).service.updateMultiplayerDifficulty(roomId,'1-3',0,connectionId,player.id),/Rejoin/);
});

test("normal lobby reads and heartbeats use one identity check and one RPC", async () => {
  for (const action of [null,'connect','heartbeat','disconnect']) {
    const f=serviceFixture();
    const value=action ? await f.service.changeMultiplayerLobbyPresence(roomId,action,tabId,connectionId,2,player.id) : await f.service.getPrivateLobby(roomId);
    assert.equal(f.auth.length,1); assert.equal(f.calls.length,1);
    assert.equal(f.calls[0].args.p_user_id,userId);
    assert.equal(f.calls[0].args.p_guest_hash,null);
    assert.equal((action ? value.lobby : value).players[0].rankTier,'Gold');
    assert.equal(f.calls[0].name,action?'change_multiplayer_lobby_presence':'read_multiplayer_lobby');
  }
});
test("join and confirmed leave rely on the atomic server-only operations", async () => {
  const f=serviceFixture();
  assert.equal((await f.service.joinPublicRoom(roomId)).playerCount,1);
  assert.equal(await f.service.confirmMultiplayerLeave(roomId,connectionId),'left');
  assert.deepEqual(f.calls.map(c=>c.name),['join_public_multiplayer_lobby','leave_multiplayer_lobby']);
  assert.equal(f.calls[1].args.p_connection_id,connectionId);
});
test("guest identity uses a server-cookie hash retained for lost-response retries", async () => {
  const f=serviceFixture({user:null,token:'private-cookie'});
  await f.service.confirmMultiplayerLeave(roomId,connectionId);
  assert.equal(f.calls[0].args.p_guest_hash,createHash('sha256').update('private-cookie').digest('hex'));
  assert.equal(f.calls[0].args.p_user_id,null); assert.equal(f.cookies.length,0);
  await f.service.confirmMultiplayerLeave(roomId,connectionId);
  assert.deepEqual(f.calls[1].args,f.calls[0].args);
});
test("auth failures and missing identity cannot falsely confirm a leave", async () => {
  for (const config of [{user:null},{user:null,authError:{name:'AuthRetryableFetchError'}}]) {
    const f=serviceFixture(config);
    await assert.rejects(f.service.confirmMultiplayerLeave(roomId,connectionId),/membership/);
    assert.equal(f.calls.length,0);
  }
});
test("database failures, malformed receipts, and started/conflict outcomes never pretend success", async () => {
  for (const reply of [()=>null,()=>({status:'left'})]) {
    const f=serviceFixture({reply}); await assert.rejects(f.service.confirmMultiplayerLeave(roomId,connectionId),/confirm/);
  }
  for(const status of ['started','conflict']) {
    const f=serviceFixture({reply:()=>status});
    assert.equal(await f.service.confirmMultiplayerLeave(roomId,connectionId),status);
    await assert.rejects(f.service.leaveMultiplayerRoom(roomId,connectionId),/started|connection changed/);
  }
  const f=serviceFixture({error:{message:'private database details'}});
  await assert.rejects(f.service.getPrivateLobby(roomId),/Unable to load/);
});

function routeFixture({ fail=false }={}) {
  const calls=[];
  const record=(name,result)=>(...args)=>{calls.push({name,args});if(fail)throw new Error('database credential detail');return result;};
  const service={getPrivateLobby:record('get',snapshot),changeMultiplayerLobbyPresence:record('presence',{status:'connected',lobby:snapshot}),confirmMultiplayerLeave:record('leave','left'),updateMultiplayerDifficulty:record('settings',snapshot)};
  const route=load('app/api/multiplayer/rooms/[id]/lobby/route.ts',{
    '@/lib/serverPerformance':{observeApi:createApiObserver()},
    'next/server':{NextResponse:{json:Response.json}},'@/lib/security/request':security,'@/lib/services/multiplayerService':service,
  });
  const invoke=(method,body,headers={},id=roomId)=>route[method](new Request('https://local.test/api/lobby',{method,headers:{'Content-Type':'application/json',...headers},...(method==='GET'?{}:{body:JSON.stringify(body)})}),{params:Promise.resolve({id})});
  return {calls,invoke};
}
test("lobby GET is read-only and responses are never cached", async()=>{
  const f=routeFixture(),response=await f.invoke('GET');
  assert.equal(response.status,200); assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.deepEqual(f.calls.map(c=>c.name),['get']);
});
test("lobby mutations reject cross-origin, oversized and invalid connection requests", async()=>{
  const body={action:'connect',tabId,connectionId,generation:1,playerId:player.id};
  const f=routeFixture();
  assert.equal((await f.invoke('POST',body,{origin:'https://evil.test'})).status,403);
  assert.equal((await f.invoke('DELETE',{connectionId},{'sec-fetch-site':'cross-site'})).status,403);
  assert.equal((await f.invoke('POST',{...body,extra:'x'.repeat(2000)})).status,413);
  for(const change of [{generation:0},{generation:1.5},{generation:Number.MAX_SAFE_INTEGER+1},{tabId:'bad'},{action:'start'},{connectionId:null},{playerId:null}]) {
    assert.equal((await f.invoke('POST',{...body,...change})).status,400);
  }
  for(const body of [null,[],{},'bad']) assert.equal((await f.invoke('DELETE',body)).status,400);
  assert.equal((await f.invoke('GET',undefined,{},'bad')).status,400);
  assert.equal(f.calls.length,0);
});
test("browser-supplied identities are ignored; leave and presence remain different operations",async()=>{
  const f=routeFixture();
  assert.equal((await f.invoke('POST',{action:'disconnect',tabId,connectionId,generation:2,playerId:player.id,userId:'victim',guestHash:'fake'})).status,200);
  assert.deepEqual(f.calls[0].args,[roomId,'disconnect',tabId,connectionId,2,player.id]);
  assert.equal((await f.invoke('DELETE',{connectionId,userId:'victim'})).status,200);
  assert.deepEqual(f.calls[1].args,[roomId,connectionId]);
  const failure=await routeFixture({fail:true}).invoke('GET');
  assert.equal(failure.status,503); assert.ok(!(await failure.text()).includes('credential'));
});
test("public directory caches only public data and never caches failure responses",async()=>{
  for(const fail of [false,true]) {
    const route=load('app/api/multiplayer/public-rooms/route.ts',{'@/lib/serverPerformance':{observeApi:createApiObserver()},'next/server':{NextResponse:{json:Response.json}},
      '@/lib/services/multiplayerService':{listPublicRooms:()=>{if(fail)throw Error('private detail');return [];}}});
    const response=await route.GET();
    assert.equal(response.status,fail?503:200);
    assert.equal(response.headers.get('Cache-Control'),fail?'no-store':'public, max-age=0, s-maxage=1, must-revalidate');
  }
});
test("connection generations survive reloads, separate rooms, and corrupt or disabled storage",()=>{
  const original=Object.getOwnPropertyDescriptor(globalThis,'sessionStorage');
  const storage=new Map();
  try {
    Object.defineProperty(globalThis,'sessionStorage',{configurable:true,value:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}});
    const first=nextLobbyConnection(roomId),second=nextLobbyConnection(roomId);
    assert.equal(second.tabId,first.tabId);assert.equal(second.generation,2);assert.notEqual(second.connectionId,first.connectionId);
    assert.notEqual(nextLobbyConnection('other').tabId,first.tabId);
    for(const saved of ['null','bad',JSON.stringify({tabId:'-'.repeat(36),generation:1}),JSON.stringify({...first,generation:Number.MAX_SAFE_INTEGER})]) {
      storage.set(`mao:lobby-tab:${roomId}`,saved);
      assert.equal(nextLobbyConnection(roomId).generation,1);
    }
    Object.defineProperty(globalThis,'sessionStorage',{configurable:true,get:()=>{throw Error('disabled');}});
    assert.equal(nextLobbyConnection(roomId).generation,1);
  } finally { if(original)Object.defineProperty(globalThis,'sessionStorage',original);else delete globalThis.sessionStorage; }
});

test("only the exact public-directory read bypasses session-cookie refresh",async()=>{
  const calls=[];
  const proxy=load('proxy.ts',{'next/server':{NextResponse:{next:()=>new Response(null)}},
    '@/lib/supabase/proxy':{updateSession:req=>{calls.push(req);return new Response(null);}}});
  const request=(pathname,method='GET')=>({nextUrl:{pathname},method});
  for(const method of ['GET','HEAD'])await proxy.proxy(request('/api/multiplayer/public-rooms',method));
  assert.equal(calls.length,0);
  for(const req of [request('/api/multiplayer/public-rooms','POST'),request('/api/multiplayer/public-rooms-extra'),
    request('/api/multiplayer/rooms/x/lobby'),request('/account')])await proxy.proxy(req);
  assert.equal(calls.length,4);
});

test("legacy leave actions cannot bypass the connection check",async()=>{
  const calls=[];
  const actions=load('app/multiplayer/actions.ts',{'next/navigation':{redirect:url=>{throw new Error(url);}},
    '@/lib/services/multiplayerService':{leaveMultiplayerRoom:(...args)=>calls.push(args)}});
  const form=new FormData();form.set('roomId',roomId);
  await assert.rejects(actions.leaveMultiplayerRoomAction(form),/Reload/);
  assert.equal(calls.length,0);
  form.set('connectionId',connectionId);
  await assert.rejects(actions.leaveMultiplayerRoomAction(form),/multiplayer/);
  assert.deepEqual(calls,[[roomId,connectionId]]);
});
