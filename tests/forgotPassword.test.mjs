import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import * as crypto from "node:crypto";
import test from "node:test";
import ts from "typescript";

async function load(path, dependencies = {}, globals = {}) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  runInNewContext(output, { exports, Buffer, Date, URL, TextDecoder, Response, AbortController, DOMException,
    setTimeout, clearTimeout, ...globals, require(name) {
      assert.ok(Object.hasOwn(dependencies, name), `Unexpected dependency ${name}`);
      return dependencies[name];
    } });
  return exports;
}
const security = await load("lib/security/request.ts", { "server-only": {} });
const timeout = await load("lib/requestTimeout.ts");
async function invoke(options = {}) {
  const calls = [], sends = [];
  const route = await load("app/api/auth/forgot-password/route.ts", {
    "node:crypto": crypto, "@/lib/security/request": security,
    "@/lib/requestTimeout": { withRequestTimeout: (fn, opts) => timeout.withRequestTimeout(fn, { ...opts, timeoutMs: 50 }) },
    "@/lib/supabase/admin": { createAdminClient: () => ({ rpc(name, args) {
      calls.push({ name, args });
      return { abortSignal: async signal => {
        assert.equal(signal.aborted, false);
        return { data: options.denied === calls.length ? false : true, error: options.limiterError ? {} : null };
      } };
    } }) },
  }, {
    process: { env: { SUPABASE_SECRET_KEY: "private-test-key", NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "public-test-key" } },
    setTimeout: callback => setTimeout(callback, 0),
    fetch: async (url, init) => {
      sends.push({ url: String(url), init });
      if (options.stall) return new Promise(() => {});
      if (options.networkError) throw new Error("sensitive upstream detail");
      return new Response("private provider details", { status: options.providerStatus ?? 200 });
    },
  });
  const response = await route.POST(new Request("https://site.test/api/auth/forgot-password", {
    method: "POST", headers: { Origin: options.origin ?? "https://site.test", "x-real-ip": "192.0.2.1" },
    body: options.raw ?? JSON.stringify(options.body ?? { email: " Person@Example.com ", redirectTo: "https://evil.test" }),
  }));
  return { response, body: await response.json(), calls, sends };
}
test("rejects cross-origin, malformed and oversized requests before email or limiter", async () => {
  for (const options of [{ origin: "https://evil.test" }, { raw: "bad" }, { raw: "x".repeat(3000) },
    { body: { email: "user@users.mao-practice.local" } }, { body: { email: [] } }, { body: { email: "not-email" } }]) {
    const result = await invoke(options);
    assert.ok(result.response.status >= 400);
    assert.equal(result.calls.length, 0); assert.equal(result.sends.length, 0);
  }
});
test("uses normalized email, fixed destination, public key and private hashed limiter keys", async () => {
  const result = await invoke();
  assert.equal(result.response.status, 200);
  assert.equal(result.response.headers.get("cache-control"), "private, no-store");
  assert.equal(result.response.headers.get("set-cookie"), null);
  assert.equal(result.calls.length, 3);
  assert.equal(new Set(result.calls.map(c => c.args.attempt_identifier)).size, 3);
  for (const call of result.calls) {
    assert.equal(call.name, "consume_login_attempt");
    assert.match(call.args.attempt_identifier, /^[a-f0-9]{64}$/);
  }
  assert.deepEqual(result.calls.map(c => c.args.max_attempts), [10, 1, 3]);
  const send = result.sends[0];
  assert.equal(new URL(send.url).searchParams.get("redirect_to"), "https://www.mathematicsdaily.com/auth/confirm");
  assert.equal(send.init.headers.apikey, "public-test-key");
  assert.deepEqual(JSON.parse(send.init.body), { email: "person@example.com" });
  assert.equal(send.init.redirect, "error");
  assert.doesNotMatch(JSON.stringify(result.body), /token|private-test-key|person@example/i);
});
test("IP denial is explicit but address denials and provider account rejections are generic", async () => {
  const normal = await invoke();
  const denied = await invoke({ denied: 1 });
  assert.equal(denied.response.status, 429);
  assert.equal(denied.response.headers.get("retry-after"), "900");
  assert.equal(denied.sends.length, 0);
  for (const n of [2, 3]) {
    const result = await invoke({ denied: n });
    assert.deepEqual(result.body, normal.body); assert.equal(result.sends.length, 0);
  }
  for (const providerStatus of [400, 422, 429]) {
    assert.deepEqual((await invoke({ providerStatus })).body, normal.body);
  }
});
test("limiter, provider and timeout failures fail closed without retries or secret details", async () => {
  for (const options of [{ limiterError: true }, { networkError: true }, { providerStatus: 503 },
    { providerStatus: 401 }, { providerStatus: 403 }, { stall: true }]) {
    const result = await invoke(options);
    assert.equal(result.response.status, 503);
    assert.ok(result.sends.length <= 1);
    if (options.limiterError) assert.equal(result.sends.length, 0);
    assert.doesNotMatch(JSON.stringify(result.body), /sensitive|private provider/);
  }
});
test("email template uses the existing server-verified token-hash recovery route", async () => {
  const template = await readFile(new URL("../supabase/templates/recovery.html", import.meta.url), "utf8");
  assert.match(template, /https:\/\/www\.mathematicsdaily\.com\/auth\/confirm\?token_hash={{ \.TokenHash }}&amp;type=recovery/);
  assert.doesNotMatch(template, /ConfirmationURL|RedirectTo/);
});
