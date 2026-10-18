import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/mu.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { muQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = muQuestions.filter(q => (q.id - 10000) >= 207 && (q.id - 10000) <= 235);

const retainedBankNumbers = Array.from({ length: 29 }, (_, i) => 207 + i).filter(number => number !== 232);

test("January Statewide excludes both annotated throw-outs without shifting remaining IDs", () => {
  assert.equal(questions.length, 28);
  assert.deepEqual(questions.map(q => (q.id - 10000)), retainedBankNumbers);
  assert.deepEqual(questions.map(q => q.id), retainedBankNumbers.map(number => 10000 + number));
  const originalBankKey = "DABEDDABCECDACDDBCDBEBDADBBBD";
  assert.equal(questions.map(q => q.answer).join(""), retainedBankNumbers.map(number => originalBankKey[number - 207]).join(""));
  assert.ok(!muQuestions.some(question => question.id === 10232));
  questions.forEach(q => assert.equal(q.choices.length, 5));
  assert.equal(new Set(muQuestions.map(q => q.id)).size, muQuestions.length);
});

test("final accepted wording and choices are incorporated", () => {
  const get = number => questions.find(q => (q.id - 10000) === number);
  assert.match(get(222).question, /finite real number/);
  assert.equal(get(222).answer, "D");
  assert.equal(get(233).answer, "B");
  assert.notEqual(get(233).choices[1], get(233).choices[2]);
});

test("all January Statewide formulas compile with KaTeX", () => {
  for (const q of questions) {
    for (const text of [q.question, ...q.choices, q.solution]) {
      for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
        assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
          throwOnError: true,
          displayMode: match[2] !== undefined,
        }), `MU ${(q.id - 10000)}`);
      }
    }
  }
});

test("the original shared graph is local and assigned to source questions 1 through 4", () => {
  const graph = readFileSync(new URL("../public/questions/mu-207-210-original.png", import.meta.url));
  assert.equal(graph.subarray(1,4).toString("ascii"), "PNG");
  for (const q of questions.slice(0, 4)) {
    assert.equal(q.illustration?.src, "/questions/mu-207-210-original.png");
    assert.equal(q.illustration?.width, 1380);
    assert.equal(q.illustration?.height, 523);
  }
  for (const q of questions.slice(4)) assert.equal(q.illustration, undefined);
});

test("credits use original paper numbering across the preexisting source-28 gap", () => {
  const difficulties = [1,1,2,1,2,3,2,2,1,2,4,1,2,4,4,5,3,2,4,2,5,3,4,3,4,3,5,1,5];
  for (const question of questions) {
    const original = (question.id - 10000) < 234 ? (question.id - 10000) - 206 : (question.id - 10000) - 205;
    assert.deepEqual(question.source, {
      competition: "2026 January Statewide", event: "Calculus Individual", questionNumber: original,
    });
    assert.equal(question.difficulty, difficulties[(question.id - 10000) - 207]);
  }
  assert.equal(questions.find(question => question.id === 10234).source.questionNumber, 29);
  assert.equal(questions.find(question => question.id === 10235).source.questionNumber, 30);
  for (const number of [26, 28]) assert.ok(!questions.some(question => question.source.questionNumber === number));
});

test("source errors and compressed explanations have explicit corrections", () => {
  const get = number => questions.find(question => (question.id - 10000) === number);
  assert.match(get(212).question, /tangent-line estimate/);
  assert.match(get(212).solution, /does not reach/);
  assert.match(get(219).question, /local inverse/);
  assert.ok(get(231).solution.includes(String.raw`w^{7/2}`));
  assert.ok(get(231).solution.includes(String.raw`\frac29`));
  assert.doesNotMatch(get(231).solution, /w\^\{9\/2\}\\right\)dw|frac2\{11\}/);
  assert.ok(get(234).question.includes(String.raw`\frac1{e^x}`));
  assert.match(get(235).solution, /Adding/);
  assert.match(get(235).solution, /sec\^3/);
  for (const number of [217,227]) {
    assert.ok(get(number).solution.includes(`[[solution-diagram:mu-${number}]]`));
    const png = readFileSync(new URL(`../public/questions/mu-${number}-original-solution.png`, import.meta.url));
    assert.equal(png.subarray(1,4).toString("ascii"), "PNG");
  }
});

test("independent quadrature, conic intersections and antiderivative checks agree", () => {
  const simpson = (fn, start, end, count = 50000) => {
    const width = (end - start) / count;
    let sum = fn(start) + fn(end);
    for (let k = 1; k < count; k++) sum += (k % 2 ? 4 : 2) * fn(start + k * width);
    return sum * width / 3;
  };
  assert.ok(Math.abs(simpson(x => Math.sqrt(1 - Math.sqrt(1 - Math.sqrt(x))),0,1) - 208 / 315) < 1e-6);
  assert.ok(Math.abs(simpson(x => Math.exp(2*x)*(1+x+x*x),0,1) - (Math.exp(2)-0.5)) < 1e-10);
  assert.ok(Math.abs(simpson(x => x*x*Math.cos(x)*(Math.sin(x)+1),-Math.PI/2,Math.PI/2) - (Math.PI**2/2-4)) < 1e-10);
  const slopes = [];
  for (const sx of [-1,1]) for (const sy of [-1,1]) {
    const x = 2 + sx * Math.sqrt(112 / 41), y = -1 + sy * Math.sqrt(75 / 41);
    assert.ok(Math.abs(5*x*x+8-2*y*y-20*x-4*y) < 1e-12);
    assert.ok(Math.abs(3*x*x+7*y*y+14*y-12*x-2) < 1e-12);
    const slope = -3*(x-2)/(7*(y+1));
    assert.ok(Number.isFinite(slope));
    slopes.push(slope);
  }
  assert.ok(Math.abs(slopes.reduce((a,b)=>a+b,0)) < 1e-12);
  const antiderivative = x => {
    const u = x-3, r = Math.sqrt(u*u+9);
    return u*r/2 - 3.5*Math.log((r+u)/3);
  };
  for (const x of [-8,0,3,7,12]) {
    const h = 1e-5;
    const derivative = (antiderivative(x+h)-antiderivative(x-h))/(2*h);
    assert.ok(Math.abs(derivative-(x*x-6*x+10)/Math.sqrt(x*x-6*x+18)) < 1e-8);
  }
});
