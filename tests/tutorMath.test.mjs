import assert from "node:assert/strict";
import test from "node:test";
import katex from "katex";
import { normalizeTutorMath } from "../lib/tutorMath.ts";
import { chainRuleFormula, garbledTutorMessage } from "./browserFixtures/tutorMath.mjs";

function formulas(text) {
  return [...text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)].map(match => match[1] ?? match[2]);
}

test("the screenshot's mis-escaped JSON becomes valid, delimited chain-rule math", () => {
  assert.match(garbledTutorMessage, /\u000c/);
  assert.match(garbledTutorMessage, /\u0008/);
  const result = normalizeTutorMath(garbledTutorMessage);
  assert.equal(result, `Use the chain rule: compute \\[${chainRuleFormula}\\]; now evaluate this at \\(x=\\pi^2\\) - try that.`);
  assert.doesNotMatch(result, /[\u0000-\u0008\u000b\u000c\u000e-\u001f]|\\u03c0/);
  assert.deepEqual(formulas(result), [chainRuleFormula, String.raw`x=\pi^2`]);
  for (const formula of formulas(result)) assert.match(katex.renderToString(formula, { throwOnError: true }), /class="katex"/);
  assert.equal(normalizeTutorMath(result), result, "formatting is idempotent");
});

test("properly delimited formulas, multiline environments, and normal prose stay unchanged", () => {
  for (const text of [
    String.raw`Try factoring \(x^2+5x+6\).`,
    String.raw`Use \[\begin{aligned}x+y&=2\\x-y&=0\end{aligned}\].`,
    "A short explanation.\nTry one step at a time.",
    "This feature is free, not $5 and not $10. A\tnew line follows.\nNext, try factoring.",
    "Use a fraction, not a decimal. Try x^2 first.",
  ]) assert.equal(normalizeTutorMath(text), text);
});

test("bare LaTeX gets delimiters without swallowing prose or changing mathematics", () => {
  for (const [text, expected] of [
    [String.raw`Use a \frac{1}{2} factor.`, String.raw`Use a \(\frac{1}{2}\) factor.`],
    [String.raw`Evaluate x=\pi^2.`, String.raw`Evaluate \(x=\pi^2\).`],
    [String.raw`Try 14\pi\cos(\sqrt{x}), now stop.`, String.raw`Try \(14\pi\cos(\sqrt{x})\), now stop.`],
    [String.raw`Use \pi n!, not a decimal.`, String.raw`Use \(\pi n!\), not a decimal.`],
    [String.raw`Use \text{a common factor} here.`, String.raw`Use \(\text{a common factor}\) here.`],
    [String.raw`Differentiate \frac{d}{dx}\left(x^2\right).`, String.raw`Differentiate \(\frac{d}{dx}\left(x^2\right)\).`],
  ]) {
    const result = normalizeTutorMath(text);
    assert.equal(result, expected);
    for (const formula of formulas(result)) katex.renderToString(formula, { throwOnError: true });
  }
});

test("dollar math and doubled math delimiters become the renderer's supported format", () => {
  for (const [text, expected] of [
    [String.raw`Use $x^2+\frac{1}{2}$ here.`, String.raw`Use \(x^2+\frac{1}{2}\) here.`],
    [String.raw`Then $$\int_0^1 x\,dx$$.`, String.raw`Then \[\int_0^1 x\,dx\].`],
    [String.raw`Try \\(x^2+1\\).`, String.raw`Try \(x^2+1\).`],
  ]) assert.equal(normalizeTutorMath(text), expected);
});

test("known JSON control escapes are repaired inside existing delimiters", () => {
  const decoded = JSON.parse(String.raw`{"message":"\\(\frac{1}{2}+\beta+\theta+\tan(x)+\rho+\nabla f\\)"}`).message;
  const result = normalizeTutorMath(decoded);
  assert.equal(result, String.raw`\(\frac{1}{2}+\beta+\theta+\tan(x)+\rho+\nabla f\)`);
  katex.renderToString(formulas(result)[0], { throwOnError: true });
});
