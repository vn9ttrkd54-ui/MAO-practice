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
    "062_multiplayer_round_feedback"]) await db.exec(await migration(name));

  const code = () => randomUUID().slice(0,8).toUpperCase();
  const user = async () => {
    const id=randomUUID();await db.query("insert into auth.users values($1)",[id]);
    await db.query("insert into profiles values($1,'Test player')",[id]);return id;
  };
  const create = u => scalar("select create_private_multiplayer_room($1,$2,'unranked','Mu',5,90,'2-4')",[u,code()]);
  const room = r => scalar("select to_jsonb(r) from multiplayer_rooms r where id=$1",[r]);
  const setup = async ({visibility="private",version=1,players=2}={}) => {
    const users=[await user()],ids=[];
    const r=visibility==="private"?await create(users[0]):await scalar(`insert into multiplayer_rooms
      (visibility,mode,division,question_count,seconds_per_question,capacity,difficulty_band)
      select 'public','ranked',d,n,90,20,'2-4' from unnest(array['Mu','Alpha','Theta']) d
      cross join unnest(array[5,15,30]) n where not exists(select 1 from multiplayer_rooms
        where visibility='public' and division=d and question_count=n and status in ('waiting','countdown'))
      order by n,d limit 1 returning id`);
    for(let i=0;i<players;i++) {
      if(i)users.push(await user());
      if(!i&&visibility==="private")ids.push((await room(r)).host_player_id);
      else ids.push(await scalar("insert into multiplayer_players(room_id,user_id) values($1,$2) returning id",[r,users[i]]));
    }
    if(visibility==="public")await scalar("select sync_public_multiplayer_host($1)",[r]);
    await db.query("update multiplayer_rooms set scoring_version=$2 where id=$1",[r,version]);
    return {r,users,ids};
  };
  const start = async f => {
    const r=await room(f.r),questions=Array.from({length:r.question_count},(_,i)=>101+i);
    return scalar("select start_multiplayer_lobby($1,$2,null,$3,$4,$5)",
      [f.r,f.users[0],questions,questions.map(()=>3),r.settings_version]);
  };
  const close = (f,u=f.users[0]) => scalar("select close_owned_private_multiplayer_lobby($1,$2)",[f.r,u]);
  const accept = (f,index,choice,correct=false) => scalar("select accept_multiplayer_answer($1,$2,101,$3,$4)",[f.r,f.ids[index],choice,correct]);
  const activate = f => db.query(`update multiplayer_match_questions set started_at=clock_timestamp()-interval '10 seconds',
    ends_at=clock_timestamp()+interval '80 seconds',hard_ends_at=clock_timestamp()+interval '85 seconds'
    where room_id=$1 and question_number=1`,[f.r]);
  const countdown = f => db.query("update multiplayer_rooms set status='countdown',countdown_ends_at=clock_timestamp()-interval '1 second' where id=$1",[f.r]);
  const allRows = async tables => Promise.all(tables.map(async table => (await db.query(`select to_jsonb(t) row from ${table} t order by to_jsonb(t)::text`)).rows));
  const untouchedTables=["profiles","multiplayer_players","multiplayer_submissions","multiplayer_match_questions","multiplayer_match_results","multiplayer_match_history","multiplayer_profiles"];
  const eligible=[await setup({visibility:"public"}),await setup({visibility:"public",players:3})];
  await db.query("update multiplayer_rooms set status='countdown',countdown_ends_at=clock_timestamp()+interval '5 seconds' where id=$1",[eligible[1].r]);
  for(const f of eligible)await db.query("update multiplayer_players set lobby_ready_settings_version=0 where room_id=$1",[f.r]);
  const privateWaiting=await setup(),running=await setup({visibility:"public"});
  await countdown(running);await start(running);await activate(running);await accept(running,0,"A",true);
  const completed=await setup({visibility:"public"});await countdown(completed);await start(completed);await activate(completed);
  await accept(completed,0,"B");await accept(completed,1,"B");
  await db.query("update multiplayer_rooms set status='completed',completed_at=clock_timestamp() where id=$1",[completed.r]);
  await scalar("select finalize_multiplayer_match($1)",[completed.r]);
  const withQuestions=await setup({visibility:"public"});
  await db.query("insert into multiplayer_match_questions(room_id,question_number,question_id,difficulty) values($1,1,999,3)",[withQuestions.r]);
  const withScore=await setup({visibility:"public"});await db.query("update multiplayer_players set score=123 where id=$1",[withScore.ids[0]]);
  const protectedRooms=[privateWaiting,running,completed,withQuestions,withScore];
  const beforeRooms=await Promise.all(protectedRooms.map(f=>room(f.r)));
  const beforeEligible=await Promise.all(eligible.map(f=>room(f.r)));
  const beforeRows=await allRows(untouchedTables);
  const functionRows=()=>db.query(`select oid::regprocedure::text name,pg_get_functiondef(oid) def from pg_proc
    where proname in ('accept_multiplayer_answer','start_multiplayer_lobby','finalize_multiplayer_match','read_multiplayer_scoreboard') order by 1`);
  const beforeFunctions=(await functionRows()).rows;
  await db.exec(await migration("063_multiplayer_lobby_recovery"));

  await check("migration preserves scores, history, profiles, memberships and running/completed/private rooms",async()=>{
    assert.deepEqual(await allRows(untouchedTables),beforeRows);
    assert.deepEqual(await Promise.all(protectedRooms.map(f=>room(f.r))),beforeRooms);
    assert.deepEqual((await functionRows()).rows,beforeFunctions);
    assert.ok(await scalar("select count(*)::int from multiplayer_match_history where room_id=$1",[completed.r]));
  });
  await check("only unused public lobbies upgrade; readiness invalidates without extending the timer",async()=>{
    for(let i=0;i<eligible.length;i++) {
      const after=await room(eligible[i].r),before=beforeEligible[i];
      assert.equal(after.scoring_version,2);assert.equal(after.settings_version,before.settings_version+1);
      assert.equal(after.state_version,before.state_version+1);
      for(const key of ["countdown_ends_at","seconds_per_question","difficulty_band","status","current_question_number"])
        assert.equal(after[key],before[key]);
      const lobby=await scalar("select read_multiplayer_lobby($1,$2,null)",[eligible[i].r,eligible[i].users[0]]);
      assert.ok(lobby.players.every(p=>p.lobby_ready===false));
    }
  });
  await check("upgraded public games accept Give up 0, wrong -300 and correct plus speed bonus",async()=>{
    const f=eligible[1];await countdown(f);assert.equal((await start(f)).status,"in-progress");await activate(f);
    await accept(f,0,null);await accept(f,1,"B");await accept(f,2,"A",true);
    const rows=(await db.query("select id,score from multiplayer_players where room_id=$1",[f.r])).rows;
    const scores=f.ids.map(id=>rows.find(p=>p.id===id).score);
    assert.deepEqual(scores.slice(0,2),[0,-300]);assert.ok(scores[2]>1000&&scores[2]<=1500);
  });
  await check("close is service-only with pinned search path",async()=>{
    const fn="close_owned_private_multiplayer_lobby(uuid,uuid)";
    for(const role of ["anon","authenticated","service_role"])
      assert.equal(await scalar("select has_function_privilege($1,$2,'execute')",[role,fn]),role==="service_role");
    assert.equal(await scalar("select prosecdef and proconfig=array['search_path=\"\"'] from pg_proc where oid=$1::regprocedure",[fn]),true);
  });
  await check("Back disconnects but does not close; explicit host close releases the creation guard",async()=>{
    const f=await setup({version:2});
    await scalar("select change_multiplayer_lobby_presence($1,$2,null,'disconnect',$3,$4,1,$5)",
      [f.r,f.users[0],randomUUID(),randomUUID(),f.ids[0]]);
    assert.equal((await room(f.r)).status,"waiting");
    await assert.rejects(create(f.users[0]),/Close or finish/);
    const before=await allRows(untouchedTables);
    assert.equal(await close(f),"closed");assert.equal((await room(f.r)).status,"cancelled");
    assert.deepEqual(await allRows(untouchedTables),before,"close cancels the room, never deletes user/player rows");
    const after=await room(f.r);assert.equal(await close(f),"closed");assert.deepEqual(await room(f.r),after);
    assert.notEqual(await create(f.users[0]),f.r);
  });
  await check("non-host, anonymous and public-room requests cannot close a room",async()=>{
    const f=await setup();const before=await room(f.r);
    await assert.rejects(close(f,f.users[1]),/Only the host/);
    await assert.rejects(close(f,await user()),/Only the host/);
    await assert.rejects(close(f,null),/Sign in/);
    await assert.rejects(close(eligible[0]),/Only the host/);
    assert.deepEqual(await room(f.r),before);
    await db.query("update multiplayer_players set left_at=clock_timestamp(),connected=false where id=$1",[f.ids[0]]);
    await assert.rejects(close(f),/Only the host/);
  });
  await check("close-before-start cannot start; start-before-close preserves a running match",async()=>{
    const first=await setup();assert.equal(await close(first),"closed");assert.equal((await start(first)).status,"cancelled");
    assert.equal(await scalar("select count(*)::int from multiplayer_match_questions where room_id=$1",[first.r]),0);
    const second=await setup();assert.equal((await start(second)).status,"in-progress");
    const before=await room(second.r),rows=await allRows(untouchedTables);
    assert.equal(await close(second),"started");assert.deepEqual(await room(second.r),before);
    assert.deepEqual(await allRows(untouchedTables),rows);
  });
  await check("unusual waiting rooms with match data or nonzero scores cannot be closed",async()=>{
    const f=await setup();await db.query("insert into multiplayer_match_questions(room_id,question_number,question_id,difficulty) values($1,1,888,3)",[f.r]);
    assert.equal(await close(f),"started");assert.equal((await room(f.r)).status,"waiting");
    const scored=await setup();await db.query("update multiplayer_players set score=-300 where id=$1",[scored.ids[0]]);
    assert.equal(await close(scored),"started");assert.equal((await room(scored.r)).status,"waiting");
    assert.equal(await close({r:randomUUID(),users:[await user()]}),"closed");
  });
  await check("documented rollout verification returns all three true",async()=>{
    const doc=await readFile(new URL("../docs/multiplayer-lobby-recovery.md",import.meta.url),"utf8");
    const sql=doc.match(/```sql\n([\s\S]*?)\n```/)[1];
    const result=(await db.query(sql)).rows[0];assert.equal(Object.keys(result).length,3);
    assert.ok(Object.values(result).every(v=>v===true),JSON.stringify(result));
  });
  console.log(`PASS ${checks} lobby-recovery database checks (isolated, not a live concurrency/load test).`);
} finally { await db.close(); }
