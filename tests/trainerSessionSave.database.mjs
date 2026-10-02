// Isolated PostgreSQL-compatible fixture with actual migrations/RLS, no hosted data.
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { trainerSessionArguments, parseTrainerSessionReceipt } from "../lib/trainerSessionSave.ts";
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const sid = n => `10000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const directory = new URL("../supabase/migrations/", import.meta.url);
const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
async function asUser(n, work) {
  await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)", [n ? uid(n) : "", n ? "authenticated" : "anon"]);
  await db.exec(`set role ${n ? "authenticated" : "anon"}`);
  try { return await work(); } finally { await db.exec("reset role; select set_config('request.jwt.claim.role','service_role',false)"); }
}
const record = n => ({ id: sid(n), division: "Mu", startedAt: Date.parse("2026-10-01T12:00:00Z"), endedAt: Date.parse("2026-10-01T12:00:01.123Z"),
  startingLevel: { level: 3, progress: 4 }, endingLevel: { level: 3, progress: 5 },
  results: [
    { questionId: 10001, questionNumber: 1, selectedAnswer: "A", correctAnswer: "A", result: "correct", elapsedSeconds: 1 },
    { questionId: 10002, questionNumber: 2, selectedAnswer: null, correctAnswer: "B", result: "give-up", elapsedSeconds: 2 },
  ] });
const args = (r, user = 1) => Object.values(trainerSessionArguments(r, uid(user)));
const call = values => scalar("select public.save_trainer_session_v1($1::uuid,$2::uuid,$3::text,$4::timestamptz,$5::timestamptz,$6::integer,$7::integer,$8::integer,$9::integer,$10::jsonb)", values);
const save = (r, user = 1) => asUser(user, () => call(args(r, user)));
const tables = ["profiles","user_levels","question_progress","bookmarks","trainer_sessions","trainer_results"];
async function checksums() {
  return Promise.all(tables.map(table => scalar(`select md5(coalesce(string_agg(row_to_json(t)::text,',' order by row_to_json(t)::text),'')) from ${table} t`)));
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
    if (/^(035|050|053)_/.test(name)) continue;
    try { await db.exec(await readFile(new URL(name, directory), "utf8")); }
    catch (error) { throw new Error(`Migration ${name}: ${error.message}`); }
  }
  await db.exec("select set_config('request.jwt.claim.role','service_role',false)");
  for (const n of [1,2]) await db.query("insert into auth.users(id,raw_user_meta_data) values($1,$2)", [uid(n), { username: `fixture_${n}` }]);
  await db.query(`insert into trainer_sessions(id,user_id,division,started_at,ended_at,starting_level,starting_progress,ending_level,ending_progress)
    select ('20000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,$1,'Mu',
      '2026-01-01'::timestamptz+n*interval '1 hour','2026-01-01'::timestamptz+n*interval '1 hour'+interval '1 second',1,0,1,0
    from generate_series(1,1105) n`, [uid(1)]);
  const before = await checksums();
  const migration = await readFile(new URL("053_atomic_trainer_session_save.sql", directory), "utf8");
  await db.exec(migration);
  assert.deepEqual(await checksums(), before, "installation must not rewrite existing records");
  const original = record(1);
  const receipt = parseTrainerSessionReceipt(await save(original), original, uid(1));
  assert.equal(receipt.recentSessions.length, 5);
  assert.equal(receipt.recentSessions[4].accuracy, 50);
  assert.ok(JSON.stringify(receipt).length < 1500, "save receipt is bounded, without lifetime answers");
  const saved = await checksums();
  for (let n=0; n<30; n++) assert.deepEqual(await save(original), receipt);
  assert.deepEqual(await checksums(), saved, "lost-response retries must not duplicate or rewrite history");
  assert.deepEqual(saved.slice(0,4), before.slice(0,4), "session saves cannot award levels or alter practice progress");
  // Equivalent order of duplicate result values is the same persisted multiset.
  assert.equal((await save({ ...original, results: [...original.results].reverse() })).status, "saved");
  for (const mutation of [r => { r.endedAt++; }, r => { r.division="Alpha"; }, r => { r.endingLevel.progress++; },
    r => { r.results.pop(); }, r => { r.results.push(r.results[0]); }, r => { r.results[0].questionId++; }]) {
    const changed = structuredClone(original); mutation(changed);
    assert.equal((await save(changed)).status,"conflict");
  }
  assert.deepEqual(await checksums(), saved);
  assert.equal((await save(original,2)).status,"conflict", "another user cannot claim the same ID");
  await assert.rejects(asUser(2, () => call(args(original,1))), error => error.code === "42501");
  await assert.rejects(asUser(0, () => call(args(original))), error => error.code === "42501");
  await assert.rejects(asUser(1, async () => {
    await db.exec("select set_config('request.jwt.claim.sub','',false)"); return call(args(original));
  }), error => error.code === "42501");
  assert.deepEqual(await checksums(), saved);
  const empty = { ...record(2), results: [] };
  parseTrainerSessionReceipt(await save(empty,2), empty, uid(2));
  assert.equal((await save(empty,2)).recentSessions.length,1,"another user's history never enters the receipt");
  const invalidBase = record(3);
  for (const mutation of [a => { a[2]="Invalid"; }, a => { a[3]=null; }, a => { a[3]="infinity"; }, a => { a[5]=0; },
    a => { a[8]=30; }, a => { a[9]=null; }, a => { a[9]={}; }, a => { a[9]=Array(2001).fill(a[9][0]); },
    a => { a[9][0].question_id=1.5; }, a => { a[9][0].selected_answer="F"; }, a => { a[9][0].result="incorrect"; },
    a => { delete a[9][0].selected_answer; }]) {
    const a = args(invalidBase); mutation(a);
    await assert.rejects(asUser(1, () => call(a)));
    assert.equal(await scalar("select count(*)::int from trainer_sessions where id=$1", [invalidBase.id]),0);
  }
  // Fail after the header and first result were inserted; the entire RPC rolls back.
  await db.exec(`create function public.fixture_fail_result() returns trigger language plpgsql as $$begin
    if new.question_number=999 then raise exception 'fixture mid-save failure'; end if; return new; end$$;
    create trigger fixture_fail_result before insert on trainer_results for each row execute function public.fixture_fail_result();`);
  const failing=record(4); failing.results[1].questionNumber=999;
  const beforeFailure=await checksums();
  await assert.rejects(save(failing),/fixture mid-save failure/);
  assert.deepEqual(await checksums(),beforeFailure,"partial header/results must roll back without a compensating delete");
  await db.exec("drop trigger fixture_fail_result on trainer_results; drop function public.fixture_fail_result()");
  parseTrainerSessionReceipt(await save(failing),failing,uid(1));
  const duplicate=record(5); duplicate.results.push({...duplicate.results[0]});
  parseTrainerSessionReceipt(await save(duplicate),duplicate,uid(1));
  assert.equal(await scalar("select count(*)::int from trainer_results where session_id=$1",[duplicate.id]),3);
  assert.deepEqual(await save(duplicate),await save(duplicate));
  const rounding=record(9);
  rounding.results=Array.from({length:200},(_,index)=>({...rounding.results[0],
    selectedAnswer:index<29?"A":"B",result:index<29?"correct":"incorrect"}));
  assert.equal(parseTrainerSessionReceipt(await save(rounding),rounding,uid(1)).recentSessions.at(-1).accuracy,15);
  const maximum=record(6); maximum.results=Array(2000).fill(maximum.results[0]);
  parseTrainerSessionReceipt(await save(maximum),maximum,uid(1));
  assert.equal((await save(maximum)).status,"saved");
  // A later session from another tab must not become the current chart point on retry.
  const newer=record(7); newer.endedAt+=10000; await save(newer);
  const earlier=await save(original); assert.equal(earlier.recentSessions.at(-1).id,original.id);
  // A legacy partial session remains untouched and returns a conflict.
  const partial=record(8);
  await db.query(`insert into trainer_sessions(id,user_id,division,started_at,ended_at,starting_level,starting_progress,ending_level,ending_progress)
    values($1,$2,'Mu',$3,$4,3,4,3,5)`,[partial.id,uid(1),new Date(partial.startedAt).toISOString(),new Date(partial.endedAt).toISOString()]);
  assert.equal((await save(partial)).status,"conflict");
  assert.equal(await scalar("select count(*)::int from trainer_results where session_id=$1",[partial.id]),0);
  const signature="public.save_trainer_session_v1(uuid,uuid,text,timestamptz,timestamptz,integer,integer,integer,integer,jsonb)";
  assert.equal(await scalar("select has_function_privilege('anon',$1,'execute')",[signature]),false);
  assert.equal(await scalar("select has_function_privilege('authenticated',$1,'execute')",[signature]),true);
  assert.equal(await scalar("select prosecdef from pg_proc where oid=$1::regprocedure",[signature]),false);
  const final=await checksums(); await db.exec(migration); assert.deepEqual(await checksums(),final);
  console.log(`PASS: actual migrations/RLS, atomic rollback, 30 exact retries, user isolation, conflicts, duplicate results, 2000-result cap, legacy preservation and bounded ${JSON.stringify(receipt).length}-byte receipt across 1105 prior sessions.`);
} catch(error) { console.error(error.message,error.where??"",error.detail??""); process.exitCode=1; }
finally { await db.close(); }
