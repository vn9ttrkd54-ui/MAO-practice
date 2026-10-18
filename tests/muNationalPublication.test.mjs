import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync,readdirSync} from "node:fs";
import {createRequire} from "node:module";
import {runInNewContext} from "node:vm";
import test from "node:test";
import ts from "typescript";
import {muQuestions} from "../data/questions/mu.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";
import {selectNextTrainerQuestion} from "../lib/trainer.ts";

const require=createRequire(import.meta.url);
function load(path,dependencies={}){
  const code=ts.transpileModule(readFileSync(new URL("../"+path,import.meta.url),"utf8"),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX},
  }).outputText;
  const exports={};
  runInNewContext(code,{exports,require:name=>name in dependencies?dependencies[name]:require(name),Response,Request,URL});
  return exports;
}

test("all four national sets remain unnumbered, permission-pending editorial references",()=>{
  assert.equal(muNationalReferences.length,118);
  const groups=[
    ["2026 MAO National Convention - Mu Individual",30],
    ["2025 MAO National Convention - Mu Individual",28],
    ["2024 MAO National Convention - Mu Individual",30],
    ["2023 MAO National Convention - Mu Individual",30],
  ];
  assert.deepEqual([...new Set(muNationalReferences.map(q=>q.referenceSet))],groups.map(([name])=>name));
  for(const [name,count] of groups)assert.equal(muNationalReferences.filter(q=>q.referenceSet===name).length,count);
  for(const q of muNationalReferences){
    assert.equal("number" in q,false);
    assert.equal(q.publicationStatus,"permission-pending");
    assert.ok(!muQuestions.some(publicQuestion=>publicQuestion.id===q.id));
  }
  // Pre-move content/label fingerprint, independently compared with Git HEAD.
  const keys=["id","division","topic","difficulty","methods","question","choices","answer","solution","illustration","source"];
  const payload=muNationalReferences.toSorted((a,b)=>a.id-b.id).map(q=>Object.fromEntries(keys.filter(k=>q[k]!==undefined).map(k=>[k,q[k]])));
  assert.equal(createHash("sha256").update(JSON.stringify(payload)).digest("hex"),"48f56e6f3fdc2fcbfeb8fb94d0851fc96db6108c9bdb000b123016c79de796b3");
});

test("approved Mu questions start at 1 with no gaps while IDs and source credits stay independent",()=>{
  assert.ok(muQuestions.length>=203);
  assert.equal(muQuestions[0].id,10119);
  assert.equal(muQuestions[0].source.competition,"2026 FAMAT State Convention");
  assert.deepEqual(muQuestions.map(q=>q.number),Array.from({length:muQuestions.length},(_,i)=>i+1));
  assert.deepEqual(muQuestions.slice(0,203).map(q=>q.id),Array.from({length:207},(_,i)=>10119+i).filter(id=>![10232,10248,10278,10285].includes(id)));
  assert.ok(muQuestions.every(q=>q.source&&!/National/.test(q.source.competition)));
  const sample=muQuestions.find(q=>q.id===10234);
  assert.equal(sample.source.questionNumber,29);
  assert.notEqual(sample.number,sample.source.questionNumber);
});

test("public listing and Trainer catalogs and selection never include withheld IDs",()=>{
  const deps={"server-only":{},"@/data/questions":{questions:muQuestions}};
  const trainer=load("lib/trainerCatalog.ts",deps);
  const listing=load("lib/questionBankCatalog.ts",{...deps,"@/lib/questionBankListing":{toQuestionBankItem:q=>q}});
  assert.deepEqual(Array.from(listing.getQuestionBankListing("Mu"),q=>q.id),muQuestions.map(q=>q.id));
  assert.deepEqual(Array.from(trainer.getTrainerItems(),q=>q.number),muQuestions.map(q=>q.number));
  for(const q of muNationalReferences)assert.equal(trainer.getTrainerQuestion(q.id),null);
  for(let difficulty=1;difficulty<=5;difficulty++)for(let i=0;i<50;i++){
    const q=selectNextTrainerQuestion(trainer.getTrainerItems(),new Map(),{division:"Mu",targetDifficulty:difficulty});
    assert.ok(q.id>=10119);
  }
});

test("production source never imports internal national reference content",()=>{
  for(const directory of ["app","components","lib","data/questions"]){
    for(const file of readdirSync(new URL("../"+directory+"/",import.meta.url),{recursive:true})){
      if(!/\.(?:ts|tsx|js|mjs)$/.test(file))continue;
      const source=readFileSync(new URL("../"+directory+"/"+file,import.meta.url),"utf8");
      assert.doesNotMatch(source,/(?:from\s*|import\s*\(|require\s*\()\s*["'][^"']*(?:question-references|muNationals)/,directory+"/"+file);
    }
  }
});

test("direct bank links and practice/tutor requests cannot reopen any hidden national question",async()=>{
  const deny=()=>assert.fail("Hidden questions must be rejected before account, provider or database access");
  class RequestBodyError extends Error {}
  const deps={
    "server-only":{},
    "@/data/questions":{questions:muQuestions},
    "@/lib/supabase/admin":{createAdminClient:deny},
    "@/lib/supabase/server":{createClient:deny},
    "@/lib/serverPerformance":{observeApi:(_name,work)=>work()},
    "@/lib/security/request":{isTrustedMutationRequest:()=>true,readJsonBody:request=>request.json(),RequestBodyError},
    "@/lib/tutorRevealToken":{createTutorRevealToken:deny,verifyTutorRevealToken:deny},
    "@/lib/practiceTiming":{PRACTICE_TIMING_LIMIT:100,isPracticeTiming:()=>true},
    "@/lib/aiTutor":{TUTOR_MAX_MESSAGE_LENGTH:1000,TUTOR_MAX_HISTORY_MESSAGES:20,TUTOR_MAX_HISTORY_LENGTH:1000},
    "next/server":{NextResponse:{json:Response.json.bind(Response)}},
    "./QuestionClient":{default:deny},
    "@/lib/questionBankCatalog":{getQuestionBankListing:deny},
    "@/lib/questionBankListing":{questionBankNavigation:deny},
  };
  const bank=load("app/practice/question-bank/[id]/page.tsx",deps).default;
  const attempt=load("app/api/practice/attempt/route.ts",deps).POST;
  const result=load("app/api/practice/result/route.ts",deps).POST;
  const tutor=load("app/api/tutor/route.ts",deps).POST;
  for(const q of muNationalReferences){
    const element=await bank({params:Promise.resolve({id:String(q.id)}),searchParams:Promise.resolve({})});
    assert.match(JSON.stringify(element),/Question Not Found/);
    const payload={questionId:q.id,trainer:false,requestId:"00000000-0000-4000-8000-000000000001",attemptId:"00000000-0000-4000-8000-000000000001",selectedAnswer:"A",message:"Explain this",history:[]};
    for(const post of [attempt,result,tutor]){
      const response=await post(new Request("https://example.test/api",{method:"POST",body:JSON.stringify(payload)}));
      assert.equal(response.status,400);
      const body=await response.text();
      assert.ok(!body.includes(q.question));
      assert.ok(!body.includes(q.solution));
    }
  }
});

test("previously stored multiplayer rounds and results cannot reveal withheld national content",async()=>{
  let questionId;
  const service=load("lib/services/multiplayerService.ts",{
    "server-only":{},"next/headers":{},"@/lib/auth/publicNames":{},"@/lib/security/request":{},
    "@/data/questions":{questions:muQuestions},
    "@/lib/supabase/server":{createClient:async()=>({auth:{getUser:async()=>({data:{user:{id:"verified-user"}},error:null})}})},
    "@/lib/supabase/admin":{createAdminClient:()=>({rpc:async name=>({
      error:null,
      data:name==="read_multiplayer_round_for_actor"?{
        status:"in-progress",currentPlayerId:"player",stateVersion:1,totalQuestions:1,
        questionDurationSeconds:90,players:[],question:{question_id:questionId,question_number:1},
      }:{
        status:"ready",result:{placement:1,final_score:0,previous_rp:null,new_rp:0},
        placements:[],submissions:[],scoreboard:{status:"completed",players:[]},
        questions:[{question_id:questionId,question_number:1}],
      },
    })})},
  });
  for(const q of muNationalReferences){
    questionId=q.id;
    await assert.rejects(service.getMultiplayerRoundState("room"),/Question unavailable/);
    await assert.rejects(service.getMultiplayerMatchResult("room"),/Unable to load a match question/);
  }
});
