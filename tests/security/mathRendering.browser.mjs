// Run after npm run build -- --webpack. Real components/KaTeX/CSS/fonts;
// local mock multiplayer endpoints only, with all external requests blocked.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtemp, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, extname, sep } from 'node:path';
import { createServer } from 'node:http';
import { chromium, expect } from '@playwright/test';
import { muQuestions } from '../../data/questions/mu.ts';

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '../..');
const fixture = name => join(root, 'tests/browserFixtures', name);
const output = await mkdtemp(join(tmpdir(), 'math-security-browser-'));
const compiler = require('next/dist/compiled/webpack/webpack').webpack({
  mode: 'development', entry: fixture('scoring.tsx'), devtool: false,
  output: { path: output, filename: 'client.js' },
  resolve: { extensions: ['.tsx', '.ts', '.js'], alias: {
    'next/navigation': fixture('router.ts'), 'next/link': fixture('link.tsx'),
    'next/image': fixture('googleImage.tsx'), '@/lib/multiplayerRealtime': fixture('realtime.ts'),
    '@': root,
  } },
  module: { rules: [
    { test: /\.tsx?$/, exclude: /node_modules/, use: fixture('loader.cjs') },
    { test: /\.css$/, use: fixture('css.cjs') },
  ] },
});
await new Promise((resolve, reject) => compiler.run((error, stats) => compiler.close(() => {
  if (error || stats.hasErrors()) reject(error ?? new Error(stats.toString()));
  else resolve();
})));
const bundle = await readFile(join(output, 'client.js'));
const staticRoot = join(root, '.next/static');
const css = (await readdir(staticRoot, { recursive: true })).filter(name => name.endsWith('.css'));
assert.ok(css.length, 'Build production styles before running this test');
const question = muQuestions.find(q => q.id === 10238);
assert.ok(question?.illustration, 'Keep the reported multiplayer image covered');
const diagram = await readFile(join(root, 'public', question.illustration.src));
const types = { '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    if (pathname === '/client.js') {
      response.setHeader('Content-Type', 'text/javascript'); response.end(bundle); return;
    }
    if (pathname === question.illustration.src) {
      response.setHeader('Content-Type', 'image/svg+xml'); response.end(diagram); return;
    }
    if (pathname.startsWith('/_next/static/')) {
      const path = resolve(staticRoot, pathname.slice('/_next/static/'.length));
      if (!path.startsWith(staticRoot + sep)) { response.writeHead(403); response.end(); return; }
      response.setHeader('Content-Type', types[extname(path)] ?? 'application/octet-stream');
      response.end(await readFile(path)); return;
    }
    if (pathname !== '/') { response.writeHead(404); response.end(); return; }
    response.setHeader('Content-Type', 'text/html');
    response.end(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
      ${css.map(file => `<link rel="stylesheet" href="/_next/static/${file}">`).join('')}
      </head><body><div id="root"></div><script src="/client.js"></script></body></html>`);
  } catch { response.writeHead(404); response.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const errors = [];
  const failures = [];
  for (const width of [1280, 390]) for (const resultMode of [false, true]) {
    const page = await browser.newPage({ viewport: { width, height: 950 } });
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    page.on('requestfailed', request => failures.push(request.url()));
    const player = { playerId: 'p', displayName: 'Fixture player', isGuest: true, score: 750, hasSubmittedCurrentQuestion: false };
    let state = {
      roomId: 'fixture', scoringVersion: 3, stateVersion: 1, currentPlayerId: 'p', questionNumber: 1, totalQuestions: 2,
      question: { questionId: question.id, number: 1, division: question.division, topic: question.topic, difficulty: question.difficulty,
        question: question.question, choices: question.choices, illustration: question.illustration },
      questionDurationSeconds: 90, preparing: false, questionStartedAt: Date.now() - 1000, questionEndsAt: Date.now() + 89000,
      intermissionEndsAt: null, players: [player], spectators: [], upcomingQuestion: null,
    };
    const result = {
      roomId: 'fixture', viewerMode: 'player', placement: 1, score: 750, ranked: false, ratingChange: null,
      finalLeaderboard: [{ ...player, placement: 1 }], rounds: [{
        questionId: question.id, questionNumber: 1, question: question.question, choices: question.choices,
        illustration: question.illustration, selectedAnswer: question.answer, correctAnswer: question.answer,
        correct: true, answerTimeMs: 90000, pointsEarned: 750,
        solution: question.solution + String.raw` Display-mode fixture: \[\int_0^1 x^2\,dx=\frac13\].`,
      }],
    };
    await page.addInitScript(({ state, result, resultMode }) => {
      window.initialRound = state;
      if (resultMode) window.initialResult = result;
    }, { state, result, resultMode });
    const posts = [];
    await page.route('**/*', async route => {
      const request = route.request();
      if (!request.url().startsWith(origin + '/')) return route.abort();
      if (!new URL(request.url()).pathname.startsWith('/api/')) return route.continue();
      if (request.method() === 'POST') {
        posts.push(request.postDataJSON());
        state = { ...state, stateVersion: 2, players: [{ ...player, hasSubmittedCurrentQuestion: true }] };
        return route.fulfill({ json: { accepted: true } });
      }
      return route.fulfill({ json: { ...state, serverReceivedAt: Date.now(), serverSentAt: Date.now() } });
    });
    await page.goto(origin);
    await expect(page.locator('.katex').first()).toBeVisible();
    await expect(page.locator('.katex-error')).toHaveCount(0);
    assert.ok(await page.locator('.katex math').count(), 'Accessible math remains in the actual multiplayer UI');
    const loadedFonts = await page.evaluate(async () => {
      const loaded = await document.fonts.load('16px KaTeX_Main');
      await document.fonts.ready;
      return loaded.map(font => font.status);
    });
    assert.ok(loadedFonts.length > 0 && loadedFonts.every(status => status === 'loaded'), 'Bundled KaTeX font must decode');
    const graph = page.getByRole('img', { name: question.illustration.alt });
    await expect(graph).toBeVisible();
    await graph.evaluate(img => img.decode());
    assert.ok(await graph.evaluate(img => img.naturalWidth > 0));
    if (resultMode) await expect(page.locator('.katex-display')).toBeVisible();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'No full-page horizontal overflow');
    await page.screenshot({ path: join(output, `${resultMode ? 'results' : 'question'}-${width}.png`), fullPage: true });
    if (!resultMode) {
      await page.getByRole('button', { name: /^A / }).click();
      await page.getByRole('button', { name: 'Submit Answer', exact: true }).click();
      await expect(page.getByText('Answer submitted', { exact: true })).toBeVisible();
      assert.deepEqual(posts, [{ questionId: question.id, selectedAnswer: 'A' }]);
    }
    await page.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  console.log('PASS: actual multiplayer question/results math, MathML, production CSS/fonts, question 10238 diagram, submission and desktop/mobile overflow checks.');
  console.log(`Screenshots: ${output}`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
