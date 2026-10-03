import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { createApiObserver, API_OPERATIONS } from "../lib/apiMetrics.ts";
import { isPracticeTiming, PRACTICE_TIMING_LIMIT } from "../lib/practiceTiming.ts";
import { withRequestTimeout } from "../lib/requestTimeout.ts";

async function load(path, dependencies) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  runInNewContext(`(function(exports,require){${code}\n})`, { Error, URL, Response, Date, TextDecoder })(exports, name => {
    assert.ok(Object.hasOwn(dependencies, name), `Unexpected dependency ${name}`); return dependencies[name];
  });
  return exports;
}
const userId = "00000000-0000-4000-8000-000000000101", roomId = "00000000-0000-4000-8000-000000000102";
const clientId = "00000000-0000-4000-8000-000000000103", serverId = "00000000-0000-4000-8000-000000000104";
const requestId = "00000000-0000-4000-8000-000000000105";
const sensitive = "PRIVATE_canary_payload_cookie_token_answer_error";
const security = await load("lib/security/request.ts", { "server-only": {} });
const routes = [
  ["dashboard.read", "dashboard", { query: `owner=${userId}` }],
  ["practice.attempt", "practice/attempt", { body: { questionId: 42, trainer: false, requestId: clientId } }],
  ["practice.result", "practice/result", { body: { questionId: 42, trainer: false, attemptId: clientId, selectedAnswer: "A", elapsedSeconds: 3 } }],
  ["trainer.question", "practice/trainer/question", { query: "id=42" }],
  ["multiplayer.directory", "multiplayer/public-rooms", {}],
  ["multiplayer.lobby.read", "multiplayer/rooms/[id]/lobby", {}],
  ["multiplayer.lobby.presence", "multiplayer/rooms/[id]/lobby", { body: { action: "heartbeat", tabId: clientId, connectionId: clientId, playerId: clientId, generation: 2 } }],
  ["multiplayer.lobby.leave", "multiplayer/rooms/[id]/lobby", { body: { connectionId: clientId } }],
  ["multiplayer.lobby.settings", "multiplayer/rooms/[id]/lobby", { body: { connectionId: clientId, playerId: clientId, difficultyBand: "2-4", settingsVersion: 0 } }],
  ["multiplayer.lobby.ready", "multiplayer/rooms/[id]/lobby/ready", { body: { connectionId: clientId, playerId: clientId, ready: true, settingsVersion: 0 } }],
  ["multiplayer.round.read", "multiplayer/rooms/[id]/round", {}],
  ["multiplayer.round.submit", "multiplayer/rooms/[id]/round", { body: { questionId: 42, selectedAnswer: "A" } }],
  ["multiplayer.ready", "multiplayer/rooms/[id]/ready", { body: { questionNumber: 1 } }],
  ["multiplayer.delivery", "multiplayer/rooms/[id]/delivery", { body: { questionNumber: 1 } }],
  ["multiplayer.spectate.read", "multiplayer/rooms/[id]/spectate", {}],
  ["multiplayer.spectate.leave", "multiplayer/rooms/[id]/spectate", { status: 204 }],
  ["multiplayer.results.ack", "multiplayer/rooms/[id]/results/acknowledge", { status: 204 }],
];
async function fixture(path, { failure = false, round = "running", stallAuth = false } = {}) {
  const logs = [], calls = [];
  const record = (name, result) => (...args) => {
    calls.push({ name, args }); if (failure) throw new Error(sensitive); return result;
  };
  const question = { id: 42, answer: "A", solution: sensitive };
  const service = {
    listPublicRooms: record("directory", []), getPrivateLobby: record("lobby", { players: [] }),
    changeMultiplayerLobbyPresence: record("presence", { status: "connected", lobby: {} }),
    confirmMultiplayerLeave: record("leave", "left"),
    updateMultiplayerDifficulty: record("settings", { room: {}, players: [] }),
    updateMultiplayerLobbyReady: record("lobby-ready", { room: {}, players: [] }),
    getMultiplayerRoundState: record("round", round === "running" ? { stateVersion: 2 } : null),
    getMultiplayerRoom: record("access", { room: { status: round } }),
    submitMultiplayerAnswer: record("answer", undefined), acknowledgeMultiplayerQuestionReady: record("ready", undefined),
    acknowledgeMultiplayerQuestionDelivery: record("delivery", { ready: true }),
    spectatePublicMatch: record("spectate", { players: [] }), leavePublicSpectator: record("spectator-leave", undefined),
    acknowledgeMultiplayerResult: record("ack", true),
  };
  const observeApi = createApiObserver({ enabled: () => true, emit: line => logs.push(JSON.parse(line)), random: () => 0, requestId: () => serverId });
  const handlers = await load(`app/api/${path}/route.ts`, {
    "next/server": { NextResponse: Response }, "@/lib/serverPerformance": { observeApi },
    "@/lib/security/request": security, "@/lib/services/multiplayerService": service,
    "@/lib/trainerCatalog": { getTrainerQuestion: () => question }, "@/data/questions": { questions: [question] },
    "@/lib/practiceTiming": { isPracticeTiming, PRACTICE_TIMING_LIMIT },
    "@/lib/tutorRevealToken": { createTutorRevealToken: () => sensitive },
    "@/lib/dashboardServer": { readDashboardSnapshot: record("dashboard", { userId, secret: sensitive }) },
    "@/lib/requestTimeout": { withRequestTimeout: (work, options) => withRequestTimeout(work, { ...options, timeoutMs: 20 }) },
    "@/lib/supabase/server": { createClient: async () => ({ auth: { getUser: () => {
      calls.push({ name: "auth" }); return stallAuth ? new Promise(() => {}) : { data: { user: { id: userId } } };
    } } }) },
    "@/lib/supabase/admin": { createAdminClient: () => ({ rpc: (name, args) => {
      calls.push({ name, args });
      if (failure) throw new Error(sensitive);
      return { data: name === "begin_practice_attempt" ? { status: "started", attemptId: clientId } : {
        status: "saved", isCorrect: true, progress: { attempts: 1, correct: 1, times: [3000],
          timing: { count: 1, totalSeconds: 3, bestSeconds: 3 } }, levelChange: null,
      }, error: null };
    } }) },
  });
  const invoke = (operation, options = {}, origin = "https://fixture.test") => {
    const method = API_OPERATIONS[operation];
    const request = new Request(`https://fixture.test/api/${path.replace("[id]", roomId)}?${options.query ?? ""}&secret=${sensitive}`, {
      method, headers: { "Content-Type": "application/json", Origin: origin, Cookie: sensitive, Authorization: `Bearer ${sensitive}`, "X-Mao-Request-Id": requestId },
      ...(method === "GET" ? {} : { body: JSON.stringify({ ...options.body, extra: sensitive }) }),
    });
    return handlers[method](request, { params: Promise.resolve({ id: roomId }) });
  };
  return { logs, calls, invoke };
}
test("all API operations expose bounded timings while keeping sensitive data out of log records", async () => {
  assert.deepEqual(routes.map(([operation]) => operation), Object.keys(API_OPERATIONS));
  for (const [operation, path, options] of routes) {
    const { logs, calls, invoke } = await fixture(path);
    const response = await invoke(operation, options);
    assert.equal(response.status, options.status ?? 200, operation);
    assert.match(response.headers.get("server-timing"), /^app;dur=[\d.]+/);
    assert.equal(response.headers.get("x-mao-request-id"), operation === "multiplayer.directory" ? null : serverId);
    assert.equal(logs.length, 1, operation); assert.equal(logs[0].operation, operation);
    assert.ok(!JSON.stringify(logs).includes(sensitive));
    for (const privateId of [roomId, userId, clientId, requestId]) assert.ok(!JSON.stringify(logs).includes(privateId));
    if (operation.startsWith("practice.")) {
      assert.equal(calls.filter(call => call.name === "auth").length, 1);
      assert.equal(calls.filter(call => call.name.includes("practice_attempt")).length, 1);
      assert.deepEqual(Object.keys(logs[0].phases), ["auth", "data"]);
    }
    if (options.status === 204) assert.equal(await response.text(), "");
  }
});
test("instrumented mutations still reject cross-origin traffic before any service call", async () => {
  for (const [operation, path, options] of routes.filter(([operation]) => API_OPERATIONS[operation] !== "GET")) {
    const { logs, calls, invoke } = await fixture(path);
    assert.equal((await invoke(operation, options, "https://untrusted.test")).status, 403, operation);
    assert.equal(calls.length, 0); assert.equal(logs[0].status, 403); assert.equal(logs[0].reason, "http_error");
  }
});
test("handled failures and uncaught exceptions remain unchanged, including retry/cache semantics", async () => {
  for (const [operation, path, options] of routes.filter(([operation]) => operation !== "trainer.question")) {
    const { logs, invoke } = await fixture(path, { failure: true });
    if (["multiplayer.round.read", "multiplayer.spectate.leave"].includes(operation)) {
      await assert.rejects(invoke(operation, options), error => error.message === sensitive);
      assert.equal(logs[0].reason, "exception"); assert.equal(logs[0].status, null);
    } else {
      const response = await invoke(operation, options);
      assert.ok(response.status >= 400); assert.equal(logs[0].status, response.status);
      assert.equal(logs[0].reason, "http_error");
      if (operation === "multiplayer.directory") assert.equal(response.headers.get("cache-control"), "no-store");
    }
    assert.equal(logs.length, 1); assert.ok(!JSON.stringify(logs).includes(sensitive));
  }
});
test("round preparation and completed responses retain their 202 and empty 204 behavior", async () => {
  for (const [round, status] of [["waiting", 202], ["completed", 204]]) {
    const { logs, calls, invoke } = await fixture("multiplayer/rooms/[id]/round", { round });
    const response = await invoke("multiplayer.round.read"); assert.equal(response.status, status);
    assert.equal(logs[0].phases.service.calls, 2); assert.equal(calls.length, 2);
    if (status === 204) assert.equal(await response.text(), "");
    else assert.deepEqual(await response.json(), { status: "preparing" });
  }
});
test("dashboard timeout records the unfinished auth phase without starting a data read", async () => {
  const { logs, calls, invoke } = await fixture("dashboard", { stallAuth: true });
  const response = await invoke("dashboard.read", { query: `owner=${userId}` });
  assert.equal(response.status, 503); assert.equal(logs[0].phases.auth.pending, true);
  assert.equal(logs[0].phases.data, undefined); assert.deepEqual(calls, [{ name: "auth" }]);
});
