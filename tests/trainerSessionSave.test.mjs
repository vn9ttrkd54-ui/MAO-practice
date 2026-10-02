import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import * as contract from "../lib/trainerSessionSave.ts";
import { withRequestTimeout } from "../lib/requestTimeout.ts";
import { calculateTrainerStats } from "../lib/trainer.ts";
const user="00000000-0000-4000-8000-000000000001", id="10000000-0000-4000-8000-000000000001";
const record=()=>({id,division:"Mu",startedAt:1780000000000,endedAt:1780000001123,startingLevel:{level:1,progress:0},endingLevel:{level:1,progress:1},
  results:[{questionId:10001,questionNumber:1,selectedAnswer:"A",correctAnswer:"A",result:"correct",elapsedSeconds:1}]});
const receipt=()=>({status:"saved",sessionId:id,userId:user,recentSessions:[{id,endedAt:1780000001123,questionsAnswered:1,accuracy:100}]});
async function load(path,dependencies={}) {
  const source=await readFile(new URL(`../${path}`,import.meta.url),"utf8");
  const code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
  const exports={};
  runInNewContext(`(function(exports,require){${code}\n})`,{Error,Date,AbortController})(exports,name=>{
    assert.ok(name in dependencies,`Unexpected dependency: ${name}`); return dependencies[name];
  });
  return exports;
}

test("Trainer session wire format preserves old persisted fields and bounds input",()=>{
  const args=contract.trainerSessionArguments(record(),user);
  assert.equal(args.p_expected_user_id,user); assert.equal(args.p_session_id,id);
  assert.equal(args.p_ended_at,"2026-05-28T20:26:41.123Z");
  assert.deepEqual(args.p_results,[{question_id:10001,question_number:1,selected_answer:"A",correct_answer:"A",result:"correct"}]);
  assert.ok(!JSON.stringify(args).includes("elapsed"));
  for(const mutate of [r=>{r.id="bad";},r=>{r.endedAt=NaN;},r=>{r.endedAt=r.startedAt-1;},r=>{r.startingLevel.progress=30;},
    r=>{r.results[0].result="incorrect";},r=>{r.results[0].selectedAnswer="F";},r=>{r.results[0].questionId=1.5;},
    r=>{r.results=Array(2001).fill(r.results[0]);}]) {
    const value=record();mutate(value);assert.throws(()=>contract.trainerSessionArguments(value,user));
  }
});

test("Trainer receipts must confirm the same owner, session, counts and bounded chart",()=>{
  assert.deepEqual(contract.parseTrainerSessionReceipt(receipt(),record(),user),receipt());
  for(const mutate of [r=>{r.status="busy";},r=>{r.userId="other";},r=>{r.sessionId="other";},r=>{r.recentSessions=[];},
    r=>{r.recentSessions=Array(6).fill(r.recentSessions[0]);},r=>{r.recentSessions[0].accuracy=99;},
    r=>{r.recentSessions[0].questionsAnswered=2;},r=>{r.recentSessions[0].endedAt++;},r=>{r.recentSessions[0].id="bad";}]) {
    const value=receipt();mutate(value);assert.throws(()=>contract.parseTrainerSessionReceipt(value,record(),user));
  }
});

test("summary and save receipt agree at half-percent rounding boundaries",()=>{
  const session=record();
  session.results=Array.from({length:200},(_,index)=>({...session.results[0],
    selectedAnswer:index<29?"A":"B",result:index<29?"correct":"incorrect"}));
  const points=contract.localTrainerHistoryPoints([session],session);
  assert.equal(calculateTrainerStats(session.results).accuracy,15,"29/200 is 14.5%, rounded to 15%");
  assert.equal(points[0].accuracy,15);
  contract.parseTrainerSessionReceipt({...receipt(),recentSessions:points},session,user);
});

test("Trainer saves use exactly one RPC and never fetch history or perform a compensating delete",async()=>{
  const calls=[];let mode="success";
  const client={from(){throw new Error("Unexpected table call");},rpc(name,args){
    calls.push({name,args});return {abortSignal:async signal=>{
      assert.equal(signal.aborted,false);
      return {data:mode==="success"?receipt():mode==="wrong"?{...receipt(),userId:"other"}:{status:mode},error:mode==="error"?{message:"private error"}:null};
    }};
  }};
  const {createSupabaseTrainerHistoryStorage}=await load("lib/storage/trainerHistory/supabaseTrainerHistoryStorage.ts",{"@/lib/trainerSessionSave":contract});
  const storage=createSupabaseTrainerHistoryStorage(client,user), controller=new AbortController();
  await storage.saveSession(record(),controller.signal);
  assert.equal(calls.length,1);assert.equal(calls[0].name,"save_trainer_session_v1");
  assert.deepEqual(calls[0].args,contract.trainerSessionArguments(record(),user));
  for(mode of ["error","busy","conflict","wrong"]) await assert.rejects(storage.saveSession(record(),controller.signal),error=>!error.message.includes("private error"));
  assert.equal(calls.length,5,"no hidden automatic retry");
  controller.abort();await assert.rejects(storage.saveSession(record(),controller.signal));assert.equal(calls.length,5);
});

test("Trainer session deadline covers auth and write confirmation, including cancellation before writes",async()=>{
  let reads=0,saves=0,releaseAuth;
  const state={owner:user,stallAuth:false,stallSave:false,authError:false};
  const storage={saveSession:async(_record,signal)=>{saves++;assert.equal(signal.aborted,false);return state.stallSave?new Promise(()=>{}):receipt();}};
  const service=await load("lib/services/trainerHistoryService.ts",{
    "@/lib/requestTimeout":{withRequestTimeout:(work,options)=>withRequestTimeout(work,{...options,timeoutMs:25})},
    "@/lib/supabase/client":{createClient:()=>({auth:{getSession:async()=>{
      reads++;if(state.stallAuth)await new Promise(resolve=>{releaseAuth=resolve;});
      return {data:{session:state.owner?{user:{id:state.owner}}:null},error:state.authError?new Error("Auth failed"):null};
    }}})},
    "@/lib/storage/trainerHistory/memoryTrainerHistoryStorage":{memoryTrainerHistoryStorage:storage},
    "@/lib/storage/trainerHistory/supabaseTrainerHistoryStorage":{createSupabaseTrainerHistoryStorage:()=>storage},
  });
  assert.deepEqual(await service.saveTrainerSession(record(),user),receipt());assert.equal(saves,1);
  state.owner="other";await assert.rejects(service.saveTrainerSession(record(),user),/account changed/);assert.equal(saves,1);
  state.owner=user;state.stallAuth=true;
  await assert.rejects(service.saveTrainerSession(record(),user),/confirm/);releaseAuth();await new Promise(resolve=>setImmediate(resolve));assert.equal(saves,1);
  state.stallAuth=false;state.stallSave=true;
  await assert.rejects(service.saveTrainerSession(record(),user),/confirm/);assert.equal(saves,2);
  const controller=new AbortController();controller.abort();const count=reads;
  await assert.rejects(service.saveTrainerSession(record(),user,controller.signal));assert.equal(reads,count);
});

test("guest history remains in memory, deduplicates retry IDs and returns only five compact points",async()=>{
  const {memoryTrainerHistoryStorage:storage}=await load("lib/storage/trainerHistory/memoryTrainerHistoryStorage.ts",{"@/lib/trainerSessionSave":contract});
  for(let n=1;n<=7;n++) await storage.saveSession({...record(),id:`10000000-0000-4000-8000-${String(n).padStart(12,"0")}`,endedAt:record().endedAt+n});
  const current={...record(),id:"10000000-0000-4000-8000-000000000007",endedAt:record().endedAt+7};
  const saved=await storage.saveSession(current);
  assert.equal(saved.userId,null);assert.equal(saved.recentSessions.length,5);
  assert.equal((await storage.getHistory()).length,7);
  assert.equal(saved.recentSessions.at(-1).id,current.id);
  assert.ok(!JSON.stringify(saved).includes("selectedAnswer"));
  await storage.clearHistory();assert.equal((await storage.getHistory()).length,0);
});
