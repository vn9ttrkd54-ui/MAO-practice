import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInThisContext } from "node:vm";
import ts from "typescript";

// Execute the real helper without a Next server or network. Only Next's build-time
// server-only marker is stubbed; the application keeps that import intact.
const source = await readFile(new URL("../lib/security/request.ts", import.meta.url), "utf8");
assert.match(source, /^import "server-only";/);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
});
const helper = {};
runInThisContext(`(function(exports, require) { ${outputText}\n })`)(helper, (name) => {
  assert.equal(name, "server-only", "unexpected helper dependency");
  return {};
});
const { readJsonBody, RequestBodyError, isTrustedMutationRequest } = helper;
const encoder = new TextEncoder();

function streamRequest(chunks, { headers, signal, cancel } = {}) {
  const state = { reads: 0, cancellations: 0 };
  const body = new ReadableStream({
    pull(controller) {
      if (state.reads === chunks.length) {
        controller.close();
        return;
      }
      const chunk = chunks[state.reads++];
      controller.enqueue(typeof chunk === "string" ? encoder.encode(chunk) : chunk);
    },
    cancel() {
      state.cancellations++;
      return cancel?.();
    },
  }, { highWaterMark: 0 });
  const request = new Request("https://example.test/api/fixture", {
    method: "POST", body, duplex: "half", headers, signal,
  });
  return { request, state };
}

async function rejectsWithStatus(promise, status) {
  await assert.rejects(promise, (error) => error instanceof RequestBodyError && error.status === status);
}

test("parses a JSON object at the exact byte limit, including split UTF-8 characters", async () => {
  const bytes = encoder.encode('{"message":"é🦙"}');
  for (const headers of [undefined, { "content-length": String(bytes.length) }]) {
    const { request } = streamRequest(Array.from(bytes, (byte) => new Uint8Array([byte])), { headers });
    assert.deepEqual(await readJsonBody(request, bytes.length), { message: "é🦙" });
    assert.equal(request.body.locked, false);
  }
});

test("cancels an oversized stream without Content-Length before reading the remaining chunks", async () => {
  const { request, state } = streamRequest(['{"x":"', "abcdefgh", "must not be read"]);
  await rejectsWithStatus(readJsonBody(request, 8), 413);
  assert.equal(state.reads, 2);
  assert.equal(state.cancellations, 1);
  assert.equal(request.body.locked, false);
});

test("checks received bytes even when Content-Length understates an oversized chunk", async () => {
  const { request, state } = streamRequest(["0123456789", "must not be read"], {
    headers: { "content-length": "2" },
  });
  await rejectsWithStatus(readJsonBody(request, 8), 413);
  assert.equal(state.reads, 1);
  assert.equal(state.cancellations, 1);
  assert.equal(request.body.locked, false);
});

test("rejects a declared oversize before pulling any body chunks", async () => {
  const { request, state } = streamRequest(["{}"], { headers: { "content-length": "9" } });
  await rejectsWithStatus(readJsonBody(request, 8), 413);
  assert.equal(state.reads, 0);
  assert.equal(state.cancellations, 1);
  assert.equal(request.body.locked, false);
});

test("rejects malformed, negative, fractional, duplicate and unsafe declared lengths", async () => {
  for (const length of ["", "-1", "+2", "2.5", "2e0", "0x2", "NaN", "Infinity", "2, 2", "9007199254740993"]) {
    const { request, state } = streamRequest(["{}"], { headers: { "content-length": length } });
    await rejectsWithStatus(readJsonBody(request, 16), 400);
    assert.equal(state.reads, 0, length);
    assert.equal(state.cancellations, 1, length);
  }
});

test("rejects bodies shorter or longer than a sane declared length", async () => {
  for (const length of ["0", "1", "3"]) {
    const { request } = streamRequest(["{}"], { headers: { "content-length": length } });
    await rejectsWithStatus(readJsonBody(request, 16), 400);
    assert.equal(request.body.locked, false);
  }
});

test("byte limits apply to UTF-8 bytes rather than JavaScript string length", async () => {
  const text = '{"x":"🦙"}';
  const { request } = streamRequest([text]);
  await rejectsWithStatus(readJsonBody(request, text.length), 413);
});

test("rejects malformed and truncated UTF-8 instead of silently replacing bytes", async () => {
  const prefix = encoder.encode('{"x":"');
  for (const invalid of [new Uint8Array([0xff]), new Uint8Array([0xf0, 0x9f])]) {
    // Replacement decoding would turn these into valid JSON containing U+FFFD.
    const { request } = streamRequest([prefix, invalid, '"}']);
    await rejectsWithStatus(readJsonBody(request, 64), 400);
    assert.equal(request.body.locked, false);
  }
  const { request } = streamRequest([prefix, new Uint8Array([0xf0, 0x9f])]);
  await rejectsWithStatus(readJsonBody(request, 64), 400);
  assert.equal(request.body.locked, false);
});

test("rejects malformed JSON and every non-object JSON top-level value", async () => {
  for (const text of ["", " ", "{", "{}garbage", "null", "[]", "[{}]", '"text"', "1", "true", "false"]) {
    const { request } = streamRequest([text]);
    await rejectsWithStatus(readJsonBody(request, 64), 400);
    assert.equal(request.body.locked, false, text);
  }
});

test("maps failed body streams, missing bodies and consumed bodies to a safe 400", async () => {
  const failed = new Request("https://example.test", {
    method: "POST", duplex: "half",
    body: new ReadableStream({ start(controller) { controller.error(new Error("private transport detail")); } }),
  });
  await assert.rejects(readJsonBody(failed, 64), (error) => {
    assert.equal(error instanceof RequestBodyError, true);
    assert.equal(error.status, 400);
    assert.equal(error.message, "Invalid request.");
    return true;
  });
  assert.equal(failed.body.locked, false);
  await rejectsWithStatus(readJsonBody(new Request("https://example.test", { method: "POST" }), 64), 400);
  const { request } = streamRequest(["{}"]);
  await request.text();
  await rejectsWithStatus(readJsonBody(request, 64), 400);
});

test("rejects a locked body without releasing another consumer's lock", async () => {
  const { request } = streamRequest(["{}"]);
  const owner = request.body.getReader();
  await rejectsWithStatus(readJsonBody(request, 64), 400);
  assert.equal(request.body.locked, true);
  owner.releaseLock();
});

test("returns promptly even if the rejected stream never finishes cancellation", { timeout: 1000 }, async () => {
  const { request, state } = streamRequest(["0123456789"], { cancel: () => new Promise(() => {}) });
  await rejectsWithStatus(readJsonBody(request, 8), 413);
  assert.equal(state.cancellations, 1);
  assert.equal(request.body.locked, false);
});

test("aborting a pending read cancels the stream, releases the reader and returns 400", { timeout: 1000 }, async () => {
  const controller = new AbortController();
  let cancellations = 0;
  const request = new Request("https://example.test", {
    method: "POST", duplex: "half", signal: controller.signal,
    body: new ReadableStream({ cancel() { cancellations++; } }, { highWaterMark: 0 }),
  });
  const result = readJsonBody(request, 64);
  controller.abort();
  await rejectsWithStatus(result, 400);
  assert.equal(cancellations, 1);
  assert.equal(request.body.locked, false);
});

test("same-origin checks retain existing behavior and are not treated as bot detection", () => {
  const request = (headers) => new Request("https://example.test/api/fixture", { headers });
  assert.equal(isTrustedMutationRequest(request({ origin: "https://example.test", "sec-fetch-site": "same-origin" })), true);
  assert.equal(isTrustedMutationRequest(request({ origin: "https://other.test" })), false);
  assert.equal(isTrustedMutationRequest(request({ "sec-fetch-site": "cross-site" })), false);
  assert.equal(isTrustedMutationRequest(request({})), true);
});
