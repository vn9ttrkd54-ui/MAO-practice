// Read-only, local production-build measurement. These are client-reference
// chunks, not total page transfer, RSC payloads, or a hosted latency benchmark.
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { gzipSync } from "node:zlib";
import { resolve } from "node:path";

const build = resolve(import.meta.dirname, "../.next");
for (const route of ["mu", "alpha", "theta", "[id]"]) {
  const context = { globalThis: {} };
  const source = await readFile(resolve(build, `server/app/practice/question-bank/${route}/page_client-reference-manifest.js`), "utf8");
  runInNewContext(source, context);
  const manifest = Object.values(context.globalThis.__RSC_MANIFEST)[0];
  const files = [...new Set(Object.entries(manifest.clientModules)
    .filter(([key]) => key.includes("QuestionBankDivisionClient") || key.endsWith("/QuestionClient.tsx"))
    .flatMap(([, value]) => value.chunks).filter(path => path.endsWith(".js")))];
  if (!files.length) throw new Error(`No Question Bank client chunks found for ${route}`);
  let bytes = 0, gzipBytes = 0;
  for (const file of files) {
    const body = await readFile(resolve(build, decodeURIComponent(file)));
    bytes += body.length;
    gzipBytes += gzipSync(body).length;
  }
  console.log(JSON.stringify({ route, bytes, gzipBytes, chunks: files.length }));
}
