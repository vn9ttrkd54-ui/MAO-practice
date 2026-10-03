import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInThisContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import rules from "../lib/auth/publicNameRules.json" with { type: "json" };

const source = await readFile(new URL("../lib/auth/publicNames.ts", import.meta.url), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const api = {};
runInThisContext(`(function(exports,require){${output}})`)(api, name => {
  assert.equal(name,"./publicNameRules.json"); return { default: rules };
});
export const blockedNames = ["fuck", "FUCK", "f_u_c_k", "fuuck", "f u c k", "f\u200buck", "ｆｕｃｋ", "f4gg0t", "b1tch", "a$$hole", "shit_123", "dick123", "n1gg3r", "c_u_n_t", "motherfucker"];
export const allowedNames = ["math_student", "Euler123", "Gauss", "sigma", "series_solver", "Ada Lovelace", "hello", ...rules.allow, ...rules.allow.map(name=>name+"123")];

test("public names reject common profanity, substitutions and separators", () => {
  for (const name of blockedNames) assert.equal(api.isPublicNameAllowed(name),false,name);
});
test("innocent words and common names are not rejected for embedded fragments", () => {
  for (const name of allowedNames) assert.equal(api.isPublicNameAllowed(name),true,name);
});
test("username syntax is still independent of nickname moderation", () => {
  for (const name of ["", "ab", "a".repeat(21), "UpperCase", "hello world", null, 123]) assert.ok(api.getUsernameValidationError(name));
  assert.equal(api.getUsernameValidationError("math_student"),null);
  assert.equal(api.getUsernameValidationError("f_u_c_k"),api.PUBLIC_NAME_ERROR);
});
