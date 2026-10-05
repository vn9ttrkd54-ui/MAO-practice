import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
import { muQuestions } from "../data/questions/mu.ts";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../lib/services/multiplayerService.ts", import.meta.url), "utf8");
const roomId = "00000000-0000-0000-0000-000000000001";
const playerId = "00000000-0000-0000-0000-000000000002";
const userId = "00000000-0000-0000-0000-000000000003";

function loadResultService({ isHost, finalizedAt, resultReadError = false }) {
  let finalizationCalls = 0;
  let snapshotCalls = 0;
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
    from(){assert.fail("Result reads must not fan out into table requests");},
    async rpc(name,args) {
      assert.equal(args.p_room_id,roomId);
      if(name==="finalize_multiplayer_match"){finalizationCalls++;return {error:null};}
      assert.equal(name,"read_multiplayer_result_snapshot");snapshotCalls++;
      assert.equal(args.p_user_id,isHost?userId:null);
      assert.equal(args.p_guest_hash===null,isHost);
      if(resultReadError)return {data:null,error:{message:"offline"}};
      if(!finalizedAt&&!finalizationCalls)return {data:{status:"pending",isHost},error:null};
      return {data:{status:"ready",viewerMode:"player",result,placements:[{player_id:playerId,placement:1}],
        submissions:[],questions:[{question_number:1,question_id:10238,difficulty:2}],scoreboard:{status:"completed",players:[{...player,display_name:"Player",rp:0,
          round_result:{questionNumber:2,outcome:"give-up",pointsEarned:0,answerTimeMs:5000}}]}},error:null};
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
      if (name === "@/data/questions") return { questions: muQuestions };
      if (name === "@/lib/security/request") return { RequestBodyError: class extends Error {} };
      if (name === "@/lib/multiplayerTiming") return { QUESTION_PREPARATION_TIMEOUT_MS: 15_000 };
      if (name === "@/lib/supabase/admin") return { createAdminClient: () => admin };
      if (name === "@/lib/supabase/server") return { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: isHost ? { id: userId } : null } }) } }) };
      return require(name);
    },
  });
  return { getResult: () => exports.getMultiplayerMatchResult(roomId), getFinalizationCalls: () => finalizationCalls, getSnapshotCalls: () => snapshotCalls };
}

test("finished player results do not re-finalize the same room", async () => {
  const service = loadResultService({ isHost: false, finalizedAt: "2026-01-01T00:01:00Z" });
  const result = await service.getResult();
  assert.equal(result.placement, 1);
  assert.equal(result.finalLeaderboard[0].roundResult.outcome, "give-up");
  assert.equal(result.finalLeaderboard[0].roundResult.answerTimeMs, 5000);
  assert.equal(result.rounds[0].illustration,muQuestions.find(q=>q.id===10238).illustration);
  assert.equal(service.getFinalizationCalls(), 0);
  assert.equal(service.getSnapshotCalls(), 1);
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
  assert.equal(service.getSnapshotCalls(), 2);
});

test("a failed submission read does not misrepresent saved answers as blanks", async () => {
  const service = loadResultService({ isHost: false, finalizedAt: "2026-01-01T00:01:00Z", resultReadError: true });
  await assert.rejects(service.getResult(), /Unable to load match results/);
});
