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
const compiler = webpack.webpack({ mode: "development", entry: { lobby: fixture("matchLobby.tsx"), join: fixture("multiplayerJoin.tsx") }, output: { path: dir, filename: "[name].js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: { "next/navigation": mocks, "next/link": fixture("link.tsx"), "@/lib/services/multiplayerService": mocks, "@/lib/supabase/server": mocks, "@/lib/supabase/client": mocks, "@/app/multiplayer/actions": mocks, "@": root } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") }, { test: /\.css$/, use: fixture("css.cjs") }] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => compiler.close(() => error || stats.hasErrors() ? reject(error ?? Error(stats.toString())) : resolve())));
const lobbyBundle = await readFile(join(dir, "lobby.js")), joinBundle = await readFile(join(dir, "join.js")), cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  const script = req.url === "/lobby.js" || req.url === "/join.js";
  res.setHeader("Content-Type", script ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(script ? req.url === "/join.js" ? joinBundle : lobbyBundle : `<meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="${req.url.startsWith("/multiplayer/join") ? "/join.js" : "/lobby.js"}"></script>`);
});
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
  assert.equal(await page.getByRole("link", { name: "Join private room", exact: true }).getAttribute("href"), "/multiplayer/join");
  assert.equal(await page.getByRole("textbox", { name: "Room code" }).count(), 0);
  assert.equal(await page.getByRole("link", { name: "Create Room" }).getAttribute("href"), "/multiplayer/create");
  await page.goto(`${origin}/?guest=1`);
  await page.getByRole("heading", { name: "Match Lobby" }).waitFor();
  assert.equal(await page.getByRole("link", { name: "Sign in to join", exact: true }).count(), 9);
  assert.equal(await page.getByRole("textbox", { name: "Guest nickname" }).count(), 0);
  assert.equal(await page.getByRole("button", { name: "How RP works" }).count(), 0);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

  await page.goto(`${origin}/multiplayer/join`);
  await page.getByRole("heading", { name: "Join private room" }).waitFor();
  assert.equal(await page.getByRole("textbox", { name: "Guest nickname" }).count(), 0);
  assert.equal(await page.getByRole("link", { name: "Match Lobby", exact: true }).getAttribute("href"), "/multiplayer");
  assert.equal(await page.getByRole("link", { name: "Terms of Service" }).getAttribute("href"), "/terms");
  assert.equal(await page.getByRole("link", { name: "Privacy Policy" }).getAttribute("href"), "/privacy");
  assert.ok(await page.getByRole("button", { name: "Join Room", exact: true }).isEnabled());
  assert.equal(await page.getByRole("checkbox").count(), 0);
  await page.getByRole("textbox", { name: "Room code" }).fill("ABCD2345");
  await page.getByRole("textbox", { name: "Room code" }).press("Enter");
  await page.waitForFunction(() => document.body.dataset.code === "ABCD2345");
  assert.equal(await page.evaluate(() => document.body.dataset.ageConfirmation), "13-or-older");
  assert.equal(await page.evaluate(() => document.body.dataset.nickname), "");

  await page.goto(`${origin}/multiplayer/join?guest=1`);
  await page.getByRole("textbox", { name: "Guest nickname" }).waitFor();
  assert.equal(await page.getByRole("checkbox").count(), 0);
  assert.ok(await page.getByRole("button", { name: "Join Room", exact: true }).isEnabled());
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.ok(await page.getByText("You must be 13 or older to play, including as a guest.", { exact: true }).isVisible());
  for (const width of [2560, 1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `join page fits ${width}px`);
    const codeBounds = await page.getByRole("textbox", { name: "Room code" }).boundingBox();
    const nicknameBounds = await page.getByRole("textbox", { name: "Guest nickname" }).boundingBox();
    assert.ok(codeBounds.width > 0 && nicknameBounds.width > 0);
    if (width < 600) assert.ok(nicknameBounds.y >= codeBounds.y + codeBounds.height, "mobile fields stack");
    if (width === 1440 || width === 390) await page.screenshot({ path: `/tmp/private-room-join-${width}.png`, fullPage: true });
  }
  await page.getByRole("button", { name: "Join Room", exact: true }).click();
  assert.equal(await page.evaluate(() => document.body.dataset.submissions), undefined, "empty fields do not submit");
  await page.getByRole("textbox", { name: "Room code" }).fill("ABCD2345");
  await page.getByRole("button", { name: "Join Room", exact: true }).click();
  assert.equal(await page.evaluate(() => document.body.dataset.submissions), undefined, "guests need a nickname");
  await page.getByRole("textbox", { name: "Guest nickname" }).fill("MathPlayer");
  await page.getByRole("button", { name: "Join Room", exact: true }).click();
  await page.waitForFunction(() => document.body.dataset.submissions === "1");
  assert.deepEqual(await page.evaluate(() => [document.body.dataset.code, document.body.dataset.nickname, document.body.dataset.ageConfirmation]), ["ABCD2345", "MathPlayer", "13-or-older"]);

  await page.goto(`${origin}/multiplayer/join?guest=1&pending=1`);
  await page.getByRole("textbox", { name: "Room code" }).fill("ABCD2345");
  await page.getByRole("textbox", { name: "Guest nickname" }).fill("MathPlayer");
  await page.getByRole("button", { name: "Join Room", exact: true }).click();
  const pendingButton = page.getByRole("button", { name: "Joining room...", exact: true });
  await pendingButton.waitFor();
  assert.ok(await pendingButton.isDisabled());
  assert.equal(await page.evaluate(() => document.body.dataset.submissions), "1");
  await page.evaluate(() => window.releasePrivateJoin());
  await page.getByRole("button", { name: "Join Room", exact: true }).waitFor();
  await page.goto(`${origin}/multiplayer/join?guest=1&error=${encodeURIComponent("Room not found. Check your code.")}`);
  await page.getByRole("alert").waitFor();
  assert.equal(await page.getByRole("alert").textContent(), "Room not found. Check your code.");
  assert.ok(await page.getByRole("textbox", { name: "Guest nickname" }).isVisible());
  assert.equal(await page.getByRole("checkbox").count(), 0);
  assert.ok(await page.getByRole("button", { name: "Join Room", exact: true }).isEnabled());
  assert.deepEqual(errors, []);
  console.log("PASS: nine rank themes, all nine division-colored rooms, five viewport widths, guest/account join with no checkbox, 13-plus notice, keyboard submission, form validation, pending guard and join errors (mocked actions).");
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
