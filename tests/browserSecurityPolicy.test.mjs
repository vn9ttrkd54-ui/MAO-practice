import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

function config(endpoint, environment = "production") {
  return JSON.parse(execFileSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "-e", `
    import config from './next.config.ts';
    console.log(JSON.stringify({ poweredBy: config.poweredByHeader, headers: await config.headers() }));
  `], { cwd: new URL("../", import.meta.url), encoding: "utf8",
    env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: endpoint, NODE_ENV: environment }, stdio: ["ignore", "pipe", "pipe"] }));
}

test("browser network policy restricts Supabase to this project over TLS", () => {
  const result = config("https://example-project.supabase.co");
  assert.equal(result.poweredBy, false);
  const csp = result.headers[0].headers.find(h => h.key === "Content-Security-Policy").value;
  assert.ok(csp.includes("connect-src 'self' https://example-project.supabase.co wss://example-project.supabase.co;"));
  assert.ok(!csp.includes("*.supabase.co"));
  assert.ok(!csp.includes("unsafe-eval"));
  for (const directive of ["frame-ancestors 'none'", "object-src 'none'", "upgrade-insecure-requests"]) assert.ok(csp.includes(directive));
});

test("production rejects insecure or credential-bearing Auth endpoints", () => {
  for (const endpoint of ["http://example-project.supabase.co", "http://127.0.0.1:54321", "https://user:secret@example.test", "ftp://example.test"]) {
    assert.throws(() => config(endpoint));
  }
  assert.doesNotThrow(() => config("http://127.0.0.1:54321", "development"));
});

test("auth and recovery surfaces suppress referrers and shared caching", () => {
  const result = config("https://example-project.supabase.co");
  for (const source of ["/auth/:path*", "/forgot-password", "/reset-password", "/account", "/admin/:path*", "/api/auth/:path*", "/api/account", "/api/admin/:path*"]) {
    const headers = Object.fromEntries(result.headers.find(h => h.source === source).headers.map(h => [h.key, h.value]));
    assert.equal(headers["Referrer-Policy"], "no-referrer");
    assert.match(headers["Cache-Control"], /private, no-store/);
  }
  assert.ok(!result.headers.some(h => h.source === "/api/multiplayer/public-rooms"), "Keep public room caching intact");
});

test("all Supabase auth clients share Secure/Lax production cookie options", async () => {
  const options = await readFile(new URL("../lib/supabase/cookieOptions.ts", import.meta.url), "utf8");
  assert.match(options, /secure: process.env.NODE_ENV === "production"/);
  assert.match(options, /sameSite: "lax"/);
  assert.ok(!options.includes("httpOnly: true"), "Browser Auth still needs to read its own cookies");
  for (const name of ["client", "server", "proxy"]) {
    const source = await readFile(new URL(`../lib/supabase/${name}.ts`, import.meta.url), "utf8");
    assert.match(source, /cookieOptions: authCookieOptions/);
  }
});
