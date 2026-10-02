import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const sources = await Promise.all(["requestTimeout", "tutorTransport"].map(async name => ts.transpileModule(
  await readFile(new URL(`../lib/${name}.ts`, import.meta.url), "utf8"),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } },
).outputText));
const flush = () => new Promise(resolve => setImmediate(resolve));
const input = { questionId: 42, message: "Where do I start?", revealToken: "fixture-reveal", history: Array.from({ length: 8 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: `Earlier ${i}` })) };
const reply = (data, status = 200, headers = {}) => ({ ok: status >= 200 && status < 300, status, headers: new Headers(headers), json: async () => data });
const busy = () => reply({ code: "busy", retryAfterMs: 3000 }, 429, { "Retry-After": "3" });

function harness(handler = () => reply({ message: "A useful hint.", messagesRemaining: 14 })) {
  let now = 0, id = 0;
  const timers = new Map(), calls = [], waits = [];
  const math = Object.create(Math); math.random = () => 0;
  const globals = { AbortController, DOMException, Error, Math: math,
    setTimeout(callback, ms) { const key = ++id; timers.set(key, { at: now + ms, callback }); return key; },
    clearTimeout(key) { timers.delete(key); },
    fetch(url, init) { calls.push({ url, ...init, at: now }); return handler(calls.length, init); },
  };
  function compile(source, dependencies) {
    const exports = {};
    runInNewContext(`(function(exports,require){${source}\n})`, globals)(exports, name => {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`); return dependencies[name];
    });
    return exports;
  }
  const timeouts = compile(sources[0], {});
  const transport = compile(sources[1], { "./requestTimeout": timeouts });
  const controller = new AbortController();
  async function advance(ms) {
    await flush();
    const target = now + ms;
    while (true) {
      const next = [...timers.entries()].filter(([, timer]) => timer.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      const [key, timer] = next; timers.delete(key); now = timer.at; timer.callback(); await flush();
    }
    now = target; await flush();
  }
  return { ...transport, calls, waits, timers, advance, controller, math,
    send: () => transport.sendTutorRequest(input, { signal: controller.signal, onWaiting: waiting => waits.push(waiting) }),
  };
}

test("tutor delivers one frozen payload with bounded history and unchanged reveal token", async () => {
  const h = harness();
  assert.equal((await h.send()).message, "A useful hint.");
  assert.equal(h.calls.length, 1);
  assert.deepEqual(JSON.parse(h.calls[0].body), { ...input, history: input.history.slice(-6) });
  assert.equal(h.timers.size, 0);
});

test("busy retries back off and stop after four attempts, not indefinitely", async () => {
  const h = harness(busy);
  const result = assert.rejects(h.send(), error => error.code === "busy" && /saved below/.test(error.message));
  await h.advance(90_000); await result;
  assert.deepEqual(h.calls.map(call => call.at), [0, 3000, 9000, 21000]);
  assert.equal(new Set(h.calls.map(call => call.body)).size, 1);
  assert.equal(h.waits.filter(Boolean).length, 3);
  assert.equal(h.timers.size, 0);
});

test("a successful busy retry returns one answer and stops all timers", async () => {
  const h = harness(n => n === 1 ? busy() : reply({ message: "A hint after waiting.", messagesRemaining: 12 }));
  const result = h.send();
  await h.advance(90_000);
  assert.equal((await result).messagesRemaining, 12);
  assert.equal(h.calls.length, 2);
  assert.equal(h.timers.size, 0);
});

test("jitter and safe server retry hints never create tight or unbounded retry loops", () => {
  const h = harness();
  assert.equal(h.tutorRetryDelay(0, -20, "bad"), 3000);
  assert.equal(h.tutorRetryDelay(0, "100", "8"), 8000);
  assert.equal(h.tutorRetryDelay(0, 9000, "3"), 9000);
  assert.equal(h.tutorRetryDelay(0, 3000, "60"), null);
  assert.equal(h.tutorRetryDelay(0, 100_000, null), null);
  assert.equal(h.tutorRetryDelay(0, Infinity, null), 3000);
  h.math.random = () => 0.999;
  assert.ok(h.tutorRetryDelay(0, null, null) > 3700);
  assert.ok(h.tutorRetryDelay(2, null, null) <= 15000);
});

test("only an explicit 429 busy response is automatically retried", async () => {
  for (const handler of [
    () => { throw Error("transport failed"); },
    () => reply({ error: "Server failed", code: "unavailable" }, 503),
    () => reply({ code: "busy" }, 500),
    () => reply({ error: "Wait", code: "rate_limited" }, 429),
    () => reply({ error: "Used up", code: "daily_limit", messagesRemaining: 0 }, 429),
    () => reply({ error: "Monthly budget", code: "pool_exhausted" }, 503),
    () => reply(null),
    () => reply({ message: "A hint", messagesRemaining: 16 }),
    () => ({ ...reply({}), json: async () => { throw Error("invalid JSON"); } }),
  ]) {
    const h = harness(handler);
    await assert.rejects(h.send()); await h.advance(180_000);
    assert.equal(h.calls.length, 1);
    assert.equal(h.timers.size, 0);
  }
});

test("stalled fetches and response bodies time out without repeating ambiguous paid work", async () => {
  for (const handler of [() => new Promise(() => {}), () => ({ ...reply({}), json: () => new Promise(() => {}) })]) {
    const h = harness(handler);
    const result = assert.rejects(h.send(), error => error.code === "unavailable" && /may use a request/.test(error.message));
    await h.advance(60_000); await result;
    assert.equal(h.calls.length, 1);
    assert.equal(h.calls[0].signal.aborted, true);
    assert.equal(h.timers.size, 0);
  }
});

test("an overall deadline also bounds multiple slow busy responses", async () => {
  let h;
  h = harness(n => n < 4 ? new Promise(resolve => {
    // Use the same virtual scheduler via the public abortable wait helper.
    void h.waitForTutorRetry(20_000, h.controller.signal).then(() => resolve(busy()));
  }) : new Promise(() => {}));
  const result = assert.rejects(h.send(), /couldn't confirm/);
  await h.advance(90_000); await result;
  assert.deepEqual(h.calls.map(call => call.at), [0, 23000, 49000, 81000]);
  assert.equal(h.calls.at(-1).signal.aborted, true);
  assert.equal(h.timers.size, 0);
});

test("cancel before sending, while waiting, or during fetch stops further requests", async () => {
  for (const phase of ["before", "wait", "fetch"]) {
    const h = harness(phase === "fetch" ? () => new Promise(() => {}) : busy);
    if (phase === "before") h.controller.abort();
    const result = assert.rejects(h.send(), error => error.name === "AbortError");
    await flush(); h.controller.abort();
    await result; await h.advance(180_000);
    assert.equal(h.calls.length, phase === "before" ? 0 : 1);
    assert.equal(h.timers.size, 0);
  }
});

test("a completed retry wait removes its abort listener", async () => {
  const h = harness();
  const signal = h.controller.signal;
  let added = 0, removed = 0;
  const add = signal.addEventListener.bind(signal), remove = signal.removeEventListener.bind(signal);
  signal.addEventListener = (...args) => { added++; return add(...args); };
  signal.removeEventListener = (...args) => { removed++; return remove(...args); };
  const done = h.waitForTutorRetry(3000, signal); await h.advance(3000); await done;
  assert.equal(added, 1); assert.equal(removed, 1);
});

test("allowance reads validate counts and bound the complete response to twelve seconds", async () => {
  for (const value of [0, 1, 15]) {
    const h = harness(() => reply({ messagesRemaining: value }));
    assert.equal(await h.readTutorAllowance(h.controller.signal), value);
    assert.equal(h.calls[0].cache, "no-store"); assert.equal(h.timers.size, 0);
  }
  for (const value of [-1, 16, null, "15", 1.5]) {
    const h = harness(() => reply({ messagesRemaining: value }));
    await assert.rejects(h.readTutorAllowance(h.controller.signal));
  }
  const h = harness(() => ({ ...reply({}), json: () => new Promise(() => {}) }));
  const result = assert.rejects(h.readTutorAllowance(h.controller.signal), /took too long/);
  await h.advance(12_000); await result;
  assert.equal(h.calls[0].signal.aborted, true); assert.equal(h.timers.size, 0);
});

test("a simulated 200-client all-busy wave is bounded to 800 attempts and then stops", async () => {
  const h = harness(busy);
  const results = Array.from({ length: 200 }, () => assert.rejects(h.send(), error => error.code === "busy"));
  await h.advance(180_000); await Promise.all(results);
  assert.equal(h.calls.length, 800); assert.equal(h.timers.size, 0);
  // This is a transport simulation, not a live database/provider capacity test.
});
