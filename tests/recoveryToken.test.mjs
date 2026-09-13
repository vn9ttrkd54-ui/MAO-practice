import assert from 'node:assert/strict';
import * as crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../lib/auth/recoveryToken.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
test('recovery UI has no browser session or direct password-update fallback', async () => {
  const gate = await readFile(new URL('../components/auth/RecoveryGate.tsx', import.meta.url), 'utf8');
  const form = await readFile(new URL('../components/auth/ResetPasswordForm.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(gate, /use client|setSession|PASSWORD_RECOVERY|window\./);
  assert.match(gate, /if \(!serverVerified\)/);
  assert.doesNotMatch(form, /browserRecovery|createClient|updateUser/);
  assert.match(form, /fetch\("\/api\/auth\/reset-password"/);
});
function fixture(key = 'isolated-test-secret') {
  let now = 1800000000000;
  const exports = {};
  runInNewContext(outputText, {
    exports, Buffer, Date: { now: () => now }, process: { env: { SUPABASE_SECRET_KEY: key } },
    require(name) {
      if (name === 'server-only') return {};
      assert.equal(name, 'node:crypto');
      return crypto;
    },
  });
  return { ...exports, advance: seconds => { now += seconds * 1000; } };
}
test('recovery token is bound to the account and expires at ten minutes', () => {
  const api = fixture();
  const token = api.createRecoveryToken('fixture-user');
  assert.equal(api.verifyRecoveryToken(token, 'fixture-user'), true);
  assert.equal(api.verifyRecoveryToken(token, 'different-user'), false);
  api.advance(599);
  assert.equal(api.verifyRecoveryToken(token, 'fixture-user'), true);
  api.advance(1);
  assert.equal(api.verifyRecoveryToken(token, 'fixture-user'), false);
});
test('malformed signatures and appended segments cannot exploit permissive hex decoding', () => {
  const api = fixture();
  const token = api.createRecoveryToken('fixture-user');
  const [user, expiry, signature] = token.split('.');
  for (const bad of [undefined, '', token + '.', token + '..', token + '.extra', token + 'z', token + '00',
    `${user}.${expiry}.${signature.slice(0, -1)}`, `${user}.${expiry}.` + '0'.repeat(64),
    `${user}.${Number(expiry) + 1}.${signature}`, `other.${expiry}.${signature}`]) {
    assert.equal(api.verifyRecoveryToken(bad, user), false);
  }
});
test('tokens cannot be verified under a different signing key', () => {
  const token = fixture().createRecoveryToken('fixture-user');
  assert.equal(fixture('different-test-secret').verifyRecoveryToken(token, 'fixture-user'), false);
  assert.throws(() => fixture('').createRecoveryToken('fixture-user'), /not configured/);
});
