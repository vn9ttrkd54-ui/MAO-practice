// Render the actual page with isolated sample data: no database calls or writes.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");
const rooms = ["Alpha", "Mu", "Theta"].flatMap((division, index) => [5, 15, 30].map((questionCount, i) => ({
  id: `${division}-${questionCount}`, settings: { division, questionCount, secondsPerQuestion: 90, difficultyBand: "2-4", mode: "ranked" },
  capacity: 20, playerCount: index === 0 && i === 1 ? 3 : 0,
  status: "waiting", countdownEndsAt: null,
  players: index === 0 && i === 1 ? ["Ada", "Sofia", "Max"].map((name, p) => ({ playerId: name, displayName: name, rankTier: p === 0 ? "Silver" : "Novice" })) : [],
})));
const profile = { username: "Sample player", rankTier: "Silver", rp: 268, globalRank: 1 };
const services = {
  listPublicRooms: async () => rooms, listOngoingPublicMatches: async () => [],
  listMyActiveMultiplayerRooms: async () => [], getMultiplayerProfile: async () => profile,
  getMultiplayerRatingLeaderboard: async () => [profile].map(p => ({ ...p, userId: "sample" })),
  listRecentMultiplayerMatches: async () => [],
};
const style = fs.readFileSync(path.join(root, "app/multiplayer/lobby.module.css"), "utf8");
const rankStyle = fs.readFileSync(path.join(root, "components/multiplayer/rankTheme.module.css"), "utf8");
const createStyle = fs.readFileSync(path.join(root, "app/multiplayer/create/create.module.css"), "utf8");
function load(relative) {
  const filename = path.join(root, relative);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true,
  }}).outputText;
  const loadedModule = { exports: {} };
  function resolve(name) {
    if (name.endsWith(".module.css")) return Object.fromEntries([...(name.includes("rankTheme") ? rankStyle : name.includes("create.module") ? createStyle : style).matchAll(/\.([A-Za-z][A-Za-z0-9]*)/g)].map(m => [m[1], m[1]]));
    if (name === "next/link") return function MockLink({ href, children, ...props }) { return React.createElement("a", { href, ...props }, children); };
    if (name === "@/app/multiplayer/actions") return { createPrivateRoomAction: "/test-create", joinPrivateRoomAction: "/test-join", joinPublicRoomAction: "/test-public", spectatePublicRoomAction: "/test-spectate" };
    if (name.includes("LiveRoomListRefresh")) return { LiveRoomListRefresh: () => null };
    if (name.includes("PendingSubmitButton")) return function MockSubmitButton({ children, ...props }) { delete props.pendingText; return React.createElement("button", { type: "submit", ...props }, children); };
    if (name === "@/lib/services/multiplayerService") return services;
    if (name === "@/lib/supabase/server") return { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: "sample" } } }) } }) };
    if (name.startsWith("@/")) return load(name.slice(2) + ".tsx");
    return require(name);
  }
  new Function("require", "module", "exports", code)(resolve, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const html = renderToStaticMarkup(await load("app/multiplayer/page.tsx").default({ searchParams: Promise.resolve({}) }));
const cssRoot = path.join(root, ".next/static");
const css = fs.readdirSync(cssRoot, { recursive: true }).filter(f => f.endsWith(".css")).map(f => fs.readFileSync(path.join(cssRoot, f), "utf8")).join("\n");
const browser = await chromium.launch();
try {
  for (const width of [1280, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    await page.setContent(`<style>${css}\n${rankStyle}\n${style}</style>${html}`);
    assert.equal(await page.locator("article").count(), 9);
    assert.equal(await page.getByRole("button", { name: "Join players", exact: true }).count(), 1);
    assert.equal(await page.getByRole("button", { name: "Join", exact: true }).count(), 8);
    assert.equal(await page.locator("article [class*='green']").count(), 0);
    assert.equal(await page.locator(".occupied").count(), 1);
    assert.ok(await page.locator(".silver").count() >= 2);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    for (const card of await page.locator("article").all()) {
      assert.equal(await card.evaluate(el => el.scrollWidth > el.clientWidth), false, `Card overflow at ${width}px`);
    }
    await page.getByRole("button", { name: "Join players", exact: true }).click({ trial: true });
    if (process.env.LOBBY_SCREENSHOT && width === 1280) await page.screenshot({ path: process.env.LOBBY_SCREENSHOT, fullPage: true });
    await page.close();
  }
  console.log("PASS: actual lobby markup with empty/occupied fixtures, blue state, preserved rank surfaces, join actions, and no card/page overflow at desktop/tablet/mobile sizes.");
  const createHtml = renderToStaticMarkup(await load("app/multiplayer/create/page.tsx").default({ searchParams: Promise.resolve({}) }));
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    await page.setContent(`<style>${css}\n${rankStyle}\n${createStyle}</style>${createHtml}`);
    assert.deepEqual(await page.locator('[name="division"] option').allTextContents(), ["Mu", "Alpha", "Theta"]);
    assert.equal(await page.getByLabel("Questions", { exact: true }).inputValue(), "5");
    assert.equal(await page.getByLabel("Time per question", { exact: true }).inputValue(), "60");
    assert.deepEqual(await page.locator('[name="secondsPerQuestion"] option').evaluateAll(options => options.map(option => option.value)), ["30","60","90","120","150","180"]);
    assert.deepEqual(await page.locator('[name="difficultyBand"] option').evaluateAll(options => options.map(option => option.value)), ["1-3","2-4","3-5"]);
    assert.equal(await page.getByLabel("Difficulty", { exact: true }).inputValue(), "2-4");
    assert.equal(await page.getByLabel("Rating mode", { exact: true }).inputValue(), "unranked");
    for (const field of await page.locator("input, select").all()) assert.ok((await field.boundingBox()).height >= 44);
    await page.getByRole("button", { name: "Create Room", exact: true }).click({ trial: true });
    assert.equal(await page.locator("form").getAttribute("action"), "/test-create");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (process.env.CREATE_SCREENSHOT && width === 1280) await page.screenshot({ path: process.env.CREATE_SCREENSHOT, fullPage: true });
    await page.close();
  }
  console.log("PASS: create-room settings, division order, consistent control heights, submit action, and desktop/mobile layout.");
} finally { await browser.close(); }
