// Real question surfaces and catalog; only account/realtime calls are mocked locally.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium, expect } from "@playwright/test";
import { muQuestions } from "../data/questions/mu.ts";
import { alphaQuestions } from "../data/questions/alpha.ts";
import { thetaQuestions } from "../data/questions/theta.ts";

const root = resolve(import.meta.dirname, "..");
const fixture = name => join(root, "tests/browserFixtures", name);
const output = await mkdtemp(join(tmpdir(), "question-credit-visibility-"));
const require = createRequire(import.meta.url);
const compiler = require("next/dist/compiled/webpack/webpack").webpack({
  mode: "development", entry: fixture("questionSources.tsx"), devtool: false,
  output: { path: output, filename: "client.js", publicPath: "/" },
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/navigation": fixture("sourceCreditRouter.ts"), "next/link": fixture("link.tsx"),
    "next/image": fixture("googleImage.tsx"), "@/lib/multiplayerRealtime": fixture("realtime.ts"),
    "@/lib/supabase/client": fixture("questionStateSupabase.ts"),
    "@/lib/supabase/browserOwnerHint": fixture("questionStateSupabase.ts"), "@": root,
  } },
  module: { rules: [
    { test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") },
    { test: /\.css$/, use: fixture("css.cjs") },
    { test: /\.(png|svg)$/, type: "asset/resource" },
  ] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => compiler.close(() =>
  error || stats.hasErrors() ? reject(error ?? Error(stats.toString())) : resolve())));
const bundle = await readFile(join(output, "client.js"));
assert.equal(bundle.includes(Buffer.from("muNationalReferences")), false, "withheld Mu sources stay private");
const cssRoot = join(root, ".next/static");
const cssFiles = (await readdir(cssRoot, { recursive: true })).filter(file => file.endsWith(".css"));
const css = (await Promise.all(cssFiles.map(file => readFile(join(cssRoot, file), "utf8")))).join("\n");
const questions = [...muQuestions, ...alphaQuestions, ...thetaQuestions];
assert.ok(questions.every(question => question.source), "every public question is credited");
const sourceKey = question => JSON.stringify([question.division, question.source.competition, question.source.event]);
const sources = new Map();
for (const question of questions) if (!sources.has(sourceKey(question))) sources.set(sourceKey(question), question);
assert.equal([...sources.values()].filter(question => question.division === "Alpha").length, 9);
assert.equal([...sources.values()].filter(question => question.division === "Theta").length, 15);

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, "http://fixture.test").pathname;
  try {
    if (/^\/questions\/[\w-]+\.svg$/.test(pathname)) {
      res.setHeader("Content-Type", "image/svg+xml");
      return res.end(await readFile(join(root, "public", pathname)));
    }
    if (pathname.startsWith("/api/")) { res.statusCode = 404; return res.end(); }
    const script = pathname === "/client.js";
    res.setHeader("Content-Type", script ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
    res.end(script ? bundle : `<meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
  } catch { res.statusCode = 404; res.end(); }
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  const externalRequests = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) { externalRequests.push(url.origin); return route.abort(); }
    if (url.pathname.startsWith("/api/multiplayer/")) {
      return route.fulfill({ json: route.request().method() === "GET"
        ? await page.evaluate(() => window.sourceCreditRound) : { accepted: true } });
    }
    return route.continue();
  });
  let checked = 0;
  for (const question of sources.values()) {
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const view of ["bank", "trainer", "play", "spectate", "results"]) {
        await page.goto(`${origin}/?guest&view=${view}&id=${question.id}`);
        const credit = page.getByLabel("Question source", { exact: true });
        const source = question.source;
        await expect(credit).toHaveText(`Source: ${source.competition} · ${source.event} · Question ${source.questionNumber}`);
        await expect(credit).toBeVisible();
        assert.ok(await credit.evaluate(element => {
          const bounds = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return bounds.left >= 0 && bounds.right <= innerWidth && bounds.top >= 0 && bounds.bottom <= innerHeight
            && style.visibility !== "hidden" && style.opacity !== "0";
        }), `${view}: ${question.division} #${question.number} credit is visible without scrolling at ${width}px`);
        if (view === "trainer") {
          await page.getByRole("button", { name: "Give Up", exact: true }).click();
          await expect(credit).toBeVisible();
        }
        if ([muQuestions[0].id, alphaQuestions[0].id, 30180, 30330].includes(question.id)) {
          await page.screenshot({ path: join(output, `${question.division}-${question.id}-${view}-${width}.png`), fullPage: true });
        }
        checked++;
      }
    }
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(externalRequests, [], "credit display requires no external requests");
  console.log(`PASS: ${checked} desktop/mobile credit checks covering all ${sources.size} source sets in Question Bank, Trainer, multiplayer play, spectators, and results. Screenshots: ${output}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
