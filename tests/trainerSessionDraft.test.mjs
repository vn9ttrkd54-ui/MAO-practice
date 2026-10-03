import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../lib/trainerSessionDraft.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
const stored = new Map();
let denied = false;
const exports = {};
runInNewContext(`(function(exports, require){${outputText}\n})`, {
  sessionStorage: {
    setItem: (key, value) => { if (denied) throw Error("storage denied"); stored.set(key, value); },
    removeItem: key => { if (denied) throw Error("storage denied"); stored.delete(key); },
  },
})(exports, name => {
  assert.equal(name, "@/lib/trainerSessionSave");
  return { MAX_TRAINER_SESSION_RESULTS: 2000 };
});
const now = 1800000000000;
const items = [{ id: 42, number: 1, division: "Mu", topic: "Calculus", difficulty: 2 }];
const draft = () => ({
  version: 1, owner: "user-a", id: "00000000-0000-4000-8000-000000000001", division: "Mu",
  questionId: 42, requestId: "00000000-0000-4000-8000-000000000002",
  sessionStartedAt: now - 20000, startTime: now - 10000, questionFinishedAt: null, endedAt: null,
  selectedAnswer: "B", submitted: false, pending: null, results: [],
  adaptiveState: { difficulty: 2, correctStreak: 1, incorrectStreak: 0 }, currentIsChallenge: false,
  levelProgress: { level: 3, progress: 2 }, startingLevelProgress: { level: 3, progress: 1 },
});
const parse = (value, owner = "user-a", time = now, catalog = items) => exports.parseTrainerDraft(JSON.stringify(value), owner, catalog, time);
const pending = d => Object.assign(d, { pending: { answer: "B", time: 7, answeredAt: now - 3000 }, questionFinishedAt: now - 3000 });
const answered = d => Object.assign(pending(d), { submitted: true, results: [{ questionId: 42, questionNumber: 1,
  selectedAnswer: "B", correctAnswer: "A", result: "incorrect", elapsedSeconds: 7 }] });

test("active, pending, answered and unconfirmed-summary drafts preserve their exact state", () => {
  for (const d of [draft(), pending(draft()), answered(draft()), { ...answered(draft()), endedAt: now }]) {
    assert.deepEqual(JSON.parse(JSON.stringify(parse(d))), d);
  }
  assert.ok(parse({ ...draft(), owner: null }, null));
});

test("recovery never crosses account or guest boundaries", () => {
  assert.equal(parse(draft(), "user-b"), null);
  assert.equal(parse(draft(), null), null);
  assert.equal(parse({ ...draft(), owner: null }), null);
});

test("stale drafts expire before a server retry receipt can disappear", () => {
  const d = draft();
  assert.ok(parse(d, "user-a", d.sessionStartedAt + exports.TRAINER_DRAFT_MAX_AGE_MS - 1));
  assert.equal(parse(d, "user-a", d.sessionStartedAt + exports.TRAINER_DRAFT_MAX_AGE_MS), null);
  assert.equal(parse({ ...d, sessionStartedAt: now + 1 }), null);
});

test("malformed, oversized, obsolete and inconsistent drafts are rejected", () => {
  for (const raw of ["{", "null", "[]", "true", "x".repeat(2000001)]) assert.equal(exports.parseTrainerDraft(raw, "user-a", items, now), null);
  for (const change of [
    { version: 2 }, { id: "bad" }, { requestId: "bad" }, { division: "Other" }, { questionId: 43 },
    { selectedAnswer: "Z" }, { startTime: now + 1 }, { startTime: now - 30000 },
    { adaptiveState: null }, { adaptiveState: { difficulty: 6, correctStreak: 0, incorrectStreak: 0 } },
    { levelProgress: { level: 0, progress: 0 } }, { startingLevelProgress: { level: 1, progress: 30 } },
    { submitted: true }, { results: null }, { results: Array(2001).fill(answered(draft()).results[0]) },
    { pending: { answer: "A", time: 7, answeredAt: now - 3000 } },
    { questionFinishedAt: now }, { endedAt: now - 15000 },
  ]) assert.equal(parse({ ...draft(), ...change }), null, JSON.stringify(change).slice(0, 100));
  assert.equal(parse(draft(), "user-a", now, []), null);
  assert.equal(parse({ ...pending(draft()), endedAt: now }), null, "cannot finalize an unconfirmed answer");
  assert.equal(parse({ ...answered(draft()), pending: null }), null);
  assert.equal(parse({ ...answered(draft()), selectedAnswer: "C" }), null);
  assert.equal(parse({ ...answered(draft()), results: [{ ...answered(draft()).results[0], result: "correct" }] }), null);
});

test("storage writes and cleanup are narrowly scoped and gracefully handle denial", () => {
  stored.set("unrelated", "keep");
  assert.equal(exports.writeTrainerDraft(draft()), true);
  assert.equal(stored.has(exports.TRAINER_DRAFT_KEY), true);
  exports.clearTrainerDraft();
  assert.equal(stored.has(exports.TRAINER_DRAFT_KEY), false);
  assert.equal(stored.get("unrelated"), "keep");
  denied = true;
  assert.equal(exports.writeTrainerDraft(draft()), false);
  assert.doesNotThrow(exports.clearTrainerDraft);
  denied = false;
});
