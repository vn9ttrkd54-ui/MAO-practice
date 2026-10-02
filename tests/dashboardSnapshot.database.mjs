// Actual application migrations and RLS, in isolated PGlite. No hosted credentials.
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { calculateTrainerHistorySummary, calculateQuestionBankSummary } from "../lib/dashboard.ts";
import { getMultiplayerSummary } from "../lib/multiplayerSummary.ts";
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const sid = n => `10000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const directory = new URL("../supabase/migrations/", import.meta.url);
const catalog = Array.from({ length: 1106 }, (_, i) => ({ id: i + 1 }));
const ids = catalog.map(q => q.id);
const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
async function asUser(n, work) {
  await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)", [n ? uid(n) : "", n ? "authenticated" : "anon"]);
  await db.exec(`set role ${n ? "authenticated" : "anon"}`);
  try { return await work(); } finally { await db.exec("reset role; select set_config('request.jwt.claim.role','service_role',false)"); }
}
const snapshot = (n, selection = ids) => asUser(n, () => scalar("select get_dashboard_snapshot($1::integer[])", [selection]));
const tables = ["profiles", "question_progress", "bookmarks", "user_levels", "trainer_sessions", "trainer_results", "challenge_user_statistics", "challenge_attempts", "multiplayer_profiles", "multiplayer_match_history", "multiplayer_match_results"];
async function checksums() {
  return Promise.all(tables.map(table => scalar(`select md5(coalesce(string_agg(row_to_json(t)::text, ',' order by row_to_json(t)::text),'')) from public.${table} t`)));
}
try {
  await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb not null default '{}');
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create function auth.role() returns text language sql stable as $$select current_setting('request.jwt.claim.role',true)$$;
    grant usage on schema auth to anon,authenticated,service_role;
    create publication supabase_realtime; create schema realtime;
    create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language plpgsql as $$begin return; end$$;`);
  for (const name of (await readdir(directory)).filter(n => n.endsWith(".sql")).sort()) {
    if (/^(035|050|052)_/.test(name)) continue; // Hosted cron and the migration under test.
    try { await db.exec(await readFile(new URL(name, directory), "utf8")); }
    catch (error) { throw new Error(`Migration ${name}: ${error.message}`); }
  }
  for (const n of [1, 2, 3]) await db.query("insert into auth.users(id,raw_user_meta_data) values($1,$2)", [uid(n), { username: `fixture_${n}` }]);
  await db.exec("select set_config('request.jwt.claim.role','service_role',false)");
  await db.query("update profiles set role='admin' where id=$1", [uid(3)]);
  await db.query("update user_levels set level=7,progress=11 where user_id=$1", [uid(1)]);
  await db.query(`insert into trainer_sessions(id,user_id,division,started_at,ended_at,starting_level,starting_progress,ending_level,ending_progress)
    select ('10000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,$1,
      (array['Mu','Alpha','Theta'])[n%3+1],
      '2026-01-01'::timestamptz+n*interval '1 hour',
      '2026-01-01'::timestamptz+n*interval '1 hour'+(n%90)*interval '1 second',2,5,3,6
    from generate_series(1,1105) n`, [uid(1)]);
  await db.query(`insert into trainer_results(session_id,user_id,question_id,question_number,selected_answer,correct_answer,result)
    select ('10000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,$1,j,j,'A','A',
      (array['correct','incorrect','give-up'])[(n+j)%3+1]
    from generate_series(1,1105) n cross join lateral generate_series(1,n%9) j`, [uid(1)]);
  await db.query(`insert into question_progress(user_id,question_id,last_result,last_attempted_at)
    select $1,n,(array[null,'correct','incorrect','give-up'])[n%4+1], '2026-08-01'::timestamptz+n*interval '1 second'
    from generate_series(1,1105) n`, [uid(1)]);
  await db.query(`insert into bookmarks(user_id,question_id,created_at)
    select $1,n,'2026-09-01'::timestamptz+n*interval '1 second' from generate_series(1,1105) n`, [uid(1)]);
  await db.query("insert into question_progress(user_id,question_id,last_result,last_attempted_at) values($1,999999,'correct',now()),($2,1,'incorrect',now())", [uid(1), uid(2)]);
  await db.query("insert into bookmarks(user_id,question_id) values($1,999999),($2,1)", [uid(1), uid(2)]);
  await db.query("insert into challenge_user_statistics(user_id,current_streak,longest_streak) values($1,3,9)", [uid(1)]);
  await db.exec("insert into daily_challenges(challenge_date,question_id,division) values(current_date,'fixture','Mu') on conflict do nothing");
  await db.query(`insert into challenge_attempts(user_id,challenge_date,question_id,selected_answer,correct)
    select $1,challenge_date,question_id,'A',true from daily_challenges where challenge_date=current_date and division='Mu'`, [uid(1)]);
  await db.query("insert into multiplayer_profiles(user_id,rp,ranked_matches_played,ranked_wins) values($1,1050,1107,1106)", [uid(1)]);
  await db.query(`insert into multiplayer_match_history(room_id,user_id,division,question_count,placement,final_score,ranked,finalized_at)
    select ('20000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,$1,'Mu',5,
      case when n=1 then 3 else 1 end,1000,true,'2026-01-01'::timestamptz+n*interval '1 hour'
    from generate_series(1,1106) n`, [uid(1)]);
  const room = "20000000-0000-4000-8000-000000001107", player = uid(20);
  await db.query(`insert into multiplayer_rooms(id,code,visibility,mode,division,question_count,seconds_per_question,capacity)
    values($1,'FIXTURE1','private','ranked','Mu',5,60,20)`, [room]);
  await db.query("insert into multiplayer_players(id,room_id,user_id) values($1,$2,$3)", [player, room, uid(1)]);
  await db.query(`insert into multiplayer_match_results(room_id,player_id,user_id,placement,final_score,ranked,previous_rp,rp_change,new_rp,opponent_adjustment,performance_index,completion_factor,finalized_at)
    values($1,$2,$3,1,1000,true,1000,20,1020,0,1,1,'2026-12-01')`, [room, player, uid(1)]);

  const before = await checksums();
  const migration = await readFile(new URL("052_dashboard_snapshot.sql", directory), "utf8");
  await db.exec(migration);
  assert.deepEqual(await checksums(), before, "additive migration must preserve every existing row");
  const first = await snapshot(1);
  assert.equal(first.version, 1); assert.equal(first.userId, uid(1)); assert.equal(first.username, "fixture_1");
  assert.deepEqual(first.level, { level: 7, progress: 11 }); assert.equal(first.isAdmin, false);
  const records = Array.from({ length: 1105 }, (_, i) => {
    const n = i + 1, startedAt = Date.parse("2026-01-01T00:00:00Z") + n * 3600000;
    return { id: sid(n), division: ["Mu", "Alpha", "Theta"][n % 3], startedAt, endedAt: startedAt + n % 90 * 1000,
      results: Array.from({ length: n % 9 }, (_, j) => ({ result: ["correct", "incorrect", "give-up"][(n+j+1)%3] })) };
  });
  assert.deepEqual(first.trainer, calculateTrainerHistorySummary(records), "all summary formulas must match the existing JS implementation");
  const progress = new Map(Array.from({ length: 1105 }, (_, i) => [i+1, [null, "correct", "incorrect", "give-up"][(i+1)%4]]));
  assert.deepEqual(first.questionBank, calculateQuestionBankSummary(catalog, progress, ids.slice(0,1105)));
  assert.equal(first.recentTrainerSessions.length, 5); assert.equal(first.recentActivity.length, 10);
  assert.ok(!JSON.stringify(first).includes("selected_answer"));
  assert.ok(!JSON.stringify(first).includes("999999"), "removed question IDs must not show up in activity");
  assert.equal(first.multiplayer.currentStreak, 1106, "streak must extend past a 1000-row API limit");
  assert.equal(first.multiplayer.averagePlacement, 1109 / 1107);
  assert.equal(Number(first.multiplayer.averagePlacement.toFixed(1)), getMultiplayerSummary({ placements: [...Array(1106).fill(1), 3] }).averagePlacement);
  assert.deepEqual(first.challenge, { currentStreak: 3, longestStreak: 9 });
  assert.ok(JSON.stringify(first).length < 10000, "response remains compact despite thousands of rows");
  const second = await snapshot(2); assert.equal(second.trainer.sessionsCompleted, 0);
  assert.equal(second.questionBank.attempted, 1); assert.equal(second.questionBank.bookmarked, 1);
  assert.equal(second.multiplayer.averagePlacement, null); assert.equal(second.multiplayer.currentStreak, 0);
  assert.equal((await snapshot(3)).isAdmin, true); assert.equal((await snapshot(3)).trainer.sessionsCompleted, 0);
  await assert.rejects(snapshot(0), error => error.code === "42501");
  assert.equal(await scalar("select has_function_privilege('anon','get_dashboard_snapshot(integer[])','execute')"), false);
  assert.equal(await scalar("select has_function_privilege('authenticated','get_dashboard_snapshot(integer[])','execute')"), true);
  await assert.rejects(asUser(1, async () => {
    await db.exec("select set_config('request.jwt.claim.sub','',false)");
    return scalar("select get_dashboard_snapshot($1::integer[])", [ids]);
  }), error => error.code === "42501");
  await assert.rejects(snapshot(1, null), /Invalid question catalog/);
  await assert.rejects(snapshot(1, Array(10001).fill(1)), /Invalid question catalog/);
  await assert.rejects(snapshot(1, [1, null]), /Invalid question catalog/);
  assert.equal((await snapshot(1, [1,1])).questionBank.totalQuestions, 1);
  assert.deepEqual((await snapshot(1, [])).questionBank, { totalQuestions: 0, solved: 0, attempted: 0, newQuestions: 0, bookmarked: 0 });
  assert.deepEqual(await checksums(), before, "dashboard reads must never mutate user records");

  // The same live match is now archived. It must count once before and after room cleanup.
  await db.query(`insert into multiplayer_match_history(room_id,user_id,division,question_count,placement,final_score,ranked,finalized_at)
    values($1,$2,'Mu',5,1,1000,true,'2026-12-01')`, [room, uid(1)]);
  assert.deepEqual((await snapshot(1)).multiplayer, first.multiplayer);
  await db.query("delete from multiplayer_rooms where id=$1", [room]);
  assert.deepEqual((await snapshot(1)).multiplayer, first.multiplayer, "cleanup cannot erase archived dashboard history");
  await db.query("delete from user_levels where user_id=$1", [uid(2)]);
  assert.deepEqual((await snapshot(2)).level, { level: 1, progress: 0 });
  assert.equal(await scalar("select count(*)::int from user_levels where user_id=$1", [uid(2)]), 0, "read must not initialize levels");
  await db.query("delete from challenge_attempts where user_id=$1", [uid(1)]);
  assert.deepEqual((await snapshot(1)).challenge, { currentStreak: 0, longestStreak: 9 });
  assert.equal(await scalar("select prosecdef from pg_proc where oid='get_dashboard_snapshot(integer[])'::regprocedure"), false);
  assert.equal(await scalar("select provolatile from pg_proc where oid='get_dashboard_snapshot(integer[])'::regprocedure"), "s");
  // Repeat the migration safely, without changing tables or history.
  const after = await checksums(); await db.exec(migration); assert.deepEqual(await checksums(), after);
  console.log(`PASS: actual migrations/RLS, user/admin isolation, 1105-session formula parity, >1000 progress/bookmark/match rows, bounded ${JSON.stringify(first).length}-byte snapshot, read-only checksums, archive/live deduplication and cleanup survival.`);
} catch (error) {
  console.error(error.message, error.where ?? "", error.detail ?? ""); process.exitCode = 1;
} finally { await db.close(); }
