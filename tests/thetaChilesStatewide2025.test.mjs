import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/theta.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { thetaQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
const chilesQuestions = thetaQuestions.filter(question => question.number <= 30);

test("Chiles Statewide 2025 updates existing Theta records without duplicating or renumbering them", () => {
  const expectedNumbers = [...Array.from({ length: 8 }, (_, index) => index + 1), ...Array.from({ length: 21 }, (_, index) => index + 10)];
  assert.equal(chilesQuestions.length, 29);
  assert.deepEqual(chilesQuestions.map(question => question.number), expectedNumbers);
  assert.deepEqual(chilesQuestions.map(question => question.id), expectedNumbers.map(number => 30000 + number));
  assert.equal(chilesQuestions.map(question => question.answer).join(""), "BAABDADCDDACBCBABBACCEBCABDCA");
  assert.ok(chilesQuestions.every(question => question.choices.length === 5));
  assert.ok(chilesQuestions.every(question => question.difficulty >= 1 && question.difficulty <= 5));
  assert.equal(new Set(thetaQuestions.map(question => question.id)).size, thetaQuestions.length);
  assert.ok(thetaQuestions.every(question => !question.question.startsWith("[Temporary]")));
  assert.equal(thetaQuestions.some(question => question.number === 9), false);
  for (const question of chilesQuestions) {
    assert.deepEqual(question.source, {
      competition: "2025 Chiles Statewide", event: "Algebra 2 Individual", questionNumber: question.number,
    });
  }
  // Later source-credit additions must not alter the previously reviewed content.
  const later = thetaQuestions.filter(q => q.id >= 30180 && q.id <= 30419).map(q => {
    const content = {...q};
    delete content.source;
    return content;
  });
  assert.equal(createHash("sha256").update(JSON.stringify(later)).digest("hex"),
    "1b2e78d0282aaed469a7ddbd4f55693fd87089698181c3d5d797bf07f6e9e981", "unrelated later Theta records are untouched");
});

test("source-sensitive details and corrections are retained", () => {
  const get = number => chilesQuestions.find(question => question.number === number);
  assert.match(get(19).solution, /decreased by/);
  assert.match(get(23).solution, /Every real number is also a complex number/);
  assert.match(get(25).solution, /distinct integral solutions/);
  assert.match(get(30).solution, /x=2.*hole/);
  assert.equal(get(7).illustration.src, "/questions/theta-7-balance-scale.svg");
  assert.equal(get(29).illustration.src, "/questions/theta-29-balloons.svg");
  assert.ok(existsSync(new URL("../public/questions/theta-7-balance-scale.svg", import.meta.url)));
  assert.ok(existsSync(new URL("../public/questions/theta-29-balloons.svg", import.meta.url)));
  assert.doesNotMatch(get(1).question, /f\(x\)=/);
  assert.match(get(5).question, /0<n<50.*mass/);
  assert.match(get(14).question, /principal square roots/);
  assert.match(get(16).question, /Two complex numbers/);
  assert.match(get(19).question, /decreased as a fraction of its original population/);
  assert.equal(get(12).choices[3], String.raw`\(\sqrt{35}\)`, "restore the source's duplicated incorrect distractor, not an invented cube root");
  assert.match(get(7).solution, /\[\[solution-diagram:theta-7\]\]/);
  assert.doesNotMatch(get(7).question, /solution-diagram/);
});

test("valid source stems and choices remain unchanged outside the documented repairs", () => {
  const hash=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
  assert.equal(hash(chilesQuestions.filter(q=>![1,5,14,16,19,29].includes(q.number)).map(q=>[q.id,q.question])),
    "4793fee4ca6edabd26ba787e05b6815f08171574494b020b95208bdac7b525a2");
  assert.match(get(29).question, /last row in the diagram/);
  assert.equal(hash(chilesQuestions.filter(q=>q.number!==12).map(q=>[q.id,q.choices])),
    "31e111f086471825412e09d594efc16112b9cb22249cb63733964b5ab51161b4");
});

test("Theta methods are solving techniques from the established vocabulary", () => {
  const methods = [...new Set(chilesQuestions.flatMap(question => question.methods))].sort();
  assert.deepEqual(methods, ["Absolute Value", "Asymptotes", "Change of Base", "Completing the Square", "Determinant", "Difference of Squares", "Modular Arithmetic", "Remainder Theorem", "Tangency"]);
  assert.deepEqual(chilesQuestions.map(q => q.difficulty),
    [1,2,1,1,2,2,2,2,2,2,3,2,2,2,2,3,1,2,2,1,3,1,3,3,1,3,2,3,2]);
});

const get = n => chilesQuestions.find(q => q.number === n);
const selected = n => get(n).choices[get(n).answer.charCodeAt(0) - 65];
function answer(n, value) { assert.equal(selected(n), String(value), "independent source #" + n); }

test("independent checks: circle intersection, factor theorem, unit conversion, logs, mixture, and test scores (#1-6)", () => {
  assert.equal(4 - (3 - 1) ** 2, 0); answer(1, 1);
  const k = 6, p = x => 3*x**3 - 9*x*x + k*x - 18;
  assert.equal(p(3), 0);
  for (const x of [-8,0,2,11]) assert.equal(p(x), 3*(x*x+2)*(x-3));
  assert.equal(selected(2), String.raw`\(x^2+2\)`);
  assert.equal((120/12)/5 * 6/3, 120/(6*5));
  assert.equal(selected(3), String.raw`\(\frac{x}{6y}\)`);
  answer(4, Math.round(120 - 12*Math.log(16)/Math.log(1/8)));
  for(const n of [1,12,25,49]) {
    const added=n*n/(100-2*n);
    assert.ok(Math.abs((n*n/100+added)/(n+added)-2*n/100)<1e-12);
  }
  assert.equal(selected(5), String.raw`\(\frac{n^2}{100-2n}\)`);
  const totals=Array.from({length:200},(_,i)=>i+20).filter(t=>15+(t-20)/3===t/2);
  assert.deepEqual(totals,[50]); answer(6, .6*50-.5*50);
});

test("independent checks: two-pan weights, rational factorization, integer ratios, and extraneous radical roots (#7-11)", () => {
  const weights=new Set();
  for(const a of [-1,0,1]) for(const b of [-1,0,1]) for(const c of [-1,0,1]) weights.add(a+3*b+5*c);
  answer(7, Array.from({length:9},(_,i)=>i+1).filter(n=>weights.has(n)).length);
  for(const [x,y,z] of [[2,3,4],[4,1,-2],[1,0,0]]) {
    const numerator=x*x+y*y-z*z+2*x*y, denominator=x*x+z*z-y*y+2*x*z;
    assert.equal(numerator*(x+z-y),denominator*(x+y-z));
  }
  assert.equal(selected(8), String.raw`\(\frac{x+y-z}{x+z-y}\)`);
  const minimumK=[1,2,3].find(k=>Number.isInteger(56*k/3)&&Number.isInteger(28*k/3));
  answer(10,56*minimumK);
  assert.equal(Math.sqrt(3*5+1)+Math.sqrt(5-4),5);
  assert.notEqual(Math.sqrt(3*40+1)+Math.sqrt(40-4),5); answer(11,5);
});

test("independent checks: circle radius, composite domain, principal complex radicals, modular powers, and symmetric cubes (#12-16)", () => {
  for(const [x,y] of [[0,1],[0,3],[5,8]]) assert.equal((x-6)**2+(y-2)**2,37);
  assert.equal(selected(12),String.raw`\(\sqrt{37}\)`);
  assert.equal((-6-2)/(-6+5),8);
  assert.equal(selected(13),String.raw`\(-5,-6\)`);
  for(const a of [-1,-7,-20]) assert.ok(Math.abs(-Math.sqrt(8*Math.abs(a))*Math.sqrt(2*Math.abs(a))+4*Math.abs(a))<1e-10);
  assert.equal(selected(14),String.raw`\(-4|a|\)`);
  answer(15,Number((3n**21n+4n**22n+5n**23n)%10n));
  assert.equal(2**3-3*2*2,-4); assert.equal(selected(16),String.raw`\(-4\)`);
});

test("independent checks: hyperbola, custom operation, compound percentages, determinant, and ratios (#17-21)", () => {
  assert.equal(9*(2-1)**2-4*(5-2)**2,-27);
  assert.equal(9*2**2-4*5**2-18*2+16*5+29,9*(2-1)**2-4*(5-2)**2+36);
  assert.equal(selected(17),String.raw`\((1,2-\sqrt{13})\)`);
  answer(18,(2027-2025)**2);
  assert.equal(256-5*3*5*3,31); answer(19,31);
  const x=11,y=x+6;
  assert.equal((5*x-2*y)-3*(20-y)-(8-x),15); answer(20,x);
  assert.equal((25-1)/6,12/3); assert.equal(-72/-18,12/3);
  assert.equal(selected(21),String.raw`\(-47\)`);
});

test("independent checks: divisibility, complex-number membership, factorial valuation, and complete integer-power cases (#22-25)", () => {
  const value=1015**2-2*1015-3;
  assert.deepEqual([2032,1012,936,8].filter(n=>value%n!==0),[936]); answer(22,936);
  // All real numbers embed into C; the only nonreal entry is 8 - 2 sqrt(2) i.
  assert.equal(3/Math.sqrt(16),.75); answer(23,"NOTA");
  let factorial=1n; for(let k=2n;k<=202n;k++) factorial*=k;
  let exponent=0; while(factorial%6n===0n){factorial/=6n;exponent++;} answer(24,exponent);
  // For integer x the exponent is nonnegative. Beyond zero exponent, only bases +/-1 work.
  const roots=Array.from({length:401},(_,i)=>i-200).filter(x=>{
    const b=BigInt(x*x-2*x-4),e=(x-3)**2;
    return e===0 ? b!==0n : b===1n || (b===-1n&&e%2===0);
  });
  assert.deepEqual(roots,[-1,3]); answer(25,roots.reduce((a,b)=>a+b,0));
});

test("independent checks: absolute-value branches, distinct symmetric solutions, balloon choices, and canceled asymptotes (#26-30)", () => {
  const roots=Array.from({length:41},(_,i)=>i-20).filter(x=>4-Math.abs(x-5)===-1);
  assert.deepEqual(roots,[0,10]); answer(26,Math.max(...roots));
  const functions=[x=>Math.abs(x)-3,x=>Math.abs(3-x),x=>Math.abs(x-6)+3,x=>3-x,x=>-Math.abs(3-x)];
  for(const [i,values] of [[0,[3,4,10]],[1,[-8,3,10]],[2,[6,7,100]],[3,[-8,0,3]]])
    for(const x of values) assert.equal(functions[i](x),Math.abs(x-3));
  assert.deepEqual(Array.from({length:101},(_,i)=>i-50).filter(x=>functions[4](x)===Math.abs(x-3)),[3]);
  answer(27,"I, II, III, IV only");
  const x=9+3*Math.sqrt(11),y=9-3*Math.sqrt(11);
  assert.ok(Math.abs(x*x-19*x-y)<1e-10); assert.ok(Math.abs(y*y-x-19*y)<1e-10);
  answer(28,Math.round(Math.sqrt(x*x+y*y+1)));
  assert.equal(3*100,300); assert.equal(20+100+20,140); assert.equal(20+30+100+30,180);
  const possible=[85,110,190,250].filter(t=>Number.isInteger((t-50)/2)&&(t-50)/2>0&&![20,30,100].includes((t-50)/2));
  assert.deepEqual(possible,[190]); answer(29,190);
  assert.equal(2*(-4)**2-4*(-4),48); assert.equal((-4)**2+2*(-4)-8,0);
  assert.equal(2*2/(2+4),2/3); assert.equal(selected(30),String.raw`\(-2\)`);
});

test("source solution table preserves every balancing configuration as native SVG text", () => {
  const svg=readFileSync(new URL("../public/questions/theta-7-solution.svg",import.meta.url),"utf8");
  const cells=[...svg.matchAll(/<text\b[^>]*>([^<]+)<\/text>/g)].map(m=>m[1]);
  assert.deepEqual(cells.slice(6),[
    "1","object","1 lb", "2","object, 1 lb","3 lb", "3","object","3 lb",
    "4","object, 1 lb","5 lb", "5","object","5 lb", "6","object","5 lb, 1 lb",
    "7","object, 1 lb","5 lb, 3 lb", "8","object","5 lb, 3 lb", "9","object","5 lb, 3 lb, 1 lb",
  ]);
});

test("all Chiles Statewide 2025 formulas compile with KaTeX", () => {
  for (const question of chilesQuestions) {
    for (const text of [question.question, ...question.choices, question.solution]) {
      for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
        assert.doesNotThrow(() => katex.renderToString(match[1] ?? match[2], {
          throwOnError: true,
          displayMode: match[2] !== undefined,
        }), "Theta " + question.number);
      }
    }
  }
});
