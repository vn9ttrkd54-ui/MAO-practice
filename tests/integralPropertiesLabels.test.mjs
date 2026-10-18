import assert from "node:assert/strict";
import test from "node:test";
import {muQuestions} from "../data/questions/mu.ts";
import {muNationalReferences} from "../data/question-references/muNationals.ts";

test("Integral Properties describes basic interval rules, not specialized integration tricks",()=>{
  // Interval additivity/subtraction, reversed bounds, and equal limits qualify.
  // An inverse-integral identity or a trigonometric integral trick does not.
  assert.deepEqual(
    muQuestions.filter(q=>q.methods.includes("Integral Properties")).map(q=>q.id),
    [10183,10328,10333,10436],
  );
  assert.deepEqual(
    muNationalReferences.filter(q=>q.methods.includes("Integral Properties")).map(q=>q.id).sort((a,b)=>a-b),
    [10006,10037],
  );
  assert.deepEqual(muQuestions.find(q=>q.id===10345).methods,["Inverse Functions"]);
  assert.deepEqual(muQuestions.find(q=>q.id===10353).methods,["Trigonometric Identities"]);
});
