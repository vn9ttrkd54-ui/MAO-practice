// Run against the local production build, never the hosted website. Browser
// requests cannot leave localhost and server-side credentials point to a stub.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";
import { muQuestions } from "../data/questions/mu.ts";
import { alphaQuestions } from "../data/questions/alpha.ts";
import { thetaQuestions } from "../data/questions/theta.ts";

const root = resolve(import.meta.dirname, "..");
const portProbe = createServer();
await new Promise(resolve => portProbe.listen(0, "127.0.0.1", resolve));
const port = portProbe.address().port;
await new Promise(resolve => portProbe.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: root,
  env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: `${origin}/blocked-supabase`, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fixture-public", SUPABASE_SECRET_KEY: "fixture-server" },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Local production server did not become ready")), 30000);
    child.once("exit", code => { clearTimeout(timeout); reject(new Error(`Local production server exited: ${code}`)); });
    child.stdout.on("data", data => { if (/Ready in/.test(data.toString())) { clearTimeout(timeout); resolve(); } });
  });
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [], writes = [], documents = [], blockedExternal = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (request.isNavigationRequest()) documents.push(request.url()); });
  await page.route("**/*", route => {
    const request = route.request();
    if (!request.url().startsWith(`${origin}/`)) { blockedExternal.push(new URL(request.url()).hostname); return route.abort(); }
    if (!["GET", "HEAD"].includes(request.method())) { writes.push(request.method()); return route.abort(); }
    return route.continue();
  });

  const bank = `${origin}/practice/question-bank/mu`;
  await page.goto(bank);
  const tiles = page.getByRole("link", { name: /^Question \d+,/ });
  await tiles.first().waitFor();
  assert.equal(await tiles.count(), Math.min(muQuestions.length, 120));
  // Read-only filtering changes the URL without triggering an RSC request.
  const rsc = [];
  page.on("request", request => { if (request.url().includes("_rsc=")) rsc.push(request.url()); });
  const topic = muQuestions[0].topic;
  await page.getByLabel("Topic", { exact: true }).selectOption(topic);
  const filtered = muQuestions.filter(q => q.topic === topic).sort((a, b) => a.number - b.number);
  await page.getByRole("heading", { name: `${filtered.length} ${filtered.length === 1 ? "question" : "questions"}`, exact: true }).waitFor();
  assert.equal(rsc.length, 0, "filter selection must not fetch a server page");
  const destination = await tiles.first().getAttribute("href");
  await tiles.first().click();
  await page.getByRole("heading", { name: `Question ${filtered[0].number}`, exact: true }).waitFor();
  assert.equal(new URL(page.url()).searchParams.get("sequence"), new URL(destination, origin).searchParams.get("sequence"));
  assert.equal(await page.getByRole("button", { name: "← Previous", exact: true }).isDisabled(), true);
  if (filtered.length > 1) {
    await page.getByRole("button", { name: "Next →", exact: true }).click();
    await page.getByRole("heading", { name: `Question ${filtered[1].number}`, exact: true }).waitFor();
    await page.getByRole("button", { name: "← Previous", exact: true }).click();
    await page.getByRole("heading", { name: `Question ${filtered[0].number}`, exact: true }).waitFor();
  }
  await page.getByRole("link", { name: "← Question Bank", exact: true }).click();
  await tiles.first().waitFor();
  assert.equal(await page.getByLabel("Topic", { exact: true }).inputValue(), topic);
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  if (muQuestions.length > 120) {
    await page.getByRole("button", { name: "Show more questions" }).click();
    const expanded = Math.min(muQuestions.length, 240);
    assert.equal(await tiles.count(), expanded);
    await tiles.nth(125 < expanded ? 125 : expanded - 1).click();
    await page.getByRole("button", { name: "Give Up", exact: true }).waitFor();
    await page.getByRole("link", { name: "← Question Bank", exact: true }).click();
    await tiles.first().waitFor();
    assert.equal(await tiles.count(), expanded);
  }
  // Old copied comma-list URLs still honor their original filtered order.
  const pair = [muQuestions[0], muQuestions[2]];
  await page.goto(`${origin}/practice/question-bank/${pair[0].id}?sequence=${pair.map(q => q.id).join(",")}`);
  await page.getByRole("button", { name: "Next →", exact: true }).click();
  await page.getByRole("heading", { name: `Question ${pair[1].number}`, exact: true }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Next →", exact: true }).isDisabled(), true);
  // Direct links have normal neighbors instead of interpreting empty sequence as 0.
  const ordered = [...muQuestions].sort((a, b) => a.number - b.number);
  await page.goto(`${origin}/practice/question-bank/${ordered[0].id}`);
  await page.getByRole("button", { name: "Next →", exact: true }).click();
  await page.getByRole("heading", { name: `Question ${ordered[1].number}`, exact: true }).waitFor();
  for (const [division, questions] of [["alpha", alphaQuestions], ["theta", thetaQuestions]]) {
    await page.goto(`${origin}/practice/question-bank/${division}`);
    await tiles.first().waitFor();
    assert.equal(await tiles.count(), Math.min(120, questions.length));
  }
  assert.deepEqual(writes, [], "navigation must not write any data");
  assert.deepEqual(errors, []);
  console.log(`PASS: production Next.js routing, native filter URLs without RSC reads, all divisions, filtered/legacy/direct next and previous, expanded return list, and read-only navigation (${documents.length} document requests).`);
} finally {
  await browser?.close();
  if (child.exitCode === null) { const exited = once(child, "exit"); child.kill("SIGTERM"); await exited; }
}
