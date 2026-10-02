import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import * as timing from "../lib/practiceTiming.ts";
import { withRequestTimeout } from "../lib/requestTimeout.ts";
import { questionReadError } from "../lib/questionReadError.ts";
async function load(path, dependencies) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  runInNewContext(`(function(exports,require){${code}\n})`, { Error, Date })(exports, name => {
    assert.ok(name in dependencies, name); return dependencies[name];
  });
  return exports;
}
const contract = await load("lib/questionState.ts", { "@/lib/practiceTiming": timing });
const progress = () => ({ attempts: 7, correct: 3, lastResult: "correct", lastCorrectAt: 1770000000000,
  timing: { count: 3, totalSeconds: 45, bestSeconds: 10 } });
const snapshot = () => ({ userId: "first", questionId: 10001, progress: progress(), bookmarked: true });
async function fixture() {
  const state = { owner: "first", calls: [], authCalls: 0, error: null, authError: false, throwAt: null, stall: null, switchOwner: false, value: snapshot(), committed: false, lost: false };
  const client = {
    auth: { getSession: async () => {
      state.authCalls++;
      if (state.throwAt === "auth") throw new Error("private auth detail");
      if (state.stall === "auth") return new Promise(() => {});
      return { data: { session: state.owner ? { user: { id: state.owner } } : null }, error: state.authError ? {} : null };
    } },
    rpc(name, args) { return { abortSignal: async signal => {
      state.calls.push({ name, args, signal });
      if (state.throwAt === "read") throw new Error("private query detail");
      if (state.stall === "read") return new Promise(() => {});
      if (state.switchOwner) state.owner = "second";
      return { data: state.value, error: state.error };
    } }; },
    from(table) {
      const spec = { table };
      return {
        upsert(row, options) { Object.assign(spec, { action: "upsert", row, options }); return this; },
        delete() { spec.action = "delete"; return this; },
        eq(key, value) { spec[key] = value; return this; },
        async abortSignal(signal) {
          state.calls.push({ ...spec, signal });
          if (state.throwAt === "write") throw new Error("private write detail");
          state.committed = spec.action === "upsert";
          if (state.stall === "write") return new Promise(() => {});
          if (state.switchOwner) state.owner = "second";
          return { error: state.lost ? { message: "lost response" } : state.error };
        },
      };
    },
  };
  const service = await load("lib/services/questionStateService.ts", {
    "@/lib/supabase/client": { createClient: () => client },
    "@/lib/requestTimeout": { withRequestTimeout: (work, options) => withRequestTimeout(work, { ...options, timeoutMs: 25 }) },
    "@/lib/questionState": contract, "@/lib/questionReadError": { questionReadError },
    "@/lib/storage/progress/memoryProgressStorage": { memoryProgressStorage: { getQuestionProgress: async () => ({ ...progress(), times: [10,15,20] }) } },
    "@/lib/storage/bookmarks/memoryBookmarkStorage": { memoryBookmarkStorage: { isBookmarked: async () => state.committed }, setMemoryQuestionBookmark: (_id, value) => { state.committed = value; } },
  });
  return { state, ...service };
}

test("question snapshot confirms owner/id and valid compact lifetime metrics", () => {
  const parsed = contract.parseQuestionState(snapshot(), 10001, "first");
  assert.equal(parsed.progress.timing.totalSeconds, 45);
  assert.equal(parsed.progress.times.length, 0);
  for (const mutate of [v => { v.userId = "second"; }, v => { v.questionId++; }, v => { v.bookmarked = 1; },
    v => { v.progress.attempts = -1; }, v => { v.progress.correct = 8; }, v => { v.progress.timing = null; },
    v => { v.progress.timing.count = 99; }, v => { v.progress.lastResult = "unknown"; }, v => { v.progress.lastCorrectAt = NaN; }]) {
    const value = snapshot(); mutate(value); assert.throws(() => contract.parseQuestionState(value, 10001, "first"));
  }
});
test("question state uses one data RPC and rechecks identity without remote getUser", async () => {
  const f = await fixture(); const result = await f.getQuestionState(10001);
  assert.equal(result.bookmarked, true); assert.equal(result.progress.attempts, 7);
  assert.equal(f.state.calls.length, 1); assert.equal(f.state.calls[0].name, "get_question_state");
  assert.equal(f.state.authCalls, 2);
  f.state.switchOwner = true; await assert.rejects(f.getQuestionState(10001), /account/);
  f.state.owner = "first"; f.state.error = {code:"42501"};
  await assert.rejects(f.getQuestionState(10001),error=>error instanceof f.QuestionStateAccountError);
});
test("read errors, malformed snapshots and deadlines never fabricate zero progress", async () => {
  for (const stall of ["auth", "read"]) {
    const f = await fixture(); f.state.stall = stall;
    await assert.rejects(f.getQuestionState(10001), /TIMEOUT/);
    assert.ok(f.state.calls.every(call => call.signal.aborted));
  }
  const f = await fixture(); f.state.error = { code: "42501", message: "private SQL token=secret" };
  await assert.rejects(f.getQuestionState(10001), /QB-DETAIL-PERMISSION/);
  f.state.error = null; f.state.value = null;
  await assert.rejects(f.getQuestionState(10001), /QB-DETAIL-INVALID/);
  const controller = new AbortController(); controller.abort(); const count = f.state.calls.length;
  await assert.rejects(f.getQuestionState(10001, controller.signal)); assert.equal(f.state.calls.length, count);
});
test("bookmark retries repeat explicit add/remove after a lost committed response", async () => {
  const f = await fixture();
  for (const desired of [true, false]) {
    f.state.lost = true;
    await assert.rejects(f.setQuestionBookmark(10001, desired, "first"), /confirm/);
    assert.equal(f.state.committed, desired);
    f.state.lost = false;
    assert.equal(await f.setQuestionBookmark(10001, desired, "first"), desired);
    assert.equal(f.state.committed, desired);
    const [first, second] = f.state.calls.slice(-2);
    assert.deepEqual({ ...first, signal: null }, { ...second, signal: null });
    if (desired) assert.equal(first.options.ignoreDuplicates, true);
    else assert.equal(first.user_id, "first");
  }
  assert.equal(f.state.calls.length, 4, "no bookmark read before a write or automatic retry");
});
test("bookmark owner binding, auth errors and complete write deadlines", async () => {
  const f = await fixture();
  await assert.rejects(f.setQuestionBookmark(10001, true, "other"), /account/); assert.equal(f.state.calls.length, 0);
  f.state.authError = true;
  await assert.rejects(f.setQuestionBookmark(10001, true, "first"), /account/); assert.equal(f.state.calls.length, 0);
  f.state.authError = false; f.state.stall = "write";
  await assert.rejects(f.setQuestionBookmark(10001, true, "first"), /in time/);
  assert.equal(f.state.calls[0].signal.aborted, true);
  f.state.stall = null; f.state.switchOwner = true;
  await assert.rejects(f.setQuestionBookmark(10001, true, "first"), /account/);
});
test("guest state and explicit bookmarks stay local and do not migrate on sign-in", async () => {
  const f = await fixture(); f.state.owner = null;
  assert.equal((await f.getQuestionState(10001)).progress.attempts, 7);
  await f.setQuestionBookmark(10001, true, null); await f.setQuestionBookmark(10001, true, null);
  assert.equal((await f.getQuestionState(10001)).bookmarked, true);
  await f.setQuestionBookmark(10001, false, null); assert.equal(f.state.committed, false);
  f.state.owner = "first";
  await assert.rejects(f.setQuestionBookmark(10001, true, null), /account/); assert.equal(f.state.calls.length, 0);
});
test("unexpected transport exceptions expose only safe error text", async () => {
  for (const point of ["auth","read","write"]) {
    const f=await fixture(); f.state.throwAt=point;
    await assert.rejects(point==="write"?f.setQuestionBookmark(10001,true,"first"):f.getQuestionState(10001),error=>!error.message.includes("private"));
  }
});
test("safe listing error references identify the read and category without leaking diagnostics", () => {
  for (const [code, category] of [["42501","PERMISSION"],["42703","SCHEMA"],["PGRST202","SCHEMA"],["PGRST301","AUTH"],[undefined,"REQUEST"]]) {
    const error = questionReadError("BOOKMARKS", { code, message: "secret SQL", details: "user-id" });
    assert.match(error.message, new RegExp(`QB-BOOKMARKS-${category}`));
    assert.doesNotMatch(error.message, /secret|SQL|user-id/);
  }
});
test("question page has no extra server auth gate and guest answer checks use the displayed question", async () => {
  const page = await readFile(new URL("../app/practice/question-bank/[id]/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(page, /supabase|auth\.getUser/);
  const service = await load("lib/services/progressService.ts", {
    "@/lib/supabase/client": { createClient: () => { throw new Error("Unexpected auth"); } },
    "@/lib/storage/progress/memoryProgressStorage": { memoryProgressStorage: {
      getQuestionProgress: async () => ({ attempts: 0, correct: 0, times: [], lastCorrectAt: null }),
      saveQuestionProgress: async (_id, value) => value,
    } },
    "@/lib/storage/levels/memoryLevelStorage": { memoryLevelStorage: {} },
    "@/lib/storage/progress/supabaseProgressStorage": {}, "@/lib/practiceTiming": timing,
  });
  const attempt = { questionId: 10001, trainer: false, submit: async (_answer, _time, guest) => guest() };
  assert.equal((await service.saveQuestionAttempt(10001, "A", 3, attempt, { id: 10001, answer: "A" })).isCorrect, true);
  assert.equal((await service.saveQuestionGiveUp(10001, attempt, { id: 10001, answer: "A" })).progress.lastResult, "give-up");
});
