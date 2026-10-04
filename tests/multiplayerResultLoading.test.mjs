import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../lib/services/multiplayerService.ts", import.meta.url), "utf8");
const roomId = "00000000-0000-0000-0000-000000000001";
const playerId = "00000000-0000-0000-0000-000000000002";
const userId = "00000000-0000-0000-0000-000000000003";

function loadResultService({ isHost, finalizedAt, resultReadError = false }) {
  let finalizationCalls = 0;
  const room = {
    id: roomId, code: "TESTROOM", visibility: "private", mode: "unranked", division: "Mu",
    question_count: 2, seconds_per_question: 60, status: "completed", capacity: 30,
    host_player_id: isHost ? playerId : userId, countdown_ends_at: null,
    created_at: "2026-01-01T00:00:00Z", started_at: "2026-01-01T00:00:10Z",
    current_question_number: 2, state_version: 4,
  };
  const player = {
    id: playerId, user_id: isHost ? userId : null, guest_nickname: isHost ? null : "Guest",
    is_host: isHost, connected: true, score: 0, placement: 1,
    has_submitted_current_question: true,
  };
  const result = {
    room_id: roomId, player_id: playerId, user_id: player.user_id,
    placement: 1, final_score: 0, ranked: false,
    previous_rp: null, new_rp: null,
  };

  const admin = {
    from(table) {
      let selection = "";
      const query = {
        select(columns) { selection = columns; return query; },
        eq() { return query; },
        is() { return query; },
        in() { return query; },
        order() { return query; },
        async maybeSingle() {
          if (table === "multiplayer_rooms") return { data: selection === "results_finalized_at" ? { results_finalized_at: finalizedAt } : room, error: null };
          if (table === "multiplayer_players") return { data: player, error: null };
          if (table === "multiplayer_result_receipts") return { data: null, error: null };
          if (table === "multiplayer_match_results") return { data: result, error: null };
          if (table === "profiles") return { data: { username: "Host" }, error: null };
          throw new Error(`Unexpected single read: ${table}`);
        },
        then(resolve, reject) {
          const rows = {
            multiplayer_match_results: [result], multiplayer_players: [player],
            multiplayer_submissions: [], multiplayer_match_questions: [],
            profiles: [{ id: userId, username: "Host" }],
            multiplayer_profiles: [{ user_id: userId, rp: 0 }],
          };
          if (!(table in rows)) throw new Error(`Unexpected list read: ${table}`);
          return Promise.resolve({ data: rows[table], error: resultReadError && table === "multiplayer_submissions" ? { message: "offline" } : null }).then(resolve, reject);
        },
      };
      return query;
    },
    async rpc(name) {
      if (name === "read_multiplayer_scoreboard") return { data: { status: "completed", players: [{ ...player, display_name: "Player", rp: 0,
        round_result: { questionNumber: 2, outcome: "give-up", pointsEarned: 0, answerTimeMs: 5000 } }] }, error: null };
      assert.equal(name, "finalize_multiplayer_match");
      finalizationCalls += 1;
      return { error: null };
    },
  };
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports,
    require(name) {
      if (name === "server-only") return {};
      if (name === "@/lib/auth/publicNames") return { isPublicNameAllowed: () => true, PUBLIC_NAME_ERROR: "Name is not allowed." };
      if (name === "next/headers") return { cookies: async () => ({ get: () => ({ value: "guest-token" }) }) };
      if (name === "@/data/questions") return { questions: [] };
      if (name === "@/lib/security/request") return { RequestBodyError: class extends Error {} };
      if (name === "@/lib/multiplayerTiming") return { QUESTION_PREPARATION_TIMEOUT_MS: 15_000 };
      if (name === "@/lib/supabase/admin") return { createAdminClient: () => admin };
      if (name === "@/lib/supabase/server") return { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: isHost ? { id: userId } : null } }) } }) };
      return require(name);
    },
  });
  return { getResult: () => exports.getMultiplayerMatchResult(roomId), getFinalizationCalls: () => finalizationCalls };
}

test("finished player results do not re-finalize the same room", async () => {
  const service = loadResultService({ isHost: false, finalizedAt: "2026-01-01T00:01:00Z" });
  const result = await service.getResult();
  assert.equal(result.placement, 1);
  assert.equal(result.finalLeaderboard[0].roundResult.outcome, "give-up");
  assert.equal(result.finalLeaderboard[0].roundResult.answerTimeMs, 5000);
  assert.equal(service.getFinalizationCalls(), 0);
});

test("guests wait for the worker instead of competing to finalize", async () => {
  const service = loadResultService({ isHost: false, finalizedAt: null });
  assert.equal(await service.getResult(), null);
  assert.equal(service.getFinalizationCalls(), 0);
});

test("the host can still finalize if the worker has not finished", async () => {
  const service = loadResultService({ isHost: true, finalizedAt: null });
  const result = await service.getResult();
  assert.equal(result.placement, 1);
  assert.equal(service.getFinalizationCalls(), 1);
});

test("a failed submission read does not misrepresent saved answers as blanks", async () => {
  const service = loadResultService({ isHost: false, finalizedAt: "2026-01-01T00:01:00Z", resultReadError: true });
  await assert.rejects(service.getResult(), /Unable to load match results/);
});
