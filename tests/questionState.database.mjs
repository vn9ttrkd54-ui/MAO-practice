// Actual migrations and RLS in an isolated local database; no live data.
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
const uid = n => `00000000-0000-4000-8000-${String(n).padStart(12,"0")}`;
const dir = new URL("../supabase/migrations/", import.meta.url);
const scalar = async (sql, args = []) => Object.values((await db.query(sql,args)).rows[0])[0];
const tables = ["profiles","user_levels","question_progress","bookmarks","trainer_sessions","trainer_results","practice_attempts"];
const checksum = () => Promise.all(tables.map(table => scalar(`select md5(coalesce(string_agg(row_to_json(t)::text,',' order by row_to_json(t)::text),'')) from public.${table} t`)));
async function asUser(n, work) {
  await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)",[n?uid(n):"",n?"authenticated":"anon"]);
  await db.exec(`set role ${n?"authenticated":"anon"}`);
  try { return await work(); } finally { await db.exec("reset role; select set_config('request.jwt.claim.role','service_role',false)"); }
}
const read = (n,id) => asUser(n,()=>scalar("select public.get_question_state($1)",[id]));
try {
  await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb not null default '{}',raw_app_meta_data jsonb not null default '{}');
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create function auth.role() returns text language sql stable as $$select current_setting('request.jwt.claim.role',true)$$;
    grant usage on schema auth to anon,authenticated,service_role;
    create publication supabase_realtime; create schema realtime;
    create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language plpgsql as $$begin return; end$$;`);
  for (const name of (await readdir(dir)).filter(n=>n.endsWith(".sql")).sort()) {
    if (/^(035|050|054)_/.test(name)) continue;
    await db.exec(await readFile(new URL(name,dir),"utf8"));
  }
  await db.exec("select set_config('request.jwt.claim.role','service_role',false)");
  for (const n of [1,2,3]) await db.query("insert into auth.users(id,raw_user_meta_data,email) values($1,$2,$3)",[uid(n),{
    username:`fixture_${n}`, age_13_or_older:true, terms_version:"2026-09-07", privacy_version:"2026-09-07", terms_accepted_at:"2026-10-01T00:00:00Z",
  },`fixture_${n}@users.mao-practice.local`]);
  await db.query("update profiles set role='admin' where id=$1",[uid(3)]);
  await db.query(`insert into question_progress(user_id,question_id,attempts,correct,last_result,last_correct_at,
    correct_times_ms,timing_count,timing_total_seconds,timing_best_seconds)
    select $1,n,5000,4000,'correct','2026-10-01'::timestamptz,array_fill(12000::bigint,array[100]),4000,48000,12 from generate_series(10001,11105) n`,[uid(1)]);
  await db.query("insert into bookmarks(user_id,question_id) select $1,n from generate_series(10001,11105) n",[uid(1)]);
  await db.query("insert into question_progress(user_id,question_id,attempts,correct,last_result) values($1,10001,1,0,'incorrect')",[uid(2)]);
  const before=await checksum();
  const migration=await readFile(new URL("054_question_state_snapshot.sql",dir),"utf8");
  await db.exec(migration); assert.deepEqual(await checksum(),before);
  const state=await read(1,11105);
  assert.equal(state.userId,uid(1)); assert.equal(state.questionId,11105); assert.equal(state.bookmarked,true);
  assert.deepEqual(state.progress,{attempts:5000,correct:4000,lastResult:"correct",lastCorrectAt:Date.parse("2026-10-01T00:00:00Z"),timing:{count:4000,totalSeconds:48000,bestSeconds:12}});
  assert.ok(!JSON.stringify(state).includes("times")); assert.ok(JSON.stringify(state).length<400);
  assert.equal((await read(2,10001)).progress.attempts,1); assert.equal((await read(2,10001)).bookmarked,false);
  assert.equal((await read(3,10001)).progress.attempts,0,"admin only sees own state");
  assert.equal((await read(1,999)).progress.attempts,0,"absent row is a successful empty result, not a write");
  for (const id of [0,-1,null]) await assert.rejects(read(1,id));
  await assert.rejects(read(0,10001),error=>error.code==="42501");
  await assert.rejects(asUser(1,async()=>{
    await db.exec("select set_config('request.jwt.claim.sub','',false)"); return scalar("select get_question_state(10001)");
  }),error=>error.code==="42501");
  assert.deepEqual(await checksum(),before,"all snapshot reads preserve every fixture record");
  const flags=(await db.query("select prosecdef,provolatile,has_function_privilege('anon',oid,'execute') as anon,has_function_privilege('authenticated',oid,'execute') as authenticated from pg_proc where oid='public.get_question_state(integer)'::regprocedure")).rows[0];
  assert.deepEqual(flags,{prosecdef:false,provolatile:"s",anon:false,authenticated:true});
  await db.exec(migration); assert.deepEqual(await checksum(),before);
  // Exercise the same explicit-state SQL operations used by the client. These
  // writes are test bookmarks only; cross-owner RLS and duplicate retries apply.
  await asUser(2,async()=>{
    for(let i=0;i<2;i++) await db.query("insert into bookmarks(user_id,question_id) values($1,10001) on conflict(user_id,question_id) do nothing",[uid(2)]);
  });
  assert.equal((await read(2,10001)).bookmarked,true);
  assert.equal(await scalar("select count(*)::int from bookmarks where user_id=$1",[uid(2)]),1);
  await assert.rejects(asUser(2,()=>db.query("insert into bookmarks(user_id,question_id) values($1,999)",[uid(1)])),error=>error.code==="42501");
  await asUser(2,()=>db.query("delete from bookmarks where user_id=$1 and question_id=10001",[uid(1)]));
  assert.equal((await read(1,10001)).bookmarked,true);
  await asUser(2,async()=>{
    for(let i=0;i<2;i++) await db.query("delete from bookmarks where user_id=$1 and question_id=10001",[uid(2)]);
  });
  assert.deepEqual(await checksum(),before,"test bookmark add/remove affects no other data");
  console.log(`PASS: actual migrations/RLS, user/admin isolation, 1105-question history, ${JSON.stringify(state).length}-byte snapshot, lifetime timing, permission checks, install/read checksums, explicit bookmark retries and cross-owner denial.`);
} finally { await db.close(); }
