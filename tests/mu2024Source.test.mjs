import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import katex from "katex";

const source = readFileSync(new URL("../data/questions/mu.ts", import.meta.url), "utf8");
const js = source.replace(/^import type .*;\s*/m, "").replace(": Question[]", "");
const { muQuestions } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const questions = muQuestions.filter(q => (q.id - 10000) >= 177 && (q.id - 10000) <= 206);
const get = n => questions[n - 177];
const require = createRequire(import.meta.url);
const compiled = ts.transpileModule(readFileSync(new URL("../components/math/MathText.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const compiledModule = { exports: {} };
new Function("require", "module", "exports", compiled)(require, compiledModule, compiledModule.exports);
const MathText = compiledModule.exports.default;

test("source answer key, numbering and all 30 entries remain intact", () => {
  assert.equal(questions.length, 30);
  assert.equal(questions.map(q => q.answer).join(""), "AACBADADAABEBCCABCCBBDACADCCBD");
  questions.forEach((q, i) => {
    assert.equal((q.id - 10000), 177+i);
    assert.equal(q.id, 10177+i);
    assert.equal(q.choices.length, 5);
  });
  assert.equal(new Set(muQuestions.map(q => q.id)).size, muQuestions.length);
});

test("source methods and alternative explanations are retained", () => {
  assert.match(get(189).solution, /L’Hôpital/);
  assert.match(get(189).solution, /Alternatively/);
  assert.match(get(195).solution, /quarter circle/);
  assert.match(get(195).solution, /Gamma and Beta/);
  assert.match(get(196).solution, /Rational root theorem/);
  assert.match(get(199).solution, /Gamma and Beta/);
  assert.match(get(202).solution, /Alternatively/);
  assert.match(get(203).solution, /arc length/);
  assert.match(get(192).question, /how to live your life/);
  assert.match(get(186).question, /oh no/);
});

test("all restored math compiles without KaTeX errors", () => {
  for (const q of questions) for (const text of [q.question, ...q.choices, q.solution]) {
    for (const m of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
      assert.doesNotThrow(() => katex.renderToString(m[1] ?? m[2], {
        throwOnError: true, displayMode: m[2] !== undefined,
      }), `MU ${(q.id - 10000)}`);
    }
  }
});

test("solution diagrams render from local allowlisted sources", () => {
  for (const n of [194,196,201,217,227]) {
    const q = muQuestions.find(question => (question.id - 10000) === n);
    assert.ok(q);
    assert.doesNotMatch(q.question, /solution-diagram/);
    const html = renderToStaticMarkup(React.createElement(MathText, null, q.solution));
    const filename = `mu-${n}-original-solution.svg`;
    assert.ok(html.includes(`/questions/${filename}`));
    assert.doesNotMatch(html, /\[\[solution-diagram/);
    const asset = readFileSync(new URL(`../public/questions/${filename}`, import.meta.url));
    assert.match(asset.toString("utf8"), /<svg\b/);
  }
  const html = renderToStaticMarkup(React.createElement(MathText, null, "[[solution-diagram:https://example.com/x]] <script>alert(1)</script>"));
  assert.doesNotMatch(html, /<img|<script/);
});
