import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";

test("problem submissions preserve private feedback, division constraints, server-only writes, and quota", async () => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH to an existing local PGlite module");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  const migration = async name => db.exec(await readFile(new URL(`../supabase/migrations/${name}.sql`, import.meta.url), "utf8"));
  const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
  const asRole = async (role, user, work) => {
    assert.ok(["anon", "authenticated", "service_role"].includes(role));
    await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)", [user ?? "", role]);
    await db.exec(`set role ${role}`);
    try { return await work(); } finally { await db.exec("reset role"); }
  };
  const insert = (user, division, questionId = null) => db.query(
    "insert into public.feedback_requests(user_id,kind,division,question_id,message) values($1,'question_submission',$2,$3,'Problem, answer, full solution, and source credit.') returning division",
    [user, division, questionId],
  );
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth;
      create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb not null default '{}');
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create function auth.role() returns text language sql stable as
        $$ select current_setting('request.jwt.claim.role',true) $$;
      grant usage on schema auth to anon,authenticated,service_role;`);
    for (const name of ["001_auth_user_data", "013_feedback_account_admin", "018_owner_role", "019_security_defense_in_depth", "042_feedback_submission_guard"]) await migration(name);
    for (let n = 1; n <= 3; n++) await db.query("insert into auth.users(id,raw_user_meta_data) values($1,$2)", [uid(n), { username: `fixture_${n}` }]);
    await db.query("select set_config('request.jwt.claim.role','service_role',false)");
    await db.query("update public.profiles set role='admin' where id=$1", [uid(3)]);
    await asRole("service_role", null, () => db.query(`insert into public.feedback_requests(user_id,kind,question_id,division,message) values
      ($1,'general_suggestion',null,null,'An existing general suggestion.'),
      ($1,'question_report',42,'Mu','An existing question report.')`, [uid(1)]));
    const before = (await db.query("select * from public.feedback_requests order by id")).rows;
    await migration("20261021172255_daily_challenge_question_submissions");
    assert.deepEqual((await db.query("select * from public.feedback_requests order by id")).rows, before);

    await asRole("service_role", null, async () => {
      for (const division of ["Mu", "Alpha", "Theta"]) assert.equal((await insert(uid(1), division)).rows[0].division, division);
      for (const division of [null, "", "mu", "Delta"]) await assert.rejects(insert(uid(1), division), error => error.code === "23514");
      await assert.rejects(insert(uid(1), "Mu", 42), error => error.code === "23514");
      for (let i = 0; i < 10; i++) await insert(uid(2), "Alpha");
      await assert.rejects(insert(uid(2), "Alpha"), error => error.code === "P0001" && error.message === "feedback_rate_limited");
    });
    for (const [role, user] of [["anon", null], ["authenticated", uid(1)], ["authenticated", uid(3)]]) {
      await asRole(role, user, () => assert.rejects(insert(user ?? uid(1), "Mu"), /permission denied/));
    }
    await asRole("authenticated", uid(1), async () => {
      const rows = (await db.query("select user_id,kind,division from public.feedback_requests")).rows;
      assert.equal(rows.length, 5);
      assert.ok(rows.every(row => row.user_id === uid(1)));
    });
    await asRole("authenticated", uid(3), async () => assert.equal(await scalar("select count(*)::int from public.feedback_requests"), 15));
    assert.equal(await scalar("select relrowsecurity from pg_class where oid='public.feedback_requests'::regclass"), true);
  } finally { await db.close(); }
});
