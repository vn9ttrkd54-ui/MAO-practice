import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { alphaQuestions } from "../data/questions/alpha.ts";
import { muQuestions } from "../data/questions/mu.ts";
import { thetaQuestions } from "../data/questions/theta.ts";
import { toQuestionBankItem, filterQuestionBankItems, encodeQuestionSequence, decodeQuestionSequence, questionBankNavigation, questionBankReturnTo, questionBankHref } from "../lib/questionBankListing.ts";
import { withRequestTimeout } from "../lib/requestTimeout.ts";
import { questionReadError } from "../lib/questionReadError.ts";

const catalog = [...muQuestions, ...alphaQuestions, ...thetaQuestions];
test("division metadata preserves every label/id/filter field and excludes full question content", () => {
  for (const group of [muQuestions, alphaQuestions, thetaQuestions]) {
    const items = group.map(toQuestionBankItem);
    assert.deepEqual(items.map(item => item.id), group.map(item => item.id));
    for (const [index, item] of items.entries()) {
      assert.deepEqual(Object.keys(item).sort(), ["id", "number", "division", "topic", "difficulty", "methods"].sort());
      for (const key of Object.keys(item)) assert.deepEqual(item[key], group[index][key]);
    }
    assert.ok(JSON.stringify(items).length < JSON.stringify(group).length / 3);
    for (const topic of new Set(["All Topics", ...items.map(item => item.topic)])) {
      for (const difficulty of ["All Difficulties", "1", "3", "5"]) {
        const result = filterQuestionBankItems(items, { topic, difficulty, method: "All Methods" });
        const old = group.filter(q => (topic === "All Topics" || q.topic === topic) && (difficulty === "All Difficulties" || q.difficulty === Number(difficulty)));
        assert.deepEqual(result.map(q => q.id), old.map(q => q.id));
      }
    }
    for (const method of new Set(items.flatMap(item => item.methods))) {
      assert.deepEqual(filterQuestionBankItems(items, { topic: "All Topics", difficulty: "All Difficulties", method }).map(q => q.id), group.filter(q => q.methods.includes(method)).map(q => q.id));
    }
  }
});

test("compact and legacy sequences preserve exact filtered order and next/previous boundaries", () => {
  for (const division of ["Mu", "Alpha", "Theta"]) {
    const ids = catalog.filter(q => q.division === division).sort((a, b) => a.number - b.number).map(q => q.id);
    for (const filtered of [ids, ids.filter((_, n) => n % 3 === 0), ids.slice(4, 30), [ids[4]], [...ids.slice(0, 12)].reverse()]) {
      const compact = encodeQuestionSequence(filtered);
      assert.deepEqual(decodeQuestionSequence(compact, ids), filtered);
      assert.deepEqual(decodeQuestionSequence(filtered.join(","), ids), filtered);
      for (const [index, id] of filtered.entries()) {
        const navigation = questionBankNavigation(id, ids, compact);
        assert.equal(navigation.previousId, filtered[index - 1] ?? null);
        assert.equal(navigation.nextId, filtered[index + 1] ?? null);
      }
    }
    assert.equal(questionBankNavigation(ids[0], ids).nextId, ids[1]);
    assert.equal(questionBankNavigation(ids[1], ids).previousId, ids[0]);
    assert.equal(questionBankNavigation(ids.at(-1), ids).nextId, null);
  }
  const ids = Array.from({ length: 1000 }, (_, index) => 10001 + index);
  assert.equal(encodeQuestionSequence(ids), "10001-11000");
  assert.ok(questionBankHref(ids[0], "/practice/question-bank/mu").length < 120);
});

test("invalid, huge, duplicated, unknown and cross-division sequences fall back safely", () => {
  const ids = [10001, 10002, 10003];
  for (const value of [undefined, "", "0", "10001,", "10001,10001", "10001-99999999999999999999", "10003-10001", "10001-10004", "10001,20001", "1e4", "<script>", "1".repeat(65537)]) {
    assert.equal(decodeQuestionSequence(value, ids), null);
    assert.equal(questionBankNavigation(10002, ids, value).nextId, 10003);
  }
  assert.equal(questionBankNavigation(10002, ids, "10001,10003").previousId, 10001);
  for (const raw of ["https://evil.test/practice/question-bank/mu", "//evil.test", "javascript:alert(1)", "/practice/question-bank/mu/elsewhere", "/practice/question-bank/alpha"]) {
    assert.equal(questionBankReturnTo(raw, "Mu"), "/practice/question-bank/mu");
  }
  assert.equal(questionBankReturnTo("/practice/question-bank/mu?topic=Calculus&shown=240", "Mu"), "/practice/question-bank/mu?topic=Calculus&shown=240");
});

test("bank and question clients do not statically import the full catalog or catalog-backed utilities", async () => {
  for (const path of ["components/practice/QuestionBankDivisionClient.tsx", "app/practice/question-bank/[id]/QuestionClient.tsx", "lib/questionBankListing.ts"]) {
    const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /from ["']@\/(data\/questions|lib\/(filters|questions))["']/);
  }
  for (const division of ["mu", "alpha", "theta"]) {
    const page = await readFile(new URL(`../app/practice/question-bank/${division}/page.tsx`, import.meta.url), "utf8");
    assert.match(page, /items=\{getQuestionBankListing/);
  }
});

const serviceSource = await readFile(new URL("../lib/services/questionBankUserDataService.ts", import.meta.url), "utf8");
const serverSource = await readFile(new URL("../lib/questionBankServer.ts", import.meta.url), "utf8");
const server = {};
runInNewContext(`(function(exports,require){${ts.transpileModule(serverSource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText}\n})`, { AbortController })(server, name => { assert.equal(name, "server-only"); return {}; });
class AccountError extends Error {}
function fixture() {
  const state = { owner: "first", authError: false, fail: false, stall: false, switchDuringRead: false, calls: [], progress: [], bookmarks: [], guest: new Map() };
  const supabase = {
    auth: { getSession: async () => ({ data: { session: state.owner ? { user: { id: state.owner } } : null }, error: state.authError ? {} : null }) },
    from(table) {
      const spec = { table };
      const query = {
        select(fields) { spec.fields = fields; return this; },
        eq(key, value) { assert.equal(key, "user_id"); spec.owner = value; return this; },
        gte(key, value) { assert.equal(key, "question_id"); spec.min = value; return this; },
        lte(key, value) { assert.equal(key, "question_id"); spec.max = value; return this; },
        order(key) { assert.equal(key, "question_id"); return this; },
        range(start, end) { spec.start = start; spec.end = end; return this; },
        abortSignal(signal) { spec.signal = signal; return this; },
        then(resolve, reject) {
          state.calls.push(spec);
          if (state.stall) return new Promise(() => {}).then(resolve, reject);
          if (state.switchDuringRead) state.owner = "second";
          const rows = (table === "question_progress" ? state.progress : state.bookmarks)
            .filter(row => row.user_id === spec.owner && row.question_id >= spec.min && row.question_id <= spec.max)
            .sort((a, b) => a.question_id - b.question_id).slice(spec.start, spec.end + 1);
          return Promise.resolve({ data: rows, error: state.fail ? {} : null }).then(resolve, reject);
        },
      };
      return query;
    },
  };
  const dependencies = {
    "@/lib/questionReadError": { questionReadError },
    "@/lib/supabase/client": { createClient: () => supabase },
    "@/lib/services/questionBankReadTransport": {
      QuestionBankReadAccountError: AccountError,
      questionBankOwner: () => { if (state.authError) throw new AccountError(); return state.owner; },
      readQuestionBankState: async (params, owner, signal) => {
        const result = await server.readQuestionBankListing(supabase, owner, Number(params.get("min")), Number(params.get("max")), signal);
        if (state.owner !== owner) throw new AccountError();
        return result;
      },
    },
    "@/lib/storage/bookmarks/memoryBookmarkStorage": { getMemoryBookmarkIds: () => [2, 99] },
    "@/lib/storage/progress/memoryProgressStorage": { getMemoryProgressSnapshot: () => state.guest },
    "@/lib/requestTimeout": { withRequestTimeout: (operation, options) => withRequestTimeout(operation, { ...options, timeoutMs: 30 }) },
  };
  const exports = {};
  const { outputText } = ts.transpileModule(serviceSource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
  runInNewContext(`(function(exports,require){${outputText}\n})`, { AbortController, URLSearchParams })(exports, name => {
    assert.ok(dependencies[name], name);
    return dependencies[name];
  });
  return { state, read: exports.getQuestionBankUserData };
}

test("progress reads paginate beyond 1000 rows and stay scoped to the signed-in account and requested ids", async () => {
  const { state, read } = fixture();
  const ids = Array.from({ length: 1105 }, (_, index) => index + 1);
  state.progress = ids.map(question_id => ({ user_id: "first", question_id, last_result: "correct" }));
  state.bookmarks = ids.map(question_id => ({ user_id: "first", question_id }));
  state.progress.push({ user_id: "second", question_id: 2, last_result: "incorrect" });
  const result = await read(ids);
  assert.equal(result.userId, "first");
  assert.equal(Object.keys(result.statuses).length, 1105);
  assert.equal(result.statuses[1105], "solved");
  assert.equal(result.statuses[2], "solved");
  assert.equal(result.bookmarkedQuestionIds.length, 1105);
  assert.equal(state.calls.length, 6);
  assert.ok(state.calls.every(call => call.owner === "first" && call.end - call.start === 499));
  const sparse = await read([1, 1105]);
  assert.deepEqual(Object.keys(sparse.statuses), ["1", "1105"]);
  assert.equal(sparse.bookmarkedQuestionIds.length, 2);
});

test("progress failures, changed identities and timeouts never return an all-new success snapshot", async () => {
  for (const flag of ["authError", "fail", "stall", "switchDuringRead"]) {
    const { state, read } = fixture(); state[flag] = true;
    await assert.rejects(read([1, 2]));
    if (flag === "stall") assert.ok(state.calls.every(call => call.signal.aborted));
  }
  const { read, state } = fixture();
  const controller = new AbortController(); controller.abort();
  await assert.rejects(read([1], controller.signal));
  assert.equal(state.calls.length, 0);
});

test("guest progress/bookmarks remain local and retain solved/attempted status", async () => {
  const { state, read } = fixture();
  state.owner = null;
  state.guest.set(1, { lastResult: "correct" });
  state.guest.set(2, { lastResult: "give-up" });
  const result = await read([1, 2, 3]);
  assert.equal(result.userId, null);
  assert.deepEqual(JSON.parse(JSON.stringify(result.statuses)), { 1: "solved", 2: "attempted", 3: "new" });
  assert.deepEqual(Array.from(result.bookmarkedQuestionIds), [2]);
  assert.equal(state.calls.length, 0);
});
