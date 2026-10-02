import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { muQuestions } from "../data/questions/mu.ts";
import { alphaQuestions } from "../data/questions/alpha.ts";
import { thetaQuestions } from "../data/questions/theta.ts";
import { selectNextTrainerQuestion } from "../lib/trainer.ts";
import { withRequestTimeout } from "../lib/requestTimeout.ts";
import { createApiObserver } from "../lib/apiMetrics.ts";

const questions = [...muQuestions, ...alphaQuestions, ...thetaQuestions];
const metadata = questions.map(({ id, number, division, topic, difficulty }) => ({ id, number, division, topic, difficulty }));
async function load(path, dependencies = {}, globals = {}) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
  const exports = {};
  runInNewContext(`(function(exports,require){${outputText}\n})`, { AbortController, Response, URL, ...globals })(exports, name => {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  });
  return exports;
}

test("Trainer metadata and single-question delivery preserve original catalog content and order", async () => {
  const catalog = await load("lib/trainerCatalog.ts", { "server-only": {}, "@/data/questions": { questions } });
  assert.equal(JSON.stringify(catalog.getTrainerItems()), JSON.stringify(metadata));
  assert.ok(JSON.stringify(metadata).length < JSON.stringify(questions).length / 5);
  const { GET } = await load("app/api/practice/trainer/question/route.ts", { "@/lib/trainerCatalog": catalog, "@/lib/serverPerformance": { observeApi: createApiObserver() } });
  for (const question of questions) {
    const response = await GET(new Request(`https://example.test/api/practice/trainer/question?id=${question.id}`));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(await response.json(), { question });
  }
  for (const query of ["", "id=0", "id=-1", "id=1e4", "id=10001&id=10002", "id=01", "id=9999999999999999999"]) {
    assert.equal((await GET(new Request(`https://example.test/?${query}`))).status, 400);
  }
  assert.equal((await GET(new Request("https://example.test/?id=9999999"))).status, 404);
});

test("960 seeded selections match the pre-refactor algorithm across all divisions and eight progress scenarios", async () => {
  // Golden digest recorded and compared against a7cad0c:lib/trainer.ts before
  // refactoring. Includes cooldown fallback, topic weights, session retries,
  // starting/target difficulties, challenge questions and previous exclusion.
  let seed = 1;
  const math = Object.create(Math);
  math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
  const { selectNextTrainerQuestion: select } = await load("lib/trainer.ts", {}, { Math: math });
  const now = 1800000000000;
  const selected = [];
  for (const division of ["Mu", "Alpha", "Theta"]) for (let scenario = 0; scenario < 8; scenario++) {
    const group = questions.filter(q => q.division === division);
    const progress = new Map(group.filter((_, i) => scenario !== 0 && (scenario === 1 || i % 3 !== 0)).map((q, i) => [q.id, {
      attempts: scenario === 1 ? 1 : i % 10 + 1, correct: scenario === 1 ? 1 : i % 4,
      lastResult: scenario === 1 ? "correct" : ["correct", "incorrect", "give-up", null][i % 4],
      lastCorrectAt: scenario === 1 ? now : now - (i % 3) * 30 * 86400000,
    }]));
    const options = { division, previousQuestionId: scenario > 1 ? group[0].id : null,
      targetDifficulty: scenario > 2 ? scenario % 5 + 1 : null, forceChallenge: scenario === 6,
      sessionResults: scenario > 3 ? group.slice(0, scenario === 7 ? group.length : 12).map((q, i) => ({ questionId: q.id, result: i % 2 ? "correct" : "incorrect" })) : [] };
    for (let trial = 1; trial <= 40; trial++) { seed = trial; selected.push(select(metadata, progress, options, now)?.id ?? null); }
  }
  assert.equal(createHash("sha256").update(JSON.stringify(selected)).digest("hex"), "69e4629c259bf8bfa25d9e5c9a81ca3448c57b9ca1789b7c355881f4ae8a8043");
  assert.equal(select([], new Map(), { division: "Mu" }), null);
  assert.equal(select(metadata.slice(0, 1), new Map(), { division: "Mu", previousQuestionId: metadata[0].id }), null);
});

async function selectionFixture() {
  const items = Array.from({ length: 1105 }, (_, i) => ({ id: i + 1, number: i + 1, division: "Mu", topic: "Calculus", difficulty: 2 }));
  const state = { owner: "first", authError: false, calls: [], fetches: [], progress: [], level: { level: 4, progress: 7 },
    guest: new Map(), fail: null, stall: null, switchDuringRead: false, switchDuringBody: false, mismatch: false };
  const supabase = {
    auth: { getSession: async () => state.stall === "auth" ? new Promise(() => {}) : ({ data: { session: state.owner ? { user: { id: state.owner } } : null }, error: state.authError ? {} : null }) },
    from(table) {
      const spec = { table };
      const query = {
        select(fields) { spec.fields = fields; return this; },
        eq(key, owner) { assert.equal(key, "user_id"); spec.owner = owner; return this; },
        gte(key, value) { assert.equal(key, "question_id"); spec.min = value; return this; },
        lte(key, value) { assert.equal(key, "question_id"); spec.max = value; return this; },
        order(key) { assert.equal(key, "question_id"); return this; },
        range(start, end) { spec.start = start; spec.end = end; return this; },
        maybeSingle() { return this; },
        abortSignal(signal) { spec.signal = signal; return this; },
        then(resolve, reject) {
          state.calls.push(spec);
          if (state.stall === table) return new Promise(() => {}).then(resolve, reject);
          if (state.switchDuringRead) state.owner = "second";
          const data = table === "user_levels" ? state.level : state.progress.filter(row => row.user_id === spec.owner && row.question_id >= spec.min && row.question_id <= spec.max)
            .sort((a, b) => a.question_id - b.question_id).slice(spec.start, spec.end + 1);
          return Promise.resolve({ data, error: state.fail === table ? {} : null }).then(resolve, reject);
        },
      };
      return query;
    },
  };
  const service = await load("lib/services/trainerSelectionService.ts", {
    "@/lib/supabase/client": { createClient: () => supabase },
    "@/lib/storage/progress/memoryProgressStorage": { getMemoryProgressSnapshot: () => state.guest },
    "@/lib/storage/levels/memoryLevelStorage": { memoryLevelStorage: { getLevelProgress: async () => ({ level: 2, progress: 3 }) } },
    "@/lib/storage/levels/levelStorage": { createDefaultLevel: () => ({ level: 1, progress: 0 }) },
    "@/lib/trainer": { selectNextTrainerQuestion },
    "@/lib/requestTimeout": { withRequestTimeout: (operation, options) => withRequestTimeout(operation, { ...options, timeoutMs: 40 }) },
  }, {
    fetch: async (url, init) => {
      state.fetches.push({ url, signal: init.signal });
      if (state.stall === "fetch") return new Promise(() => {});
      if (state.fail === "fetch") return Response.json({}, { status: 500 });
      return { ok: true, json: async () => {
        if (state.stall === "body") return new Promise(() => {});
        if (state.switchDuringBody) state.owner = "second";
        const id = Number(new URL(url, "https://fixture.test").searchParams.get("id"));
        return { question: { ...items[id - 1], id: state.mismatch ? 999999 : id, methods: [], question: "Fixture question", choices: ["One", "Two"], answer: "A", solution: "Fixture solution" } };
      } };
    },
  });
  return { state, items, read: service.getNextTrainerSelection };
}

test("Trainer batches 1105 rows into three scoped reads, omits timing arrays, and reads level only at start", async () => {
  const { state, items, read } = await selectionFixture();
  state.progress = items.map(q => ({ user_id: "first", question_id: q.id, attempts: 4, correct: 3, last_result: "incorrect", last_correct_at: null }));
  state.progress.push({ ...state.progress[0], user_id: "second" });
  const result = await read(items, { division: "Mu" }, { includeLevel: true });
  assert.equal(result.userId, "first");
  assert.deepEqual(result.level, { level: 4, progress: 7 });
  assert.equal(state.calls.filter(c => c.table === "question_progress").length, 3);
  assert.equal(state.calls.filter(c => c.table === "user_levels").length, 1);
  assert.ok(state.calls.every(c => c.owner === "first" && !c.fields.includes("times")));
  assert.equal(state.fetches.length, 1);
  state.calls = [];
  await read(items.slice(0, 418), { division: "Mu" }, { expectedUserId: "first" });
  assert.equal(state.calls.length, 1, "418 per-question requests become one progress query");
  state.level = null;
  assert.deepEqual((await read(items.slice(0, 2), { division: "Mu" }, { includeLevel: true })).level, { level: 1, progress: 0 });
});

test("Trainer uses saved cooldown fields, including beyond 1000 rows and sparse metadata", async () => {
  const { state, items, read } = await selectionFixture();
  state.progress = items.map(q => ({ user_id: "first", question_id: q.id, attempts: 1, correct: 1, last_result: "correct", last_correct_at: new Date().toISOString() }));
  state.progress.at(-1).last_result = "give-up";
  assert.equal((await read(items, { division: "Mu" })).question.id, 1105);
  assert.equal((await read([items[0], items.at(-1)], { division: "Mu" })).question.id, 1105);
  state.owner = null;
  state.guest.set(1, { attempts: 1, correct: 1, lastResult: "correct", lastCorrectAt: Date.now() });
  state.calls = [];
  const result = await read(items.slice(0, 2), { division: "Mu" }, { includeLevel: true, expectedUserId: null });
  assert.equal(result.question.id, 2);
  assert.deepEqual(result.level, { level: 2, progress: 3 });
  assert.equal(result.userId, null);
  assert.equal(state.calls.length, 0);
});

test("failed reads, wrong question payloads, and account changes do not return a fresh-looking Trainer session", async () => {
  for (const change of [s => { s.authError = true; }, s => { s.fail = "question_progress"; }, s => { s.fail = "user_levels"; }, s => { s.fail = "fetch"; },
    s => { s.switchDuringRead = true; }, s => { s.switchDuringBody = true; }, s => { s.mismatch = true; }]) {
    const { state, items, read } = await selectionFixture(); change(state);
    await assert.rejects(read(items, { division: "Mu" }, { includeLevel: true }));
  }
  for (const expectedUserId of ["second", null]) {
    const { state, items, read } = await selectionFixture();
    await assert.rejects(read(items, { division: "Mu" }, { expectedUserId }), /account changed/);
    assert.equal(state.calls.length + state.fetches.length, 0);
  }
});

test("Trainer times out through response-body reads, cancels siblings and honors unmount cancellation", async () => {
  for (const stall of ["auth", "question_progress", "user_levels", "fetch", "body"]) {
    const { state, items, read } = await selectionFixture(); state.stall = stall;
    await assert.rejects(read(items, { division: "Mu" }, { includeLevel: true }), /took too long/);
    assert.ok([...state.calls, ...state.fetches].every(c => c.signal.aborted));
  }
  const { state, items, read } = await selectionFixture();
  const controller = new AbortController(); controller.abort();
  await assert.rejects(read(items, { division: "Mu" }, { signal: controller.signal }));
  assert.equal(state.calls.length + state.fetches.length, 0);
  state.fail = "question_progress"; state.stall = "user_levels";
  await assert.rejects(read(items, { division: "Mu" }, { includeLevel: true }), /progress/);
  assert.ok(state.calls.every(c => c.signal.aborted));
});

test("Trainer summary/selector do not import full questions; guest checking uses the displayed question", async () => {
  for (const path of ["lib/trainer.ts", "components/trainer/TrainerSummary.tsx", "app/practice/trainer/TrainerClient.tsx"]) {
    assert.doesNotMatch(await readFile(new URL(`../${path}`, import.meta.url), "utf8"), /from ["']@\/data\/questions/);
  }
  let saved = 0;
  const { saveVerifiedTrainerResult } = await load("lib/services/progressService.ts", {
    "@/lib/supabase/client": {}, "@/lib/storage/progress/supabaseProgressStorage": {},
    "@/lib/storage/progress/memoryProgressStorage": { memoryProgressStorage: {
      getQuestionProgress: async () => ({ attempts: 0, correct: 0, times: [], lastResult: null, lastCorrectAt: null }),
      saveQuestionProgress: async (_id, value) => { saved++; return value; },
    } },
    "@/lib/storage/levels/memoryLevelStorage": { memoryLevelStorage: { applyTrainerResult: async () => ({ level: 1, progress: 1 }) } },
    "@/lib/practiceTiming": { appendPracticeTime: () => ({ times: [3] }) },
  });
  const attempt = { questionId: 1, trainer: true, submit: async (_answer, _time, guest) => guest() };
  assert.equal((await saveVerifiedTrainerResult(1, "A", 3, attempt, { id: 1, answer: "A" })).isCorrect, true);
  assert.equal(saved, 1);
  await assert.rejects(saveVerifiedTrainerResult(1, "A", 3, attempt, { id: 2, answer: "A" }), /not found/);
  assert.equal(saved, 1);
});

test("session history cannot be written to an account different from the Trainer selection owner", async () => {
  let saves = 0;
  const storage = { saveSession: async () => { saves++; return []; } };
  const { saveTrainerSession } = await load("lib/services/trainerHistoryService.ts", {
    "@/lib/requestTimeout": { withRequestTimeout },
    "@/lib/supabase/client": { createClient: () => ({ auth: { getSession: async () => ({ data: { session: { user: { id: "second" } } }, error: null }) } }) },
    "@/lib/storage/trainerHistory/memoryTrainerHistoryStorage": { memoryTrainerHistoryStorage: storage },
    "@/lib/storage/trainerHistory/supabaseTrainerHistoryStorage": { createSupabaseTrainerHistoryStorage: () => storage },
  });
  for (const owner of ["first", null]) await assert.rejects(saveTrainerSession({}, owner), /account changed/);
  assert.equal(saves, 0);
  await saveTrainerSession({}, "second");
  assert.equal(saves, 1);
});
