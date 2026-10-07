// Real Challenge page/components with local fixture data; no hosted reads or writes.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";
const require = createRequire(import.meta.url);
const webpack = require("next/dist/compiled/webpack/webpack");
const root = resolve(import.meta.dirname, "..");
const dir = await mkdtemp(join(tmpdir(), "challenge-studio-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const mocks = fixture("challengeStudioMocks.ts");
const compiler = webpack.webpack({
  mode: "development", entry: fixture("challengeStudio.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: { "@/lib/challenge": mocks, "@/app/challenge/actions": mocks, "next/navigation": mocks, "next/image": fixture("image.tsx"), "@": root } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") }, { test: /\.css$/, use: fixture("css.cjs") }] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => {
  compiler.close(() => error || stats.hasErrors() ? reject(error ?? new Error(stats.toString())) : resolve());
}));
const bundle = await readFile(join(dir, "client.js"));
const cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(req.url === "/client.js" ? bundle : `<meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", error => { errors.push(error.message); console.error(error.message); });
  await page.route("**/*", route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
  await page.goto(origin);
  await page.getByRole("heading", { name: "Daily Challenge", exact: true }).waitFor();
  for (const division of ["MU", "ALPHA", "THETA"]) {
    await page.getByRole("button", { name: division, exact: true }).click();
    await page.waitForURL(`**/challenge?division=${division === "MU" ? "Mu" : division === "ALPHA" ? "Alpha" : "Theta"}`);
    await page.waitForFunction(name => [...document.querySelectorAll('button[aria-pressed="true"]')].some(button => button.textContent === name), division);
    for (const width of [2560, 1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${division} fits ${width}px`);
      const record = page.getByRole("region", { name: "Your challenge record" });
      assert.equal(await record.locator('[aria-current="date"]').count(), 1);
      assert.equal(await record.locator("dt").count(), 4);
      const bounds = await record.boundingBox(), group = await page.getByRole("group", { name: "Division" }).boundingBox();
      assert.ok(bounds.y + bounds.height <= group.y, "record stays above the question");
      if (width >= 1440) assert.ok(bounds.width >= width - 81);
      assert.equal(await page.getByRole("button", { name: "Submit Answer", exact: true }).isDisabled(), true);
      await page.screenshot({ path: `/tmp/challenge-studio-${division}-${width}.png`, fullPage: true });
    }
  }
  await page.locator(".answers button").first().click();
  await page.getByRole("button", { name: "Submit Answer", exact: true }).click();
  await page.getByRole("heading", { name: "Correct!", exact: true }).waitFor();
  assert.ok(await page.getByRole("button", { name: "Answer Submitted" }).isDisabled());
  assert.equal(await page.locator(".answers button:disabled").count(), 5);
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `/tmp/challenge-studio-result-${width}.png`, fullPage: true });
  }
  await page.goto(`${origin}/challenge?empty=1`);
  await page.getByRole("heading", { name: "Today's Mu question has not been scheduled yet." }).waitFor();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: "/tmp/challenge-studio-empty.png", fullPage: true });
  assert.deepEqual(errors, []);
  console.log("PASS: Challenge Studio desktop/mobile, all divisions, selection/submission/results and empty state with local mock data.");
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
