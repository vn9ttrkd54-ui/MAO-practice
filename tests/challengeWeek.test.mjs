import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { getChallengeWeekDates } from '../lib/challengeWeek.ts';
import { getChallengeDate } from '../lib/challengeDate.ts';

test('New York calendar week runs Monday–Sunday through week, month and year boundaries', () => {
  assert.deepEqual(getChallengeWeekDates('2026-10-19'), [
    '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25',
  ]);
  assert.equal(getChallengeWeekDates('2026-10-18')[0], '2026-10-12');
  assert.equal(getChallengeWeekDates('2027-01-01')[0], '2026-12-28');
  assert.equal(getChallengeWeekDates('2027-01-01')[6], '2027-01-03');
  assert.equal(getChallengeWeekDates('2026-11-01')[0], '2026-10-26');
});

const compiled = ts.transpileModule(readFileSync(new URL('../lib/services/challengeService.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const defaultStats = { current_streak: 4, longest_streak: 12, total_completed: 18, total_correct: 15 };

function fixture({ today = '2026-10-19', now = `${today}T06:35:00Z`, user = 'viewer', attempts = [], statistics = defaultStats, error = null } = {}) {
  const calls = [];
  const db = {
    auth: { getUser: async () => ({ data: { user: user ? { id: user } : null } }) },
    from(table) {
      assert.ok(['challenge_user_statistics', 'challenge_attempts'].includes(table));
      const call = { table, filters: {} }; calls.push(call);
      const query = {
        select(columns) { call.columns = columns; return query; },
        eq(column, value) { call.filters[column] = value; return query; },
        gte(column, value) { assert.equal(column, 'challenge_date'); call.start = value; return query; },
        lte(column, value) { assert.equal(column, 'challenge_date'); call.end = value; return query; },
        order(column, options) { assert.equal(column, 'challenge_date'); assert.equal(options.ascending, false); return query; },
        limit(max) { call.limit = max; return query; },
        async maybeSingle() { return { data: statistics, error }; },
        async returns() {
          return { data: attempts.filter(row => row.user_id === call.filters.user_id && row.challenge_date >= call.start && row.challenge_date <= call.end)
            .sort((a, b) => b.challenge_date.localeCompare(a.challenge_date)).slice(0, call.limit)
            .map(({ challenge_date }) => ({ challenge_date })), error };
        },
      };
      return query;
    },
  };
  class FixedDate extends Date { constructor(value) { super(value ?? now); } }
  const exports = {};
  vm.runInNewContext(compiled, { exports, Date: FixedDate, require(name) {
    if (name === 'server-only') return {};
    if (name === '@/lib/challengeDate') return { getChallengeDate };
    if (name === '@/lib/challengeWeek') return { getChallengeWeekDates };
    if (name === '@/lib/challengeQuestionCatalog') return {};
    if (name === '@/lib/supabase/server') return { createClient: async () => db };
    if (name === '@/lib/supabase/admin') return { createAdminClient() { throw Error('No privileged client needed for calendar reads'); } };
    throw Error(name);
  } });
  return { calls, load: () => exports.getChallengeStatistics() };
}
const attempt = (date, user = 'viewer', correct = true) => ({ challenge_date: date, user_id: user, correct });
const plain = value => JSON.parse(JSON.stringify(value));

test('Monday fills after a saved answer; duplicates across divisions count as one day', async () => {
  const f = fixture({ attempts: [attempt('2026-10-19'), attempt('2026-10-19'), attempt('2026-10-18')] });
  const result = await f.load();
  assert.deepEqual(plain(result.completedDates), ['2026-10-19']);
  assert.equal(result.asOfDate, '2026-10-19');
  assert.equal(result.currentStreak, 4);
  assert.equal(f.calls.length, 2, 'reuse the existing two statistics reads, without a third request');
  for (const call of f.calls) assert.equal(call.filters.user_id, 'viewer');
  assert.deepEqual(f.calls[1], { table: 'challenge_attempts', filters: { user_id: 'viewer' },
    columns: 'challenge_date', start: '2026-10-18', end: '2026-10-19', limit: 24 });
});

test('only saved dates for this account/current week fill; missed days stay empty', async () => {
  const f = fixture({ today: '2026-10-22', attempts: [attempt('2026-10-19'), attempt('2026-10-21'),
    attempt('2026-10-20', 'someone-else'), attempt('2026-10-18'), attempt('2026-10-23')] });
  assert.deepEqual(plain((await f.load()).completedDates), ['2026-10-21', '2026-10-19']);
});

test('a wrong saved answer still completes the day without creating a streak', async () => {
  const f = fixture({ attempts: [attempt('2026-10-19', 'viewer', false)], statistics: { ...defaultStats, current_streak: 0 } });
  const result = await f.load();
  assert.deepEqual(plain(result.completedDates), ['2026-10-19']);
  assert.equal(result.currentStreak, 0);
});

test('Monday does not fill from Sunday history, but the existing streak grace day is preserved', async () => {
  const result = await fixture({ attempts: [attempt('2026-10-18')] }).load();
  assert.deepEqual(plain(result.completedDates), []);
  assert.equal(result.currentStreak, 4);
  assert.equal((await fixture({ attempts: [attempt('2026-10-17')] }).load()).currentStreak, 0);
});

test('guest/no-history views do not invent completed days from a streak number', async () => {
  const guest = fixture({ user: null, attempts: [attempt('2026-10-19')] });
  assert.deepEqual(plain((await guest.load()).completedDates), []);
  assert.equal(guest.calls.length, 0);
  assert.deepEqual(plain((await fixture().load()).completedDates), []);
});

test('failed reads surface an error instead of displaying false completion data', async () => {
  await assert.rejects(fixture({ error: { message: 'Read failed' } }).load(), /Unable to load Challenge statistics/);
});

test('after UTC midnight the New York day, week and yesterday grace period do not advance early', async () => {
  const f = fixture({ now: '2026-10-19T02:30:00Z', attempts: [attempt('2026-10-18'), attempt('2026-10-17')] });
  const result = await f.load();
  assert.equal(result.asOfDate, '2026-10-18');
  assert.equal(result.currentStreak, 4);
  assert.equal(f.calls[1].start, '2026-10-12');
  assert.equal(f.calls[1].end, '2026-10-18');
  assert.deepEqual(plain(result.completedDates), ['2026-10-18', '2026-10-17']);
});

test('yesterday remains exactly one calendar day earlier at both daylight saving changes', async () => {
  for (const now of ['2026-03-09T04:00:00Z', '2026-11-02T05:00:00Z']) {
    const today = getChallengeDate(new Date(now));
    const yesterday = new Date(Date.parse(`${today}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
    assert.equal((await fixture({ now, attempts: [attempt(yesterday)] }).load()).currentStreak, 4);
    const twoDaysAgo = new Date(Date.parse(`${today}T00:00:00Z`) - 2 * 86400000).toISOString().slice(0, 10);
    assert.equal((await fixture({ now, attempts: [attempt(twoDaysAgo)] }).load()).currentStreak, 0);
  }
});
