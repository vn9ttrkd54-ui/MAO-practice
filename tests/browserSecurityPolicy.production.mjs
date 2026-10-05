// HTTP-only checks against the local production build. No live account writes.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

const reservation = createServer();
reservation.listen(0, "127.0.0.1");
await once(reservation, "listening");
const port = reservation.address().port;
await new Promise(resolve => reservation.close(resolve));
const root = new URL("../", import.meta.url);
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)],
  { cwd: root, env: { ...process.env, NODE_ENV: "production" }, stdio: "ignore" });
const closed = once(server, "exit");
const base = `http://127.0.0.1:${port}`;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    assert.equal(server.exitCode, null, "Local production server exited before starting");
    try {
      const response = await fetch(`${base}/privacy`, { signal: AbortSignal.timeout(1000) });
      await response.body?.cancel();
      if (response.ok) { ready = true; break; }
    } catch { /* A startup connection refusal is expected. */ }
    await delay(100);
  }
  assert.ok(ready, "Local production server did not become ready");
  for (const path of ["/reset-password", "/account", "/api/auth/login", "/api/account", "/api/admin/feedback"]) {
    const response = await fetch(base + path, { redirect: "manual", signal: AbortSignal.timeout(5000) });
    assert.ok(response.status < 500, `${path}: unexpected server failure`);
    assert.equal(response.headers.get("referrer-policy"), "no-referrer", path);
    assert.match(response.headers.get("cache-control") ?? "", /no-store/, path);
    assert.equal(response.headers.get("x-powered-by"), null, path);
    const csp = response.headers.get("content-security-policy") ?? "";
    assert.ok(csp.includes("connect-src 'self'"), path);
    assert.ok(!csp.includes("*.supabase.co"), path);
    assert.ok(!csp.includes("unsafe-eval"), path);
    await response.body?.cancel();
  }
  console.log("PASS: production auth/account headers, restricted connection policy, no shared caching and no framework disclosure.");
} finally {
  server.kill("SIGTERM");
  const stopped = await Promise.race([closed.then(() => true), delay(3000).then(() => false)]);
  if (!stopped) { server.kill("SIGKILL"); await closed; }
}
