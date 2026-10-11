// Actual account component, synthetic users and mocked requests. No live writes.
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
const dir = await mkdtemp(join(tmpdir(), "md-account-feedback-"));
const fixture = name => resolve(import.meta.dirname, "browserFixtures", name);
const compiler = webpack.webpack({
  mode: "development", entry: fixture("googleAuth.tsx"), output: { path: dir, filename: "client.js" }, devtool: false,
  resolve: { extensions: [".tsx", ".ts", ".js"], alias: {
    "next/navigation": fixture("router.ts"), "next/link": fixture("link.tsx"),
    "next/image": fixture("googleImage.tsx"), "@": root,
  } },
  module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: fixture("loader.cjs") }, { test: /\.css$/, use: fixture("css.cjs") }] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => error || stats.hasErrors()
  ? reject(error ?? new Error(stats.toString())) : compiler.close(resolve)));
const bundle = await readFile(join(dir, "client.js"));
const icon = await readFile(join(root, "public/google-g.png"));
const cssDir = join(root, ".next/static/css");
const css = (await Promise.all((await readdir(cssDir)).filter(name => name.endsWith(".css")).map(name => readFile(join(cssDir, name), "utf8")))).join("\n");
const server = createServer((req, res) => {
  if (req.url === "/google-g.png") { res.setHeader("Content-Type", "image/png"); res.end(icon); return; }
  res.setHeader("Content-Type", req.url === "/client.js" ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8");
  res.end(req.url === "/client.js" ? bundle : `<style>${css}</style><div id="root"></div><script src="/client.js"></script>`);
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
const section = (page, name) => page.locator("section").filter({ has: page.getByRole("heading", { name, exact: true }) });
let browser;
try {
  browser = await chromium.launch({ headless: true });
  for (const width of [1280, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const requests = [], errors = [];
    let outcome = "error", release, held;
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname !== "/api/account") return route.continue();
      requests.push({ method: route.request().method(), body: route.request().postDataJSON() });
      if (outcome === "hold") await new Promise(resolve => { release = resolve; held(); });
      if (outcome === "network") return route.abort();
      return route.fulfill(outcome === "success" ? { json: { success: true } } : { status: 400, json: { error: "Fixture: request rejected." } });
    });
    await page.goto(`${origin}/?mode=account-password`);
    await page.getByRole("heading", { name: "Account settings", exact: true }).waitFor();
    const username = section(page, "Username"), password = section(page, "Password"), email = section(page, "Recovery email"), deletion = section(page, "Delete account");
    await username.getByLabel("Username", { exact: true }).fill("x");
    await username.getByRole("button", { name: "Change username", exact: true }).click();
    await username.getByRole("alert").waitFor();
    assert.equal(requests.length, 0, "client validation stays local and sends no request");
    await username.getByLabel("Username", { exact: true }).fill("new_student");
    await username.getByRole("button", { name: "Change username", exact: true }).click();
    await username.getByRole("alert").filter({ hasText: "Fixture: request rejected." }).waitFor();
    assert.deepEqual(requests.at(-1), { method: "PATCH", body: { action: "username", username: "new_student" } });

    async function fillPassword() {
      await password.getByPlaceholder("Current password", { exact: true }).fill("fixture-current");
      await password.getByPlaceholder("New password", { exact: true }).fill("fixture-new-password");
    }
    outcome = "success"; await fillPassword();
    await password.getByRole("button", { name: "Change password", exact: true }).click();
    await password.getByRole("status").filter({ hasText: "Password changed successfully." }).waitFor();
    assert.deepEqual(requests.at(-1), { method: "PATCH", body: { action: "password", password: "fixture-new-password", currentPassword: "fixture-current" } });
    assert.equal(await password.getByPlaceholder("New password", { exact: true }).inputValue(), "");
    assert.equal(await password.getByPlaceholder("Current password", { exact: true }).inputValue(), "");
    assert.equal(await username.getByRole("alert").count(), 1, "a password result does not clear username feedback");

    outcome = "hold"; await fillPassword();
    const heldRequest = new Promise(resolve => { held = resolve; });
    await password.getByRole("button", { name: "Change password", exact: true }).click();
    await heldRequest;
    assert.equal(await password.getByRole("status").count(), 0, "retry clears only this section's stale success");
    assert.equal(await username.getByRole("alert").count(), 1);
    for (const name of ["Change username", "Change recovery email", "Change password", "Permanently delete account"]) {
      assert.equal(await page.getByRole("button", { name, exact: true }).isDisabled(), true);
    }
    outcome = "error"; release();
    await password.getByRole("alert").filter({ hasText: "Fixture: request rejected." }).waitFor();
    assert.equal(await password.getByPlaceholder("New password", { exact: true }).inputValue(), "fixture-new-password");

    await email.getByPlaceholder("you@example.com").fill("recovery@example.test");
    await email.getByPlaceholder("Confirm your password").fill("fixture-current");
    await email.getByRole("button", { name: "Change recovery email", exact: true }).click();
    await email.getByRole("alert").waitFor();
    outcome = "success";
    await email.getByRole("button", { name: "Change recovery email", exact: true }).click();
    await email.getByRole("status").filter({ hasText: "Email submitted." }).waitFor();
    assert.deepEqual(requests.at(-1), { method: "PATCH", body: { action: "email", email: "recovery@example.test", currentPassword: "fixture-current" } });
    assert.equal(await email.getByPlaceholder("Confirm your password").inputValue(), "");
    assert.equal(await email.getByRole("alert").count(), 0);
    assert.equal(await password.getByRole("alert").count(), 1);

    await username.getByRole("button", { name: "Change username", exact: true }).click();
    await username.getByRole("status").filter({ hasText: "Username changed successfully." }).waitFor();
    assert.equal(await username.getByRole("alert").count(), 0);
    assert.equal(await email.getByRole("status").count(), 1);

    await deletion.getByLabel("Current password", { exact: true }).fill("fixture-current");
    await deletion.getByLabel("Type DELETE to confirm", { exact: true }).fill("DELETE");
    outcome = "error";
    await deletion.getByRole("button", { name: "Permanently delete account", exact: true }).click();
    await deletion.getByRole("alert").filter({ hasText: "Fixture: request rejected." }).waitFor();
    assert.deepEqual(requests.at(-1), { method: "DELETE", body: { confirmation: "DELETE", currentPassword: "fixture-current" } });
    assert.equal(await page.locator("body").getAttribute("data-destination"), null);
    outcome = "network";
    await deletion.getByRole("button", { name: "Permanently delete account", exact: true }).click();
    await deletion.getByRole("alert").filter({ hasText: "Unable to reach the server." }).waitFor();
    assert.equal(await page.locator("main > [role=alert], main > [role=status]").count(), 0, "no page-top banners remain");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: join(dir, `feedback-${width}.png`), fullPage: true });
    await password.screenshot({ path: join(dir, `password-${width}.png`) });
    outcome = "success";
    await deletion.getByRole("button", { name: "Permanently delete account", exact: true }).click();
    await page.waitForFunction(() => document.body.dataset.destination === "/");
    assert.deepEqual(errors, []);
    await page.close();

    for (const [mode, google, target, role] of [
      ["account-password", "linked", "Google sign-in", "status"],
      ["account-password", "error", "Google sign-in", "alert"],
      ["account-verified", "verified", "Delete account", "status"],
      ["account-verified", "error", "Delete account", "alert"],
      ["account-google", "error", "Delete account", "alert"],
    ]) {
      const callback = await browser.newPage({ viewport: { width, height: 900 } });
      await callback.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      await callback.goto(`${origin}/?mode=${mode}&google=${google}`);
      await section(callback, target).getByRole(role).waitFor();
      if (mode === "account-verified") assert.equal(await section(callback, "Delete account").getByRole("status").count(), 1);
      assert.equal(await callback.locator("main > [role=alert], main > [role=status]").count(), 0);
      assert.equal(await callback.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await callback.close();
    }
    const protectedPage = await browser.newPage();
    await protectedPage.goto(`${origin}/?mode=account-password&protected`);
    await protectedPage.getByRole("heading", { name: "Protected account", exact: true }).waitFor();
    assert.equal(await protectedPage.getByRole("button", { name: "Permanently delete account", exact: true }).count(), 0);
    await protectedPage.close();
  }
  console.log(`PASS: Section-local validation, successes, server/network failures, isolated clearing, original request bodies and redirects, busy controls, Google callbacks, protected accounts and responsive layout at 1280/390/320px. Screenshots: ${dir}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
