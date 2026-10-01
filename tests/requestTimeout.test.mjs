import assert from "node:assert/strict";
import test from "node:test";
import { withRequestTimeout } from "../lib/requestTimeout.ts";

test("deadline aborts the request even when an operation ignores cancellation", async () => {
  let signal;
  await assert.rejects(withRequestTimeout((next) => {
    signal = next;
    return new Promise(() => {});
  }, { timeoutMs: 10, message: "Timed out" }), /Timed out/);
  assert.equal(signal.aborted, true);
});

test("caller cancellation releases the wait and removes the listener", async () => {
  const controller = new AbortController();
  let signal;
  let removed = 0;
  const remove = controller.signal.removeEventListener.bind(controller.signal);
  controller.signal.removeEventListener = (...args) => { removed++; remove(...args); };
  const pending = withRequestTimeout(async (next) => {
    signal = next;
    return new Promise(() => {});
  }, { signal: controller.signal });
  await Promise.resolve();
  controller.abort(new Error("Unmounted"));
  await assert.rejects(pending, /Unmounted/);
  assert.equal(signal.aborted, true);
  assert.equal(removed, 1);
});

test("already cancelled operations do not begin", async () => {
  const controller = new AbortController();
  controller.abort();
  let called = false;
  await assert.rejects(withRequestTimeout(async () => { called = true; }, { signal: controller.signal }), { name: "AbortError" });
  assert.equal(called, false);
});

test("success and failure clean up their deadline and cancellation listener", async () => {
  for (const fail of [false, true]) {
    const controller = new AbortController();
    let removed = 0;
    let signal;
    const remove = controller.signal.removeEventListener.bind(controller.signal);
    controller.signal.removeEventListener = (...args) => { removed++; remove(...args); };
    const result = withRequestTimeout(async (next) => {
      signal = next;
      if (fail) throw new Error("Offline");
      return 42;
    }, { timeoutMs: 10, signal: controller.signal });
    if (fail) await assert.rejects(result, /Offline/);
    else assert.equal(await result, 42);
    controller.abort();
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.equal(signal.aborted, false);
    assert.equal(removed, 1);
  }
});
