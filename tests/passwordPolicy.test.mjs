import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInThisContext } from "node:vm";
import ts from "typescript";

async function compile(path) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  });
  return (dependencies = {}) => {
    const exports = {};
    runInThisContext(`(function(exports, require) { ${outputText}\n })`, { filename: path })(exports, (name) => {
      assert.ok(Object.hasOwn(dependencies, name), `Unexpected dependency ${name}`);
      return dependencies[name];
    });
    return exports;
  };
}

const policy = (await compile("lib/auth/passwordPolicy.ts"))();
const loadAuthService = await compile("lib/auth/authService.ts");
const { MIN_PASSWORD_LENGTH, PASSWORD_REQUIREMENT_MESSAGE, getPasswordValidationError } = policy;

test("new passwords require 8 Unicode code points, not UTF-16 code units", () => {
  assert.equal(MIN_PASSWORD_LENGTH, 8);
  assert.equal(PASSWORD_REQUIREMENT_MESSAGE, "Password must be at least 8 characters.");
  for (const character of ["a", "é", "🔐"]) {
    assert.equal(getPasswordValidationError(character.repeat(7)), PASSWORD_REQUIREMENT_MESSAGE);
    assert.equal(getPasswordValidationError(character.repeat(8)), null);
  }
  assert.equal(getPasswordValidationError("🔐".repeat(4)), PASSWORD_REQUIREMENT_MESSAGE);
});

test("password policy rejects non-strings without coercion or throwing", () => {
  for (const value of [undefined, null, false, 8, [], {}, { length: 8 }, new String("a".repeat(8))]) {
    assert.equal(getPasswordValidationError(value), PASSWORD_REQUIREMENT_MESSAGE);
  }
});

test("long passphrases and spaces are supported without character-class requirements", () => {
  for (const password of ["abcdefghijkl", "123456789012", "  passphrase  ", "a".repeat(1000)]) {
    assert.equal(getPasswordValidationError(password), null);
  }
});

async function signUp(password, options = {}) {
  const effects = [];
  const service = loadAuthService({
    "@/lib/auth/passwordPolicy": policy,
    "@/lib/legal": { LEGAL_VERSION: "fixture-version" },
    "@/lib/supabase/client": {
      createClient() {
        effects.push({ kind: "createClient" });
        return {
          async rpc(name, value) {
            effects.push({ kind: "rpc", name, value });
            return { data: true, error: null };
          },
          auth: {
            async signUp(value) {
              effects.push({ kind: "signUp", value });
              return { data: { session: {} }, error: options.providerError ?? null };
            },
          },
        };
      },
    },
  });
  const result = await service.signUp({ username: "math_fixture", password, acceptedLegal: options.acceptedLegal ?? true });
  return { result, effects };
}

test("signup rejects short passwords before even creating a provider client", async () => {
  for (const password of ["a".repeat(7), "🔐".repeat(4), null, { length: 8 }]) {
    const { result, effects } = await signUp(password);
    assert.deepEqual(result, { success: false, error: PASSWORD_REQUIREMENT_MESSAGE });
    assert.deepEqual(effects, []);
  }
});

test("signup accepts 8-character passwords without rewriting them and preserves username-only accounts", async () => {
  for (const password of ["abcdefgh", "🔐".repeat(8), "  useful long passphrase  "]) {
    const { result, effects } = await signUp(password);
    assert.deepEqual(result, { success: true });
    assert.deepEqual(effects.map(({ kind }) => kind), ["createClient", "rpc", "signUp"]);
    const value = effects.at(-1).value;
    assert.equal(value.password, password);
    assert.equal(value.email, "math_fixture@users.mao-practice.local");
    assert.equal(value.options.data.username, "math_fixture");
  }
});

test("signup keeps legal acceptance mandatory without provider side effects", async () => {
  const { result, effects } = await signUp("a".repeat(8), { acceptedLegal: false });
  assert.equal(result.success, false);
  assert.match(result.error, /legal terms/);
  assert.deepEqual(effects, []);
});

test("signup explains provider weak-password rejections without exposing provider details", async () => {
  const { result } = await signUp("a".repeat(8), {
    providerError: { code: "weak_password", message: "private fixture provider detail" },
  });
  assert.equal(result.success, false);
  assert.match(result.error, /stronger, unique password/);
  assert.doesNotMatch(result.error, /private fixture/);
});
