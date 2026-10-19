import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import { getChallengeWeekDates } from '../../lib/challengeWeek.ts';

const source = readFileSync(new URL('../../lib/services/challengeService.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function fixture({ user = { id: 'verified-user' }, assignment = 'SEC-MU', error = null } = {}) {
  const date = new Date().toISOString().slice(0, 10);
  const calls = [];
  let adminClients = 0;
  const db = {
    auth: { getUser: async () => ({ data: { user } }) },
    from(table) {
      assert.equal(table, 'daily_challenges', 'No user-scoped table write is needed');
      const query = {
        select() { return query; },
        eq() { return query; },
        maybeSingle: async () => ({ data: { challenge_date: date, question_id: assignment }, error: null }),
      };
      return query;
    },
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === 'server-only') return {};
      if (name === '@/lib/challengeWeek') return { getChallengeWeekDates };
      if (name === '@/lib/supabase/server') return { createClient: async () => db };
      if (name === '@/lib/challengeQuestionCatalog') return {
        requireDailyQuestionById: id => ({ id, division: 'Mu', answer: 'C', solution: 'Server-owned solution' }),
      };
      if (name === '@/lib/supabase/admin') return { createAdminClient: () => {
        adminClients++;
        return { rpc: async (name, args) => {
          calls.push({ name, args: JSON.parse(JSON.stringify(args)) });
          return { error };
        } };
      } };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return {
    calls,
    adminClients: () => adminClients,
    submit: overrides => exports.submitChallenge({ challengeDate: date, questionId: 'SEC-MU', selectedAnswer: 'A', ...overrides }),
    date,
  };
}

test('Challenge ignores forged correctness and identity and uses only the verified server RPC', async () => {
  const f = fixture();
  const result = await f.submit({ correct: true, userId: 'other-user', p_user_id: 'other-user' });
  assert.equal(result.correct, false);
  assert.equal(result.saved, true);
  assert.equal(f.adminClients(), 1);
  assert.deepEqual(f.calls, [{ name: 'submit_challenge_attempt', args: {
    p_user_id: 'verified-user', p_challenge_date: f.date, p_question_id: 'SEC-MU', p_selected_answer: 'A', p_correct: false,
  } }]);
});

test('Challenge saves a genuinely correct answer through the same single RPC', async () => {
  const f = fixture();
  assert.equal((await f.submit({ selectedAnswer: 'C', correct: false })).correct, true);
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].args.p_correct, true);
});

test('bank fallback answers use the same verified identity and server grading', async () => {
  const f = fixture({ assignment: 'CH-BANK-10238' });
  const result = await f.submit({ questionId: 'CH-BANK-10238', selectedAnswer: 'C', userId: 'forged' });
  assert.equal(result.correct, true);
  assert.equal(result.saved, true);
  assert.equal(f.calls[0].args.p_question_id, 'CH-BANK-10238');
  assert.equal(f.calls[0].args.p_user_id, 'verified-user');
});

test('guest Challenge answers do not obtain a write client or save records', async () => {
  const f = fixture({ user: null });
  const result = await f.submit({ selectedAnswer: 'C', userId: 'forged-user' });
  assert.equal(result.correct, true);
  assert.equal(result.saved, false);
  assert.equal(f.adminClients(), 0);
  assert.deepEqual(f.calls, []);
});

test('invalid dates, choices and changed assignments fail before any server write', async () => {
  for (const [config, input] of [
    [{}, { challengeDate: '2000-01-01' }],
    [{}, { challengeDate: 'not-a-date' }],
    [{}, { selectedAnswer: 'Z' }],
    [{ assignment: 'OTHER-QUESTION' }, {}],
  ]) {
    const f = fixture(config);
    await assert.rejects(f.submit(input));
    assert.equal(f.adminClients(), 0);
    assert.deepEqual(f.calls, []);
  }
});

test('duplicate and denied database writes are not reported as saved', async () => {
  for (const error of [{ code: '23505' }, { code: '42501', message: 'Private database details' }]) {
    const f = fixture({ error });
    await assert.rejects(f.submit(), error.code === '23505' ? /already submitted/ : /Unable to submit the Challenge right now/);
    assert.equal(f.calls.length, 1);
  }
});
