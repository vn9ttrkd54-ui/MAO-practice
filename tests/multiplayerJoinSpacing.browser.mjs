// Real join page and CSS; authentication and actions stay local to the fixture.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const webpack = require("next/dist/compiled/webpack/webpack");
const root = resolve(import.meta.dirname, "..");
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const mocks = fixture("matchLobbyMocks.ts");
const output = await mkdtemp(join(tmpdir(), "multiplayer-join-spacing-"));
const compiler = webpack.webpack({
  mode: "development",
  entry: fixture("multiplayerJoin.tsx"),
  output: { path: output, filename: "join.js" },
  devtool: false,
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "next/link": fixture("link.tsx"),
      "@/lib/supabase/server": mocks,
      "@/app/multiplayer/actions": mocks,
      "@": root,
    },
  },
  module: { rules: [
    { test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") },
    { test: /\.css$/, use: fixture("css.cjs") },
  ] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => compiler.close(() =>
  error || stats.hasErrors() ? reject(error ?? Error(stats.toString())) : resolve())));
const bundle = await readFile(join(output, "join.js"));
const cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css"))
  .map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  const script = req.url === "/join.js";
  res.setHeader("Content-Type", script ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(script ? bundle : `<meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script src="/join.js"></script>`);
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
  for (const guest of [false, true]) {
    await page.goto(`${origin}/multiplayer/join${guest ? "?guest=1" : ""}`);
    await page.getByRole("heading", { name: "Join private room" }).waitFor();
    assert.equal(await page.getByRole("textbox", { name: "Guest nickname" }).count(), guest ? 1 : 0);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const code = await page.getByRole("textbox", { name: "Room code" }).boundingBox();
      const button = await page.getByRole("button", { name: "Join Room", exact: true }).boundingBox();
      const preceding = guest ? await page.locator("#join-eligibility").boundingBox() : code;
      assert.equal(Math.round(button.y - preceding.y - preceding.height), 24,
        `${guest ? "guest" : "signed-in"} button has a 24px gap at ${width}px`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `fits ${width}px`);
      assert.ok(button.width > 0 && button.height >= 48);
      if (width === 1440 || width === 390) {
        await page.screenshot({ path: join(output, `${guest ? "guest" : "signed-in"}-${width}.png`), fullPage: true });
      }
    }
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: signed-in and guest join spacing at four viewport widths. Screenshots: ${output}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
