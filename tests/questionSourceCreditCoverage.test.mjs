import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync,readdirSync} from "node:fs";
import test from "node:test";
import {alphaQuestions} from "../data/questions/alpha.ts";
import {thetaQuestions} from "../data/questions/theta.ts";
import {muQuestions} from "../data/questions/mu.ts";

const report=JSON.parse(readFileSync(new URL("../docs/question-source-credit-audit.json",import.meta.url),"utf8"));
const questions=[...muQuestions,...alphaQuestions,...thetaQuestions];
const hash=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const addedIds=new Set(report.sourceGroups.flatMap(group=>Array.from({length:group.last-group.first+1},(_,i)=>group.first+i)));
const clean=qs=>qs.map(q=>{
  const content={...q};
  delete content.source;
  return content;
});

test("all 1272 public questions have complete source credits and unique original-paper identities",()=>{
  assert.equal(questions.length,1272);
  assert.deepEqual([muQuestions.length,alphaQuestions.length,thetaQuestions.length],[558,267,447]);
  const identities=new Set();
  for(const q of questions){
    assert.ok(q.source,"missing source: "+q.division+" #"+q.number);
    assert.ok(q.source.competition.trim());
    assert.ok(q.source.event.trim());
    assert.ok(Number.isSafeInteger(q.source.questionNumber)&&q.source.questionNumber>0);
    const identity=JSON.stringify([q.source.competition,q.source.event,q.source.questionNumber]);
    assert.ok(!identities.has(identity),"duplicate source: "+identity);
    identities.add(identity);
  }
  assert.equal(report.publicCatalog.missingCount,0);
  for(const [division,qs] of [["Mu",muQuestions],["Alpha",alphaQuestions],["Theta",thetaQuestions]]){
    assert.equal(report.publicCatalog[division].questions,qs.length);
    assert.equal(report.publicCatalog[division].credited,qs.length);
    assert.deepEqual(report.publicCatalog[division].missing,[]);
  }
});

test("five supplied existing Alpha sets and three already-identified Theta sets get exact original-number credits",()=>{
  assert.equal(report.sourceGroups.length,8);
  assert.equal(addedIds.size,239);
  for(const group of report.sourceGroups){
    const qs=questions.filter(q=>q.id>=group.first&&q.id<=group.last);
    assert.equal(qs.length,group.originals.length);
    for(const [i,q] of qs.entries()){
      assert.equal(q.division,group.division);
      assert.deepEqual(q.source,{competition:group.competition,event:group.event,questionNumber:group.originals[i]});
    }
  }
  assert.equal(alphaQuestions.find(q=>q.id===20149).source.questionNumber,30);
  assert.equal(alphaQuestions.some(q=>q.source.competition==="2019 FAMAT March"&&q.source.questionNumber===29),false);
  assert.equal(alphaQuestions.find(q=>q.id===20241).source.competition,"FAMAT February Regional",
    "do not invent an unprinted competition year");
  assert.equal(Object.values(report.suppliedFiles).filter(file=>file.status==="matched-existing-set").length,10);
  assert.equal(Object.values(report.suppliedFiles).filter(file=>file.status==="not-imported-no-existing-matching-set").length,18);
});

test("all existing question content, labels, IDs, numbering, and pre-existing credits are unchanged",()=>{
  assert.equal(hash(clean(alphaQuestions)),report.fingerprints.unchangedAlphaContent);
  assert.equal(hash(clean(thetaQuestions)),report.fingerprints.unchangedThetaContent);
  assert.equal(createHash("sha256").update(readFileSync(new URL("../data/questions/mu.ts",import.meta.url))).digest("hex"),
    report.fingerprints.unchangedMuFile);
  assert.equal(hash(questions.filter(q=>!addedIds.has(q.id)).map(q=>[q.id,q.source])),report.fingerprints.preExistingCredits);
});

test("all SVGs are byte-identical and no unmatched test or missing question is added",()=>{
  const files=readdirSync(new URL("../public/questions/",import.meta.url)).filter(file=>file.endsWith(".svg")).sort();
  const digests=files.map(file=>[file,createHash("sha256").update(readFileSync(new URL("../public/questions/"+file,import.meta.url))).digest("hex")]);
  assert.equal(hash(digests),report.fingerprints.unchangedSVGs);
  assert.equal(new Set(questions.map(q=>q.id)).size,1272);
  assert.ok(!alphaQuestions.some(q=>q.source.competition==="2026 King February Statewide"||q.source.competition==="2026 January Statewide"));
});
