import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const dir = await mkdtemp(join(tmpdir(), "podium-ui-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = require("next/dist/compiled/webpack/webpack").webpack({
  mode: "development", entry: fixture("results.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: { "next/link": fixture("link.tsx"), "next/image": fixture("image.tsx"), "@": resolve(import.meta.dirname, "..") } },
  module: { rules: [
    { test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") },
    { test: /\.css$/, use: fixture("css.cjs") },
  ] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(resolve)));
const bundle = await readFile(join(dir, "client.js"));
const cssDir = resolve(import.meta.dirname, "../.next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css"))
  .map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  if (req.url === "/multiplayer") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end("<h1>Multiplayer Lobby</h1>");
    return;
  }
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(req.url === "/client.js" ? bundle : `<meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const errors = [], reports = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  let fail = true;
  await page.route("**/api/feedback", async route => {
    reports.push(route.request().postDataJSON());
    if (fail) { fail = false; return route.abort(); }
    return route.fulfill({ json: { success: true } });
  });
  await page.goto(`${origin}/`);
  await page.waitForTimeout(200);
  assert.deepEqual(errors, []);
  assert.equal(await page.getByText("Final totals, with the last question’s result below each player.", { exact: true }).count(), 0);
  await page.getByRole("heading", { name: "Final leaderboard", exact: true }).waitFor();
  for (const number of [1, 2]) await page.getByText(`Report an error · Question ${number}`, { exact: true }).click();
  const boxes = page.getByRole("textbox");
  assert.equal(await boxes.count(), 2);
  assert.notEqual(await boxes.nth(0).getAttribute("id"), await boxes.nth(1).getAttribute("id"));
  await boxes.nth(0).fill("The solution has an incorrect calculation.");
  await page.getByRole("button", { name: "Submit", exact: true }).nth(0).click();
  await page.getByText("Unable to submit feedback. Please check your connection and try again.").waitFor();
  await page.getByRole("button", { name: "Submit", exact: true }).nth(0).click();
  await page.getByText("Thank you—your feedback was submitted.").waitFor();
  await boxes.last().fill("This question has an unclear answer choice.");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll("textarea").length === 0);
  assert.equal(reports.length, 3);
  assert.equal(reports[0].questionId, reports[1].questionId);
  assert.notEqual(reports[1].questionId, reports[2].questionId);
  assert.ok(reports.every(r => r.kind === "question_report" && r.division));

  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [mode, query] of [["unranked", ""], ["ranked", "?ranked"], ["spectator", "?viewer=spectator"]]) {
      await page.goto(`${origin}/${query}`);
      const returns = page.getByRole("link", { name: "Return to Lobby", exact: true });
      await returns.first().waitFor();
      assert.equal(await returns.count(), 2, "return controls remain available before and after question review");
      for (const link of await returns.all()) assert.equal(await link.getAttribute("href"), "/multiplayer");
      const top = page.locator("main > header").getByRole("link", { name: "Return to Lobby", exact: true });
      const bounds = await top.boundingBox();
      assert.ok(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 900, "top return is visible without scrolling");
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width && bounds.height >= 44);
      await page.keyboard.press("Tab");
      assert.equal(await top.evaluate(link => link === document.activeElement), true, "return is keyboard reachable");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (mode === "unranked") await page.screenshot({ path: join(dir, `return-to-lobby-${width}.png`) });
      if (mode === "spectator") await page.getByRole("heading", { name: "Final results", exact: true }).waitFor();
      if (mode === "ranked") await page.getByText("+12 RP", { exact: false }).waitFor();
      await top.click();
      await page.waitForURL(`${origin}/multiplayer`);
      await page.getByRole("heading", { name: "Multiplayer Lobby", exact: true }).waitFor();
      await page.goto(`${origin}/${query}`);
      await page.getByRole("link", { name: "Return to Lobby", exact: true }).last().click();
      await page.waitForURL(`${origin}/multiplayer`);
    }
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: question reports and retries; top/bottom lobby navigation for unranked, ranked and spectator results; keyboard access and responsive layout at 1280/390/320px. Screenshots: ${dir}`);
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
