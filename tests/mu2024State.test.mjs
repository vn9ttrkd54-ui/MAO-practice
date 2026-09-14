import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import katex from "katex";

const source = await readFile(new URL("../data/questions/mu.ts", import.meta.url), "utf8");
const javascript = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { muQuestions } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);
const batch = muQuestions.filter(q => q.number >= 177 && q.number <= 206);

test("2024 State MU set keeps all 30 source answers and unique bank identifiers", () => {
  assert.equal(batch.length, 30);
  assert.equal(batch.map(q => q.answer).join(""), "AACBADA DAABEBCCABCCBB DACADCCBD".replaceAll(" ", ""));
  assert.equal(new Set(muQuestions.map(q => q.id)).size, muQuestions.length);
  assert.equal(new Set(muQuestions.map(q => q.number)).size, muQuestions.length);
  batch.forEach((q, i) => {
    assert.equal(q.number, 177 + i);
    assert.equal(q.id, 10177 + i);
    assert.equal(q.division, "Mu");
    assert.equal(q.choices.length, 5);
    assert.equal(q.choices[4], "NOTA");
    assert.ok(Number.isInteger(q.difficulty) && q.difficulty >= 1 && q.difficulty <= 5);
    assert.ok(q.topic && q.solution && Array.isArray(q.methods));
  });
  assert.match(source, /2025 FAMAT State Convention/);
  assert.match(source, /2024 FAMAT State Convention/);
});

test("all new question, choice and solution formulas render with KaTeX", () => {
  for (const q of batch) {
    for (const text of [q.question, ...q.choices, q.solution]) {
      const expressions = [...text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)];
      for (const m of expressions) {
        assert.doesNotThrow(() => katex.renderToString(m[1] ?? m[2], {
          throwOnError: true, displayMode: m[2] !== undefined,
        }), `MU ${q.number}: ${m[0]}`);
      }
      const remainder = text.replace(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g, "");
      assert.doesNotMatch(remainder, /\\[()[\]]/, `unmatched math delimiter in MU ${q.number}`);
    }
  }
});

test("adapted questions include assumptions and avoid previous-question dependencies", () => {
  assert.match(batch[1].question, /continuous at/);
  assert.match(batch[19].question, /right circular cone/);
  assert.match(batch[26].question, /least upper bound/);
  for (const q of batch) assert.doesNotMatch(q.question, /previous problem|see problem/i);
});

const near = (actual, expected, tolerance = 1e-9) => assert.ok(
  Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`,
);
const integral = (f, a, b, n = 10000) => {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return s * h / 3;
};

test("independent numerical checks for integrals, optimization and series", () => {
  near(integral(x => 1 / ((8*x+27)*Math.sqrt(2*x+7)), 1, 9), Math.log(63/55)/4);
  // Remove Q19's integrable endpoint singularity using x = sin²(t)/2024.
  near(integral(t => 2*Math.cos(t)**2/Math.sqrt(2024), 0, Math.PI/2), Math.PI*Math.sqrt(506)/2024);
  const volume = h => Math.PI*h**3/(6*(h-1)**2);
  near(volume(3), 9*Math.PI/8);
  for (const h of [1.1, 1.5, 2, 2.9, 3.1, 4, 10]) assert.ok(volume(h) > volume(3));
  let sum = 0;
  for (let i = 2000; i <= 2999; i++) sum += 1/(i*i+1000*i);
  const choices = [0.000287, 0.000119, 0.000283, 0.000104];
  assert.equal(choices.indexOf(choices.reduce((a,b) => Math.abs(a-sum) < Math.abs(b-sum) ? a : b)), 1);
  near(integral(z => Math.PI*z*(1-z)**1.5, 0, 1), 4*Math.PI/35);
  near(integral(a => 2*a**(4/3)/3, 0, 1), 2/7);
  const y = x => 1+1/x+Math.exp(1/x-1);
  near(y(1), 3);
  near(y(2), 1.5+1/Math.sqrt(Math.E));
  near((-1/4-Math.exp(-0.5)/4)+y(2)/4, 1/8);
  let series = 0;
  for (let n = 0; n < 100; n++) series += [1,-1,0][(2*n)%3]/2**n;
  near(series, 6/7);
  near(integral(x => 1/(1+Math.exp(Math.sin(x)**3)), 0, 2*Math.PI), Math.PI);
  // Q29/Q30: log of the exact factorial expression, independent of Stirling simplification.
  let logFactorialN = 0, logFactorial2N = 0;
  const n = 10000;
  for (let k = 1; k <= 2*n; k++) {
    logFactorial2N += Math.log(k);
    if (k <= n) logFactorialN += Math.log(k);
  }
  const ratio = Math.exp(logFactorial2N-n*Math.log(4)-logFactorialN+Math.log(Math.PI)/2-n*(Math.log(n)-1));
  near(ratio, Math.sqrt(2*Math.PI), 0.00002);
});
