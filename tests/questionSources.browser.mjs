// Actual UI and KaTeX; isolated fixtures, no hosted database or account writes.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium, expect } from "@playwright/test";
const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");
const dir = await mkdtemp(join(tmpdir(), "question-sources-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = require("next/dist/compiled/webpack/webpack").webpack({
  mode: "development", entry: fixture("questionSources.tsx"), devtool: false,
  output: { path: dir, filename: "client.js", publicPath: "/" },
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/navigation": fixture("sourceCreditRouter.ts"), "next/link": fixture("link.tsx"),
    "next/image": fixture("googleImage.tsx"), "@/lib/multiplayerRealtime": fixture("realtime.ts"),
    "@/lib/supabase/client": fixture("questionStateSupabase.ts"),
    "@/lib/supabase/browserOwnerHint": fixture("questionStateSupabase.ts"), "@": root,
  } },
  module: { rules: [
    { test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") },
    { test: /\.css$/, use: fixture("css.cjs") }, { test: /\.(png|svg)$/, type: "asset/resource" },
  ] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(resolve)));
const bundle = await readFile(join(dir, "client.js"));
const cssRoot = join(root, ".next/static");
const cssFiles = (await readdir(cssRoot, { recursive: true })).filter(f => f.endsWith(".css"));
const css = (await Promise.all(cssFiles.map(f => readFile(join(cssRoot, f), "utf8")))).join("\n");
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, "http://fixture.test").pathname;
  try {
    if (/^\/questions\/mu-\d+-solution\.png$/.test(pathname)) {
      res.setHeader("Content-Type", "image/png"); return res.end(await readFile(join(root, "public", pathname)));
    }
    if (/^\/[a-f0-9]+\.png$/.test(pathname)) {
      res.setHeader("Content-Type", "image/png"); return res.end(await readFile(join(dir, pathname)));
    }
    res.setHeader("Content-Type", pathname === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
    res.end(pathname === "/client.js" ? bundle : `<meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
  } catch { res.statusCode = 404; res.end(); }
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const errors = [];
try {
  browser = await chromium.launch({ headless: true });
  async function open(view, id, width, revealed = false) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/api/multiplayer/**", async route => {
      if (route.request().method() !== "GET") return route.fulfill({ json: { accepted: true } });
      return route.fulfill({ json: await page.evaluate(() => window.sourceCreditRound) });
    });
    await page.goto(`${origin}/?guest&view=${view}&id=${id}${revealed ? "&revealed" : ""}`);
    const credit = page.getByLabel("Question source", { exact: true });
    await expect(credit).toHaveText(`Source: 2026 February King Invitational · Calculus Individual · Question ${id - 10295}`);
    assert.equal(await page.locator(".katex-error").count(), 0, "no broken math");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "no page overflow");
    return page;
  }
  for (const view of ["bank", "trainer", "play", "spectate", "results"]) {
    for (const width of [1280, 390, 320]) {
      const page = await open(view, 10302, width);
      if (view !== "results") assert.equal(await page.locator('img[src*="-solution.png"]').count(), 0, "solutions stay hidden before reveal");
      if (view === "trainer") {
        await page.getByRole("button", { name: "Give Up", exact: true }).click();
        await expect(page.locator('img[src="/questions/mu-302-solution.png"]')).toBeVisible();
      }
      await page.screenshot({ path: join(dir, `${view}-${width}.png`), fullPage: true });
      await page.close();
    }
  }
  for (const id of [10302, 10313, 10320, 10325]) {
    const page = await open("trainer", id, 390, true);
    const picture = page.locator(`img[src="/questions/mu-${id - 10000}-solution.png"]`);
    await picture.scrollIntoViewIfNeeded();
    await expect.poll(() => picture.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    await page.screenshot({ path: join(dir, `diagram-${id}.png`), fullPage: true });
    await page.close();
  }
  for (const id of [10310, 10317, 10324]) {
    const page = await open("trainer", id, 320, true);
    await page.screenshot({ path: join(dir, `long-math-${id}.png`), fullPage: true });
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: original-number credits in Question Bank, Trainer, play, spectators and results; original diagrams, reveal gating and real KaTeX at desktop/mobile widths. Screenshots: ${dir}`);
} finally {
  await browser?.close(); await new Promise(resolve => server.close(resolve));
}
