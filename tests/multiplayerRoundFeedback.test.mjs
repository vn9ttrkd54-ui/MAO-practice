import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
import { formatAnswerTime, formatRoundPoints, roundFeedbackForQuestion } from "../lib/multiplayerRoundFeedback.ts";

test("round feedback is hidden until closed and never carries over to another question",()=>{
  const player={roundResult:{questionNumber:1,outcome:"incorrect",pointsEarned:-300,answerTimeMs:11000}};
  assert.equal(roundFeedbackForQuestion(player,1,false),null);
  assert.equal(roundFeedbackForQuestion(player,2,true),null);
  assert.equal(roundFeedbackForQuestion(player,1,true),player.roundResult);
  assert.equal(roundFeedbackForQuestion({},1,true),null);
});
test("feedback formats negative, zero and speed-bonus points plus actual answer times",()=>{
  assert.deepEqual([-300,0,1250].map(formatRoundPoints),["-300","0","+1250"]);
  assert.deepEqual([null,0,12500,180000].map(formatAnswerTime),["Time expired","0.0s","12.5s","180.0s"]);
});

const require=createRequire(import.meta.url);
const source=readFileSync(new URL("../lib/services/multiplayerService.ts",import.meta.url),"utf8");
function loadService({user=true,member=true,publicRoom=false,closed=false,rpcError=false,status="in-progress"}={}) {
  const calls=[];
  const room={id:"room",visibility:publicRoom?"public":"private",status,question_count:2,seconds_per_question:90,mode:"unranked",
    division:"Mu",capacity:30,created_at:new Date().toISOString(),current_question_number:1,state_version:4};
  const feedback={questionNumber:1,outcome:"incorrect",pointsEarned:-300,answerTimeMs:12000};
  const player={id:"verified-player",user_id:user?"user":null,guest_nickname:user?null:"Guest",connected:true,
    is_host:true,score:closed?-300:0,placement:null,has_submitted_current_question:true,
    display_name:"Tester",rp:0,round_result:closed?feedback:null};
  const snapshot={roomId:"room",currentPlayerId:"verified-player",spectators:[],status,stateVersion:4,totalQuestions:2,scoringVersion:2,questionDurationSeconds:90,roundClosed:closed,
    question:{question_number:1,question_id:101,difficulty:2,started_at:"2026-01-01T00:00:00Z",ends_at:"2026-01-01T00:01:30Z",intermission_ends_at:null},
    players:[player],upcoming:null};
  const admin={
    from(table){
      let selection="",filters={};
      const q={select(s){selection=s;return q;},eq(k,v){filters[k]=v;return q;},is(){return q;},gte(){return q;},order(){return q;},
        upsert(){calls.push(["upsert",table]);return Promise.resolve({error:null});},
        async maybeSingle(){
          calls.push(["single",table,selection]);
          if(table==="multiplayer_rooms")return {data:filters.visibility&&filters.visibility!==room.visibility?null:room,error:null};
          if(table==="multiplayer_players")return {data:member?player:null,error:null};
          if(table==="profiles")return {data:{username:"Tester"},error:null};
          throw new Error(`Unexpected table ${table}`);
        },
        then(resolve,reject){
          calls.push(["list",table,selection]);
          assert.equal(table,"multiplayer_spectators","no independent roster or score reads");
          return Promise.resolve({data:[],error:null}).then(resolve,reject);
        }};return q;
    },
    async rpc(name,args){calls.push(["rpc",name,args]);return {data:name==="read_multiplayer_round_for_actor"&&!member?null:snapshot,error:rpcError?{message:"failure"}:null};}
  };
  const exports={};
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{
    exports,require(name){
      if(name==="server-only")return {};
      if(name==="@/lib/auth/publicNames")return {isPublicNameAllowed:()=>true};
      if(name==="next/headers")return {cookies:async()=>({get:()=>member?{value:"guest-token"}:undefined})};
      if(name==="@/data/questions")return {questions:[{id:101,division:"Mu",topic:"Algebra",question:"Test?",choices:["1","2"],answer:"A",solution:"Secret"}]};
      if(name==="@/lib/security/request")return {RequestBodyError:class extends Error{}};
      if(name==="@/lib/supabase/admin")return {createAdminClient:()=>admin};
      if(name==="@/lib/supabase/server")return {createClient:async()=>({auth:{getUser:async()=>({data:{user:user?{id:"user"}:null}})}})};
      return require(name);
    },
  });
  return {service:exports,calls,feedback};
}
for(const user of [true,false])test(`${user?"account":"guest"} round maps safe feedback from verified membership only`,async()=>{
  const f=loadService({user,closed:true});const round=await f.service.getMultiplayerRoundState("room");
  assert.equal(round.roundClosed,true);assert.equal(round.players[0].roundResult,f.feedback);
  assert.equal(round.players[0].score,-300);
  assert.deepEqual(f.calls.find(c=>c[0]==="rpc").slice(0,2),["rpc","read_multiplayer_round_for_actor"]);
  assert.equal(round.currentPlayerId,"verified-player");
  assert.equal(f.calls.find(c=>c[0]==="rpc")[2].p_user_id,user?"user":null);
  assert.equal(f.calls.length,1,"only one database call for a complete round snapshot");
  assert.equal(round.question.answer,undefined);assert.equal(round.question.solution,undefined);
});
test("nonmembers cannot request a round scoreboard",async()=>{
  const f=loadService({member:false});assert.equal(await f.service.getMultiplayerRoundState("room"),null);
  assert.equal(f.calls.filter(c=>c[0]==="rpc").length,1,"membership is checked inside the compact read");
});
test("spectator receives atomic question, safe totals and closed-round feedback",async()=>{
  const f=loadService({member:false,publicRoom:true,closed:true});const state=await f.service.spectatePublicMatch("room");
  assert.equal(state.roundClosed,true);assert.equal(state.stateVersion,4);
  assert.equal(state.players[0].roundResult,f.feedback);assert.equal(state.players[0].score,-300);
  assert.equal(f.calls.filter(c=>c[0]==="rpc"&&c[1]==="read_multiplayer_scoreboard").length,1);
  assert.equal(state.question.answer,undefined);
});
test("spectator access is checked before the server-only scoreboard is invoked",async()=>{
  for(const options of [{user:false,member:false,publicRoom:true},{member:true,publicRoom:true},{member:false,publicRoom:false}]){
    const f=loadService(options);await assert.rejects(f.service.spectatePublicMatch("room"));
    assert.equal(f.calls.filter(c=>c[0]==="rpc").length,0);
  }
});
test("read failures fail closed and completed spectator matches trigger the existing result path",async()=>{
  const f=loadService({rpcError:true});await assert.rejects(f.service.getMultiplayerRoundState("room"),/Unable to read/);
  const s=loadService({member:false,publicRoom:true,rpcError:true});await assert.rejects(s.service.spectatePublicMatch("room"),/Unable to read/);
  const end=loadService({member:false,publicRoom:true,status:"completed"});await assert.rejects(end.service.spectatePublicMatch("room"),/no longer in progress/);
});
