// Client-reference JS only, not total page transfer or hosted latency.
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { gzipSync } from "node:zlib";
import { resolve } from "node:path";

const build = resolve(import.meta.dirname, "../.next");
const context = { globalThis: {} };
runInNewContext(await readFile(resolve(build, "server/app/dashboard/page_client-reference-manifest.js"), "utf8"), context);
const manifest = Object.values(context.globalThis.__RSC_MANIFEST)[0];
const files = [...new Set(Object.entries(manifest.clientModules)
  .filter(([key]) => key.endsWith("/DashboardClient.tsx"))
  .flatMap(([, value]) => value.chunks).filter(path => path.endsWith(".js")))];
if (!files.length) throw new Error("No dashboard client chunks found");
let bytes = 0, gzipBytes = 0;
for (const file of files) {
  const body = await readFile(resolve(build, decodeURIComponent(file)));
  bytes += body.length;
  gzipBytes += gzipSync(body).length;
}
console.log(JSON.stringify({ route: "dashboard", bytes, gzipBytes, chunks: files.length }));
