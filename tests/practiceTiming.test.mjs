import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInThisContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";

async function load(path, dependencies = {}) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } });
  const exports = {};
  runInThisContext(`(function(exports,require){${outputText}\n})`)(exports, (name) => {
    assert.ok(Object.hasOwn(dependencies, name), `Unexpected import ${name}`);
    return dependencies[name];
  });
  return exports;
}
const timing = await load("lib/practiceTiming.ts");
const empty = await load("lib/storage/progress/progressStorage.ts");
const { memoryProgressStorage } = await load("lib/storage/progress/memoryProgressStorage.ts", { "@/lib/practiceTiming": timing, "@/lib/storage/progress/progressStorage": empty });
const { createSupabaseProgressStorage } = await load("lib/storage/progress/supabaseProgressStorage.ts", { "@/lib/practiceTiming": timing, "@/lib/storage/progress/progressStorage": empty });
const { default: QuestionStats } = await load("components/practice/QuestionStats.tsx", { "react/jsx-runtime": jsxRuntime, "@/lib/practiceTiming": timing, "./question-detail.module.css": { default: { stats: "stats" } } });

test("empty statistics and lifetime best/mean keep the existing presentation", () => {
  assert.deepEqual(timing.getPracticeTiming({ times: [] }), { count: 0, totalSeconds: 0, bestSeconds: null });
  assert.deepEqual(timing.getPracticeTiming({ times: [1, 1, 4] }), { count: 3, totalSeconds: 6, bestSeconds: 1 });
  const html = renderToStaticMarkup(jsxRuntime.jsx(QuestionStats, { attempts: 1200, correct: 1000, times: [99, 99], timing: { count: 1000, totalSeconds: 1500, bestSeconds: 0 } }));
  assert.match(html, /0:00/);
  assert.match(html, /0:02/); // Same Math.round rule as before, not the recent-only mean.
  assert.ok(!html.includes("1:39"));
  const blank = renderToStaticMarkup(jsxRuntime.jsx(QuestionStats, { attempts: 0, correct: 0, times: [] }));
  assert.equal((blank.match(/--/g) ?? []).length, 2);
});

test("large legacy arrays calculate without a spread-argument overflow", () => {
  const times = [0, ...Array(200_000).fill(3)];
  assert.deepEqual(timing.getPracticeTiming({ times }), { count: 200001, totalSeconds: 600000, bestSeconds: 0 });
});

test("thousands of new guest samples keep only 100 entries but exact lifetime totals", () => {
  let progress = { times: [] };
  let total = 0;
  for (let n = 0; n < 2500; n++) {
    const seconds = n % 87;
    total += seconds;
    progress = timing.appendPracticeTime(progress, seconds);
    assert.ok(progress.times.length <= 100);
  }
  assert.equal(progress.timing.count, 2500);
  assert.equal(progress.timing.totalSeconds, total);
  assert.equal(progress.timing.bestSeconds, 0);
  assert.deepEqual(progress.times, Array.from({ length: 100 }, (_, n) => (2400 + n) % 87));
});

test("memory storage preserves lifetime totals before clipping legacy arrays and clones them", async () => {
  const legacy = { ...empty.createEmptyProgress(), times: Array.from({ length: 300 }, (_, n) => n), timing: undefined };
  await memoryProgressStorage.saveQuestionProgress(123, legacy);
  const saved = await memoryProgressStorage.getQuestionProgress(123);
  assert.equal(saved.times.length, 100);
  assert.equal(saved.timing.count, 300);
  assert.equal(saved.timing.totalSeconds, 44850);
  assert.equal(saved.timing.bestSeconds, 0);
  saved.timing.count = 1;
  saved.times[0] = 999;
  const reread = await memoryProgressStorage.getQuestionProgress(123);
  assert.equal(reread.timing.count, 300);
  assert.equal(reread.times[0], 200);
});

test("malformed and unsafe aggregates cannot silently fall back to a recent-only average", () => {
  for (const value of [null, [], {}, { count: "1", totalSeconds: 1, bestSeconds: 1 }, { count: 0, totalSeconds: 0, bestSeconds: 0 }, { count: 1, totalSeconds: -1, bestSeconds: 0 }, { count: 1, totalSeconds: 1, bestSeconds: null }, { count: 1, totalSeconds: 0, bestSeconds: 1 }, { count: 1, totalSeconds: Number.MAX_SAFE_INTEGER + 1, bestSeconds: 0 }]) {
    assert.equal(timing.isPracticeTiming(value), false);
    assert.throws(() => timing.getPracticeTiming({ times: [10], timing: value }), /Invalid practice timing/);
  }
  assert.throws(() => timing.appendPracticeTime({ times: [] }, Infinity), /Invalid practice time/);
  assert.deepEqual(timing.appendPracticeTime({ times: [] }, 3.9).timing, { count: 1, totalSeconds: 3, bestSeconds: 3 });
});

test("signed-in storage reads owner-bound lifetime fields and refuses direct progress writes", async () => {
  const calls = [];
  let result = { attempts: 500, correct: 400, correct_times_ms: [1999, 3999], timing_count: 400, timing_total_seconds: 600, timing_best_seconds: 0, last_result: "correct", last_correct_at: null };
  const query = {
    select(columns) { calls.push(["select", columns]); return query; },
    eq(key, value) { calls.push([key, value]); return query; },
    async maybeSingle() { return { data: result, error: null }; },
  };
  const client = { from(table) { calls.push(["table", table]); return query; } };
  const storage = createSupabaseProgressStorage(client, "fixture-owner");
  const progress = await storage.getQuestionProgress(42);
  assert.deepEqual(progress.times, [1, 3]);
  assert.deepEqual(progress.timing, { count: 400, totalSeconds: 600, bestSeconds: 0 });
  assert.ok(calls.some(([key, value]) => key === "user_id" && value === "fixture-owner"));
  assert.match(calls.find(([key]) => key === "select")[1], /timing_count, timing_total_seconds, timing_best_seconds/);
  const before = calls.length;
  await assert.rejects(storage.saveQuestionProgress(42, progress), /verified practice attempt/);
  assert.equal(calls.length, before);
  result = { ...result, timing_count: undefined };
  await assert.rejects(storage.getQuestionProgress(42), /Unable to read practice timing/);
  result = { ...result, timing_count: 400, correct_times_ms: Array(101).fill(1000) };
  await assert.rejects(storage.getQuestionProgress(42), /Unable to read practice timing/);
});
