import assert from "node:assert/strict";
import test from "node:test";
import { createApiObserver, API_OPERATIONS } from "../lib/apiMetrics.ts";

const id = "00000000-0000-4000-8000-000000000001";
function fixture(options = {}) {
  let time = 0;
  const logs = [];
  const observe = createApiObserver({ enabled: () => true, emit: line => logs.push(JSON.parse(line)),
    now: () => time, random: () => 0, requestId: () => id, ...options });
  return { observe, logs, tick: amount => { time += amount; } };
}
test("API timings preserve response identity, body, cookies, headers and single handler execution", async () => {
  const { observe, logs, tick } = fixture(); let calls = 0;
  const response = Response.json({ secret: "unchanged body" }, { headers: {
    "Set-Cookie": "original=secret; HttpOnly", "Cache-Control": "private, no-store", "Retry-After": "60", "Server-Timing": "existing;dur=2",
  } });
  const result = await observe("practice.result", async measure => {
    calls++;
    assert.equal(await measure("auth", () => { tick(12); return 42; }), 42);
    await measure("data", async () => { tick(20); }); tick(3);
    return response;
  });
  assert.equal(result, response); assert.equal(calls, 1);
  assert.deepEqual(await result.json(), { secret: "unchanged body" });
  assert.equal(result.headers.get("set-cookie"), "original=secret; HttpOnly");
  assert.equal(result.headers.get("cache-control"), "private, no-store");
  assert.equal(result.headers.get("retry-after"), "60");
  assert.equal(result.headers.get("server-timing"), "existing;dur=2, app;dur=35, auth;dur=12, data;dur=20");
  assert.equal(result.headers.get("x-mao-request-id"), id);
  assert.deepEqual(logs, [{ event: "mao_api_metric", version: 1, operation: "practice.result", method: "POST",
    request_id: id, status: 200, duration_ms: 35, phases: {
      auth: { duration_ms: 12, calls: 1, pending: false }, data: { duration_ms: 20, calls: 1, pending: false },
    }, reason: "sample", suppressed: 0 }]);
  assert.ok(!JSON.stringify(logs).includes("secret"));
});
test("uncaught exceptions are rethrown exactly once without logging their data or inventing an HTTP status", async () => {
  const { observe, logs, tick } = fixture();
  const error = new Error("token: private-provider-message"); let calls = 0;
  await assert.rejects(observe("multiplayer.round.read", async measure => {
    calls++; return await measure("service", () => { tick(8); throw error; });
  }), actual => actual === error);
  assert.equal(calls, 1); assert.equal(logs.length, 1); assert.equal(logs[0].status, null);
  assert.equal(logs[0].reason, "exception"); assert.equal(logs[0].phases.service.duration_ms, 8);
  assert.ok(!JSON.stringify(logs).includes("private")); assert.ok(!JSON.stringify(logs).includes("token"));
});
test("pending phases are measured at handler completion and late completions cannot emit again", async () => {
  const { observe, logs, tick } = fixture(); let release; let pending;
  const response = await observe("dashboard.read", measure => {
    pending = measure("auth", () => new Promise(resolve => { release = resolve; }));
    tick(12000); return Response.json({ error: "timeout" }, { status: 503 });
  });
  assert.match(response.headers.get("server-timing"), /auth;dur=12000;desc="incomplete"/);
  assert.deepEqual(logs[0].phases.auth, { duration_ms: 12000, calls: 1, pending: true });
  tick(999); release("late"); assert.equal(await pending, "late"); assert.equal(logs.length, 1);
  assert.equal(logs[0].duration_ms, 12000);
});
test("public directory keeps shared caching and never publishes a per-viewer request ID", async () => {
  const { observe, logs } = fixture();
  const response = await observe("multiplayer.directory", () => Response.json([], {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=1, must-revalidate" },
  }));
  assert.equal(response.headers.get("x-mao-request-id"), null);
  assert.equal(response.headers.get("set-cookie"), null);
  assert.equal(response.headers.get("cache-control"), "public, max-age=0, s-maxage=1, must-revalidate");
  assert.equal(logs[0].request_id, id, "internal ID is for the origin execution, not each CDN response");
});
test("logging is opt-in, samples fast results at 1 percent, and includes slow, error and throttle responses", async () => {
  const off = fixture({ enabled: () => false });
  await off.observe("practice.result", () => Response.json({}, { status: 500 })); assert.equal(off.logs.length, 0);
  const { observe, logs, tick } = fixture({ random: () => 0.5 });
  for (const status of [200, 202, 204, 304, 400, 401, 403, 404, 409, 429, 500, 503]) {
    await observe("practice.result", () => new Response(null, { status }));
  }
  assert.deepEqual(logs.map(log => log.status), [400, 401, 403, 404, 409, 429, 500, 503]);
  await observe("practice.result", () => { tick(1000); return new Response(); });
  assert.equal(logs.at(-1).reason, "slow");
  for (const [random, count] of [[0.0099, 1], [0.01, 0]]) {
    const f = fixture({ random: () => random }); await f.observe("trainer.question", () => new Response());
    assert.equal(f.logs.length, count);
  }
});
test("200 simultaneous observed failures are bounded to 60 log lines per observer window", async () => {
  const { observe, logs, tick } = fixture(); let calls = 0;
  await Promise.all(Array.from({ length: 200 }, () => observe("multiplayer.lobby.presence", async () => {
    calls++; return new Response(null, { status: 503 });
  })));
  assert.equal(calls, 200); assert.equal(logs.length, 60);
  tick(60000); await observe("multiplayer.lobby.presence", () => new Response(null, { status: 429 }));
  assert.equal(logs.length, 61); assert.equal(logs.at(-1).suppressed, 140);
  assert.ok(logs.every(log => JSON.stringify(log).length < 1024));
});
test("failed clock, ID, sampling and logging functions cannot change a response or original error", async () => {
  const broken = () => { throw new Error("diagnostic failure"); };
  for (const options of [{ now: broken }, { requestId: broken }, { requestId: () => "secret\r\nInjected: bad" },
    { enabled: broken }, { emit: broken }, { random: broken }]) {
    const { observe } = fixture(options); const response = new Response(null, { status: 204 }); let calls = 0;
    assert.equal(await observe("practice.result", () => { calls++; return response; }), response);
    assert.equal(calls, 1); assert.ok(!String(response.headers.get("x-mao-request-id")).includes("secret"));
    const error = new Error("original");
    await assert.rejects(observe("practice.result", () => { throw error; }), actual => actual === error);
  }
  const { observe } = fixture();
  const immutable = Response.redirect("https://example.test");
  assert.equal(await observe("trainer.question", () => immutable), immutable);
});
test("unknown operation and phase labels never expose caller-controlled fields", async () => {
  const { observe, logs } = fixture();
  const response = new Response();
  assert.equal(await observe("/api/private?token=secret", () => response), response);
  assert.equal(response.headers.get("server-timing"), null); assert.equal(logs.length, 0);
  await observe("practice.result", async measure => { await measure("secret-user-id", () => 1); return new Response(); });
  assert.deepEqual(logs[0].phases, {});
  assert.equal(Object.keys(API_OPERATIONS).length, 18);
});
test("concurrent requests keep phase timings isolated, including repeated phases", async () => {
  const { observe, logs, tick } = fixture(); let release;
  const first = observe("practice.attempt", async measure => {
    await measure("auth", () => new Promise(resolve => { release = resolve; }));
    return new Response();
  });
  tick(10);
  await observe("multiplayer.round.read", async measure => {
    await measure("service", () => { tick(5); });
    await measure("service", () => { tick(7); });
    return new Response();
  });
  release(); await first;
  assert.deepEqual(logs[0].phases, { service: { duration_ms: 12, calls: 2, pending: false } });
  assert.deepEqual(logs[1].phases, { auth: { duration_ms: 22, calls: 1, pending: false } });
});
