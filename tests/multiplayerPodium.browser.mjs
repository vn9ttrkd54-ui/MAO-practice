import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const dir = await mkdtemp(join(tmpdir(), "podium-ui-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = require("next/dist/compiled/webpack/webpack").webpack({
  mode: "development", entry: fixture("podium.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: { "@": resolve(import.meta.dirname, "..") } },
  module: { rules: [
    { test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") },
    { test: /\.css$/, use: fixture("css.cjs") },
  ] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(resolve)));
const bundle = await readFile(join(dir, "client.js"));
const server = createServer((req, res) => {
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript" : "text/html");
  res.end(req.url === "/client.js" ? bundle : '<style>body{margin:0;font-family:Arial}.sr-only{position:absolute;clip:rect(0,0,0,0)}</style><div id="root"></div><script src="/client.js"></script>');
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true });
try {
  for (const [count, width, reducedMotion] of [[5, 1280, "no-preference"], [4, 390, "no-preference"], [5, 390, "reduce"]]) {
    const page = await browser.newPage({ viewport: { width, height: 800 }, reducedMotion });
    const errors = [], requests = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => requests.push(request.url()));
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await page.goto(`http://127.0.0.1:${server.address().port}/?players=${count}`);
    for (const place of count < 5 ? [1] : [3, 2, 1]) {
      await page.getByRole("region", { name: `Place ${place}`, exact: true }).waitFor();
      assert.equal(await page.locator(".medallion").evaluate(el => getComputedStyle(el).transform), "none");
      assert.equal(await page.getByRole("button", { name: /skip/i }).count(), 0);
      await page.clock.fastForward(1000);
      assert.equal(await page.getByRole("heading", { name: `Player ${place}`, exact: true }).isVisible(), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      if (place === 1 && width === 1280) await page.screenshot({ path: join(dir, "winner.png"), timeout: 5000 });
      await page.clock.fastForward(1500);
    }
    await page.getByRole("heading", { name: "Existing final results" }).waitFor();
    assert.deepEqual(errors, []);
    assert.equal(requests.some(url => url.includes("/api/")), false);
    await page.close();
  }
  console.log(`PASS: 3→2→1, winner-only, 2.5 seconds each, upright badges, no Skip, results transition, mobile, reduced motion, no API requests. Screenshot: ${join(dir, "winner.png")}`);
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
