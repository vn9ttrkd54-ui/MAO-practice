import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInThisContext } from "node:vm";
import ts from "typescript";
const require = createRequire(import.meta.url);
const compiled = new Map();
function load(path, dependencies) {
  if (!compiled.has(path)) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    compiled.set(path, runInThisContext(`(function(exports,require){${code}\n})`));
  }
  const exports={};
  compiled.get(path)(exports,name=>{assert.ok(name in dependencies,`Unexpected dependency ${name}`);return dependencies[name];});
  return exports;
}
const security=load("lib/security/request.ts",{"server-only":{}});
const room={id:"room",status:"in-progress",scoring_version:2,created_at:new Date().toISOString()};
const player={id:"verified-player",user_id:"verified-user",score:0};
function fixture({member=true,guest=false,error=null,version=2}={}) {
  const calls=[],reads=[];
  const admin={
    from(table) {
      const filters=[];
      const query={
        select(){return query;},eq(...args){filters.push(args);return query;},is(...args){filters.push(args);return query;},
        async maybeSingle(){reads.push({table,filters});return {data:table==="multiplayer_rooms"?{...room,scoring_version:version}:
          table==="multiplayer_players"?(member?{...player,user_id:guest?null:player.user_id}:null):{username:"Tester"}};},
      };
      return query;
    },
    async rpc(name,args){calls.push({name,args});return {error};},
  };
  const service=load("lib/services/multiplayerService.ts",{
    "server-only":{},"node:crypto":require("node:crypto"),
    "next/headers":{cookies:async()=>({get:()=>guest?{value:"guest-token"}:undefined})},
    "@/data/questions":{questions:[{id:42,answer:"A"}]},
    "@/lib/security/request":security,
    "@/lib/auth/publicNames":{isPublicNameAllowed:()=>true,PUBLIC_NAME_ERROR:"Invalid name"},
    "@/lib/supabase/admin":{createAdminClient:()=>admin},
    "@/lib/supabase/server":{createClient:async()=>({auth:{getUser:async()=>({data:{user:guest?null:{id:player.user_id}}})}})},
  });
  const route=load("app/api/multiplayer/rooms/[id]/round/route.ts",{
    "next/server":{NextResponse:Response},"@/lib/security/request":security,
    "@/lib/services/multiplayerService":service,
    "@/lib/serverPerformance":{observeApi:(_name,work)=>work((_phase,read)=>read())},
  });
  const invoke=(body,origin="https://local.test")=>route.POST(new Request("https://local.test/api/round",{
    method:"POST",headers:{"Content-Type":"application/json",origin},body:JSON.stringify(body),
  }),{params:Promise.resolve({id:"room"})});
  return {invoke,calls,reads};
}
test("Give up uses verified account or guest identity and server-computed correctness in one atomic RPC",async()=>{
  for(const version of [2,3]) {
  for(const guest of [false,true]) {
    const f=fixture({guest,version});
    const response=await f.invoke({questionId:42,selectedAnswer:null,playerId:"victim",correct:true,points:1500,answerTimeMs:0});
    assert.equal(response.status,200);assert.deepEqual(await response.json(),{accepted:true});
    assert.deepEqual(f.calls,[{name:"accept_multiplayer_answer",args:{
      p_room_id:"room",p_player_id:"verified-player",p_question_id:42,p_selected_answer:null,p_correct:false,
    }}]);
    const filters=f.reads.find(r=>r.table==="multiplayer_players").filters;
    assert.ok(filters.some(([column])=>column===(guest?"reconnect_token_hash":"user_id")));
  }
  }
});
test("ordinary answers still ignore forged correctness, score and timing",async()=>{
  for(const version of [2,3]) {
  for(const [choice,correct] of [["A",true],["B",false]]) {
    const f=fixture({version});assert.equal((await f.invoke({questionId:42,selectedAnswer:choice,correct:!correct,points:1720,answerTimeMs:0})).status,200);
    assert.equal(f.calls[0].args.p_correct,correct);
    assert.equal(f.calls.length,1);
    assert.deepEqual(Object.keys(f.calls[0].args).sort(),["p_correct","p_player_id","p_question_id","p_room_id","p_selected_answer"]);
  }
  }
});
test("missing answer is not Give up; malformed, oversized and cross-origin submissions never reach the database",async()=>{
  const f=fixture();
  for(const body of [{questionId:42},{questionId:42,selectedAnswer:""}, {questionId:42,selectedAnswer:"X"},
    {questionId:42,selectedAnswer:false},{questionId:"42",selectedAnswer:null},{questionId:0,selectedAnswer:null},
    {questionId:0.5,selectedAnswer:null},null,[]])assert.equal((await f.invoke(body)).status,400);
  assert.equal((await f.invoke({questionId:42,selectedAnswer:null,extra:"x".repeat(2100)})).status,413);
  assert.equal((await f.invoke({questionId:42,selectedAnswer:null},"https://evil.test")).status,403);
  assert.equal(f.calls.length,0);assert.equal(f.reads.length,0);
});
test("nonmembers, unknown questions and rejected or unavailable RPCs never become accepted",async()=>{
  const absent=fixture({member:false});
  assert.equal((await absent.invoke({questionId:42,selectedAnswer:null})).status,403);assert.equal(absent.calls.length,0);
  const unknown=fixture();
  assert.equal((await unknown.invoke({questionId:99,selectedAnswer:null})).status,400);assert.equal(unknown.calls.length,0);
  for(const [error,status] of [[{code:"P0001",message:"This question is closed."},409],[{code:"XX000",message:"private internals"},503]]) {
    const f=fixture({error});const res=await f.invoke({questionId:42,selectedAnswer:null});
    assert.equal(res.status,status);assert.ok(!(await res.text()).includes("private internals"));
  }
});
