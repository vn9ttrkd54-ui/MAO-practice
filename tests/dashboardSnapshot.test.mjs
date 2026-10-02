import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { parseDashboardSnapshot, dashboardObject } from "../lib/dashboardSnapshot.ts";
import { withRequestTimeout } from "../lib/requestTimeout.ts";
import { getMultiplayerSummary } from "../lib/multiplayerSummary.ts";
import { dashboardFixture, dashboardOwner } from "./browserFixtures/dashboardData.ts";

async function load(path, dependencies = {}, globals = {}) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  runInNewContext(`(function(exports,require){${code}\n})`, { Error, URL, Response, ...globals })(exports, name => {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`); return dependencies[name];
  });
  return exports;
}
const fastTimeout = (operation, options) => withRequestTimeout(operation, { ...options, timeoutMs: 30 });

test("dashboard validates complete account-bound snapshots with bounded lists", () => {
  const data = dashboardFixture();
  assert.equal(parseDashboardSnapshot(data, dashboardOwner), data);
  const mutations = [
    d => { d.version = 2; }, d => { d.userId = "other"; }, d => { d.username = null; },
    d => { d.level.progress = 30; }, d => { d.trainer.correct = -1; },
    d => { d.trainer.questionsAnswered = 1999; }, d => { d.questionBank.totalQuestions = 999; },
    d => { d.trainer.sessionsByDivision = []; }, d => { d.trainer.recentSessionAccuracy = Array(9).fill(d.trainer.recentSessionAccuracy[0]); },
    d => { d.recentTrainerSessions = Array(6).fill(d.recentTrainerSessions[0]); },
    d => { d.recentActivity = Array(11).fill(d.recentActivity[0]); }, d => { d.recentActivity[0].questionNumber = undefined; },
    d => { d.multiplayer.averagePlacement = "1.5"; }, d => { d.recentTrainerSessions[0].endedAt = Infinity; },
  ];
  for (const mutate of mutations) { const data = dashboardFixture(); mutate(data); assert.throws(() => parseDashboardSnapshot(data, dashboardOwner)); }
});

async function clientFixture(handler) {
  const calls = [];
  const client = await load("lib/dashboardService.ts", {
    "./dashboardSnapshot": { parseDashboardSnapshot }, "./requestTimeout": { withRequestTimeout: fastTimeout },
  }, { fetch: async (url, init) => { calls.push({ url, ...init }); return handler(init); } });
  return { calls, read: client.getDashboardData };
}

test("dashboard client performs one no-store read without progress/history/catalog dependencies", async () => {
  const { calls, read } = await clientFixture(() => Response.json(dashboardFixture()));
  assert.deepEqual(await read(dashboardOwner), dashboardFixture());
  assert.equal(calls.length, 1); assert.equal(calls[0].cache, "no-store");
  assert.equal(calls[0].url, `/api/dashboard?owner=${dashboardOwner}`);
});

test("dashboard client stops on auth, mismatch, unavailable, malformed and timed-out responses without retries", async () => {
  for (const handler of [
    () => Response.json({}, { status: 401 }), () => Response.json({}, { status: 409 }),
    () => Response.json({}, { status: 503 }), () => Response.json(dashboardFixture("other")),
    () => Response.json({}), () => new Promise(() => {}),
    () => ({ ok: true, status: 200, json: () => new Promise(() => {}) }),
  ]) {
    const { read, calls } = await clientFixture(handler); await assert.rejects(read(dashboardOwner)); assert.equal(calls.length, 1);
  }
  const { read, calls } = await clientFixture(() => new Promise(() => {}));
  const controller = new AbortController(), result = read(dashboardOwner, controller.signal);
  const rejection = assert.rejects(result); await new Promise(resolve => setImmediate(resolve)); controller.abort(); await rejection;
  assert.equal(calls[0].signal.aborted, true);
});

test("server enriches one compact RPC result using the catalog only on the server", async () => {
  const raw = dashboardFixture();
  raw.multiplayer = { rp: 1050, rankedMatchesPlayed: 1107, rankedWins: 1106, averagePlacement: 1, currentStreak: 1106 };
  delete raw.recentActivity[0].questionNumber;
  const calls = [];
  let fail = false;
  const supabase = { rpc(name, args) { calls.push({ name, args }); return { abortSignal: async signal => ({ data: raw, error: fail ? {} : null, signal }) }; } };
  const server = await load("lib/dashboardServer.ts", {
    "server-only": {}, "@/data/questions": { questions: [{ id: 42, number: 7 }, { id: 43, number: 8 }] },
    "@/lib/dashboardSnapshot": { parseDashboardSnapshot, dashboardObject }, "@/lib/multiplayerSummary": { getMultiplayerSummary },
  });
  const controller = new AbortController();
  assert.deepEqual(JSON.parse(JSON.stringify(await server.readDashboardSnapshot(supabase, dashboardOwner, controller.signal))), dashboardFixture());
  assert.equal(calls.length, 1); assert.equal(calls[0].name, "get_dashboard_snapshot");
  assert.equal(JSON.stringify(calls[0].args), JSON.stringify({ p_question_ids: [42,43] }));
  raw.multiplayer.averagePlacement = 2.55;
  assert.equal((await server.readDashboardSnapshot(supabase, dashboardOwner, controller.signal)).multiplayer.averagePlacement, Number((2.55).toFixed(1)));
  raw.multiplayer.averagePlacement = "2.55";
  await assert.rejects(server.readDashboardSnapshot(supabase, dashboardOwner, controller.signal));
  raw.multiplayer.averagePlacement = 1;
  fail = true; await assert.rejects(server.readDashboardSnapshot(supabase, dashboardOwner, controller.signal)); fail = false;
  raw.userId = "other"; await assert.rejects(server.readDashboardSnapshot(supabase, dashboardOwner, controller.signal)); raw.userId = dashboardOwner;
  raw.recentActivity[0].questionId = 999; await assert.rejects(server.readDashboardSnapshot(supabase, dashboardOwner, controller.signal));
});

async function routeFixture(options = {}) {
  const calls = { auth: 0, reads: 0 };
  const route = await load("app/api/dashboard/route.ts", {
    "@/lib/requestTimeout": { withRequestTimeout: fastTimeout },
    "@/lib/supabase/server": { createClient: async () => ({ auth: { getUser: async () => {
      calls.auth++; if (options.stallAuth) return new Promise(() => {});
      return { data: { user: options.signedOut ? null : { id: dashboardOwner } }, error: options.authError ? {} : null };
    } } }) },
    "@/lib/dashboardServer": { readDashboardSnapshot: async (_client, owner, signal) => {
      calls.reads++; assert.equal(owner, dashboardOwner); assert.equal(signal.aborted, false);
      if (options.fail) throw new Error("private database error");
      if (options.stall) return new Promise(() => {});
      return dashboardFixture();
    } },
  });
  return { calls, read: (owner = dashboardOwner) => route.GET(new Request(`https://fixture.test/api/dashboard?owner=${owner}`)) };
}

test("dashboard route verifies the cookie owner, uses no privileged client and never caches personal data", async () => {
  const { calls, read } = await routeFixture();
  const response = await read(); assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.deepEqual(await response.json(), dashboardFixture()); assert.deepEqual(calls, { auth: 1, reads: 1 });
  const rejected = await routeFixture();
  assert.equal((await rejected.read("invalid")).status, 400); assert.equal(rejected.calls.auth, 0);
  assert.equal((await rejected.read("00000000-0000-4000-8000-000000000002")).status, 409);
  assert.equal(rejected.calls.reads, 0);
});

test("dashboard route bounds auth/database hangs and fails safely instead of reporting empty statistics", async () => {
  for (const options of [{ signedOut: true }, { authError: true }, { fail: true }, { stall: true }, { stallAuth: true }]) {
    const { calls, read } = await routeFixture(options); const response = await read();
    assert.equal(response.status, options.signedOut || options.authError ? 401 : 503);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.ok(!(await response.text()).includes("private database"));
    if (options.signedOut || options.authError || options.stallAuth) assert.equal(calls.reads, 0);
  }
});
