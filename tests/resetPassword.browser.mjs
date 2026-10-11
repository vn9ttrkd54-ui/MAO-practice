// Real reset page and form, synthetic cookies and mocked endpoint. No live writes.
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
const dir = await mkdtemp(join(tmpdir(), "md-reset-password-ui-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = webpack.webpack({
  mode: "development", entry: fixture("resetPassword.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/navigation": fixture("router.ts"), "next/link": fixture("link.tsx"),
    "next/headers": fixture("resetPasswordServer.ts"),
    "@/lib/supabase/server": fixture("resetPasswordServer.ts"),
    "@/lib/auth/recoveryToken": fixture("resetPasswordServer.ts"), "@": root,
  } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") }, { test: /\.css$/, use: fixture("css.cjs") }] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(resolve)));
const bundle = await readFile(join(dir, "client.js"));
const cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(req.url === "/client.js" ? bundle : `<style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  for (const width of [1280, 390, 320]) for (const state of ["valid", "expired"]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const requests = [], errors = [];
    let result = "error", finishRequest;
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname !== "/api/auth/reset-password") return route.continue();
      requests.push(route.request().postDataJSON());
      if (result === "hold") await new Promise(resolve => { finishRequest = resolve; });
      if (result === "network") return route.abort();
      return route.fulfill(result === "success" ? { json: { success: true } } : { status: 400, json: { error: "This reset link has expired. Request a new link." } });
    });
    await page.goto(`${origin}/?state=${state}`);
    await page.getByRole("heading", { level: 1 }).waitFor();
    assert.equal(await page.getByRole("link", { name: "Back to login" }).getAttribute("href"), "/login");
    if (state === "expired") {
      await page.getByRole("heading", { name: "Invalid or expired link", exact: true }).waitFor();
      assert.equal(await page.locator("form").count(), 0);
      assert.equal(await page.getByRole("link", { name: "Request a new reset link" }).getAttribute("href"), "/forgot-password");
      const requestLink = await page.getByRole("link", { name: "Request a new reset link" }).boundingBox();
      const loginLink = await page.getByRole("link", { name: "Back to login" }).boundingBox();
      assert.ok(loginLink.y > requestLink.y + requestLink.height, "expired-link actions stay on separate rows");
      assert.equal(requests.length, 0);
    } else {
      await page.getByRole("heading", { name: "Set a new password", exact: true }).waitFor();
      const password = page.getByLabel("New password", { exact: true });
      const confirmation = page.getByLabel("Confirm new password", { exact: true });
      const button = page.getByRole("button", { name: "Set new password", exact: true });
      for (const field of [password, confirmation]) {
        assert.equal(await field.getAttribute("type"), "password");
        assert.equal(await field.getAttribute("autocomplete"), "new-password");
        assert.equal(await field.getAttribute("minlength"), "8");
      }
      assert.equal(await button.evaluate(el => getComputedStyle(el).backgroundColor), "rgb(37, 99, 235)");
      await page.screenshot({ path: join(dir, `valid-${width}.png`), fullPage: true });
      await password.fill("short"); await confirmation.fill("short"); await button.click();
      assert.equal(requests.length, 0, "minimum length prevents the request");
      await password.fill("fixture-password"); await confirmation.fill("different-password"); await button.click();
      await page.getByRole("alert").filter({ hasText: "Passwords do not match." }).waitFor();
      assert.equal(requests.length, 0, "mismatched passwords never reach the endpoint");
      await confirmation.fill("fixture-password"); await button.click();
      await page.getByRole("alert").filter({ hasText: "This reset link has expired." }).waitFor();
      assert.deepEqual(requests[0], { password: "fixture-password" });
      assert.equal(await button.isEnabled(), true);
      assert.equal(await page.locator("body").getAttribute("data-destination"), null);
      await page.screenshot({ path: join(dir, `error-${width}.png`), fullPage: true });
      result = "network"; await button.click();
      await page.getByRole("alert").filter({ hasText: "Unable to reset the password right now." }).waitFor();
      assert.equal(await button.isEnabled(), true);
      result = "hold"; await button.click();
      const updating = page.getByRole("button", { name: "Updating…", exact: true });
      await updating.waitFor();
      assert.equal(await updating.isDisabled(), true);
      assert.equal(await updating.getAttribute("aria-busy"), "true");
      await page.waitForFunction(() => !document.querySelector("[role=alert]"));
      await page.screenshot({ path: join(dir, `loading-${width}.png`), fullPage: true });
      result = "success"; finishRequest();
      await page.waitForFunction(() => document.body.dataset.destination === "/login?passwordReset=success");
      assert.equal(await page.locator("body").getAttribute("data-refreshes"), "1");
      assert.equal(requests.length, 3);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${state} overflows at ${width}`);
    for (const control of await page.locator("button, input").all()) assert.equal(await control.evaluate(el => el.scrollWidth > el.clientWidth), false);
    assert.deepEqual(errors, []);
    if (state === "expired") await page.screenshot({ path: join(dir, `expired-${width}.png`), fullPage: true });
    await page.close();
  }
  console.log(`PASS: Reset theme, valid/expired links, hidden password fields, minimum length, mismatch, server/network errors, loading, original success redirect and responsive layout at 1280/390/320px. Screenshots: ${dir}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
