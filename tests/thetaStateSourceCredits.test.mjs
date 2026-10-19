import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import test from "node:test";
import {thetaQuestions} from "../data/questions/theta.ts";

const hash=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const states=thetaQuestions.filter(q=>q.id>=30180&&q.id<=30329);
const reviewedCatalog=thetaQuestions.filter(q=>q.id<=30449);

test("the five supplied States sets credit all 150 existing questions with original numbers",()=>{
  assert.equal(states.length,150);
  for(const [year,first] of [[2026,30180],[2025,30210],[2024,30240],[2023,30270],[2022,30300]]){
    const set=states.filter(q=>q.id>=first&&q.id<first+30);
    assert.equal(set.length,30);
    for(const [index,q] of set.entries()){
      assert.equal(q.id,first+index);
      assert.deepEqual(q.source,{
        competition:year+" FAMAT State Convention",
        event:"Theta Individual",
        questionNumber:index+1,
      });
      assert.equal(q.number,q.id-30000);
    }
  }
});

test("the credit-only change preserves every question, answer, solution, label, ID and illustration assignment",()=>{
  const content=reviewedCatalog.map(q=>{
    const copy={...q};
    delete copy.source;
    return copy;
  });
  assert.equal(reviewedCatalog.length,447);
  assert.equal(hash(content),"5017f65ae6248a1b8676db7c2d6ecd190daa7310b11cb7a3e2c486a3fd8f2217");
  assert.equal(hash(reviewedCatalog.filter(q=>q.id<30180||q.id>30419).map(q=>[q.id,q.source??null])),
    "5c7335c60ff3857db0035d4eddd41aa1f1248506d6a56dcb38a5b4d16687884f");
  assert.equal(reviewedCatalog.some(q=>q.source?.competition==="2025 January Regional"),false,
    "the user explicitly asked to leave the missing January Regional 2025 test out");
});

test("all nine existing States SVG files stay byte-for-byte unchanged",()=>{
  const files=[...new Set(states.flatMap(q=>q.illustration?[q.illustration.src]:[]))].sort();
  assert.equal(files.length,9);
  const digests=files.map(file=>[file,createHash("sha256").update(readFileSync(new URL("../public"+file,import.meta.url))).digest("hex")]);
  assert.equal(hash(digests),"72dcc2c5226abf8cc699033f62bbd616363917c6e5061f01ed8a1ab9de9c49a6");
});
