import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/mu.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { muQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = muQuestions.filter(question => question.number >= 296 && question.number <= 325);

test("King February Statewide 2026 contains all 30 sequential questions", () => {
  assert.equal(questions.length, 30);
  assert.deepEqual(questions.map(question => question.number), Array.from({ length: 30 }, (_, index) => 296 + index));
  assert.deepEqual(questions.map(question => question.id), Array.from({ length: 30 }, (_, index) => 10296 + index));
  assert.equal(questions.map(question => question.answer).join(""), "ADACDABBACAACEBCDDDBBECCDABBAB");
  questions.forEach(question => assert.equal(question.choices.length, 5));
  assert.equal(new Set(muQuestions.map(question => question.id)).size, muQuestions.length);
});

test("shared setups are repeated and source corrections are retained", () => {
  const get = number => questions.find(question => question.number === number);

  for (const number of [305, 306]) assert.ok(get(number).question.includes(String.raw`x(t)=t\cos(t)`));
  for (const number of [319, 320, 321]) assert.match(get(number).question, /is sadder than another function/);
  for (const number of [323, 324]) {
    assert.match(get(number).question, /Hermite polynomials.*defined/);
    assert.ok(get(number).question.includes("H_1(x)"));
    assert.ok(get(number).question.includes("H_2(x)"));
  }
  assert.match(get(300).solution, /x=2\\pi k/);
  assert.ok(get(315).question.includes("t(\\ln t)^3"));
  assert.match(get(318).question, /Ai}'''\(1\).*Ai}\^\{\(4\)\}/);
  assert.ok(get(309).question.includes(String.raw`\lceil\sin(\pi x)\rceil`));
  assert.ok(get(310).question.includes(String.raw`\cfrac`));
  assert.ok(get(320).question.includes(String.raw`|g(x)|^r`));
  assert.match(get(313).question, /continuous limiting value 0/);

  for (const question of questions) {
    assert.doesNotMatch(question.question, /previous question|same scenario|same situation/i);
    assert.doesNotMatch(`${question.question}\n${question.solution}`, /disput|thrown out|test bank|original version/i);
  }
});

test("every supplied question has an exact original-number credit and keeps the established difficulty scale", () => {
  const difficulties = [1,2,2,1,3,1,3,2,3,2,4,2,3,3,5,3,4,5,4,3,5,5,3,2,5,3,3,4,5,4];
  for (const [index, question] of questions.entries()) {
    assert.deepEqual(question.source, {
      competition: "2026 February King Invitational", event: "Calculus Individual", questionNumber: index + 1,
    });
    assert.equal(question.difficulty, difficulties[index]);
  }
  for (const [bankNumber, token] of [[302,302],[313,313],[320,320],[325,325]]) {
    assert.ok(questions.find(q => q.number === bankNumber).solution.includes(`[[solution-diagram:mu-${token}]]`));
  }
});

test("independent algebra verifies the corrected implicit derivative and Airy coefficients", () => {
  const x = 1, y = 2;
  const fx = 2*y*y - 2*x*y - 1;
  const fy = -3*y*y + 4*x*y - x*x + 1;
  assert.equal(-fx/fy, 3/4);
  // Each pair represents f^(n) = A(x) f + B(x) f', with f'' = x f.
  const add = (a,b) => Array.from({length:Math.max(a.length,b.length)},(_,i)=>(a[i]??0)+(b[i]??0));
  const derivative = a => a.slice(1).map((value,i)=>value*(i+1));
  let a=[1], b=[0];
  const pairs=[];
  for(let n=1;n<=4;n++) {
    [a,b]=[add(derivative(a),[0,...b]),add(a,derivative(b))];
    pairs[n]=[a.reduce((s,v)=>s+v,0),b.reduce((s,v)=>s+v,0)];
  }
  assert.deepEqual(pairs[3],[1,1]);
  assert.deepEqual(pairs[4],[1,2]);
});

test("Hermite derivative and recurrence identities hold coefficient by coefficient", () => {
  const add=(a,b)=>Array.from({length:Math.max(a.length,b.length)},(_,i)=>(a[i]??0)+(b[i]??0));
  const scale=(a,k)=>a.map(v=>v*k);
  const trim=a=>{while(a.length>1 && a.at(-1)===0)a.pop();return a;};
  const derivative=a=>a.slice(1).map((v,i)=>v*(i+1));
  const h=[[1],[0,2]];
  for(let n=1;n<9;n++)h.push(trim(add([0,...scale(h[n],2)],scale(h[n-1],-2*n))));
  assert.deepEqual(trim(derivative(h[9])),trim(scale(h[8],18)));
  assert.deepEqual(trim(add([0,...scale(h[8],2)],scale(derivative(h[8]),-1))),h[9]);
});

test("sadder counterexample and scaled functional-equation example satisfy their claims", () => {
  for(let i=0;i<=100;i++) {
    const x=i/100, f=2*x*x-x, g=5*x-4*x*x;
    for(const r of [1.01,2,7,100])assert.ok(Math.abs(g)**r >= f-1e-12);
  }
  const baseDerivative=x=>Math.PI/(3*Math.log(2)*x)*Math.cos(Math.PI*Math.log2(x)/3);
  const c=5/baseDerivative(4);
  const f=x=>c*Math.sin(Math.PI*Math.log2(x)/3);
  for(const x of [0.125,0.5,1,2,4,7])assert.ok(Math.abs(f(x)-f(x/2)-f(2*x))<1e-10);
  assert.ok(Math.abs(c*baseDerivative(0.5)+40)<1e-10);
});

test("all King February Statewide 2026 formulas compile with KaTeX", () => {
  for (const question of questions) {
    for (const text of [question.question, ...question.choices, question.solution]) {
      for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
        assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
          throwOnError: true,
          displayMode: match[2] !== undefined,
        }), `MU ${question.number}`);
      }
    }
  }
});

test("high-risk integral values agree with independent calculations", () => {
  const simpson = (fn, start, end, subdivisions = 20000) => {
    const width = (end - start) / subdivisions;
    let total = fn(start) + fn(end);
    for (let index = 1; index < subdivisions; index += 1) {
      total += (index % 2 === 0 ? 2 : 4) * fn(start + index * width);
    }
    return total * width / 3;
  };

  const epsilon = 1e-5;
  const logarithmicIntegral = simpson(theta => Math.log(2 + 2 * Math.sin(theta)), -Math.PI / 2 + epsilon, Math.PI / 2 - epsilon);
  assert.ok(Math.abs(logarithmicIntegral) < 0.001);

  const geometricArea = [...Array(20)].reduce((sum, _, index) => sum + 1 / 2 ** (2 * (index + 1) + 2), 0);
  assert.ok(Math.abs(geometricArea - 1 / 12) < 1e-12);
});
