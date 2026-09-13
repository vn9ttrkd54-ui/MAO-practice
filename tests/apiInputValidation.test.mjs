import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInThisContext } from "node:vm";
import ts from "typescript";
import * as crypto from "node:crypto";

// Run actual route code and the actual JSON/origin helper. Every external
// dependency is explicit and local; this harness never loads provider clients.
const compiledModules = new Map();
async function loadModule(path, dependencies) {
  if (!compiledModules.has(path)) {
    const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    });
    compiledModules.set(path, runInThisContext(`(function(exports, require) { ${outputText}\n })`, { filename: path }));
  }
  const exports = {};
  compiledModules.get(path)(exports, (name) => {
    assert.ok(Object.hasOwn(dependencies, name), `Unexpected dependency ${name} in ${path}`);
    return dependencies[name];
  });
  return exports;
}

const security = await loadModule("lib/security/request.ts", { "server-only": {} });
const roles = await loadModule("lib/auth/roles.ts", {});
const passwordPolicy = await loadModule("lib/auth/passwordPolicy.ts", {});
const timing = await loadModule("lib/practiceTiming.ts", {});
const USER_ID = "00000000-0000-4000-8000-000000000001";
const TARGET_ID = "00000000-0000-4000-8000-000000000002";
const FEEDBACK_ID = "00000000-0000-4000-8000-000000000003";
const QUESTION = { id: 42, answer: "C", division: "Mu" };
const routes = {
  login: ["app/api/auth/login/route.ts", "POST"],
  reset: ["app/api/auth/reset-password/route.ts", "POST"],
  account: ["app/api/account/route.ts", "PATCH"],
  deletion: ["app/api/account/route.ts", "DELETE"],
  recovery: ["app/api/admin/account-recovery/route.ts", "POST"],
  feedback: ["app/api/feedback/route.ts", "POST"],
  resolution: ["app/api/admin/feedback/route.ts", "PATCH"],
  practice: ["app/api/practice/result/route.ts", "POST"],
  attempt: ["app/api/practice/attempt/route.ts", "POST"],
};

async function invoke(routeName, body, options = {}) {
  const effects = [];
  const user = options.signedIn === false ? null : { id: USER_ID, email: "fixture@example.test", user_metadata: options.metadata ?? {} };
  const record = (kind, value) => effects.push({ kind, value });
  const client = {
    auth: {
      getUser: async () => ({ data: { user } }),
      signInWithPassword: async (value) => {
        record("signInWithPassword", value);
        return { error: options.passwordError ? { message: "fixture credential failure" } : null };
      },
      updateUser: async (value) => {
        record("updateUser", value);
        if (options.updateUserThrows) throw new Error("private fixture provider failure");
        return { data: { user: { ...user, ...value } }, error: options.updateUserError ?? null };
      },
      signOut: async () => { record("signOut"); return { error: null }; },
    },
  };
  const admin = {
    from(table) {
      let selection;
      let operation = "select";
      const filters = [];
      const query = {
        select(columns) {
          selection = columns;
          if (table === "feedback_requests") record("feedbackCountQuery");
          return query;
        },
        eq(column, value) { filters.push(["eq", column, value]); return query; },
        neq(column, value) { filters.push(["neq", column, value]); return query; },
        gte(column, value) { filters.push(["gte", column, value]); return query; },
        async maybeSingle() {
          if (selection === "role") {
            assert.deepEqual(filters, [["eq", "id", USER_ID]], "Role lookup must use the authenticated identity");
            return { data: options.profileError ? null : { role: Object.hasOwn(options, "role") ? options.role : "owner" }, error: options.profileError ? { message: "fixture lookup failure" } : null };
          }
          return { data: filters.some(([operator]) => operator === "neq") ? null : { id: TARGET_ID }, error: null };
        },
        update(value) { record("databaseUpdate", { table, value, filters }); return query; },
        insert(value) { operation = "insert"; record("databaseInsert", { table, value }); return query; },
        then(resolve, reject) {
          return Promise.resolve({
            count: options.feedbackCount ?? 0,
            error: table === "feedback_requests"
              ? (operation === "insert" ? options.feedbackInsertError : options.feedbackCountError) ?? null
              : null,
          }).then(resolve, reject);
        },
      };
      return query;
    },
    async rpc(name, value) {
      record("rpc", { name, value });
      if (name === "consume_recovery_token") return { data: options.recoveryConsumed !== true, error: options.recoveryLedgerError ? { message: "fixture failure" } : null };
      if (name === "begin_practice_attempt" || name === "finish_practice_attempt_v2") {
        if (Object.hasOwn(options, "practicePayload")) return { data: options.practicePayload, error: null };
        if (options.practiceRpcError) return { data: null, error: options.practiceRpcError };
        if (options.practiceStatus) return { data: { status: options.practiceStatus }, error: null };
        if (options.practiceNull) return { data: null, error: null };
        if (name === "begin_practice_attempt") return { data: { status: "started", attemptId: TARGET_ID }, error: null };
        return { data: { status: "saved", isCorrect: value.result_value === "correct", progress: { attempts: 1, correct: 1, times: [value.elapsed_ms], timing: { count: 1, totalSeconds: Math.floor(value.elapsed_ms / 1000), bestSeconds: Math.floor(value.elapsed_ms / 1000) }, lastResult: value.result_value }, levelChange: null }, error: null };
      }
      return { data: true, error: null };
    },
    auth: {
      admin: {
        async getUserById(id) { record("getUserById", id); return { data: { user: { email: "target@example.test" } }, error: null }; },
        async generateLink(value) { record("generateLink", value); return { data: { properties: { hashed_token: "test-only-recovery-token" } }, error: null }; },
        async updateUserById(id, value) { record("updateUserById", { id, value }); return { error: null }; },
        async deleteUser(id) { record("deleteUser", id); return { error: null }; },
      },
    },
  };
  const [path, method] = routes[routeName];
  const handlers = await loadModule(path, {
    "node:crypto": crypto,
    "next/server": { NextResponse: { json: (value, init) => Response.json(value, init) } },
    "next/headers": { cookies: async () => ({ get: () => ({ value: "test-only-cookie" }), delete: () => record("deleteCookie") }) },
    "@/lib/security/request": security,
    "@/lib/practiceTiming": timing,
    "@/lib/supabase/server": { createClient: async () => client },
    "@/lib/supabase/admin": { createAdminClient: () => admin },
    "@/lib/auth/roles": roles,
    "@/lib/auth/passwordPolicy": passwordPolicy,
    "@/lib/auth/recoveryToken": { verifyRecoveryToken: () => options.recoveryVerified !== false },
    "@/lib/tutorRevealToken": { createTutorRevealToken: () => "test-only-reveal-token" },
    "@/data/questions": { questions: [QUESTION] },
  });
  const request = new Request("https://example.test/api/fixture", {
    method,
    headers: { "Content-Type": "application/json", Origin: options.origin ?? "https://example.test" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  const response = await handlers[method](request);
  return { status: response.status, body: await response.json(), effects };
}

async function rejectsInputs(route, inputs, expectedError) {
  for (const body of inputs) {
    const result = await invoke(route, body);
    assert.equal(result.status, 400, `${route} accepted malformed input ${JSON.stringify(body)}`);
    assert.deepEqual(result.effects, [], `${route} called a provider or privileged write before rejecting ${JSON.stringify(body)}`);
    if (expectedError) assert.equal(result.body.error, expectedError);
  }
}

const nonStrings = [undefined, null, false, 17, [], ["text"], {}, { length: 12 }];
const loginBody = { username: "math_student", password: "correct password" };
const recoveryBody = { username: "math_student", currentPassword: "owner password", identityVerified: true };
const practiceBody = { attemptId: TARGET_ID, questionId: QUESTION.id, selectedAnswer: "C", elapsedSeconds: 10, trainer: true };
const attemptBody = { questionId: QUESTION.id, trainer: true, requestId: FEEDBACK_ID };
const feedbackBody = { kind: "question_report", questionId: QUESTION.id, division: "Mu", message: "This is useful feedback." };

test("login rejects malformed credentials before throttling or authentication and retains generic errors", async () => {
  await rejectsInputs("login", [
    ...nonStrings.map((username) => ({ ...loginBody, username })),
    ...nonStrings.map((password) => ({ ...loginBody, password })),
    { ...loginBody, username: "invalid!" }, { ...loginBody, password: "" },
  ], "Incorrect username or password.");
});

test("reset-password rejects non-string and short passwords before changing credentials", async () => {
  await rejectsInputs("reset", [...nonStrings, "", "short"].map((password) => ({ password })));
});

test("account rejects unknown actions and malformed names or emails before any writes", async () => {
  await rejectsInputs("account", [
    ...[...nonStrings, "admin", "delete", ""].map((action) => ({ action })),
    ...nonStrings.map((username) => ({ action: "username", username })),
    { action: "username", username: "invalid!" },
    ...nonStrings.map((email) => ({ action: "email", email, currentPassword: "password" })),
    { action: "email", email: "invalid", currentPassword: "password" },
    { action: "email", email: "test@users.mao-practice.local", currentPassword: "password" },
  ]);
});

test("account password/email changes reject malformed current or replacement passwords before reauthentication", async () => {
  await rejectsInputs("account", [
    ...nonStrings.map((password) => ({ action: "password", password, currentPassword: "password" })),
    { action: "password", password: "short", currentPassword: "password" },
    ...[...nonStrings, ""].flatMap((currentPassword) => [
      { action: "password", password: "new password", currentPassword },
      { action: "email", email: "new@example.test", currentPassword },
    ]),
  ]);
});

test("account deletion rejects malformed confirmations and passwords before reauthentication or deletion", async () => {
  await rejectsInputs("deletion", [
    ...[...nonStrings, "delete", ""].map((confirmation) => ({ confirmation, currentPassword: "password" })),
    ...[...nonStrings, ""].map((currentPassword) => ({ confirmation: "DELETE", currentPassword })),
  ]);
});

test("owner recovery rejects malformed credentials and requires the literal boolean true", async () => {
  await rejectsInputs("recovery", [
    ...nonStrings.map((username) => ({ ...recoveryBody, username })),
    ...[...nonStrings, ""].map((currentPassword) => ({ ...recoveryBody, currentPassword })),
    ...[undefined, null, false, 1, "true", [], {}].map((identityVerified) => ({ ...recoveryBody, identityVerified })),
  ]);
});

test("feedback rejects malformed messages, kinds, question IDs and division enums before its count query or insert", async () => {
  await rejectsInputs("feedback", [
    ...[...nonStrings, "short", "a".repeat(2001)].map((message) => ({ ...feedbackBody, message })),
    ...[...nonStrings, "other"].map((kind) => ({ ...feedbackBody, kind })),
    ...[undefined, null, "42", false, {}, [], -1, 0, 42.5, Number.MAX_SAFE_INTEGER + 1].map((questionId) => ({ ...feedbackBody, questionId })),
    ...[undefined, null, "mu", "other", {}, [], 3].map((division) => ({ ...feedbackBody, division })),
    { ...feedbackBody, division: "Alpha" },
    { kind: "general_suggestion", message: feedbackBody.message, questionId: {} },
    { kind: "general_suggestion", message: feedbackBody.message, division: [] },
  ]);
});

test("admin feedback rejects malformed and non-UUID IDs before attempting resolution", async () => {
  await rejectsInputs("resolution", [...nonStrings, "", "not-a-uuid", `${FEEDBACK_ID}extra`].map((id) => ({ id })));
});

test("practice rejects malformed IDs, answer enums, trainer flags and elapsed values before authentication or scoring", async () => {
  await rejectsInputs("practice", [
    ...[...nonStrings, "", "not-a-uuid", `${TARGET_ID}extra`].map((attemptId) => ({ ...practiceBody, attemptId })),
    ...[undefined, null, "42", false, {}, [], 42.5, Number.MAX_SAFE_INTEGER + 1].map((questionId) => ({ ...practiceBody, questionId })),
    ...[false, 3, {}, [], "F", "c", ""].map((selectedAnswer) => ({ ...practiceBody, selectedAnswer })),
    ...[undefined, null, 1, 0, "true", "false", {}, []].map((trainer) => ({ ...practiceBody, trainer })),
    ...[null, "10", true, {}, [], Number.MAX_SAFE_INTEGER + 1, -Number.MAX_SAFE_INTEGER - 1].map((elapsedSeconds) => ({ ...practiceBody, elapsedSeconds })),
    '{"questionId":42,"trainer":true,"elapsedSeconds":1e999}',
    '{"questionId":42,"trainer":true,"elapsedSeconds":-1e999}',
    '{"questionId":42,"trainer":true,"elapsedSeconds":NaN}',
  ]);
});

test("practice creation rejects malformed request IDs, question IDs and modes before privileged calls", async () => {
  await rejectsInputs("attempt", [
    ...[...nonStrings, "", "not-a-uuid", `${FEEDBACK_ID}extra`].map((requestId) => ({ ...attemptBody, requestId })),
    ...[undefined, null, "42", false, {}, [], 42.5, 999].map((questionId) => ({ ...attemptBody, questionId })),
    ...[undefined, null, 1, "true", {}, []].map((trainer) => ({ ...attemptBody, trainer })),
  ]);
});

test("practice creation and completion use the authenticated owner and only the guarded RPCs", async () => {
  const started = await invoke("attempt", { ...attemptBody, userId: TARGET_ID });
  assert.equal(started.status, 200);
  assert.deepEqual(started.body, { attemptId: TARGET_ID });
  assert.deepEqual(started.effects, [{ kind: "rpc", value: {
    name: "begin_practice_attempt",
    value: { target_user_id: USER_ID, target_question_id: QUESTION.id, award_trainer_level: true, client_request_id: FEEDBACK_ID },
  } }]);
  const finished = await invoke("practice", { ...practiceBody, userId: FEEDBACK_ID, isCorrect: false });
  assert.equal(finished.status, 200);
  assert.equal(finished.body.isCorrect, true);
  const saved = finished.effects.find(({ kind }) => kind === "rpc").value;
  assert.equal(saved.name, "finish_practice_attempt_v2");
  assert.equal(saved.value.target_user_id, USER_ID);
  assert.equal(saved.value.target_attempt_id, TARGET_ID);
  assert.equal(saved.value.selected_answer, "C");
  assert.equal(saved.value.result_value, "correct");
});

test("practice guards map denied attempts safely and never issue a tutor reveal token", async () => {
  for (const [route, body] of [["attempt", attemptBody], ["practice", practiceBody]]) {
    for (const [practiceStatus, status] of [["rate_limited", 429], ["conflict", 409], ["expired", 410], ["invalid", 400], ["unexpected", 500]]) {
      const response = await invoke(route, body, { practiceStatus });
      assert.equal(response.status, status);
      assert.equal(response.body.tutorRevealToken, undefined);
      assert.equal(response.body.progress, undefined);
    }
    for (const options of [{ practiceNull: true }, { practiceRpcError: { message: "private SQL detail" } }]) {
      const response = await invoke(route, body, options);
      assert.equal(response.status, 500);
      assert.ok(!JSON.stringify(response.body).includes("private SQL detail"));
    }
  }
});

test("practice results require bounded history and lifetime aggregates without replacing them with recent averages", async () => {
  const payload = { status: "saved", isCorrect: true, levelChange: null, progress: {
    attempts: 600, correct: 500, times: [1999, null], timing: { count: 500, totalSeconds: 750, bestSeconds: 0 }, lastResult: "correct", lastCorrectAt: null,
  } };
  const result = await invoke("practice", practiceBody, { practicePayload: payload });
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.progress.times, [1, 0]);
  assert.deepEqual(result.body.progress.timing, payload.progress.timing);
  for (const change of [{ timing: undefined }, { timing: null }, { timing: {} }, { timing: { count: 0, totalSeconds: 0, bestSeconds: null } }, { times: Array(101).fill(1000) }]) {
    const failed = await invoke("practice", practiceBody, { practicePayload: { ...payload, progress: { ...payload.progress, ...change } } });
    assert.equal(failed.status, 500);
    assert.equal(failed.body.tutorRevealToken, undefined);
    assert.equal(failed.body.progress, undefined);
  }
});

test("every affected route rejects invalid JSON and non-object bodies without provider mutations", async () => {
  for (const route of Object.keys(routes)) {
    await rejectsInputs(route, ["{", "null", "[]", "true", '"text"']);
  }
});

test("valid login still normalizes the username and passes the full password unchanged", async () => {
  const password = ` ${"p".repeat(600)} `;
  const result = await invoke("login", { username: " Math_Student ", password });
  assert.equal(result.status, 200);
  assert.equal(result.effects.find(({ kind }) => kind === "signInWithPassword").value.password, password);
  assert.deepEqual(result.effects.filter(({ kind }) => kind === "rpc").map(({ value }) => value.name), ["consume_login_attempt", "clear_login_attempts"]);
  const failed = await invoke("login", loginBody, { passwordError: true });
  assert.equal(failed.status, 401);
  assert.equal(failed.body.error, "Incorrect username or password.");
});

test("valid account actions retain normalization, self ownership and untruncated passwords", async () => {
  const password = "p".repeat(600);
  const changed = await invoke("account", { action: "password", password, currentPassword: "current" });
  assert.equal(changed.status, 200);
  assert.deepEqual(changed.effects.map(({ kind }) => kind), ["signInWithPassword", "updateUser"]);
  assert.equal(changed.effects[1].value.password, password);
  assert.equal(changed.effects[1].value.current_password, "current");
  const renamed = await invoke("account", { action: "username", username: " Math_Student " });
  assert.equal(renamed.status, 200);
  const write = renamed.effects.find(({ kind }) => kind === "databaseUpdate").value;
  assert.equal(write.value.username, "math_student");
  assert.deepEqual(write.filters, [["eq", "id", USER_ID]]);
  const email = await invoke("account", { action: "email", email: " New@Example.Test ", currentPassword: "current" });
  assert.equal(email.status, 200);
  assert.equal(email.effects.find(({ kind }) => kind === "updateUser").value.email, "new@example.test");
  const deleted = await invoke("deletion", { confirmation: "DELETE", currentPassword: "current" });
  assert.equal(deleted.status, 200);
  assert.deepEqual(deleted.effects.find(({ kind }) => kind === "deleteUser").value, USER_ID);
});

test("reset consumes authorization before changing password and denies replay or ledger failure", async () => {
  for (const options of [{ recoveryConsumed: true }, { recoveryLedgerError: true }]) {
    const denied = await invoke("reset", { password: "replacement-password" }, options);
    assert.equal(denied.status, 403);
    assert.deepEqual(denied.effects.map(effect => effect.kind), ["rpc", "deleteCookie"]);
  }
  const result = await invoke("reset", { password: "replacement-password" });
  assert.equal(result.status, 200);
  assert.deepEqual(result.effects.slice(0, 3).map(effect => effect.kind), ["rpc", "deleteCookie", "updateUser"]);
  assert.equal(result.effects[0].value.value.p_user_id, USER_ID);
  assert.match(result.effects[0].value.value.p_token_hash, /^[0-9a-f]{64}$/);
});

test("new-password minimum is consistent while existing short passwords still authenticate", async () => {
  for (const password of ["1234567", "😀".repeat(7), "😀".repeat(4)]) {
    for (const [route, body] of [["account", { action: "password", currentPassword: "old123", password }], ["reset", { password }]]) {
      const denied = await invoke(route, body);
      assert.equal(denied.status, 400);
      assert.deepEqual(denied.effects, []);
      assert.equal(denied.body.error, passwordPolicy.PASSWORD_REQUIREMENT_MESSAGE);
    }
  }
  for (const password of ["12345678", "😀".repeat(8), " passphrase ".repeat(3)]) {
    const currentPassword = " old ";
    const result = await invoke("account", { action: "password", password, currentPassword, current_password: "forged" });
    assert.equal(result.status, 200);
    assert.deepEqual(result.effects.find(effect => effect.kind === "updateUser").value, { password, current_password: currentPassword });
    assert.equal(result.effects.find(effect => effect.kind === "signInWithPassword").value.password, currentPassword);
    const reset = await invoke("reset", { password });
    assert.equal(reset.status, 200);
    assert.deepEqual(reset.effects.find(effect => effect.kind === "updateUser").value, { password });
  }
  const login = await invoke("login", { ...loginBody, password: "old123" });
  assert.equal(login.status, 200);
  assert.equal(login.effects.find(effect => effect.kind === "signInWithPassword").value.password, "old123");
});

test("provider password-policy rejections remain useful without exposing internals", async () => {
  for (const route of ["account", "reset"]) {
    const body = { action: "password", currentPassword: "current", password: "new passphrase here" };
    const rejected = await invoke(route, body, { updateUserError: { code: "weak_password", message: "private provider details" } });
    assert.equal(rejected.status, 400);
    assert.match(rejected.body.error, /security policy/);
    assert.doesNotMatch(rejected.body.error, /private provider/);
    const unknown = await invoke(route, body, { updateUserError: { code: "unexpected", message: "private provider details" } });
    assert.equal(unknown.status, 400);
    assert.doesNotMatch(unknown.body.error, /private provider/);
  }
  const uncertain = await invoke("reset", { password: "new passphrase here" }, { updateUserThrows: true });
  assert.equal(uncertain.status, 503);
  assert.deepEqual(uncertain.effects.map(effect => effect.kind), ["rpc", "deleteCookie", "updateUser"]);
  assert.doesNotMatch(uncertain.body.error, /private fixture/);
  // Recovery must not demand the forgotten password or accept one from the body.
  const recovered = await invoke("reset", { password: "new passphrase here", current_password: "forged" });
  assert.equal(recovered.status, 200);
  assert.deepEqual(recovered.effects.find(effect => effect.kind === "updateUser").value, { password: "new passphrase here" });
});

test("valid recovery flows keep password reauthentication and signed recovery checks", async () => {
  const generated = await invoke("recovery", recoveryBody);
  assert.equal(generated.status, 200);
  assert.deepEqual(generated.effects.map(({ kind }) => kind), ["signInWithPassword", "getUserById", "generateLink"]);
  const password = "p".repeat(600);
  const reset = await invoke("reset", { password });
  assert.equal(reset.status, 200);
  assert.equal(reset.effects.find(effect => effect.kind === "updateUser").value.password, password);
  const invalidRecovery = await invoke("reset", { password }, { recoveryVerified: false });
  assert.equal(invalidRecovery.status, 403);
  assert.deepEqual(invalidRecovery.effects.map(({ kind }) => kind), ["deleteCookie"]);
});

test("valid feedback types retain trimming and administrator resolution by UUID", async () => {
  for (const body of [feedbackBody, { kind: "general_suggestion", message: "  A useful suggestion.  " }]) {
    const result = await invoke("feedback", body);
    assert.equal(result.status, 200);
    const insert = result.effects.find(({ kind }) => kind === "databaseInsert").value.value;
    assert.equal(insert.user_id, USER_ID);
    assert.equal(insert.message, body.message.trim());
    assert.equal(insert.question_id, body.kind === "question_report" ? QUESTION.id : null);
  }
  const resolved = await invoke("resolution", { id: FEEDBACK_ID });
  assert.equal(resolved.status, 200);
  const write = resolved.effects.find(({ kind }) => kind === "databaseUpdate").value;
  assert.equal(write.value.resolved_by, USER_ID);
  assert.deepEqual(write.filters, [["eq", "id", FEEDBACK_ID], ["eq", "status", "open"]]);
});

test("feedback returns 429 for both the early quota check and the atomic database guard", async () => {
  const limited = await invoke("feedback", feedbackBody, { feedbackCount: 10 });
  assert.equal(limited.status, 429);
  assert.equal(limited.effects.filter(({ kind }) => kind === "databaseInsert").length, 0);
  const raced = await invoke("feedback", feedbackBody, {
    feedbackCount: 9,
    feedbackInsertError: { code: "P0001", message: "feedback_rate_limited" },
  });
  assert.equal(raced.status, 429);
  assert.deepEqual(raced.body, limited.body);
});

test("feedback count and unrelated database errors remain generic and do not leak internals", async () => {
  for (const options of [
    { feedbackCountError: { message: "private database detail" } },
    { feedbackInsertError: { code: "P0001", message: "private database detail" } },
    { feedbackInsertError: { code: "23514", message: "feedback_rate_limited" } },
  ]) {
    const failed = await invoke("feedback", feedbackBody, options);
    assert.equal(failed.status, 500);
    assert.deepEqual(failed.body, { error: "Unable to submit feedback right now." });
    if (options.feedbackCountError) assert.equal(failed.effects.filter(({ kind }) => kind === "databaseInsert").length, 0);
  }
});

test("valid practice retains fractional-second rounding, elapsed clamps and optional give-up answers", async () => {
  for (const [elapsedSeconds, expectedMilliseconds] of [[undefined, 0], [-3, 0], [10.9, 10_000], [86_400, 86_400_000], [90_000, 86_400_000]]) {
    const result = await invoke("practice", { ...practiceBody, elapsedSeconds });
    assert.equal(result.status, 200);
    const saved = result.effects.find(({ kind }) => kind === "rpc").value.value;
    assert.equal(saved.elapsed_ms, expectedMilliseconds);
    assert.equal(saved.target_user_id, USER_ID);
    assert.equal(saved.result_value, "correct");
  }
  for (const selectedAnswer of [undefined, null]) {
    const result = await invoke("practice", { ...practiceBody, selectedAnswer, trainer: false });
    assert.equal(result.status, 200);
    const saved = result.effects.find(({ kind }) => kind === "rpc").value.value;
    assert.equal(saved.result_value, "give-up");
    assert.equal(saved.award_trainer_level, false);
  }
});

test("admin endpoints ignore claimed roles and fail closed on missing or failed profile lookup", async () => {
  for (const [route, body, allowed] of [["recovery", recoveryBody, ["owner"]], ["resolution", { id: FEEDBACK_ID }, ["admin", "owner"]]]) {
    for (const role of [null, "", "user", "admin", "owner", "OWNER", "service_role"]) {
      const result = await invoke(route, { ...body, role: "owner", userId: TARGET_ID }, { role, metadata: { role: "owner", is_admin: true } });
      assert.equal(result.status, allowed.includes(role) ? 200 : 403, `${route}: ${role}`);
      if (!allowed.includes(role)) assert.deepEqual(result.effects, []);
    }
    const failed = await invoke(route, body, { profileError: true });
    assert.equal(failed.status, 403);
    assert.deepEqual(failed.effects, []);
  }
});

test("sensitive account operations stop after failed password verification", async () => {
  for (const [route, body] of [
    ["account", { action: "email", email: "new@example.test", currentPassword: "wrong" }],
    ["account", { action: "password", password: "replacement-password", currentPassword: "wrong" }],
    ["deletion", { confirmation: "DELETE", currentPassword: "wrong" }],
    ["recovery", recoveryBody],
  ]) {
    const result = await invoke(route, body, { passwordError: true });
    assert.equal(result.status, 401);
    assert.deepEqual(result.effects.map(effect => effect.kind), ["signInWithPassword"]);
    assert.equal(result.effects[0].value.email, "fixture@example.test");
  }
});

test("forged target identity cannot redirect account deletion or feedback resolution attribution", async () => {
  const deleted = await invoke("deletion", { confirmation: "DELETE", currentPassword: "current", userId: TARGET_ID, id: TARGET_ID });
  assert.equal(deleted.status, 200);
  assert.equal(deleted.effects.find(effect => effect.kind === "deleteUser").value, USER_ID);
  const resolved = await invoke("resolution", { id: FEEDBACK_ID, resolved_by: TARGET_ID, userId: TARGET_ID }, { role: "admin" });
  assert.equal(resolved.status, 200);
  const update = resolved.effects.find(effect => effect.kind === "databaseUpdate").value;
  assert.equal(update.value.resolved_by, USER_ID);
  assert.deepEqual(update.filters, [["eq", "id", FEEDBACK_ID], ["eq", "status", "open"]]);
});

test("existing authentication, administrator/owner and cross-origin guards still reject access", async () => {
  for (const [route, body] of [["account", { action: "username", username: "valid_name" }], ["deletion", { confirmation: "DELETE", currentPassword: "current" }], ["feedback", feedbackBody], ["practice", practiceBody], ["attempt", attemptBody], ["recovery", recoveryBody]]) {
    const result = await invoke(route, body, { signedIn: false });
    assert.equal(result.status, 401);
    assert.deepEqual(result.effects, []);
  }
  for (const [route, body, role] of [["recovery", recoveryBody, "admin"], ["resolution", { id: FEEDBACK_ID }, "user"]]) {
    const result = await invoke(route, body, { role });
    assert.equal(result.status, 403);
    assert.deepEqual(result.effects, []);
  }
  for (const route of Object.keys(routes)) {
    const result = await invoke(route, {}, { origin: "https://other.test" });
    assert.equal(result.status, 403);
    assert.deepEqual(result.effects, []);
  }
});
