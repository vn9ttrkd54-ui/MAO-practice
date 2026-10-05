import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
import { muQuestions } from "../data/questions/mu.ts";
import { alphaQuestions } from "../data/questions/alpha.ts";
import { thetaQuestions } from "../data/questions/theta.ts";

const require = createRequire(import.meta.url);
const questions = [...muQuestions, ...alphaQuestions, ...thetaQuestions];
function load(file, dependencies) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports, require: name => name in dependencies ? dependencies[name] : require(name) });
  return exports;
}

test("the full catalog has unique IDs, so indexed lookups preserve the first-match behavior", () => {
  const indexed = new Map(questions.map(question => [question.id, question]));
  assert.equal(indexed.size, questions.length, "duplicate IDs would change find versus Map semantics");
  for (const question of questions) assert.equal(indexed.get(question.id), questions.find(item => item.id === question.id));
  assert.equal(indexed.get(-1), undefined);
});

test("all question and solution illustrations and the active llama sprite still exist", () => {
  const illustrations = new Set();
  for (const question of questions) {
    if (question.illustration) illustrations.add(question.illustration.src);
    for (const match of JSON.stringify(question).matchAll(/\/questions\/[\w./-]+\.(?:svg|png|webp|jpe?g)/g)) illustrations.add(match[0]);
  }
  assert.ok(illustrations.size > 0);
  for (const src of illustrations) assert.ok(existsSync(new URL(`../public${src}`, import.meta.url)), `Missing illustration: ${src}`);
  const petCss = readFileSync(new URL("../components/practice/LlamaPet.module.css", import.meta.url), "utf8");
  assert.match(petCss, /url\(['"]?\/llama-pet\.png/);
  assert.ok(existsSync(new URL("../public/llama-pet.png", import.meta.url)));
});

test("multiplayer indexes the catalog once, still authorizes each read, and never reveals open-round answers", async () => {
  let indexes = 0, authReads = 0, stateReads = 0, questionId = questions[0].id;
  const catalog = [...questions];
  catalog.map = callback => { indexes++; return Array.prototype.map.call(catalog, callback); };
  catalog.find = () => assert.fail("hot-path reads must not rescan the entire catalog");
  const service = load("lib/services/multiplayerService.ts", {
    "server-only": {}, "@/lib/auth/publicNames": {}, "@/lib/security/request": {}, "next/headers": {},
    "@/data/questions": { questions: catalog },
    "@/lib/supabase/server": { createClient: async () => ({ auth: { getUser: async () => {
      authReads++; return { data: { user: { id: "verified-user" } }, error: null };
    } } }) },
    "@/lib/supabase/admin": { createAdminClient: () => ({ rpc: async (name, args) => {
      stateReads++; assert.equal(args.p_user_id, "verified-user");
      if (name === "read_multiplayer_round_for_actor") return { error: null, data: {
        status: "in-progress", stateVersion: stateReads, currentPlayerId: "player", totalQuestions: 1,
        questionDurationSeconds: 90, players: [], upcoming: null,
        question: { question_id: questionId, question_number: 1, difficulty: 3 },
      } };
      assert.equal(name, "read_multiplayer_result_snapshot");
      return { error: null, data: {
        status: "ready", result: { placement: 1, final_score: 1000, previous_rp: null, new_rp: 0 },
        placements: [], submissions: [], scoreboard: { status: "completed", players: [] },
        questions: questions.slice(0, 30).map((q, i) => ({ question_id: q.id, question_number: i + 1 })),
      } };
    } }) },
  });
  assert.equal(indexes, 1);
  for (const question of questions) {
    questionId = question.id;
    const round = await service.getMultiplayerRoundState("room");
    assert.equal(round.question.questionId, question.id);
    assert.equal(round.question.question, question.question);
    assert.equal(round.question.choices, question.choices);
    assert.equal("answer" in round.question, false); assert.equal("solution" in round.question, false);
  }
  questionId = -1;
  await assert.rejects(service.getMultiplayerRoundState("room"), /Question unavailable/);
  const result = await service.getMultiplayerMatchResult("room");
  assert.equal(result.rounds.length, 30);
  for (const [i, round] of result.rounds.entries()) {
    assert.equal(round.questionId, questions[i].id); assert.equal(round.correctAnswer, questions[i].answer);
    assert.equal(round.solution, questions[i].solution);
  }
  assert.equal(indexes, 1, "reads and result assembly reuse the server catalog");
  assert.equal(authReads, questions.length + 2); assert.equal(stateReads, authReads);
});

test("admin catalog metadata is reused but authorization and account statistics are never cached", async () => {
  let indexes = 0, authChecks = 0;
  const accountReads = [], catalog = [...questions];
  catalog.map = callback => { indexes++; return Array.prototype.map.call(catalog, callback); };
  const service = load("lib/services/adminUsersService.ts", {
    "server-only": {}, "next/navigation": { redirect: () => assert.fail("authorized admin") },
    "@/lib/auth/roles": { hasAdminAccess: role => role === "admin" },
    "@/data/questions": { questions: catalog },
    "@/lib/supabase/server": { createClient: async () => ({
      auth: { getUser: async () => { authChecks++; return { data: { user: { id: "admin" } } }; } },
      from: () => { const q = { select: () => q, eq: () => q, maybeSingle: async () => ({ data: { role: "admin" }, error: null }) }; return q; },
    }) },
    "@/lib/supabase/admin": { createAdminClient: () => ({ from: table => {
      let userId;
      const q = { select: () => q, eq: (_key, value) => { userId = value; return q; }, order: () => q,
        range: async () => { accountReads.push([table, userId]); return { data: [
          { question_id: questions[0].id, attempts: userId === "first" ? 7 : 2, correct: 1 },
          { question_id: -1, attempts: 1, correct: 0 },
        ], error: null }; },
        limit: async () => { accountReads.push([table, userId]); return { data: [], error: null }; },
      }; return q;
    } }) },
  });
  assert.equal(indexes, 1);
  for (const [userId, attempts] of [["first", 7], ["second", 2]]) {
    const details = await service.getAdminUserDetails(userId);
    assert.equal(details.byDivision[questions[0].division].attempts, attempts);
    assert.equal(details.byDivision["Other / removed"].attempts, 1);
  }
  assert.equal(indexes, 1); assert.equal(authChecks, 2);
  assert.deepEqual(accountReads, [["question_progress", "first"], ["multiplayer_match_history", "first"],
    ["question_progress", "second"], ["multiplayer_match_history", "second"]]);
});
