// Isolated PostgreSQL regression, never a linked project or production load test.
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
    create function auth.uid() returns uuid language sql as $$ select null::uuid $$;
    create table public.profiles(id uuid primary key, username text);
    create function public.set_updated_at() returns trigger language plpgsql as $$begin new.updated_at=clock_timestamp(); return new; end;$$;
    create schema realtime; create table realtime.test_events(payload jsonb);
    create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language sql as
    $$insert into realtime.test_events values(payload)$$;`);
  const schema = await migration("009_multiplayer_pack_m2_schema");
  await db.exec(schema.slice(0, schema.indexOf("-- Row Level Security")) + "\ncommit;");
  await db.exec("alter table multiplayer_spectators add column last_seen_at timestamptz default clock_timestamp()");
  for (const name of ["022_multiplayer_realtime_foundation", "023_multiplayer_realtime_signal_filter",
    "024_multiplayer_atomic_round_transitions", "025_fix_multiplayer_transition_timestamp",
    "026_multiplayer_request_storm_control", "027_multiplayer_transition_recovery", "028_fix_multiplayer_state_trigger",
    "029_preload_multiplayer_questions", "030_confirm_preloaded_round_before_reveal", "031_multiplayer_atomic_submissions",
    "032_multiplayer_atomic_finalization", "033_multiplayer_event_snapshots", "034_multiplayer_database_worker",
    "036_multiplayer_readiness_countdown", "037_multiplayer_balanced_rp", "040_multiplayer_authoritative_scoring_clock",
    "047_multiplayer_host_account_deletion", "049_multiplayer_room_lifecycle", "051_multiplayer_confirmed_lobby_transitions"]) await db.exec(await migration(name));


  const users=Array.from({length:24},()=>randomUUID());
  for(const [i,id] of users.entries()) {
    await db.query("insert into auth.users values($1)",[id]);
    await db.query("insert into profiles values($1,$2)",[id,`Player ${i}`]);
  }
  const legacyRoom=async(status='waiting',visibility='public')=>scalar(`insert into multiplayer_rooms(visibility,code,mode,division,question_count,seconds_per_question,capacity,status,started_at)
    values($1,$2,'ranked','Mu',5,60,$3,$4,case when $4='in-progress' then clock_timestamp() end) returning id`,
    [visibility,visibility==='private'?'LEGACYAA':null,visibility==='public'?20:30,status]);
  const oldRunning=await legacyRoom('in-progress');
  const oldWaiting=await legacyRoom();
  const oldPrivate=await legacyRoom('waiting','private');
  const oldHost=await scalar("insert into multiplayer_players(room_id,user_id) values($1,$2) returning id",[oldWaiting,users[0]]);
  await db.exec(await migration("059_multiplayer_room_settings"));
  const read=(room,user)=>scalar("select read_multiplayer_lobby($1,$2,null)",[room,user]);
  const join=(room,user)=>scalar("select join_public_multiplayer_lobby($1,$2)",[room,user]);
  const room=()=>scalar("insert into multiplayer_rooms(visibility,mode,division,question_count,seconds_per_question,capacity) values('public','ranked','Mu',5,90,20) returning id");
  const playerId=(room,user)=>scalar("select id from multiplayer_players where room_id=$1 and user_id=$2",[room,user]);
  const conn=()=>({tab:randomUUID(),id:randomUUID(),gen:1});
  const presence=async(room,user,c,action='connect')=>{
    c.player ??= await playerId(room,user);
    return scalar("select change_multiplayer_lobby_presence($1,$2,null,$3,$4,$5,$6,$7)",[room,user,action,c.tab,c.id,c.gen,c.player]);
  };
  const leave=(room,user,c)=>scalar("select leave_multiplayer_lobby($1,$2,null,$3)",[room,user,c.id]);
  const set=(room,user,c,band,version=0)=>scalar("select set_multiplayer_lobby_difficulty($1,$2,null,$3,$4,$5,$6)",[room,user,band,version,c.id,c.player]);
  const start=(room,user,version=0,difficulties=[2,3,4,2,3])=>scalar("select start_multiplayer_lobby($1,$2,null,$3,$4,$5)",[room,user,[101,102,103,104,105],difficulties,version]);
  const expire=async(room,user)=>{
    await db.exec("alter table multiplayer_players disable trigger multiplayer_players_set_updated_at");
    await db.query("update multiplayer_players set updated_at=clock_timestamp()-interval '31 seconds' where room_id=$1 and user_id=$2",[room,user]);
    await db.exec("alter table multiplayer_players enable trigger multiplayer_players_set_updated_at");
  };
  await check("migration preserves running/private legacy rooms; pending public rooms get 90s, default band and first host",async()=>{
    assert.deepEqual((await db.query("select seconds_per_question,difficulty_band from multiplayer_rooms where id=$1",[oldRunning])).rows[0],{seconds_per_question:60,difficulty_band:null});
    assert.equal(await scalar("select difficulty_band from multiplayer_rooms where id=$1",[oldPrivate]),null);
    const lobby=await read(oldWaiting,users[0]);
    assert.equal(lobby.room.seconds_per_question,90);assert.equal(lobby.room.difficulty_band,'2-4');
    assert.equal(lobby.room.host_player_id,oldHost);assert.equal(lobby.currentPlayer.is_host,true);
    await db.exec("delete from multiplayer_rooms");
  });
  await check("first public joiner owns settings; leaving transfers host, preserving countdown and difficulty",async()=>{
    const r=await room();await join(r,users[0]);await join(r,users[1]);await join(r,users[2]);
    const c=conn();await presence(r,users[0],c);
    const before=await read(r,users[0]);assert.equal(before.room.host_player_id,c.player);
    const saved=await set(r,users[0],c,'1-3');
    assert.equal(saved.room.countdown_ends_at,before.room.countdown_ends_at);
    await leave(r,users[0],c);const after=await read(r,users[1]);
    assert.equal(after.currentPlayer.is_host,true);assert.equal(after.room.host_player_id,after.currentPlayer.id);
    assert.equal(after.room.difficulty_band,'1-3');assert.equal(after.room.countdown_ends_at,before.room.countdown_ends_at);
    assert.equal(after.players.filter(p=>p.is_host).length,1);
    const next=conn();await presence(r,users[1],next);await leave(r,users[1],next);
    const last=await read(r,users[2]);assert.equal(last.room.status,'waiting');assert.equal(last.room.countdown_ends_at,null);
    await db.query("delete from multiplayer_rooms where id=$1",[r]);
  });
  await check("disconnect/expiry transfer hosting without reviving stale members or broadcasting normal heartbeats",async()=>{
    const r=await room();await join(r,users[0]);await join(r,users[1]);
    const a=conn(),b=conn();await presence(r,users[0],a);await presence(r,users[1],b);
    await expire(r,users[0]);await presence(r,users[1],b,'heartbeat');
    const snapshot=await read(r,users[1]);assert.equal(snapshot.currentPlayer.is_host,true);
    assert.equal(await scalar("select connected from multiplayer_players where id=$1",[a.player]),false);
    const version=snapshot.room.state_version;
    await presence(r,users[1],b,'heartbeat');assert.equal((await read(r,users[1])).room.state_version,version);
    const rejoin={...a,id:randomUUID(),gen:2};await presence(r,users[0],rejoin);
    assert.equal((await read(r,users[1])).currentPlayer.is_host,true,'returning old host does not steal ownership');
    await presence(r,users[1],b,'disconnect');assert.equal((await read(r,users[0])).currentPlayer.is_host,true);
    await presence(r,users[0],rejoin,'disconnect');
    assert.equal(await scalar("select host_player_id from multiplayer_rooms where id=$1",[r]),null);
    await db.query("delete from multiplayer_rooms where id=$1",[r]);
  });
  await check("account deletion transfers public host without cancelling lobby or deleting other memberships",async()=>{
    const r=await room();await join(r,users[20]);await join(r,users[21]);
    await db.query("delete from auth.users where id=$1",[users[20]]);
    const after=await read(r,users[21]);assert.notEqual(after.room.status,'cancelled');
    assert.equal(after.currentPlayer.is_host,true);assert.equal(after.players.length,1);
    await db.query("delete from auth.users where id=$1",[users[21]]);
    assert.equal(await scalar("select host_player_id from multiplayer_rooms where id=$1",[r]),null);
    await db.query("delete from multiplayer_rooms where id=$1",[r]);
  });
  await check("only current connected host and current connection may change settings; retries are idempotent",async()=>{
    const r=await room();await join(r,users[0]);await join(r,users[1]);
    const a=conn(),b=conn();await presence(r,users[0],a);await presence(r,users[1],b);
    await assert.rejects(set(r,users[1],b,'1-3'),/host/);
    await assert.rejects(set(r,users[0],{...a,id:randomUUID()},'1-3'),/host/);
    await assert.rejects(set(r,users[0],{...a,player:b.player},'1-3'),/host/);
    await assert.rejects(set(r,users[0],a,'1-5'),/difficulty/);
    const saved=await set(r,users[0],a,'1-3');const version=saved.room.state_version;
    assert.equal((await set(r,users[0],a,'1-3')).room.state_version,version);
    await assert.rejects(set(r,users[0],a,'3-5',0),/Settings changed/);
    const next={...a,id:randomUUID(),gen:2};await presence(r,users[0],next);
    await assert.rejects(set(r,users[0],a,'3-5',1),/host/);
    await set(r,users[0],next,'3-5',1);
    await db.query("update multiplayer_rooms set countdown_ends_at=clock_timestamp()+interval '5 seconds' where id=$1",[r]);
    const deadline=(await read(r,users[0])).room.countdown_ends_at;
    await assert.rejects(set(r,users[0],next,'1-3',2),/locked/);
    assert.equal((await read(r,users[0])).room.countdown_ends_at,deadline);
    await db.query("delete from multiplayer_rooms where id=$1",[r]);
  });
  await check("host account deletion still cancels private lobbies and preserves running public matches",async()=>{
    const privateRoom=await scalar("select create_private_multiplayer_room($1,'DELETEAA','unranked','Mu',5,180,'1-3')",[users[19]]);
    await db.query("insert into multiplayer_players(room_id,user_id) values($1,$2)",[privateRoom,users[16]]);
    await db.query("delete from auth.users where id=$1",[users[19]]);
    assert.equal(await scalar("select status from multiplayer_rooms where id=$1",[privateRoom]),'cancelled');
    assert.equal(await scalar("select count(*)::int from multiplayer_players where room_id=$1",[privateRoom]),1);
    const r=await room();await join(r,users[18]);await join(r,users[17]);
    await db.query("update multiplayer_rooms set countdown_ends_at=clock_timestamp()-interval '1 second' where id=$1",[r]);
    await start(r,users[18]);
    await db.query("update multiplayer_players set score=123 where room_id=$1 and user_id=$2",[r,users[17]]);
    await db.query("delete from auth.users where id=$1",[users[18]]);
    assert.equal(await scalar("select status from multiplayer_rooms where id=$1",[r]),'in-progress');
    assert.equal(await scalar("select score from multiplayer_players where room_id=$1 and user_id=$2",[r,users[17]]),123);
    assert.equal(await scalar("select count(*)::int from multiplayer_match_questions where room_id=$1",[r]),5);
    await db.exec("delete from multiplayer_rooms");
  });
  await check("starts enforce locked settings version and difficulty; repeated start is idempotent; replacements use 90s",async()=>{
    const r=await room();await join(r,users[0]);await join(r,users[1]);
    const a=conn();await presence(r,users[0],a);await set(r,users[0],a,'3-5');
    await db.query("update multiplayer_rooms set countdown_ends_at=clock_timestamp()-interval '1 second' where id=$1",[r]);
    await assert.rejects(start(r,users[0],0,[3,4,5,3,4]),/settings changed/);
    await assert.rejects(start(r,users[0],1,[1,2,3,4,5]),/difficulty/);
    await assert.rejects(scalar("select start_multiplayer_lobby($1,$2,null,$3,$4)",[r,users[0],[1,2,3,4,5],[3,4,5,3,4]]),/settings changed/);
    assert.equal(await scalar("select count(*)::int from multiplayer_match_questions where room_id=$1",[r]),0);
    assert.equal((await start(r,users[1],1,[3,4,5,3,4])).status,'in-progress','public host cannot prevent an automatic due start');
    await start(r,users[0],1,[3,4,5,3,4]);
    assert.equal(await scalar("select count(*)::int from multiplayer_match_questions where room_id=$1",[r]),5);
    const replacement=await scalar("select to_jsonb(r) from multiplayer_rooms r where visibility='public' and status='waiting'");
    assert.equal(replacement.seconds_per_question,90);assert.equal(replacement.difficulty_band,'2-4');assert.equal(replacement.host_player_id,null);
    await assert.rejects(set(r,users[0],a,'1-3',1),/started/);
    await db.exec("delete from multiplayer_rooms");
  });
  await check("private room creation permits 180s and a band, retains single-host/rate checks and restricts start",async()=>{
    const create=(user,time,band,code='PRIVATEA')=>scalar("select create_private_multiplayer_room($1,$2,'unranked','Mu',5,$3,$4)",[user,code,time,band]);
    await assert.rejects(create(users[0],181,'1-3'),/check constraint/);
    await assert.rejects(create(users[0],180,'1-5'),/difficulty/);
    const r=await create(users[0],180,'1-3');const a=conn();await presence(r,users[0],a);
    assert.equal((await read(r,users[0])).room.seconds_per_question,180);
    await assert.rejects(create(users[0],90,'2-4','PRIVATEB'),/current room/);
    await db.query("insert into multiplayer_players(room_id,user_id) values($1,$2)",[r,users[1]]);
    await assert.rejects(start(r,users[1],0,[1,2,3,2,1]),/host/);
    await set(r,users[0],a,'3-5');
    await assert.rejects(start(r,users[0],0,[1,2,3,2,1]),/settings changed/);
    await start(r,users[0],1,[3,4,5,3,4]);
    await db.query("delete from multiplayer_rooms where id=$1",[r]);
  });
  await check("new and old RPC signatures remain blocked to browsers; internal host repair cannot be called by service role",async()=>{
    for(const signature of ['set_multiplayer_lobby_difficulty(uuid,uuid,text,text,bigint,uuid,uuid)',
      'start_multiplayer_lobby(uuid,uuid,text,integer[],integer[],bigint)',
      'create_private_multiplayer_room(uuid,text,text,text,integer,integer,text)',
      'start_multiplayer_lobby(uuid,uuid,text,integer[],integer[])','create_private_multiplayer_room(uuid,text,text,text,integer,integer)']) {
      for(const role of ['anon','authenticated'])assert.equal(await scalar("select has_function_privilege($1,$2,'EXECUTE')",[role,signature]),false);
      assert.equal(await scalar("select has_function_privilege('service_role',$1,'EXECUTE')",[signature]),true);
    }
    assert.equal(await scalar("select has_function_privilege('service_role','sync_public_multiplayer_host(uuid,uuid)','EXECUTE')"),false);
  });
  console.log(`PASS: ${checks} Stage 1 isolated database scenarios. Not a hosted concurrency test.`);
} catch (error) {
  console.error(error.message, error.where ?? "", error.position ? error.query?.slice(Number(error.position)-180,Number(error.position)+180) : "");
  process.exitCode=1;
} finally { await db.close(); }
