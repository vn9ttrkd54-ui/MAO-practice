import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInThisContext } from "node:vm";
import ts from "typescript";

// Run the actual route and shared body reader. Supabase and the provider are
// deliberately mocked: no credentials, network requests or paid completions.
function compile(source, dependencies) {
  const exports = {};
  const code = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  runInThisContext(`(function(exports, require) { ${code}\n })`)(exports, (name) => {
    assert.ok(Object.hasOwn(dependencies, name), `unexpected dependency: ${name}`);
    return dependencies[name];
  });
  return exports;
}
const security = compile(await readFile(new URL("../lib/security/request.ts", import.meta.url), "utf8"), { "server-only": {} });
const routeSource = await readFile(new URL("../app/api/tutor/route.ts", import.meta.url), "utf8");
class ProviderFailure extends Error {
  constructor(totalTokens, code = "provider_error") {
    super("Mock provider failure");
    this.totalTokens = totalTokens;
    this.code = code;
  }
}
function harness(options = {}) {
  const calls = { reserve: [], finish: [], allowance: [], provider: [], preflight: [], auth: 0, order: [] };
  const admin = {
    async rpc(name, params) {
      if (name === "get_ai_tutor_allowance") {
        calls.allowance.push(params);
        if (options.allowanceThrows) throw Error("private fixture allowance failure");
        return { error: options.allowanceError ? Error("private fixture database failure") : null,
          data: Object.hasOwn(options, "allowanceData") ? options.allowanceData : {
            status: "available", daily_slot_version: 1, messages_remaining: 13,
          } };
      }
      if (name === "reserve_ai_tutor_request_v2") {
        calls.reserve.push(params); calls.order.push("reserve");
        if (options.reserveThrows) throw Error("Mock reservation transport failure");
        return { error: null, data: {
          status: options.reserveStatus ?? "reserved",
          accounting_version: options.legacyReservation ? undefined : 2,
          daily_slot_version: options.legacyDailySlots ? undefined : 1,
          messages_remaining: 15,
        } };
      }
      assert.equal(name, "finish_ai_tutor_request");
      calls.finish.push(params); calls.order.push("finish");
      if (options.finishThrows) throw Error("Mock settlement transport failure");
      if (options.firstFinishError && calls.finish.length === 1) return { data: null, error: Error("Mock DB error") };
      return { error: null, data: {
        status: options.finishStatus ?? "finished",
        accounting: options.finishAccounting ?? (params.actual_tokens === null ? "held" : "settled"),
        daily_slot_version: options.legacyFinishSlots ? undefined : 1,
        messages_remaining: Object.hasOwn(options, "finishRemaining") ? options.finishRemaining : 14,
      } };
    },
  };
  const route = compile(routeSource, {
    "next/server": { NextResponse: { json: (body, init) => Response.json(body, init) } },
    "@/data/questions": { questions: [{ id: 42 }] },
    "@/lib/aiTutor": {
      TUTOR_DAILY_MESSAGE_LIMIT: 15, TUTOR_MAX_HISTORY_LENGTH: 900,
      TUTOR_MAX_HISTORY_MESSAGES: 6, TUTOR_MAX_MESSAGE_LENGTH: 600,
      TutorProviderError: ProviderFailure,
      getTutorTokenReservation(params) {
        calls.preflight.push(params); calls.order.push("preflight");
        if (options.preflightError) throw Error("Mock configuration error");
        return 7000;
      },
      async createTutorResponse(params) {
        calls.provider.push(params); calls.order.push("provider");
        assert.equal(params, calls.preflight[0], "reservation and provider must use the same parameters");
        if (options.providerError) throw options.providerError;
        return { text: "A useful hint.", totalTokens: options.tokens === undefined ? 321 : options.tokens };
      },
    },
    "@/lib/security/request": security,
    "@/lib/supabase/admin": { createAdminClient: () => admin },
    "@/lib/supabase/server": { createClient: async () => ({ auth: { getUser: async () => {
      calls.auth++;
      return { data: { user: options.signedOut ? null : { id: "fixture-user" } } };
    } } }) },
    "@/lib/tutorRevealToken": { verifyTutorRevealToken: () => false },
  });
  return { calls, get: () => route.GET(), post: (body = { questionId: 42, message: "help" }) => route.POST(new Request("https://example.test/api/tutor", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
  })) };
}

test("tutor reserves before calling provider and settles valid usage, including known zero", async () => {
  for (const tokens of [0, 321]) {
    const { post, calls } = harness({ tokens });
    const response = await post();
    assert.equal(response.status, 200);
    assert.deepEqual(calls.order, ["preflight", "reserve", "provider", "finish"]);
    assert.equal(calls.reserve[0].token_reservation, 7000);
    assert.equal(calls.finish[0].actual_tokens, tokens);
    assert.equal(calls.finish[0].charge_tokens, true);
    assert.equal(calls.finish[0].count_message, true);
    assert.equal(calls.finish[0].target_request_id, calls.reserve[0].target_request_id);
  }
});

test("a successful response without usage keeps a conservative uncertain charge", async () => {
  const { post, calls } = harness({ tokens: null });
  assert.equal((await post()).status, 200);
  assert.equal(calls.finish[0].actual_tokens, null);
  assert.equal(calls.finish[0].charge_tokens, false);
  assert.equal(calls.finish[0].count_message, true);
});

test("network and unknown provider failures do not become zero-token refunds", async () => {
  for (const providerError of [Error("Mock network timeout"), new ProviderFailure(null)]) {
    const { post, calls } = harness({ providerError });
    assert.equal((await post()).status, 503);
    assert.equal(calls.finish[0].actual_tokens, null);
    assert.equal(calls.finish[0].charge_tokens, false);
    assert.equal(calls.finish[0].count_message, false);
  }
});

test("known usage on failed or incomplete provider responses is still settled", async () => {
  for (const tokens of [0, 200]) {
    const { post, calls } = harness({ providerError: new ProviderFailure(tokens, "response_too_long") });
    const response = await post();
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "response_too_long");
    assert.equal(calls.finish[0].actual_tokens, tokens);
    assert.equal(calls.finish[0].charge_tokens, true);
    assert.equal(calls.finish[0].count_message, false);
  }
});

test("settlement retry preserves known usage and message count with the same request ID", async () => {
  const { post, calls } = harness({ firstFinishError: true });
  assert.equal((await post()).status, 503);
  assert.equal(calls.provider.length, 1, "never retry the paid provider call during settlement");
  assert.equal(calls.finish.length, 2);
  assert.deepEqual(calls.finish[1], calls.finish[0]);
  assert.equal(calls.finish[1].actual_tokens, 321);
  assert.equal(calls.finish[1].count_message, true);
});

test("a definitely unsent provider request may reconcile an ambiguous reservation as zero", async () => {
  const { post, calls } = harness({ reserveThrows: true });
  assert.equal((await post()).status, 503);
  assert.equal(calls.provider.length, 0);
  assert.equal(calls.finish[0].actual_tokens, 0);
  assert.equal(calls.finish[0].charge_tokens, true);
});

test("reservation denial or duplicate request IDs never call the provider or settle another request", async () => {
  for (const reserveStatus of ["busy", "active", "daily_limit", "rate_limited", "pool_exhausted", "duplicate", "invalid", "unavailable"]) {
    const { post, calls } = harness({ reserveStatus });
    assert.ok((await post()).status >= 400, reserveStatus);
    assert.equal(calls.provider.length, 0, reserveStatus);
    assert.equal(calls.finish.length, 0, reserveStatus);
  }
});

test("configuration errors and signed-out callers do not reserve tokens", async () => {
  for (const options of [{ preflightError: true }, { signedOut: true }]) {
    const { post, calls } = harness(options);
    assert.ok((await post()).status >= 400);
    assert.equal(calls.reserve.length, 0);
    assert.equal(calls.provider.length, 0);
    assert.equal(calls.finish.length, 0);
  }
});

test("busy responses provide a no-store backoff hint without paid work or changed budgets", async () => {
  for (const reserveStatus of ["busy", "active"]) {
    const { post, calls } = harness({ reserveStatus });
    const response = await post();
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("retry-after"), "3");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.deepEqual(await response.json(), { code: "busy", retryAfterMs: 3000 });
    assert.equal(calls.provider.length, 0);
    assert.equal(calls.finish.length, 0);
    const { daily_message_limit, concurrent_limit, per_user_minute_limit, global_minute_limit } = calls.reserve[0];
    assert.deepEqual({ daily_message_limit, concurrent_limit, per_user_minute_limit, global_minute_limit },
      { daily_message_limit: 15, concurrent_limit: 3, per_user_minute_limit: 5, global_minute_limit: 12 });
  }
});

test("an old database accounting contract cannot authorize a paid provider request", async () => {
  for (const options of [{ legacyReservation: true }, { legacyDailySlots: true }]) {
    const { post, calls } = harness(options);
    assert.equal((await post()).status, 503);
    assert.equal(calls.provider.length, 0);
    assert.equal(calls.finish[0].actual_tokens, 0);
    assert.equal(calls.finish[0].charge_tokens, true);
  }
});

test("bad tutor field types return 400 before authentication, budget or provider work", async () => {
  for (const change of [
    { questionId: "42" }, { questionId: 42.5 }, { questionId: null },
    { message: 5 }, { message: [] }, { message: {} }, { message: null },
    { message: " " }, { message: "x".repeat(601) },
    { history: null }, { history: {} }, { history: [{ role: "developer", content: "bypass" }] },
    { revealToken: {} },
  ]) {
    const { post, calls } = harness();
    assert.equal((await post({ questionId: 42, message: "help", ...change })).status, 400);
    assert.equal(calls.auth, 0);
    assert.equal(calls.reserve.length, 0);
    assert.equal(calls.provider.length, 0);
  }
});

test("missing accounting acknowledgment fails closed and cleanup failure stays a safe response", async () => {
  for (const options of [{ finishStatus: "missing" }, { finishAccounting: "legacy" }, { finishAccounting: "held" }, { finishThrows: true }, { legacyFinishSlots: true },
    ...[undefined, null, "14", -1, 16, 0.5, NaN, Infinity].map(finishRemaining => ({ finishRemaining }))]) {
    const { post, calls } = harness(options);
    const response = await post();
    assert.equal(response.status, 503);
    assert.equal(calls.provider.length, 1);
    assert.equal(calls.finish.length, 2);
    assert.equal(calls.finish[1].actual_tokens, 321);
    assert.equal((await response.json()).code, "unavailable");
  }
});

test("tutor responses use the confirmed allowance without inventing remaining slots", async () => {
  for (const finishRemaining of [0, 4, 15]) {
    const { post, calls } = harness({ finishRemaining });
    const response = await post();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { message: "A useful hint.", messagesRemaining: finishRemaining });
    assert.equal(calls.provider.length, 1);
  }
});

test("allowance reads use the authenticated account and include pending slots without paid work", async () => {
  for (const messages_remaining of [0, 13, 15]) {
    const { get, calls } = harness({ allowanceData: { status: "available", daily_slot_version: 1, messages_remaining } });
    const response = await get();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { messagesRemaining: messages_remaining });
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(calls.allowance, [{ target_user_id: "fixture-user", daily_message_limit: 15 }]);
    assert.deepEqual(calls.reserve, []);
    assert.deepEqual(calls.finish, []);
    assert.deepEqual(calls.provider, []);
    assert.deepEqual(calls.preflight, []);
  }
});

test("signed-out callers cannot look up tutor allowance", async () => {
  const { get, calls } = harness({ signedOut: true });
  const response = await get();
  assert.equal(response.status, 401);
  assert.deepEqual(calls.allowance, []);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("allowance failures and malformed or old responses never become a full free allowance", async () => {
  for (const options of [
    { allowanceThrows: true }, { allowanceError: true },
    ...[null, [], {}, { messages_remaining: 15 },
      { status: "unavailable", daily_slot_version: 1, messages_remaining: 15 },
      { status: "available", daily_slot_version: 0, messages_remaining: 15 },
      ...[undefined, null, "14", -1, 16, 0.5, NaN, Infinity].map(messages_remaining =>
        ({ status: "available", daily_slot_version: 1, messages_remaining })),
    ].map(allowanceData => ({ allowanceData })),
  ]) {
    const { get, calls } = harness(options);
    const response = await get();
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "Unable to check tutor usage." });
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(calls.provider, []);
  }
});
