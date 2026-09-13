import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

import * as tutorSafety from "../lib/tutorSafety.ts";
import * as tutorGuidance from "../lib/tutorGuidance.ts";
import * as tutorInstructions from "../lib/tutorInstructions.ts";

// Run the real wrapper with isolated environment values and an in-memory fetch.
// No Next server, real credentials, or provider requests are used by this suite.
const source = await readFile(new URL("../lib/aiTutor.ts", import.meta.url), "utf8");
assert.match(source, /^import "server-only";/);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
});
const fixtureKey = "test-only-provider-key";
const params = {
  question: {
    id: 900001, division: "Mu", topic: "Algebra", difficulty: 2,
    methods: ["factoring"], question: "Factor the expression.",
    choices: ["1", "2", "3", "4", "NOTA"], answer: "A", solution: "Use factoring.",
  },
  message: "Explain the first step.",
  history: [], revealed: true, userId: "fixture-user",
};

function loadProvider(fetchImpl, { apiKey = fixtureKey, model } = {}) {
  const provider = {};
  const calls = [];
  const logs = [];
  const dependencies = {
    "server-only": {}, "node:crypto": { createHash },
    "@/lib/tutorSafety": tutorSafety,
    "@/lib/tutorGuidance": tutorGuidance,
    "@/lib/tutorInstructions": tutorInstructions,
  };
  runInNewContext(outputText, {
    exports: provider,
    require(name) {
      assert.ok(Object.hasOwn(dependencies, name), `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    process: { env: { OPENAI_API_KEY: apiKey, OPENAI_TUTOR_MODEL: model, NODE_ENV: "development" } },
    Buffer, AbortSignal,
    console: { info: (...args) => logs.push(args), warn: (...args) => logs.push(args) },
    fetch: async (...args) => {
      calls.push(args);
      assert.ok(fetchImpl, "This test must explicitly mock every provider call");
      return fetchImpl(...args);
    },
  });
  return { ...provider, calls, logs };
}

function response(data, ok = true) {
  return { ok, json: async () => data };
}

function completed(usage) {
  return { status: "completed", output_text: "A short explanation.", usage };
}

async function rejectsProvider(provider, expectedTokens, code = "provider_error") {
  await assert.rejects(provider.createTutorResponse(params), (error) => {
    assert.ok(error instanceof provider.TutorProviderError);
    assert.equal(error.totalTokens, expectedTokens);
    assert.equal(error.code, code);
    assert.doesNotMatch(error.message, /private provider detail|test-only-provider-key/);
    return true;
  });
  assert.deepEqual(provider.logs, [], "provider failures must not print payloads, credentials, or raw errors");
}

test("reserves against the exact transmitted UTF-8 payload with room for output and framing", async () => {
  const provider = loadProvider(async () => response(completed({ total_tokens: 10 })));
  const unicodeParams = {
    ...params,
    message: "界".repeat(600),
    history: Array.from({ length: 6 }, (_, index) => ({
      role: index % 2 ? "assistant" : "user", content: "界".repeat(900),
    })),
  };
  const reserved = provider.getTutorTokenReservation(unicodeParams);
  assert.equal(provider.calls.length, 0, "preflight must not call the provider");
  await provider.createTutorResponse(unicodeParams);
  const [url, options] = provider.calls[0];
  const bytes = Buffer.byteLength(options.body, "utf8");
  assert.equal(reserved, Math.max(provider.TUTOR_TOKEN_RESERVATION,
    bytes + provider.TUTOR_MAX_OUTPUT_TOKENS + 1024));
  assert.ok(bytes > options.body.length + 10_000, "Unicode must be counted as bytes, not JS characters");
  assert.ok(reserved > provider.getTutorTokenReservation(params));
  assert.equal(url, "https://api.openai.com/v1/responses");
  assert.equal(options.method, "POST");
  assert.equal(options.headers.Authorization, `Bearer ${fixtureKey}`);
  assert.equal(options.signal.aborted, false);
  const payload = JSON.parse(options.body);
  assert.equal(payload.model, "gpt-5-mini");
  assert.equal(payload.max_output_tokens, 1200);
  assert.deepEqual(payload.reasoning, { effort: "low" });
  assert.equal(payload.store, false);
  assert.equal(payload.instructions, tutorInstructions.tutorInstructions(true, false));
  assert.equal(payload.input.length, 8);
  assert.equal(payload.input[0].role, "developer");
  assert.equal(payload.input.at(-1).content, unicodeParams.message);
  assert.equal(payload.safety_identifier, createHash("sha256").update(params.userId).digest("hex"));
  assert.doesNotMatch(options.body, /test-only-provider-key|fixture-user/);
});

test("reservation preflight checks configuration before any provider request", async () => {
  for (const apiKey of [null, "", "   ", "fixture\ninvalid"]) {
    const provider = loadProvider(undefined, { apiKey });
    assert.throws(() => provider.getTutorTokenReservation(params), /not configured/);
    await assert.rejects(provider.createTutorResponse(params), /not configured/);
    assert.equal(provider.calls.length, 0);
  }
});

test("the shared payload builder retains configured model and history limits", async () => {
  const provider = loadProvider(async () => response(completed({ total_tokens: 1 })), { model: "fixture-model" });
  const oversizedHistory = {
    ...params,
    history: Array.from({ length: 9 }, (_, index) => ({ role: "user", content: `${index}${"x".repeat(1000)}` })),
  };
  const reservation = provider.getTutorTokenReservation(oversizedHistory);
  await provider.createTutorResponse(oversizedHistory);
  const body = provider.calls[0][1].body;
  const payload = JSON.parse(body);
  assert.equal(payload.model, "fixture-model");
  assert.equal(payload.input.length, 8);
  assert.equal(payload.input[1].content[0], "3");
  assert.ok(payload.input.slice(1, -1).every((item) => item.content.length === 900));
  assert.ok(reservation >= Buffer.byteLength(body, "utf8") + 1200);
});

test("only an actual nonnegative safe integer total_tokens establishes known usage, including zero", async () => {
  for (const totalTokens of [0, 137, Number.MAX_SAFE_INTEGER]) {
    const provider = loadProvider(async () => response(completed({ total_tokens: totalTokens })));
    const result = await provider.createTutorResponse(params);
    assert.equal(result.totalTokens, totalTokens);
    assert.equal(result.text, "A short explanation.");
  }
});

test("missing, malformed, fractional, negative, nonfinite and unsafe usage remains unknown", async () => {
  const invalidUsage = [undefined, null, [], "12", {}, { input_tokens: 10, output_tokens: 2 },
    ...[undefined, null, "12", false, -1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]
      .map((total_tokens) => ({ total_tokens }))];
  for (const usage of invalidUsage) {
    const provider = loadProvider(async () => response(completed(usage)));
    assert.equal((await provider.createTutorResponse(params)).totalTokens, null);
  }
});

test("network failures, timeouts and malformed JSON retain unknown usage", async () => {
  const failures = [
    async () => { throw new Error("private provider detail"); },
    async () => { throw new DOMException("private provider detail", "TimeoutError"); },
    async () => ({ ok: true, json: async () => { throw new SyntaxError("private provider detail"); } }),
  ];
  for (const failure of failures) await rejectsProvider(loadProvider(failure), null);
  for (const malformed of [null, [], "private provider detail", 3]) {
    await rejectsProvider(loadProvider(async () => response(malformed)), null);
  }
});

test("incomplete responses fail even with text and preserve known or unknown usage", async () => {
  for (const [usage, expected] of [[{ total_tokens: 46 }, 46], [{ total_tokens: 0 }, 0], [undefined, null]]) {
    const provider = loadProvider(async () => response({
      ...completed(usage), status: "incomplete", incomplete_details: { reason: "max_output_tokens" },
    }));
    await rejectsProvider(provider, expected, "response_too_long");
  }
  await rejectsProvider(loadProvider(async () => response({
    ...completed({ total_tokens: 19 }), status: "incomplete", incomplete_details: [],
  })), 19);
});

test("failed and other unfinished statuses never turn returned text into success", async () => {
  for (const status of ["failed", "cancelled", "in_progress", "queued"]) {
    await rejectsProvider(loadProvider(async () => response({
      ...completed({ total_tokens: 31 }), status, error: { message: "private provider detail" },
    })), 31);
  }
  await rejectsProvider(loadProvider(async () => response({
    ...completed(), status: "failed", error: { message: "private provider detail" },
  })), null);
  await rejectsProvider(loadProvider(async () => response(completed({ total_tokens: 7 }), false)), 7);
});

test("malformed output cannot discard usage already reported by the provider", async () => {
  for (const output of [null, {}, "private provider detail", [null, 3, { content: null }, { content: [null, { type: "output_text", text: 5 }] }]]) {
    await rejectsProvider(loadProvider(async () => response({ status: "completed", usage: { total_tokens: 81 }, output })), 81);
  }
  // A downstream parsing failure must also keep metrics extracted before output.
  const malformed = { status: "completed", usage: { total_tokens: 82 } };
  Object.defineProperty(malformed, "output", { get() { throw new Error("private provider detail"); } });
  await rejectsProvider(loadProvider(async () => response(malformed)), 82);
});

test("defensive output parsing accepts real text among optional and malformed content", async () => {
  const provider = loadProvider(async () => response({
    status: "completed", usage: { total_tokens: 21 },
    output: [null, { type: "reasoning" }, { content: [null, { type: "output_text", text: " First. " },
      { type: "other", text: "Ignore." }, { type: "output_text", text: " Second. " }] }],
  }));
  const result = await provider.createTutorResponse(params);
  assert.equal(result.text, "First.\n\nSecond.");
  assert.equal(result.totalTokens, 21);
});
