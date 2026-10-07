// Real lobby page/components; local mocked services and actions only.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";
const require = createRequire(import.meta.url), webpack = require("next/dist/compiled/webpack/webpack");
const root = resolve(import.meta.dirname, ".."), dir = await mkdtemp(join(tmpdir(), "match-lobby-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name), mocks = fixture("matchLobbyMocks.ts");
const compiler = webpack.webpack({ mode: "development", entry: fixture("matchLobby.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: { "next/navigation": mocks, "next/link": fixture("link.tsx"), "@/lib/services/multiplayerService": mocks, "@/lib/supabase/server": mocks, "@/lib/supabase/client": mocks, "@/app/multiplayer/actions": mocks, "@": root } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") }, { test: /\.css$/, use: fixture("css.cjs") }] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => compiler.close(() => error || stats.hasErrors() ? reject(error ?? Error(stats.toString())) : resolve())));
const bundle = await readFile(join(dir, "client.js")), cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => { res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8"); res.end(req.url === "/client.js" ? bundle : `<meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="/client.js"></script>`); });
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage(), errors = [];
  page.on("pageerror", error => { errors.push(error.message); console.error(error.message); });
  await page.route("**/*", async route => {
    if (!route.request().url().startsWith(origin)) return route.abort();
    if (route.request().url().includes("/api/multiplayer/public-rooms")) return route.fulfill({ json: await page.evaluate(() => window.fixtureRooms) });
    return route.continue();
  });
  for (const rank of ["Novice", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Legend"]) {
    await page.goto(`${origin}/?rank=${rank}`);
    await page.getByRole("heading", { name: "Match Lobby" }).waitFor();
    const banner = page.getByRole("region", { name: "Your multiplayer rating" });
    assert.ok(await banner.evaluate((el, rank) => rank === "Novice" || el.classList.contains(rank.toLowerCase()), rank));
    assert.equal(await page.locator('article[data-division]').count(), 9);
    assert.equal(await page.locator('[role="tablist"]').count(), 0);
    assert.equal(await page.locator('article[data-division] input[name="roomId"]').count(), 9);
    const colors = await page.locator('article[data-division] .roomHeading').evaluateAll(els => els.map(el => getComputedStyle(el).backgroundColor));
    assert.equal(new Set(colors).size, 3);
    for (const width of [2560, 1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${rank} fits ${width}px`);
      const help = page.getByRole("button", { name: "How RP works" });
      const tooltip = page.getByRole("tooltip");
      await help.hover();
      await tooltip.waitFor({ state: "visible" });
      assert.ok((await tooltip.textContent()).includes("beating lower-RP players earns less"));
      const tipBounds = await tooltip.boundingBox();
      assert.ok(tipBounds.x >= 0 && tipBounds.x + tipBounds.width <= width);
      if (rank === "Silver" && width === 1440) await page.screenshot({ path: "/tmp/rating-help-1440.png" });
      await page.mouse.move(0, 0);
      await help.focus();
      await tooltip.waitFor({ state: "visible" });
      await help.press("Escape");
      await tooltip.waitFor({ state: "hidden" });
      await help.click();
      await tooltip.waitFor({ state: "visible" });
      await help.press("Escape");
      await page.mouse.move(0, 0);
      const bounds = await banner.boundingBox(), actions = await page.locator('.actions').boundingBox();
      assert.ok(bounds.y + bounds.height <= actions.y, "rating precedes room tools");
      if (width >= 1440) assert.ok(bounds.width >= width - 81);
      if (rank === "Silver") await page.screenshot({ path: `/tmp/match-lobby-${width}.png`, fullPage: true });
    }
  }
  await page.locator('article[data-division="Theta"]').last().getByRole("button", { name: "Join", exact: true }).click();
  await page.waitForFunction(() => document.body.dataset.joined === "Theta-30");
  await page.getByRole("textbox", { name: "Room code" }).fill("ABCD2345");
  await page.getByRole("button", { name: "Join Room", exact: true }).click();
  await page.waitForFunction(() => document.body.dataset.code === "ABCD2345");
  assert.equal(await page.getByRole("link", { name: "Create Room" }).getAttribute("href"), "/multiplayer/create");
  await page.goto(`${origin}/?guest=1`);
  await page.getByRole("heading", { name: "Match Lobby" }).waitFor();
  assert.equal(await page.getByRole("link", { name: "Sign in to join", exact: true }).count(), 9);
  assert.equal(await page.getByRole("textbox", { name: "Guest nickname" }).count(), 1);
  assert.equal(await page.getByRole("button", { name: "How RP works" }).count(), 0);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.deepEqual(errors, []);
  console.log("PASS: nine rank themes, all nine division-colored rooms, five viewport widths, guest access and mocked public/private join actions.");
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
