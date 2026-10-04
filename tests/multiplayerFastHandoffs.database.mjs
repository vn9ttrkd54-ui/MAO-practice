// Actual migrations in isolated PostgreSQL. Never connects to hosted Supabase.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
const migration = name => readFile(new URL(`../supabase/migrations/${name}.sql`, import.meta.url), "utf8");
const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
let checks = 0;
const check = async (name, run) => { await run(); checks++; console.log(`PASS ${name}`); };
try {
  await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role;
    create schema auth; create table auth.users(id uuid primary key);
    grant usage on schema auth to authenticated;
    create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    create table public.profiles(id uuid primary key, username text);
    create function public.set_updated_at() returns trigger language plpgsql as $$begin new.updated_at=clock_timestamp(); return new; end;$$;
    create schema realtime; create table realtime.test_events(payload jsonb);
    create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language sql as
    $$insert into realtime.test_events values(payload)$$;`);
  const schema = await migration("009_multiplayer_pack_m2_schema");
  await db.exec(schema.slice(0, schema.indexOf("-- Row Level Security")) + "\ncommit;");
  await db.exec(schema.slice(schema.indexOf("-- Row Level Security"),schema.indexOf("-- Realtime is limited")));
  await db.exec(`alter table multiplayer_spectators add column last_seen_at timestamptz default clock_timestamp();
    grant select on multiplayer_players to authenticated;`);
  for (const name of ["022_multiplayer_realtime_foundation", "023_multiplayer_realtime_signal_filter",
    "024_multiplayer_atomic_round_transitions", "025_fix_multiplayer_transition_timestamp",
    "026_multiplayer_request_storm_control", "027_multiplayer_transition_recovery", "028_fix_multiplayer_state_trigger",
    "029_preload_multiplayer_questions", "030_confirm_preloaded_round_before_reveal", "031_multiplayer_atomic_submissions",
    "032_multiplayer_atomic_finalization", "033_multiplayer_event_snapshots", "034_multiplayer_database_worker",
    "036_multiplayer_readiness_countdown", "037_multiplayer_balanced_rp", "040_multiplayer_authoritative_scoring_clock",
    "047_multiplayer_host_account_deletion", "049_multiplayer_room_lifecycle", "051_multiplayer_confirmed_lobby_transitions",
    "059_multiplayer_room_settings", "060_multiplayer_lobby_ready", "061_multiplayer_scoring_give_up",
    "062_multiplayer_round_feedback", "063_multiplayer_lobby_recovery"]) await db.exec(await migration(name));


  const user=async()=>{const id=randomUUID();await db.query("insert into auth.users values($1)",[id]);await db.query("insert into profiles values($1,'Test')",[id]);return id;};
  const setup=async({visibility="private",count=2,guest=false}={})=>{
    if(visibility==="public")count=5;
    const u=await user();
    const r=visibility==="private"?await scalar("select create_private_multiplayer_room($1,$2,'unranked','Mu',$3,90,'2-4')",[u,randomUUID().slice(0,8).toUpperCase(),count]):
      (await scalar("select (select id from multiplayer_rooms where visibility='public' and division='Mu' and question_count=5 and status='waiting' limit 1)")) ??
      await scalar("insert into multiplayer_rooms(visibility,mode,division,question_count,seconds_per_question,capacity,difficulty_band) values('public','ranked','Mu',5,90,20,'2-4') returning id");
    let host=await scalar("select host_player_id from multiplayer_rooms where id=$1",[r]);
    if(!host){host=await scalar("insert into multiplayer_players(room_id,user_id,is_host) values($1,$2,true) returning id",[r,u]);await db.query("update multiplayer_rooms set host_player_id=$2 where id=$1",[r,host]);}
    const secondUser=guest?null:await user();
    const second=await scalar("insert into multiplayer_players(room_id,user_id,guest_nickname,reconnect_token_hash) values($1,$2,$3,$4) returning id",[r,secondUser,guest?"Guest":null,guest?"a".repeat(64):null]);
    if(visibility==="public")await db.query("update multiplayer_rooms set status='countdown',countdown_ends_at=clock_timestamp()-interval '1 second' where id=$1",[r]);
    return {r,u,host,secondUser,second,count};
  };
  const start=f=>scalar("select start_multiplayer_lobby($1,$2,null,$3,$4,0)",[f.r,f.u,Array.from({length:f.count},(_,i)=>101+i),Array(f.count).fill(3)]);
  const q=f=>scalar("select to_jsonb(q) from multiplayer_match_questions q where room_id=$1 and question_number=1",[f.r]);
  const round=(f,u=f.u,hash=null,version=-1)=>scalar("select read_multiplayer_round_for_actor($1,$2,$3,$4)",[f.r,u,hash,version]);
  const result=(f,u=f.u,hash=null)=>scalar("select read_multiplayer_result_snapshot($1,$2,$3)",[f.r,u,hash]);
  const activate=f=>db.query("update multiplayer_match_questions set started_at=clock_timestamp()-interval '10 seconds',ends_at=clock_timestamp()+interval '85 seconds',hard_ends_at=clock_timestamp()+interval '85 seconds' where room_id=$1 and question_number=1",[f.r]);
  const submit=(f,p,choice,correct=false)=>scalar("select accept_multiplayer_answer($1,$2,101,$3,$4)",[f.r,p,choice,correct]);
  const rows=async()=>Promise.all(["multiplayer_rooms","multiplayer_players","multiplayer_match_questions","multiplayer_submissions","multiplayer_match_results","multiplayer_profiles","multiplayer_match_history"]
    .map(async t=>(await db.query("select to_jsonb(t) row from "+t+" t order by to_jsonb(t)::text")).rows));
  const old=await setup();await start(old);
  const done=await setup({count:1});await start(done);await activate(done);await submit(done,done.host,"A",true);await submit(done,done.second,null);
  await scalar("select finalize_multiplayer_match($1)",[done.r]);
  const before=await rows();
  const defs=async()=>(await db.query("select oid::regprocedure::text name,pg_get_functiondef(oid) def from pg_proc where proname in ('accept_multiplayer_answer','finalize_multiplayer_match','schedule_ready_multiplayer_question','advance_multiplayer_round_state','set_multiplayer_lobby_ready') order by 1")).rows;
  const beforeDefs=await defs();
  await db.exec(await migration("064_multiplayer_fast_handoffs"));

  await check("migration changes no existing rows or scoring/finalization/later-round/Ready rules",async()=>{
    assert.deepEqual(await rows(),before);assert.deepEqual(await defs(),beforeDefs);
    assert.equal((await q(old)).started_at,null,"already preparing old games are not rewritten");
  });
  for(const visibility of ["private","public"])await check(visibility+" starts on an exact 3+5 server schedule, even without ACKs",async()=>{
    const f=await setup({visibility});const r=await start(f),first=await q(f);
    const elapsed=(key)=>(Date.parse(first[key])-Date.parse(r.started_at))/1000;
    assert.equal(elapsed("preparation_deadline_at"),3);assert.equal(elapsed("started_at"),8);
    assert.equal((Date.parse(first.ends_at)-Date.parse(first.started_at))/1000,95);
    assert.equal(first.ends_at,first.hard_ends_at);
    await scalar("select acknowledge_multiplayer_question_ready($1,$2,1)",[f.r,f.host]);
    assert.equal((await q(f)).started_at,first.started_at,"early/missing/duplicate ACK cannot extend the fixed start");
    await scalar("select acknowledge_multiplayer_question_ready($1,$2,1)",[f.r,f.host]);
    assert.equal((await q(f)).started_at,first.started_at);
    await assert.rejects(submit(f,f.host,"A",true),/not started/);
    assert.equal(await scalar("select count(*)::int from multiplayer_submissions where room_id=$1",[f.r]),0);
    if(visibility==="private"){
      await activate(f);await submit(f,f.host,"B");await submit(f,f.second,null);
      const next=await scalar("select to_jsonb(q) from multiplayer_match_questions q where room_id=$1 and question_number=2",[f.r]);
      assert.equal(next.started_at,null);assert.ok(next.preparation_deadline_at);
      await scalar("select acknowledge_multiplayer_question_ready($1,$2,2)",[f.r,f.host]);
      assert.equal(await scalar("select started_at is null from multiplayer_match_questions where room_id=$1 and question_number=2",[f.r]),true);
      await scalar("select acknowledge_multiplayer_question_ready($1,$2,2)",[f.r,f.second]);
      const later=await scalar("select extract(epoch from (started_at-clock_timestamp()))::float from multiplayer_match_questions where room_id=$1 and question_number=2",[f.r]);
      assert.ok(later>9&&later<=10,"later rounds retain 5s announcement + 5s countdown");
    }
  });
  await check("compact round read enforces account/guest ownership and masks open-round deltas",async()=>{
    const f=await setup({guest:true});await start(f);await activate(f);await submit(f,f.host,"B");
    const a=await round(f),b=await round(f,null,"a".repeat(64));assert.equal(a.currentPlayerId,f.host);assert.equal(b.currentPlayerId,f.second);
    assert.ok(a.players.every(p=>p.score===0&&p.round_result===null));
    assert.equal(await round(f,await user()),null);assert.equal(await round(f,null,"b".repeat(64)),null);
    assert.equal(await round(f,null,null),null);
    assert.deepEqual(await round(f,f.u,null,a.stateVersion),{unchanged:true,stateVersion:a.stateVersion,status:"in-progress"});
    assert.ok(!JSON.stringify(a).match(/reconnect_token_hash|selected_answer|correct_answer/));
    await db.query("update multiplayer_players set left_at=clock_timestamp(),connected=false where id=$1",[f.second]);
    assert.equal(await round(f,null,"a".repeat(64)),null);
  });
  await check("result snapshot exposes only finalized own submissions; completed private results stay private",async()=>{
    const f=await setup({count:1,guest:true});await start(f);await activate(f);await submit(f,f.host,"B");
    assert.equal(await result(f),null,"no result before the last player finishes");
    await submit(f,f.second,null);
    assert.deepEqual(await result(f),{status:"pending",isHost:true});
    assert.deepEqual(await result(f,null,"a".repeat(64)),{status:"pending",isHost:false});
    assert.equal(await result(f,await user()),null);
    await scalar("select tick_multiplayer_rooms()");
    const a=await result(f),b=await result(f,null,"a".repeat(64));
    assert.equal(a.status,"ready","one worker tick finalizes the completed match");assert.equal(a.result.final_score,-300);assert.equal(b.result.final_score,0);
    assert.deepEqual(a.submissions.map(s=>s.selected_answer),["B"]);assert.deepEqual(b.submissions.map(s=>s.selected_answer),[null]);
    assert.equal(a.placements.length,2);assert.equal(a.questions.length,1);
    assert.equal((await round(f)).status,"completed");
    const saved=await rows();await scalar("select finalize_multiplayer_match($1)",[f.r]);assert.deepEqual(await rows(),saved,"no repeated rating/history award");
    await scalar("select acknowledge_multiplayer_result($1,$2)",[f.r,f.host]);
    assert.equal(await result(f),null,"result receipt behavior preserved");
  });
  await check("signed-in public spectators can view completed results, not other players' submissions",async()=>{
    const f=await setup({visibility:"public"});await start(f);await activate(f);await submit(f,f.host,"A",true);await submit(f,f.second,"B");
    await db.query("update multiplayer_rooms set status='completed',completed_at=clock_timestamp() where id=$1",[f.r]);
    await scalar("select finalize_multiplayer_match($1)",[f.r]);
    const s=await result(f,await user());assert.equal(s.viewerMode,"spectator");assert.equal(s.result,null);assert.deepEqual(s.submissions,[]);
    assert.equal(await result(f,null,null),null);assert.equal(await result(f,null,"b".repeat(64)),null);
  });
  await check("read RPCs have server-only grants, are stable, and never mutate or broadcast",async()=>{
    const signatures=["read_multiplayer_round_for_actor(uuid,uuid,text,bigint)","read_multiplayer_result_snapshot(uuid,uuid,text)"];
    for(const fn of signatures){
      assert.equal(await scalar("select prosecdef and provolatile='s' and proconfig=array['search_path=\"\"'] from pg_proc where oid=$1::regprocedure",[fn]),true);
      for(const role of ["anon","authenticated","service_role"])assert.equal(await scalar("select has_function_privilege($1,$2,'execute')",[role,fn]),role==="service_role");
    }
    const saved=await rows(),events=await scalar("select count(*) from realtime.test_events");
    for(let i=0;i<20;i++){await round(old);await result(done);}
    assert.deepEqual(await rows(),saved);assert.equal(await scalar("select count(*) from realtime.test_events"),events);
  });
  console.log("PASS "+checks+" isolated fast-handoff database checks; no live performance claim.");
} finally { await db.close(); }
