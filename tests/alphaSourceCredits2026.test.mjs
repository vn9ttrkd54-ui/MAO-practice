import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync,readdirSync} from "node:fs";
import test from "node:test";
import {alphaQuestions} from "../data/questions/alpha.ts";

const hash=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const sets=[
  {competition:"2026 January Regional",first:20001,last:20030,event:"Precalculus Individual",originals:Array.from({length:30},(_,i)=>i+1)},
  {competition:"2026 February Regional",first:20031,last:20059,event:"Precalculus Individual",originals:Array.from({length:30},(_,i)=>i+1).filter(n=>n!==28)},
  {competition:"2026 March Regional",first:20061,last:20090,event:"Precalculus Individual",originals:Array.from({length:30},(_,i)=>i+1).filter(n=>n!==22)},
  {competition:"2026 FAMAT State Convention",first:20301,last:20330,event:"Alpha Individual",originals:Array.from({length:30},(_,i)=>i+1)},
];
const credited=alphaQuestions.filter(q=>sets.some(s=>q.id>=s.first&&q.id<=s.last));

test("the four already-present supplied Alpha sets have all 118 original-number credits",()=>{
  assert.equal(credited.length,118);
  for(const set of sets){
    const questions=credited.filter(q=>q.id>=set.first&&q.id<=set.last);
    assert.equal(questions.length,set.originals.length);
    for(const [index,q] of questions.entries()){
      assert.deepEqual(q.source,{competition:set.competition,event:set.event,questionNumber:set.originals[index]});
    }
  }
  assert.equal(alphaQuestions.find(q=>q.id===20058).source.questionNumber,29);
  assert.equal(alphaQuestions.find(q=>q.id===20083).source.questionNumber,23);
  assert.equal(alphaQuestions.find(q=>q.id===20301).source.questionNumber,1);
  assert.equal(alphaQuestions.find(q=>q.id===20330).source.questionNumber,30);
});

test("credits change no questions, answers, solutions, ratings, methods, stable IDs, display numbers, or illustration assignments",()=>{
  const clean=alphaQuestions.map(q=>{
    const copy={...q};
    delete copy.source;
    return copy;
  });
  assert.equal(alphaQuestions.length,267);
  assert.equal(hash(clean),"58432486ac41dd54186ca3f6c8894a24be6b3b0d688bee53cb361d9e1ab17e0c");
  // Later legacy-set credits are independently covered by the full-catalog audit.
  for(const competition of ["2026 King February Statewide","2026 January Statewide"]){
    assert.ok(!alphaQuestions.some(q=>q.source?.competition===competition),"missing test is not imported");
  }
});

test("every existing question SVG remains byte-identical during this credit-only update",()=>{
  const files=readdirSync(new URL("../public/questions/",import.meta.url)).filter(file=>file.endsWith(".svg")).sort();
  const digests=files.map(file=>[file,createHash("sha256").update(readFileSync(new URL("../public/questions/"+file,import.meta.url))).digest("hex")]);
  assert.equal(hash(digests),"357a1b784aab8e74dbe093af5749b1b6259869a0514b1a054b8d29328df443d0");
});
