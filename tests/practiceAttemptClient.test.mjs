import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { withRequestTimeout } from "../lib/requestTimeout.ts";

const source = await readFile(new URL("../lib/services/practiceAttemptService.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
function fixture(initialOwner = "user-a") {
  const state = { owner: initialOwner, sessionError: false, sessionStalled: false, startsStalled: 0, resultsStalled: 0, bodiesStalled: 0, startsLost: 0, resultsLost: 0, startStatus: 200, resultStatus: 200, calls: [], uuid: 0, guestSaves: 0 };
  const result = { progress: { attempts: 1, correct: 1, times: [7], lastResult: "correct" }, levelChange: { level: 1, progress: 1, leveledUp: false }, isCorrect: true, tutorRevealToken: "fixture-token" };
  const exports = {};
  runInNewContext(`(function(exports,require){${outputText}\n})`, {
    crypto: { randomUUID: () => `request-${++state.uuid}` },
    fetch: async (url, init) => {
      const body = JSON.parse(init.body);
      state.calls.push({ url, body });
      if (url.endsWith("/attempt")) {
        if (state.startsStalled-- > 0) return new Promise(() => {});
        if (state.startsLost-- > 0) throw new Error("lost creation response");
        if (state.startStatus !== 200) return Response.json({ error: "fixture rejected attempt" }, { status: state.startStatus });
        return Response.json({ attemptId: `server-${body.requestId}` });
      }
      if (state.resultsStalled-- > 0) return new Promise(() => {});
      if (state.bodiesStalled-- > 0) return { ok: true, json: () => new Promise(() => {}) };
      if (state.resultsLost-- > 0) throw new Error("lost committed result response");
      if (state.resultStatus !== 200) return Response.json({ error: "fixture rejected result" }, { status: state.resultStatus });
      return Response.json(result);
    },
  })(exports, (name) => {
    if (name === "@/lib/requestTimeout") return { withRequestTimeout: (operation, options) => withRequestTimeout(operation, { ...options, timeoutMs: 20 }) };
    assert.equal(name, "@/lib/supabase/client");
    return { createClient: () => ({ auth: { getSession: async () => state.sessionStalled ? new Promise(() => {}) : ({ data: { session: state.owner ? { user: { id: state.owner } } : null }, error: state.sessionError ? {} : null }) } }) };
  });
  const guest = async () => { state.guestSaves++; return { ...result, tutorRevealToken: null }; };
  return { state, result, guest, create: exports.createPracticeAttempt };
}

test("display preparation and simultaneous Strict Mode preparation share one server attempt", async () => {
  const { create, state } = fixture();
  const attempt = create(42, true);
  assert.equal(state.calls.length, 0);
  await Promise.all([attempt.prepare(), attempt.prepare(), attempt.prepare()]);
  assert.equal(state.calls.length, 1);
  assert.deepEqual(state.calls[0].body, { questionId: 42, trainer: true, requestId: "request-1" });
});

test("stalled creation releases its in-flight promise and retries the same request ID", async () => {
  const { create, state } = fixture();
  const attempt = create(42, false);
  state.startsStalled = 1;
  await assert.rejects(attempt.prepare(), /took too long/);
  await attempt.prepare();
  assert.deepEqual(state.calls[0], state.calls[1]);
});

test("stalled save or response body unlocks Retry save without changing the accepted answer", async () => {
  for (const stalled of ["resultsStalled", "bodiesStalled"]) {
    const { create, state, guest } = fixture();
    const attempt = create(42, true);
    state[stalled] = 1;
    await assert.rejects(attempt.submit("C", 7, guest), /Retry save/);
    await assert.rejects(attempt.submit("A", 7, guest), /original answer/);
    await attempt.submit("C", 7, guest);
    const writes = state.calls.filter(({ url }) => url.endsWith("/result"));
    assert.deepEqual(writes[0], writes[1]);
  }
});

test("a stuck session check times out before a practice write", async () => {
  const { create, state, guest } = fixture();
  const attempt = create(42, true);
  state.sessionStalled = true;
  await assert.rejects(attempt.submit("C", 7, guest), /check your account/);
  assert.equal(state.calls.length, 0);
  state.sessionStalled = false;
  await attempt.submit("C", 7, guest);
  assert.equal(state.calls.length, 2);
});

test("a lost creation response retries the original request ID, not a new attempt", async () => {
  const { create, state } = fixture();
  state.startsLost = 1;
  const attempt = create(42, false);
  await assert.rejects(attempt.prepare(), /lost creation/);
  await attempt.prepare();
  assert.deepEqual(state.calls[0], state.calls[1]);
});

test("a lost committed result retries identical answer/time/id and cannot change to give-up", async () => {
  const { create, state, guest, result } = fixture();
  const attempt = create(42, true);
  await attempt.prepare();
  state.resultsLost = 1;
  await assert.rejects(attempt.submit("C", 7, guest), /lost committed/);
  for (const [answer, time] of [["A", 7], [null, 7], ["C", 8]]) await assert.rejects(attempt.submit(answer, time, guest), /original answer/);
  assert.deepEqual(await attempt.submit("C", 7, guest), result);
  const writes = state.calls.filter(({ url }) => url.endsWith("/result"));
  assert.equal(writes.length, 2);
  assert.deepEqual(writes[0], writes[1]);
  assert.equal(writes[0].body.attemptId, "server-request-1");
  await attempt.submit("C", 7, guest);
  assert.equal(state.calls.length, 3);
});

test("double-click saves deduplicate in flight and new manual attempts and tabs stay independent", async () => {
  const { create, state, guest } = fixture();
  const first = create(42, false);
  await first.prepare();
  await Promise.all([first.submit("C", 7, guest), first.submit("C", 7, guest)]);
  assert.equal(state.calls.filter(({ url }) => url.endsWith("/result")).length, 1);
  const second = create(42, false);
  const otherTab = create(42, true);
  await Promise.all([second.prepare(), otherTab.prepare()]);
  await second.submit("C", 7, guest);
  const starts = state.calls.filter(({ url }) => url.endsWith("/attempt"));
  assert.equal(new Set(starts.map(({ body }) => body.requestId)).size, 3);
  assert.equal(state.calls.filter(({ url }) => url.endsWith("/result")).length, 2);
});

test("expired/conflicting attempts cannot auto-mint a replacement, but transient limits can retry", async () => {
  for (const status of [400, 409, 410]) {
    const { create, state, guest } = fixture();
    const attempt = create(42, true);
    state.startStatus = status;
    await assert.rejects(attempt.prepare(), /rejected attempt/);
    state.startStatus = 200;
    await assert.rejects(attempt.submit("C", 7, guest), /rejected attempt/);
    assert.equal(state.calls.length, 1);
  }
  const { create, state, guest } = fixture();
  const attempt = create(42, true);
  state.resultStatus = 429;
  await assert.rejects(attempt.submit("C", 7, guest), /rejected result/);
  state.resultStatus = 200;
  await attempt.submit("C", 7, guest);
  assert.equal(state.calls.filter(({ url }) => url.endsWith("/attempt")).length, 1);
});

test("guests stay local and their retries increment local progress only once", async () => {
  const { create, state, guest } = fixture(null);
  const attempt = create(42, true);
  await Promise.all([attempt.prepare(), attempt.prepare()]);
  await Promise.all([attempt.submit(null, 10, guest), attempt.submit(null, 10, guest)]);
  await attempt.submit(null, 10, guest);
  assert.equal(state.guestSaves, 1);
  assert.equal(state.calls.length, 0);
});

test("account switches, login/logout mid-question, and auth errors fail without saving to another identity", async () => {
  for (const [before, after] of [["user-a", "user-b"], ["user-a", null], [null, "user-a"]]) {
    const { create, state, guest } = fixture(before);
    const attempt = create(42, false);
    await attempt.prepare();
    state.owner = after;
    await assert.rejects(attempt.submit("C", 7, guest), /account changed/);
    assert.equal(state.calls.filter(({ url }) => url.endsWith("/result")).length, 0);
    assert.equal(state.guestSaves, 0);
  }
  const { create, state, guest } = fixture();
  state.sessionError = true;
  await assert.rejects(create(42, true).submit("C", 7, guest), /check your account/);
  assert.equal(state.calls.length, 0);
});

test("UI keeps solution/next separate from pending saves and wires per-display attempts", async () => {
  const trainer = await readFile(new URL("../app/practice/trainer/TrainerClient.tsx", import.meta.url), "utf8");
  const card = await readFile(new URL("../components/trainer/TrainerQuestion.tsx", import.meta.url), "utf8");
  const bank = await readFile(new URL("../app/practice/question-bank/[id]/QuestionClient.tsx", import.meta.url), "utf8");
  assert.match(trainer, /submitted=\{submitted\}\s+saving=\{isSaving\}/);
  assert.match(trainer, /openAttempt\(firstQuestion\)/);
  assert.match(trainer, /openAttempt\(nextQuestion\)/);
  assert.match(card, /<SolutionPanel\s+submitted=\{submitted\}/);
  assert.match(card, /\{submitted && \(/);
  assert.match(card, /answerLocked \? "Retry save"/);
  assert.match(bank, /attempt\.current \?\?= createPracticeAttempt/);
  assert.match(bank, /pending\.current \?\?=/);
});
