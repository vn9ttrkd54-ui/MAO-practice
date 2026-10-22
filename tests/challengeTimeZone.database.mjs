// Real migrations in isolated PostgreSQL; the clock override exists only in this in-memory database.
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { after, before, test } from "node:test";
import { pathToFileURL } from "node:url";
import { getChallengeDate } from "../lib/challengeDate.ts";

const modulePath = process.env.PGLITE_MODULE_PATH ?? process.argv[2];
if (!modulePath) throw new Error("Set PGLITE_MODULE_PATH to an installed @electric-sql/pglite module.");
const { PGlite } = await import(pathToFileURL(modulePath).href);
const db = new PGlite();
const directory = new URL("../supabase/migrations/", import.meta.url);
const migrationName = "20261022015150_daily_challenge_new_york_time.sql";
const names = ["submit_challenge_attempt", "get_challenge_leaderboard", "get_challenge_leaderboard_position",
  "get_my_challenge_leaderboard_position", "get_admin_users", "get_dashboard_snapshot"];
const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
const clock = instant => db.query("select set_config('test.challenge_clock',$1,false)", [instant]);
const question = (day, division = "Mu") => `TZ-${day}-${division}`;
const routines = () => db.query(`select proname,prosrc,prosecdef,proconfig,
  has_function_privilege('anon',oid,'execute') anonymous,
  has_function_privilege('authenticated',oid,'execute') authenticated,
  has_function_privilege('service_role',oid,'execute') server
  from pg_proc where pronamespace='public'::regnamespace and proname=any($1) order by proname`, [names]);
async function history() {
  return Promise.all(["daily_challenges", "challenge_attempts", "challenge_user_statistics"].map(table =>
    scalar(`select coalesce(jsonb_agg(to_jsonb(t) order by to_jsonb(t)::text),'[]'::jsonb) from public.${table} t`)));
}
async function asRole(role, user, work) {
  await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)", [user ? uid(user) : "", role]);
  await db.exec(`set role ${role}`);
  try { return await work(); }
  finally { await db.exec("reset role; select set_config('request.jwt.claim.role','service_role',false)"); }
}
const snapshot = user => asRole("authenticated", user, () => scalar("select get_dashboard_snapshot('{}'::integer[])"));
const position = user => asRole("authenticated", user, () => scalar("select current_streak from get_my_challenge_leaderboard_position()"));
const directoryUsers = () => asRole("authenticated", 5, () => scalar("select get_admin_users('tz_')"));
const submit = (day, division = "Mu", correct = true) => asRole("service_role", null,
  () => db.query("select submit_challenge_attempt($1,$2,$3,'A',$4)", [uid(4), day, question(day, division), correct]));

before(async () => {
  await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role bypassrls; create role authenticator;
    create schema auth; create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb not null default '{}',raw_app_meta_data jsonb not null default '{}');
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create function auth.role() returns text language sql stable as $$select current_setting('request.jwt.claim.role',true)$$;
    grant usage on schema auth to anon,authenticated,service_role;
    create publication supabase_realtime; create schema realtime;
    create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language plpgsql as $$begin return; end$$;`);
  // PGlite does not run hosted pg_cron registration/retention jobs.
  for (const name of (await readdir(directory)).filter(name => /^\d{3}_.*\.sql$/.test(name) && !/^(035|050|069)_/.test(name)).sort()) {
    try { await db.exec(await readFile(new URL(name, directory), "utf8")); }
    catch (error) { throw new Error(`Migration ${name}: ${error.message}`); }
  }
  await clock("2026-10-22T02:00:00Z");
  await db.exec(`create or replace function pg_catalog.now() returns timestamptz language sql stable
    as $$select current_setting('test.challenge_clock')::timestamptz$$;
    select set_config('request.jwt.claim.role','service_role',false);`);
  for (const [index, name] of ["alice", "bob", "charlie", "delta", "admin"].entries()) {
    await db.query("insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)", [uid(index + 1), `tz_${name}@users.mao-practice.local`, {
      username: `tz_${name}`, age_13_or_older: true, terms_version: "2026-09-07",
      privacy_version: "2026-09-07", terms_accepted_at: "2026-10-01T00:00:00Z",
    }]);
  }
  await db.query("update profiles set role='admin' where id=$1", [uid(5)]);
  for (const day of ["2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22"]) {
    for (const division of ["Mu", "Alpha", "Theta"]) {
      await db.query("insert into daily_challenges(challenge_date,division,question_id) values($1,$2,$3)", [day, division, question(day, division)]);
    }
  }
  for (const [user, day, submitted] of [
    [1, "2026-10-20", "2026-10-20T12:00:00Z"],
    [2, "2026-10-21", "2026-10-21T14:00:00Z"],
    [3, "2026-10-21", "2026-10-21T13:00:00Z"],
    [4, "2026-10-19", "2026-10-19T12:00:00Z"],
    [4, "2026-10-20", "2026-10-20T12:00:00Z"],
  ]) {
    await db.query(`insert into challenge_attempts(user_id,challenge_date,question_id,selected_answer,correct,submitted_at)
      values($1,$2,$3,'A',true,$4)`, [uid(user), day, question(day), submitted]);
  }
  for (const user of [1, 2, 3, 4]) {
    await db.query(`insert into challenge_user_statistics(user_id,current_streak,longest_streak,total_completed,total_correct)
      values($1,$2,5,$2,$2)`, [uid(user), user === 4 ? 2 : 3]);
  }
});
after(() => db.close());

test("migration changes only the nine current-day expressions, preserving history and security", async () => {
  const before = (await routines()).rows;
  const stored = await history();
  await db.exec(await readFile(new URL(migrationName, directory), "utf8"));
  assert.deepEqual(await history(), stored, "no assignments, IDs, attempts or streak statistics are rewritten");
  const after = (await routines()).rows;
  assert.equal(after.length, 6);
  let changes = 0;
  for (let i = 0; i < before.length; i++) {
    const { prosrc: oldSource, ...oldSecurity } = before[i];
    const { prosrc: newSource, ...newSecurity } = after[i];
    assert.deepEqual(newSecurity, oldSecurity, before[i].proname);
    let expected = oldSource;
    for (const expression of ["(timezone('utc',now()))::date", "(timezone('utc', now()))::date", "(current_timestamp at time zone 'UTC')::date"]) {
      changes += expected.split(expression).length - 1;
      expected = expected.replaceAll(expression, "(now() at time zone 'America/New_York')::date");
    }
    assert.equal(newSource, expected, before[i].proname);
  }
  assert.equal(changes, 9);
  await db.exec(await readFile(new URL(migrationName, directory), "utf8"));
  assert.deepEqual(await history(), stored, "reapplying the migration remains non-destructive");
});

test("PostgreSQL and JavaScript agree at midnight and both daylight-saving transitions regardless of database timezone", async () => {
  for (const zone of ["UTC", "Asia/Tokyo", "America/Los_Angeles"]) {
    await db.query("select set_config('TimeZone',$1,false)", [zone]);
    for (const instant of ["2026-01-15T04:59:59Z", "2026-01-15T05:00:00Z", "2026-07-15T03:59:59Z", "2026-07-15T04:00:00Z",
      "2026-03-08T06:59:59Z", "2026-03-08T07:00:00Z", "2026-03-09T03:59:59Z", "2026-03-09T04:00:00Z",
      "2026-11-01T05:30:00Z", "2026-11-01T06:30:00Z", "2026-11-02T04:59:59Z", "2026-11-02T05:00:00Z"]) {
      await clock(instant);
      assert.equal(await scalar("select (now() at time zone 'America/New_York')::date::text"), getChallengeDate(new Date(instant)), `${zone}: ${instant}`);
    }
  }
  await db.exec("set timezone='UTC'");
  await clock("2026-10-22T02:00:00Z");
});

test("leaderboards use New York's current day for streak grace and earliest-correct tie breaks", async () => {
  const rows = await asRole("anon", null, () => db.query("select * from get_challenge_leaderboard()"));
  assert.deepEqual(rows.rows.slice(0, 3).map(row => row.username), ["tz_charlie", "tz_bob", "tz_alice"]);
  assert.equal(await position(1), 3);
  assert.equal(await asRole("service_role", null, () => scalar("select current_streak from get_challenge_leaderboard_position($1)", [uid(1)])), 3);
  assert.equal((await snapshot(1)).challenge.currentStreak, 3);
  assert.equal((await directoryUsers()).users.find(user => user.id === uid(1)).current_streak, 3);
});

test("streak expiry changes at New York midnight, not at UTC midnight", async () => {
  await clock("2026-10-22T03:59:59Z");
  assert.equal(await position(1), 3);
  await clock("2026-10-22T04:00:00Z");
  assert.equal(await position(1), 0);
  assert.equal((await snapshot(1)).challenge.currentStreak, 0);
  assert.equal((await directoryUsers()).users.find(user => user.id === uid(1)).current_streak, 0);
  await clock("2026-10-22T02:00:00Z");
});

test("submissions accept only New York today, keep streaks across divisions, and remain immutable", async () => {
  const before = await history();
  for (const date of ["2026-10-20", "2026-10-22"]) await assert.rejects(submit(date), /Only today's Challenge/);
  assert.deepEqual(await history(), before, "rejected dates do not change saved progress");
  await submit("2026-10-21");
  await submit("2026-10-21", "Alpha");
  assert.equal(await scalar("select current_streak from challenge_user_statistics where user_id=$1", [uid(4)]), 3);
  await assert.rejects(submit("2026-10-21"), error => error.code === "23505");
  await clock("2026-10-22T04:00:00Z");
  await assert.rejects(submit("2026-10-21", "Theta"), /Only today's Challenge/);
  await submit("2026-10-22");
  assert.equal(await scalar("select current_streak from challenge_user_statistics where user_id=$1", [uid(4)]), 4);
});

test("timezone change does not expose privileged submission, account rankings, dashboard or admin reads", async () => {
  for (const role of ["anon", "authenticated"]) {
    await assert.rejects(asRole(role, role === "authenticated" ? 1 : null,
      () => db.query("select submit_challenge_attempt($1,'2026-10-22',$2,'A',true)", [uid(1), question("2026-10-22")])), error => error.code === "42501");
    await assert.rejects(asRole(role, role === "authenticated" ? 1 : null,
      () => db.query("select * from get_challenge_leaderboard_position($1)", [uid(2)])), error => error.code === "42501");
  }
  await assert.rejects(asRole("anon", null, () => db.query("select get_dashboard_snapshot('{}'::integer[])")), error => error.code === "42501");
  await assert.rejects(asRole("authenticated", 1, () => db.query("select get_admin_users()")), error => error.code === "42501");
});
