import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import * as ssr from "@supabase/ssr";
import { withRequestTimeout } from "../lib/requestTimeout.ts";
import { questionReadError } from "../lib/questionReadError.ts";
import { createApiObserver } from "../lib/apiMetrics.ts";
import * as timing from "../lib/practiceTiming.ts";

const first = "11111111-1111-4111-8111-111111111111", second = "22222222-2222-4222-8222-222222222222";
async function load(path, dependencies, globals = {}) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  runInNewContext(`(function(exports,require){${code}\n})`, {
    URL, URLSearchParams, Request, Response, AbortController, AbortSignal, Error, Date, ...globals,
  })(exports, name => { assert.ok(name in dependencies, name); return dependencies[name]; });
  return exports;
}
const contract = await load("lib/questionState.ts", { "@/lib/practiceTiming": timing });
const db = await load("lib/questionBankServer.ts", { "server-only": {} });
const stateValue = () => ({ userId: first, questionId: 10238, bookmarked: true, progress: {
  attempts: 8, correct: 3, lastResult: "correct", lastCorrectAt: 1770000000000,
  timing: { count: 3, totalSeconds: 45, bestSeconds: 10 },
} });

test("owner hints support real SSR encoding/chunks, reject damaged cookies, and ignore token rotation", async () => {
  const document = { cookie: "" };
  const { browserOwnerHint } = await load("lib/supabase/browserOwnerHint.ts", { "@supabase/ssr": ssr }, {
    document, process: { env: { NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co" } },
  });
  const cookie = (owner, padding = "") => `base64-${ssr.stringToBase64URL(JSON.stringify({
    access_token: `header.${ssr.stringToBase64URL(JSON.stringify({ sub: owner, exp: 1 }))}.signature`,
    refresh_token: padding,
  }))}`;
  const install = value => {
    document.cookie = ssr.createChunks("sb-fixture-auth-token", value).map(c => ssr.serializeCookieHeader(c.name, c.value)).join("; ");
  };
  assert.equal(browserOwnerHint(), null);
  document.cookie = "sb-other-auth-token=broken; unrelated=x";
  assert.equal(browserOwnerHint(), null);
  install(cookie(first)); assert.equal(browserOwnerHint(), first);
  install(cookie(first, "x".repeat(8000))); assert.equal(browserOwnerHint(), first);
  install(cookie(second)); assert.equal(browserOwnerHint(), second);
  for (const malformed of ["null", "{}", "base64-%%%", "base64-e30", cookie("not-a-uuid")]) {
    install(malformed); assert.throws(browserOwnerHint, /account could not be confirmed/);
  }
  document.cookie = "sb-fixture-auth-token.1=partial";
  assert.throws(browserOwnerHint, /account could not be confirmed/);
});

test("read transport avoids browser Auth, preserves owner checks, and never reflects raw errors", async () => {
  let owner = first, code = 200, value = stateValue(), failBody = false, change = false, called = 0;
  const transport = await load("lib/services/questionBankReadTransport.ts", {
    "@/lib/supabase/browserOwnerHint": { browserOwnerHint: () => owner },
    "@/lib/questionReadError": { questionReadError },
  }, { fetch: async (url, options) => {
    called++;
    assert.match(url, /^\/api\/practice\/question-bank\/state\?/);
    assert.equal(new URL(url, "https://fixture.test").searchParams.get("owner"), first);
    assert.equal(options.cache, "no-store"); assert.equal(options.credentials, "same-origin");
    if (change) owner = second;
    return { status: code, ok: code === 200, json: async () => { if (failBody) throw Error("private upstream error"); return value; } };
  } });
  const read = () => transport.readQuestionBankState(new URLSearchParams({ questionId: "10238" }), first, new AbortController().signal);
  assert.equal((await read()).progress.attempts, 8);
  for (const status of [401, 409]) { code = status; await assert.rejects(read(), transport.QuestionBankReadAccountError); }
  code = 503; value = { error: "private SQL token=secret", code: "42501" };
  await assert.rejects(read(), /QB-DETAIL-PERMISSION/);
  failBody = true; await assert.rejects(read(), error => /QB-DETAIL-REQUEST/.test(error.message) && !/private/.test(error.message));
  failBody = false; code = 200; value = stateValue(); change = true;
  await assert.rejects(read(), transport.QuestionBankReadAccountError);
  assert.equal(called, 6);
});

async function routeFixture() {
  const state = { user: { id: first, app_metadata: {} }, authError: null, fail: null, stall: null, reads: [], authCalls: 0, signal: null, value: stateValue() };
  const client = {
    auth: { async getUser() {
      state.authCalls++;
      if (state.stall === "auth") return new Promise(() => {});
      return { data: { user: state.user }, error: state.authError };
    } },
    rpc(name, args) { return { abortSignal: async signal => {
      state.reads.push({ name, args, signal });
      if (state.stall === "data") return new Promise(() => {});
      return { data: state.value, error: state.fail };
    } }; },
  };
  const { GET } = await load("app/api/practice/question-bank/state/route.ts", {
    "@/lib/supabase/server": { createClient: async signal => { state.signal = signal; return client; } },
    "@/lib/requestTimeout": { withRequestTimeout: (work, options) => withRequestTimeout(work, { ...options, timeoutMs: 30 }) },
    "@/lib/serverPerformance": { observeApi: createApiObserver() },
    "@/lib/questionBankServer": { ...db, readQuestionBankListing: async (_client, owner, min, max, signal) => {
      state.reads.push({ owner, min, max, signal });
      return { userId: owner, statuses: { [min]: "solved" }, bookmarkedQuestionIds: [max] };
    } },
    "@/lib/questionState": contract,
  });
  const read = (query = `owner=${first}&questionId=10238`, signal) => GET(new Request(`https://fixture.test/api/practice/question-bank/state?${query}`, { signal }));
  return { state, read };
}

test("saved-state API verifies the account once, uses RLS client, returns compact private data and timings", async () => {
  const { read, state } = await routeFixture();
  const response = await read();
  assert.equal(response.status, 200); assert.equal(state.authCalls, 1);
  assert.equal(state.reads[0].name, "get_question_state"); assert.equal(state.reads[0].args.p_question_id, 10238);
  assert.match(response.headers.get("Cache-Control"), /private, no-store/);
  assert.equal(response.headers.get("Vary"), "Cookie");
  assert.match(response.headers.get("Server-Timing"), /auth;dur=.*data;dur=/);
  assert.equal((await response.json()).progress.attempts, 8);
  const listing = await read(`owner=${first}&min=10001&max=10325`);
  assert.equal(listing.status, 200); assert.equal((await listing.json()).userId, first);
  assert.equal(state.reads[1].owner, first);
});

test("forged owners, expired sessions, incomplete setup and malformed requests cannot read private state", async () => {
  for (const kind of ["no-user", "auth-error", "other-user", "google-setup", "explicit-setup"]) {
    const { state, read } = await routeFixture();
    if (kind === "no-user") state.user = null;
    if (kind === "auth-error") state.authError = { status: 401, message: "private auth detail" };
    if (kind === "other-user") state.user.id = second;
    if (kind === "google-setup") state.user.app_metadata = { provider: "google" };
    if (kind === "explicit-setup") state.user.app_metadata = { needs_username: true };
    const response = await read();
    assert.equal(response.status, kind.includes("setup") ? 403 : kind === "other-user" ? 409 : 401);
    assert.equal(state.reads.length, 0);
    assert.doesNotMatch(await response.text(), /private auth/);
  }
  for (const query of ["", "owner=wrong&questionId=1", `owner=${first}&questionId=-1`, `owner=${first}&questionId=2.1`,
    `owner=${first}&questionId=2147483648`, `owner=${first}&questionId=1&min=1&max=2`,
    `owner=${first}&min=1&max=90000`, `owner=${first}&min=3&max=2`]) {
    const { state, read } = await routeFixture();
    assert.equal((await read(query)).status, 400); assert.equal(state.authCalls, 0);
  }
});

test("server auth/data deadlines abort work; failures never return empty success or sensitive diagnostics", async () => {
  for (const stall of ["auth", "data"]) {
    const { state, read } = await routeFixture(); state.stall = stall;
    const response = await read();
    assert.equal(response.status, 503); assert.equal(state.signal.aborted, true);
    if (stall === "auth") assert.equal(state.reads.length, 0);
  }
  const { state, read } = await routeFixture(); state.fail = { code: "42501", message: "secret SQL" };
  const response = await read();
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "Unable to load saved state. Please retry.", code: "42501" });
  state.fail = null; state.value.userId = second;
  assert.equal((await read()).status, 503);
  const controller = new AbortController(); controller.abort(); const before = state.authCalls;
  assert.equal((await read(undefined, controller.signal)).status, 503); assert.equal(state.authCalls, before);
  const outage = await routeFixture(); outage.state.authError = { status: 503, message: "provider details" };
  assert.equal((await outage.read()).status, 503, "an Auth outage must not be mistaken for a different account");
  assert.equal(outage.state.reads.length, 0);
});

test("request-scoped server fetch propagates cancellation to Auth and preserves normal client defaults", async () => {
  let options;
  const { createClient } = await load("lib/supabase/server.ts", {
    "@supabase/ssr": { createServerClient: (_url, _key, settings) => { options = settings; return {auth:{getUser:async()=>({data:{user:null}})}}; } },
    "next/headers": { cookies: async () => ({ getAll: () => [], set: () => {} }) },
    "./cookieOptions": { authCookieOptions: {} },
    "next/navigation": { redirect: () => { throw new Error("Unexpected redirect"); } },
    "@/lib/auth/accountAccess": await load("lib/auth/accountAccess.ts"),
  }, { process: { env: {} }, fetch: async (_input, init) => init });
  await createClient(); assert.equal(options.global, undefined);
  const controller = new AbortController(); await createClient(controller.signal);
  const individual = new AbortController();
  const forwarded = await options.global.fetch("https://fixture.test/auth/v1/user", { signal: individual.signal });
  assert.equal(forwarded.signal.aborted, false); controller.abort(); assert.equal(forwarded.signal.aborted, true);
});

test("only the exact self-authenticating read route skips duplicate proxy auth; mutations stay protected", async () => {
  let sessions = 0;
  const { proxy } = await load("proxy.ts", {
    "next/server": { NextResponse: { next: () => "next" } },
    "@/lib/supabase/proxy": { updateSession: async () => { sessions++; return "protected"; } },
  });
  for (const method of ["GET", "HEAD"]) {
    assert.equal(await proxy({ nextUrl: { pathname: "/api/practice/question-bank/state" }, method }), "next");
  }
  for (const [pathname, method] of [["/api/practice/question-bank/state", "POST"], ["/api/practice/question-bank/state/other", "GET"],
    ["/api/practice/result", "POST"], ["/api/multiplayer/rooms/room/round", "GET"]]) {
    assert.equal(await proxy({ nextUrl: { pathname }, method }), "protected");
  }
  assert.equal(sessions, 4);
});
