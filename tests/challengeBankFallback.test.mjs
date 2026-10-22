import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { pickBankChallenge, toBankChallenge } from '../lib/challengeBankFallback.ts';
import { getChallengeDate } from '../lib/challengeDate.ts';
import { muQuestions } from '../data/questions/mu.ts';
import { alphaQuestions } from '../data/questions/alpha.ts';
import { thetaQuestions } from '../data/questions/theta.ts';
import { getChallengeQuestionById, challengeQuestions } from '../data/challengeQuestions.ts';

const bank = [
  { id: 1, division: 'Mu' }, { id: 2, division: 'Mu' }, { id: 3, division: 'Mu' },
  { id: 4, division: 'Alpha' }, { id: 5, division: 'Theta' },
];
const row = (id, date = '2026-01-01') => ({ question_id: `CH-BANK-${id}`, challenge_date: date });

test('random selection stays in division and prefers every unused question before repeating', () => {
  const history = [];
  for (let i = 0; i < 3; i++) {
    const id = pickBankChallenge(bank, 'Mu', history, () => 0.99);
    assert.ok(!history.some(item => item.question_id === id));
    history.push({ question_id: id, challenge_date: `2026-01-0${i + 1}` });
  }
  assert.equal(pickBankChallenge(bank, 'Mu', history), history[0].question_id);
  assert.equal(pickBankChallenge(bank, 'Alpha', history), 'CH-BANK-4');
  assert.equal(pickBankChallenge(bank, 'Theta', history), 'CH-BANK-5');
  assert.equal(pickBankChallenge([], 'Mu', []), null);
  assert.notEqual(pickBankChallenge(bank, 'Mu', [], () => 0), pickBankChallenge(bank, 'Mu', [], () => 0.99));
});

test('repeated historical assignments use the latest occurrence and new bank additions win', () => {
  const history = [row(1), row(2, '2026-01-02'), row(3, '2026-01-03'), row(1, '2026-01-04')];
  assert.equal(pickBankChallenge(bank, 'Mu', history), 'CH-BANK-2');
  assert.equal(pickBankChallenge([...bank, { id: 6, division: 'Mu' }], 'Mu', history), 'CH-BANK-6');
});

test('bank adaptation preserves stable ID, all choices, grading, diagrams and source credit', () => {
  const question = { id: 10238, number: 1, division: 'Mu', difficulty: 3, topic: 'Limits',
    question: 'Graph question', choices: ['a', 'b', 'c', 'd', 'e'], answer: 'C', solution: 'Solution',
    illustration: { src: '/questions/graph.svg', alt: 'Graph', width: 400, height: 300 },
    source: { competition: 'Original competition', event: 'Individual', questionNumber: 7 } };
  const converted = toBankChallenge(question);
  assert.equal(converted.id, 'CH-BANK-10238');
  assert.deepEqual(converted.choices, { A: 'a', B: 'b', C: 'c', D: 'd', E: 'e' });
  for (const key of ['division', 'difficulty', 'topic', 'question', 'answer', 'solution', 'illustration', 'source']) {
    assert.deepEqual(converted[key], question[key]);
  }
});

test('real catalog resolves every published bank question and every upload, and rejects unknown IDs', () => {
  const questions = [...muQuestions, ...alphaQuestions, ...thetaQuestions];
  const exports = {};
  const source = readFileSync(new URL('../lib/challengeQuestionCatalog.ts', import.meta.url), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports, require(name) {
    if (name === 'server-only') return {};
    if (name === '@/data/questions') return { questions };
    if (name === '@/data/challengeQuestions') return { getChallengeQuestionById };
    if (name === '@/lib/challengeBankFallback') return { toBankChallenge };
    throw Error(name);
  } });
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  for (const question of questions) {
    const daily = exports.requireDailyQuestionById(`CH-BANK-${question.id}`);
    assert.equal(daily.division, question.division);
    assert.equal(daily.answer, question.answer);
    assert.equal(question.choices.length, 5);
    assert.ok(daily.choices[daily.answer]);
  }
  for (const question of challengeQuestions) assert.equal(exports.requireDailyQuestionById(question.id), question);
  for (const id of ['CH-BANK-0', 'CH-BANK-../secrets', 'CH-NOT-PUBLISHED', null]) {
    assert.throws(() => exports.requireDailyQuestionById(id), /unavailable/);
  }
});

const compiled = ts.transpileModule(readFileSync(new URL('../lib/services/challengeFallbackService.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function fixture({ now = new Date().toISOString(), initial = null, history = [], fail = '', racingManual = null } = {}) {
  class FixedDate extends Date { constructor(value) { super(value ?? now); } }
  let assignment = initial;
  const calls = [], writes = [];
  const db = { from(table) {
    assert.equal(table, 'daily_challenges');
    const filters = {};
    const query = {
      select() { return query; },
      eq(key, value) { filters[key] = value; return query; },
      lt(key, value) { assert.equal(key, 'challenge_date'); filters.before = value; return query; },
      order(key, options) { assert.equal(key, 'challenge_date'); assert.equal(options.ascending, false); return query; },
      async maybeSingle() {
        calls.push({ ...filters });
        return { data: assignment ? { question_id: assignment } : null, error: fail === 'read' ? {} : null };
      },
      async range(start, end) {
        assert.equal(end - start, 499);
        assert.equal(filters.division, 'Mu');
        assert.match(filters.before, /^\d{4}-\d{2}-\d{2}$/);
        return { data: history.slice(start, end + 1), error: fail === 'history' ? {} : null };
      },
      async upsert(value, options) {
        assert.equal(options.onConflict, 'challenge_date,division');
        assert.equal(options.ignoreDuplicates, true);
        assert.equal(value.challenge_date, getChallengeDate(new Date(now)));
        assert.equal(value.division, 'Mu');
        writes.push(value);
        if (fail === 'write') return { error: { message: 'private details' } };
        assignment ??= racingManual ?? value.question_id;
        return { error: null };
      },
    };
    return query;
  } };
  let adminClients = 0;
  const exports = {};
  vm.runInNewContext(compiled, { exports, Date: FixedDate, require(name) {
    if (name === 'server-only') return {};
    if (name === '@/lib/challengeDate') return { getChallengeDate };
    if (name === '@/data/questions') return { questions: bank };
    if (name === '@/lib/challengeBankFallback') return { pickBankChallenge };
    if (name === '@/lib/supabase/admin') return { createAdminClient() { adminClients++; return db; } };
    throw Error(name);
  } });
  return { ensure: exports.ensureTodayChallenge, writes, calls, assignment: () => assignment, adminClients: () => adminClients };
}

test('uploaded assignment has priority, with no history read or write', async () => {
  const f = fixture({ initial: 'CH-UPLOADED', fail: 'history' });
  await f.ensure('Mu');
  assert.equal(f.assignment(), 'CH-UPLOADED');
  assert.equal(f.writes.length, 0);
});

test('history beyond the API page limit is included; assigned question survives repeat visits', async () => {
  const f = fixture({ history: [...Array.from({ length: 500 }, () => row(1)), row(2)] });
  await f.ensure('Mu');
  assert.equal(f.assignment(), 'CH-BANK-3');
  await f.ensure('Mu');
  assert.equal(f.writes.length, 1);
});

test('simultaneous visitors converge without replacing an assignment', async () => {
  const f = fixture();
  await Promise.all(Array.from({ length: 30 }, () => f.ensure('Mu')));
  const id = f.assignment();
  assert.ok(['CH-BANK-1', 'CH-BANK-2', 'CH-BANK-3'].includes(id));
  await f.ensure('Mu');
  assert.equal(f.assignment(), id);
});

test('a manual assignment arriving during fallback creation wins the conflict', async () => {
  const f = fixture({ racingManual: 'CH-UPLOADED' });
  await f.ensure('Mu');
  assert.equal(f.assignment(), 'CH-UPLOADED');
});

test('invalid division cannot obtain admin access or write arbitrary rows', async () => {
  for (const division of ['Other', '', null, { division: 'Mu' }]) {
    const f = fixture();
    await assert.rejects(f.ensure(division), /Invalid division/);
    assert.equal(f.adminClients(), 0);
  }
});

test('database failures fail closed with a safe retry message', async () => {
  for (const fail of ['read', 'history', 'write']) {
    const f = fixture({ fail });
    await assert.rejects(f.ensure('Mu'), /^Error: Unable to prepare today's question\. Please retry\.$/);
    if (fail !== 'write') assert.equal(f.writes.length, 0);
  }
});

test('fallback scheduling retains the New York day until midnight, in summer and winter', async () => {
  for (const [now, expected] of [
    ['2026-07-15T03:59:59Z', '2026-07-14'],
    ['2026-07-15T04:00:00Z', '2026-07-15'],
    ['2026-01-15T04:59:59Z', '2026-01-14'],
    ['2026-01-15T05:00:00Z', '2026-01-15'],
  ]) {
    const f = fixture({ now });
    await f.ensure('Mu');
    assert.equal(f.writes[0].challenge_date, expected);
    assert.ok(f.calls.every(call => call.challenge_date === expected));
  }
});
