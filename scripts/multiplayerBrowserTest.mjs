import { chromium } from "@playwright/test";

const roomCode = process.argv[2]?.trim().toUpperCase();
const playerCount = Number(process.argv[3] ?? 15);
const baseUrl = (process.env.TARGET_URL ?? "http://localhost:3000").replace(/\/$/, "");
const joinTimeoutMs = 45_000;
const matchTimeoutMs = 20 * 60_000;

if (!roomCode || !/^[A-Z0-9]{8}$/.test(roomCode)) {
  console.error("Usage: npm run test:multiplayer-browser -- ROOMCODE [PLAYER_COUNT]");
  process.exit(1);
}
if (!Number.isInteger(playerCount) || playerCount < 1 || playerCount > 30) {
  console.error("PLAYER_COUNT must be between 1 and 30.");
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const players = [];
const failures = [];
const startedAt = Date.now();

function elapsed() {
  return `${((Date.now() - startedAt) / 1000).toFixed(1)}s`;
}

async function joinPlayer(index) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const name = `LoadTest${String(index + 1).padStart(2, "0")}`;
  page.on("pageerror", (error) => failures.push(`${name}: page error: ${error.message}`));
  const acceptedQuestions = new Set();
  const transientFailures = [];
  const timings = { finalAnswerAt: null, completedSignalAt: null, resultsRouteAt: null, podiumAt: null, detailsAt: null };
  page.on("response", (response) => {
    if (response.request().method() === "GET" && response.status() === 204
      && /\/round(?:\?|$)/.test(response.url()) && timings.completedSignalAt === null) {
      timings.completedSignalAt = Date.now();
    }
    if (response.request().method() === "POST" && response.url().endsWith("/round")) {
      if (response.ok()) {
        try { acceptedQuestions.add(response.request().postDataJSON().questionId); } catch {}
      } else if (response.status() < 500 && response.status() !== 429) {
        failures.push(`${name}: submission rejected: HTTP ${response.status()}`);
      } else transientFailures.push(response.status());
    } else if (response.status() >= 500) transientFailures.push(response.status());
  });

  await page.goto(`${baseUrl}/multiplayer`, { waitUntil: "domcontentloaded", timeout: joinTimeoutMs });
  await page.getByLabel("Room code").fill(roomCode);
  await page.getByLabel("Guest nickname").fill(name);
  await page.getByRole("button", { name: "Join Room" }).click();
  await page.waitForURL(/\/multiplayer\/room\//, { timeout: joinTimeoutMs });
  players.push({ context, page, name, questionLoads: [], countdowns: new Map(), acceptedQuestions, transientFailures, timings });
  console.log(`[${elapsed()}] ${name} joined`);
}

async function runPlayer(player) {
  const { page, name } = player;
  let lastQuestion = 0;
  let finalAnswerSubmittedAt = null;
  const deadline = Date.now() + matchTimeoutMs;

  while (Date.now() < deadline) {
    if (finalAnswerSubmittedAt !== null) {
      if (player.timings.resultsRouteAt === null && page.url().endsWith("/results")) player.timings.resultsRouteAt = Date.now();
      if (player.timings.podiumAt === null && await page.getByText("MATCH COMPLETE", { exact: true }).isVisible().catch(() => false)) {
        player.timings.podiumAt = Date.now();
      }
    }
    const results = page.getByRole("heading", { name: /You placed|Final results/ });
    if (await results.isVisible().catch(() => false)) {
      player.timings.detailsAt = Date.now();
      const expected = player.questionLoads.length;
      if (player.acceptedQuestions.size < expected) failures.push(`${name}: only ${player.acceptedQuestions.size}/${expected} answers confirmed`);
      for (const [question, numbers] of player.countdowns) {
        console.log(`[${elapsed()}] ${name} intermission after ${question}: ${[...numbers].join(", ")}`);
      }
      console.log(`[${elapsed()}] ${name} transient HTTP failures recovered/observed: ${player.transientFailures.length}`);
      console.log(`[${elapsed()}] ${name} reached final results`);
      return;
    }

    if (finalAnswerSubmittedAt !== null && Date.now() - finalAnswerSubmittedAt > 90_000) {
      const headings = await page.getByRole("heading").allTextContents().catch(() => []);
      throw new Error(`Final results did not appear within 90s (url: ${page.url()}, headings: ${JSON.stringify(headings.slice(0, 5))})`);
    }

    const countdown = (await page.getByText(/^Next question in \d+s$/).allTextContents())[0] ?? null;
    if (countdown) {
      const seconds = Number(countdown.match(/(\d+)s/)[1]);
      if (!player.countdowns.has(lastQuestion)) player.countdowns.set(lastQuestion, new Set());
      player.countdowns.get(lastQuestion).add(seconds);
    }
    const heading = page.getByRole("heading", { name: /Question \d+ of \d+/ });
    if (await heading.isVisible().catch(() => false)) {
      const text = await heading.textContent();
      const questionNumber = Number(text?.match(/Question (\d+)/)?.[1] ?? 0);
      const totalQuestions = Number(text?.match(/of (\d+)/)?.[1] ?? 0);
      if (questionNumber > lastQuestion) {
        if (questionNumber > lastQuestion + 1) failures.push(`${name}: skipped from question ${lastQuestion} to ${questionNumber}`);
        lastQuestion = questionNumber;
        const timer = await page.getByText(/^\d+s$/).first().textContent().catch(() => "unknown");
        const revealedAt = Date.now();
        console.log(`[${elapsed()}] ${name} loaded question ${questionNumber} at ${timer}`);

        const answer = page.locator("section button").filter({
          has: page.locator("span:first-child").filter({ hasText: /^A$/ }),
        }).first();
        await answer.waitFor({ state: "visible", timeout: 15_000 });
        await answer.waitFor({ state: "attached", timeout: 15_000 });
        await page.waitForFunction(
          (button) => button instanceof HTMLButtonElement && !button.disabled,
          await answer.elementHandle(),
          { timeout: 15_000 },
        );
        const enabledDelayMs = Date.now() - revealedAt;
        const enabledTimer = await page.getByText(/^\d+s$/).first().textContent().catch(() => "unknown");
        player.questionLoads.push({ questionNumber, timer, enabledTimer, enabledDelayMs, atMs: revealedAt - startedAt });
        console.log(`[${elapsed()}] ${name} enabled question ${questionNumber} after ${enabledDelayMs}ms at ${enabledTimer}`);
        await answer.click();
        await page.getByRole("button", { name: "Submit Answer" }).click();
        if (questionNumber === totalQuestions) {
          finalAnswerSubmittedAt = Date.now();
          player.timings.finalAnswerAt = finalAnswerSubmittedAt;
        }
        // Keep observing countdowns and later rounds while the app retries.
        // A single aborted attempt is not the outcome of a submission.
        console.log(`[${elapsed()}] ${name} submitted question ${questionNumber}`);
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error("Timed out before reaching final results.");
}

try {
  console.log(`Opening ${playerCount} isolated players at ${baseUrl} for room ${roomCode}.`);
  for (let index = 0; index < playerCount; index += 1) {
    await joinPlayer(index);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\nAll simulated players joined. Start the game from your host window.\n`);
  const outcomes = await Promise.allSettled(players.map(runPlayer));
  outcomes.forEach((outcome, index) => {
    if (outcome.status === "rejected") failures.push(`${players[index].name}: ${outcome.reason?.message ?? outcome.reason}`);
  });

  console.log(`\nCompleted players: ${outcomes.filter((outcome) => outcome.status === "fulfilled").length}/${playerCount}`);
  console.log("Question delivery summary:");
  const questionNumbers = [...new Set(players.flatMap((player) => player.questionLoads.map((load) => load.questionNumber)))];
  for (const questionNumber of questionNumbers) {
    const loads = players.flatMap((player) => player.questionLoads.filter((load) => load.questionNumber === questionNumber));
    const timers = loads.map((load) => Number.parseInt(load.timer, 10)).filter(Number.isFinite);
    const timerRange = timers.length > 0 ? `${Math.min(...timers)}s-${Math.max(...timers)}s` : "unknown";
    const enabledDelays = loads.map((load) => load.enabledDelayMs).filter(Number.isFinite);
    const enabledDelayRange = enabledDelays.length > 0
      ? `${Math.min(...enabledDelays)}ms-${Math.max(...enabledDelays)}ms`
      : "unknown";
    console.log(`Question ${questionNumber}: ${loads.length}/${playerCount} loaded; timer range ${timerRange}; enable delay ${enabledDelayRange}`);
  }
  console.log("Final-results timing:");
  for (const [label, from, to] of [
    ["Final answer -> completion signal", "finalAnswerAt", "completedSignalAt"],
    ["Completion signal -> results route", "completedSignalAt", "resultsRouteAt"],
    ["Results route -> podium", "resultsRouteAt", "podiumAt"],
    ["Podium -> full results", "podiumAt", "detailsAt"],
  ]) {
    const delays = players.map((player) => player.timings[from] !== null && player.timings[to] !== null
      ? player.timings[to] - player.timings[from] : null).filter(Number.isFinite);
    console.log(`${label}: ${delays.length}/${playerCount}; ${delays.length ? `${Math.min(...delays)}ms-${Math.max(...delays)}ms` : "unknown"}`);
  }
  if (failures.length > 0) {
    console.error(`Failures (${failures.length}):`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log("No browser or server failures detected.");
  }
} finally {
  await Promise.all(players.map(({ context }) => context.close()));
  await browser.close();
}
