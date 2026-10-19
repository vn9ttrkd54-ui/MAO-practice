import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../lib/services/challengeService.ts", import.meta.url), "utf8");
test("unscheduled daily divisions return an empty overview without reading a null question", async () => {
  const requestedDivisions = [];
  const db = {
    auth: { getUser: async () => ({ data: { user: null } }) },
    from(table) {
      assert.equal(table, "daily_challenges");
      const query = {
        select() { return query; },
        eq(column, value) { if (column === "division") requestedDivisions.push(value); return query; },
        maybeSingle: async () => ({ data: null, error: null }),
      };
      return query;
    },
    rpc: async () => ({ data: [], error: null }),
  };
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports,
    require(name) {
      if (name === "server-only") return {};
      if (name === "@/lib/supabase/server") return { createClient: async () => db };
      if (name === "@/lib/supabase/admin") return { createAdminClient: () => { throw Error("Unexpected write client"); } };
      if (name === "@/lib/challengeQuestionCatalog") return { requireDailyQuestionById: () => { throw Error("Unscheduled question lookup"); } };
      return require(name);
    },
  });
  for (const division of [undefined, "Mu", "Alpha", "Theta"]) {
    const result = await exports.getChallengeOverview(division);
    assert.equal(result.dailyChallenge, null);
    assert.equal(result.attempt, null);
  }
  assert.deepEqual(requestedDivisions, ["Mu", "Mu", "Alpha", "Theta"]);
});
