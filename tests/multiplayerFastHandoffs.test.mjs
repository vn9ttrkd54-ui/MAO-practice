import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require=createRequire(import.meta.url);
const code=new Map();
function load(path,dependencies){
  if(!code.has(path))code.set(path,ts.transpileModule(readFileSync(new URL("../"+path,import.meta.url),"utf8"),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX},
  }).outputText);
  const exports={};vm.runInNewContext(code.get(path),{exports,URL,Response,Date,require:name=>Object.hasOwn(dependencies,name)?dependencies[name]:require(name)});
  return exports;
}

test("completed round uses one service read and an empty non-cacheable 204",async()=>{
  const calls=[];
  const route=load("app/api/multiplayer/rooms/[id]/round/route.ts",{
    "next/server":{NextResponse:Response},
    "@/lib/security/request":{},
    "@/lib/serverPerformance":{observeApi:(_name,work)=>work((_phase,read)=>read())},
    "@/lib/services/multiplayerService":{
      getMultiplayerRoundState:async(...args)=>{calls.push(args);return {completed:true};},
      getMultiplayerRoom:()=>assert.fail("completed reads must not repeat membership/table requests"),
    },
  });
  const response=await route.GET(new Request("https://example.test/api/room/round?version=7"),{params:Promise.resolve({id:"room"})});
  assert.equal(response.status,204);assert.equal(await response.text(),"");
  assert.equal(response.headers.get("cache-control"),"no-store");assert.deepEqual(calls,[["room",7]]);
});

test("refreshing a completed play page redirects straight to results",async()=>{
  const page=load("app/multiplayer/room/[id]/play/page.tsx",{
    "next/navigation":{redirect:path=>{throw new Error("redirect:"+path);},notFound:()=>assert.fail("completed member is not a missing page")},
    "@/components/multiplayer/MatchQuestion":()=>null,
    "@/lib/services/multiplayerService":{
      getMultiplayerRoundState:async()=>({completed:true}),
      getMultiplayerRoom:()=>assert.fail("no repeated access read"),
    },
  });
  await assert.rejects(page.default({params:Promise.resolve({id:"room"})}),/redirect:\/multiplayer\/room\/room\/results/);
});

function service({user={id:"verified-user"},authError=null,token="guest-token",data=null,rpcError=null}={}){
  const calls=[];
  const exports=load("lib/services/multiplayerService.ts",{
    "server-only":{},"@/lib/auth/publicNames":{},"@/lib/security/request":{},
    "next/headers":{cookies:async()=>({get:()=>token?{value:token}:undefined})},
    "@/data/questions":{questions:[]},
    "@/lib/supabase/server":{createClient:async()=>({auth:{getUser:async()=>({data:{user},error:authError})}})},
    "@/lib/supabase/admin":{createAdminClient:()=>({
      from:()=>assert.fail("snapshot must not fan out into table reads"),
      rpc:async(name,args)=>{calls.push({name,args});return {data,error:rpcError};},
    })},
  });
  return {exports,calls};
}

test("verified account identity wins over guest cookie and unchanged snapshots stay compact",async()=>{
  const f=service({data:{status:"in-progress",unchanged:true}});
  assert.equal((await f.exports.getMultiplayerRoundState("room",17)).unchanged,true);
  assert.equal(f.calls.length,1);assert.equal(f.calls[0].name,"read_multiplayer_round_for_actor");
  assert.equal(f.calls[0].args.p_user_id,"verified-user");assert.equal(f.calls[0].args.p_guest_hash,null);
  assert.equal(f.calls[0].args.p_known_version,17);
});

test("identity verification failures never fall back to a guest identity",async()=>{
  const f=service({user:null,authError:{name:"AuthRetryableFetchError"}});
  for(const method of ["getMultiplayerRoundState","getMultiplayerMatchResult"]){
    await assert.rejects(f.exports[method]("room"),/Unable to verify/);
  }
  assert.equal(f.calls.length,0);
  const anonymous=service({user:null,token:null,authError:{name:"AuthSessionMissingError"}});
  assert.equal(await anonymous.exports.getMultiplayerRoundState("room"),null);
  assert.equal(await anonymous.exports.getMultiplayerMatchResult("room"),null);
  assert.equal(anonymous.calls.length,0);
});

test("guest identity uses a hash and completion strips the internal scoreboard",async()=>{
  const f=service({user:null,authError:{name:"AuthSessionMissingError"},data:{status:"completed",players:[{private:"not returned"}]}});
  const result=await f.exports.getMultiplayerRoundState("room");
  assert.equal(JSON.stringify(result),'{"completed":true}');
  assert.equal(f.calls[0].args.p_user_id,null);assert.match(f.calls[0].args.p_guest_hash,/^[a-f0-9]{64}$/);
  assert.ok(!JSON.stringify(f.calls).includes("guest-token"));
});

test("result failures and incomplete ready snapshots do not fabricate blank results",async()=>{
  for(const options of [{rpcError:{message:"offline"}},{data:{status:"ready",viewerMode:"player",scoreboard:{status:"completed"},result:null}}]){
    const f=service(options);await assert.rejects(f.exports.getMultiplayerMatchResult("room"),/Unable to load match results/);
    assert.equal(f.calls.length,1);
  }
});
