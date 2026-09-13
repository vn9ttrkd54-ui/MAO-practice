import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { pathToFileURL } from "node:url";

test("bounded timing storage preserves lifetime statistics and prior receipts", async (t) => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const uid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
  const migration = async (name) => db.exec(await readFile(new URL(`../../supabase/migrations/${name}.sql`, import.meta.url), "utf8"));
  const asRole = async (role, work) => {
    await db.query("select set_config('request.jwt.claim.role',$1,false)", [role]);
    await db.exec(`set role ${role}`);
    try { return await work(); } finally { await db.exec("reset role"); }
  };
  let nonce = 100;
  const start = (user) => asRole("service_role", () => scalar("select begin_practice_attempt($1,42,true,$2)", [uid(user), uid(nonce++)]));
  const finish = (user, id, milliseconds, result = "correct", answer = "C") => asRole("service_role", () => scalar(
    "select finish_practice_attempt_v2($1,$2,42,true,$3,$4,$5)", [uid(user), id, answer, result, milliseconds]));
  const row = async (user) => (await db.query("select * from question_progress where user_id=$1 and question_id=42", [uid(user)])).rows[0];
  const lifetime = (values) => ({ count: values.length, totalSeconds: values.reduce((sum, ms) => sum + Math.floor(ms / 1000), 0), bestSeconds: values.length ? values.reduce((best, ms) => Math.min(best, Math.floor(ms / 1000)), Infinity) : null });
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth;
      create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb not null default '{}');
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create function auth.role() returns text language sql stable as $$ select current_setting('request.jwt.claim.role',true) $$;
      grant usage on schema auth to anon,authenticated,service_role;`);
    for (const name of ["001_auth_user_data", "013_feedback_account_admin", "015_security_hardening", "018_owner_role", "019_security_defense_in_depth", "043_practice_attempt_guard"]) await migration(name);
    for (let n = 1; n <= 8; n++) await db.query("insert into auth.users(id,raw_user_meta_data) values($1,$2)", [uid(n), { username: `fixture_${n}` }]);
    const longHistory = [999, 1999, ...Array.from({ length: 1000 }, (_, n) => 3999 + n * 1000)];
    for (const [user, values, attempts, correct] of [[1, longHistory, 6005, 6000], [2, [], 8, 2], [3, [null, 1999, 3999], 1, 1], [5, [-1], 1, 1]]) {
      await db.query("insert into question_progress(user_id,question_id,attempts,correct,correct_times_ms,last_result,last_attempted_at,last_correct_at,updated_at) values($1,42,$2,$3,$4,'correct','2001-01-01','2001-01-01','2001-01-01')", [uid(user), attempts, correct, values]);
    }
    await db.query("insert into question_progress(user_id,question_id,attempts,correct,correct_times_ms) values($1,42,3,3,'[0:2]={1999,2999,4999}'::bigint[])", [uid(4)]);
    const oldAttempt = await start(6);
    const oldReceipt = await asRole("service_role", () => scalar("select finish_practice_attempt($1,$2,42,true,'C','correct',1999)", [uid(6), oldAttempt.attemptId]));
    const before = await row(1);

    await t.test("unexpected legacy data or trigger configuration stops migration without data loss", async () => {
      await assert.rejects(migration("044_bounded_practice_timing"), /Unexpected practice timing history/);
      await db.exec("rollback");
      assert.equal(await scalar("select to_regclass('public.practice_timing_legacy_archive')"), null);
      assert.deepEqual((await row(1)).correct_times_ms, longHistory);
      assert.equal(await scalar("select tgenabled from pg_trigger where tgname='question_progress_set_updated_at'"), "O");
      await db.query("update question_progress set correct_times_ms=array[[1000,2000],[3000,4000]] where user_id=$1", [uid(5)]);
      await assert.rejects(migration("044_bounded_practice_timing"), /Unexpected practice timing history/);
      await db.exec("rollback");
      await db.query("update question_progress set correct_times_ms=array[1000] where user_id=$1", [uid(5)]);
      await db.exec("alter table question_progress disable trigger question_progress_set_updated_at");
      await assert.rejects(migration("044_bounded_practice_timing"), /Unexpected practice timestamp trigger/);
      await db.exec("rollback");
      assert.equal(await scalar("select tgenabled from pg_trigger where tgname='question_progress_set_updated_at'"), "D");
      await db.exec("alter table question_progress enable trigger question_progress_set_updated_at");
    });
    await migration("044_bounded_practice_timing");

    await t.test("full lifetime metrics and timestamps survive; only recent samples remain on the hot row", async () => {
      const after = await row(1);
      assert.deepEqual(after.correct_times_ms, longHistory.slice(-100));
      assert.deepEqual({ count: Number(after.timing_count), totalSeconds: Number(after.timing_total_seconds), bestSeconds: after.timing_best_seconds }, lifetime(longHistory));
      for (const key of ["attempts", "correct", "last_result", "last_attempted_at", "last_correct_at", "created_at", "updated_at"]) assert.deepEqual(after[key], before[key]);
      assert.deepEqual(await scalar("select correct_times_ms from practice_timing_legacy_archive where user_id=$1", [uid(1)]), longHistory);
      assert.equal(await scalar("select count(*)::int from practice_timing_legacy_archive"), 5);
      assert.deepEqual(await scalar("select correct_times_ms from practice_timing_legacy_archive where user_id=$1", [uid(3)]), [null, 1999, 3999]);
    });
    await t.test("empty, null-containing and unusual array bounds preserve per-sample rounding", async () => {
      for (const [user, values] of [[2, []], [3, [null, 1999, 3999]], [4, [1999, 2999, 4999]]]) {
        const actual = await row(user);
        assert.deepEqual({ count: Number(actual.timing_count), totalSeconds: Number(actual.timing_total_seconds), bestSeconds: actual.timing_best_seconds }, lifetime(values));
        assert.deepEqual(actual.correct_times_ms, values);
      }
      assert.equal(await scalar("select array_lower(correct_times_ms,1) from question_progress where user_id=$1", [uid(4)]), 1);
      assert.equal((await row(2)).correct, 2); // Sample count must not be inferred from correct answers.
    });
    await t.test("a pre-migration receipt returns lifetime metrics without re-awarding its result", async () => {
      const retried = await finish(6, oldAttempt.attemptId, 1999, "incorrect");
      assert.equal(retried.isCorrect, true);
      assert.deepEqual(retried.levelChange, oldReceipt.levelChange);
      assert.deepEqual(retried.progress.timing, { count: 1, totalSeconds: 1, bestSeconds: 1 });
      assert.equal((await row(6)).attempts, 1);
    });
    await t.test("many distinct correct attempts grow aggregates, not arrays or archived data", async () => {
      const all = [...longHistory];
      let last;
      for (let n = 0; n < 125; n++) {
        if (n % 25 === 0) await db.query("update practice_attempt_state set recent_starts='{}',recent_finishes='{}' where user_id=$1", [uid(1)]);
        const attempt = await start(1);
        const ms = 9999 + n * 1000;
        all.push(ms);
        const saved = await finish(1, attempt.attemptId, ms);
        assert.equal(saved.status, "saved");
        assert.deepEqual(saved.progress.timing, lifetime(all));
        assert.deepEqual(saved.progress.times, all.slice(-100));
        last = { attempt, ms, saved };
      }
      assert.deepEqual(await finish(1, last.attempt.attemptId, last.ms), last.saved);
      assert.equal((await row(1)).attempts, 6130);
      assert.equal((await row(1)).correct_times_ms.length, 100);
      assert.deepEqual(await scalar("select correct_times_ms from practice_timing_legacy_archive where user_id=$1", [uid(1)]), longHistory);
      assert.equal(await scalar("select count(*)::int from practice_attempts where response_snapshot->'progress' ? 'times'"), 0);
    });
    await t.test("incorrect/give-up and rolled-back saves do not change timing metrics", async () => {
      const before = await row(2);
      for (const [answer, result] of [["A", "incorrect"], [null, "give-up"]]) {
        const attempt = await start(2);
        assert.equal((await finish(2, attempt.attemptId, 999, result, answer)).status, "saved");
      }
      const attempt = await start(2);
      await db.exec("begin");
      await finish(2, attempt.attemptId, 2999);
      await db.exec("rollback");
      const after = await row(2);
      for (const key of ["timing_count", "timing_total_seconds", "timing_best_seconds", "correct_times_ms"]) assert.deepEqual(after[key], before[key]);
      assert.equal((await finish(2, attempt.attemptId, 2999)).progress.timing.totalSeconds, 2);
    });
    await t.test("archive and legacy scoring stay inaccessible; normal owner-only progress reads remain", async () => {
      for (const role of ["anon", "authenticated", "service_role"]) await asRole(role, async () => {
        for (const query of ["select * from practice_timing_legacy_archive", "delete from practice_timing_legacy_archive", "update practice_timing_legacy_archive set question_id=0", "insert into practice_timing_legacy_archive(user_id,question_id,correct_times_ms) values(null,0,'{}')"]) await assert.rejects(db.query(query), /permission denied/);
        await assert.rejects(db.query("select finish_practice_attempt($1,$2,42,true,'C','correct',1999)", [uid(6), oldAttempt.attemptId]), /permission denied/);
        if (role !== "service_role") await assert.rejects(db.query("select finish_practice_attempt_v2($1,$2,42,true,'C','correct',1999)", [uid(6), oldAttempt.attemptId]), /permission denied/);
      });
      const attempts = (await row(6)).attempts;
      assert.equal((await scalar("select finish_practice_attempt($1,$2,42,true,'C','correct',1999)", [uid(6), oldAttempt.attemptId])).status, "invalid");
      assert.equal((await row(6)).attempts, attempts);
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [uid(1)]);
      await asRole("authenticated", async () => {
        const rows = (await db.query("select user_id,timing_count from question_progress")).rows;
        assert.equal(rows.length, 1);
        assert.equal(rows[0].user_id, uid(1));
        await assert.rejects(db.query("update question_progress set timing_total_seconds=0"), /permission denied/);
      });
    });
    await t.test("database constraints prevent oversized hot rows and unsafe aggregate values", async () => {
      await assert.rejects(db.query("update question_progress set correct_times_ms=array_fill(1000::bigint,array[101]) where user_id=$1", [uid(1)]), /practice_recent_times_bounded/);
      await assert.rejects(db.query("update question_progress set timing_total_seconds=9007199254740992 where user_id=$1", [uid(1)]), /practice_timing_aggregate_valid/);
      await db.query("delete from auth.users where id=$1", [uid(1)]);
      assert.equal(await scalar("select count(*)::int from practice_timing_legacy_archive where user_id=$1", [uid(1)]), 0);
    });
  } finally { await db.close(); }
});
