// Runs actual application migrations in isolated PostgreSQL, without live credentials.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
const migration = async (name) => readFile(new URL(`../supabase/migrations/${name}.sql`, import.meta.url), "utf8");
try {
  await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role;
    create schema auth; create table auth.users(id uuid primary key);
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
    "026_multiplayer_request_storm_control", "027_multiplayer_transition_recovery",
    "028_fix_multiplayer_state_trigger", "029_preload_multiplayer_questions", "030_confirm_preloaded_round_before_reveal",
    "031_multiplayer_atomic_submissions", "032_multiplayer_atomic_finalization", "033_multiplayer_event_snapshots",
    "034_multiplayer_database_worker"]) await db.exec(await migration(name));
  const room = "00000000-0000-0000-0000-000000000001";
  const player = "00000000-0000-0000-0000-000000000002";
  await db.query(`insert into multiplayer_rooms(id,code,visibility,mode,division,question_count,seconds_per_question,status,capacity,started_at,current_question_number)
    values($1,'TESTROOM','private','unranked','Mu',2,60,'in-progress',30,clock_timestamp(),1)`, [room]);
  await db.query("insert into multiplayer_players(id,room_id,guest_nickname,reconnect_token_hash) values($1,$2,'Tester','secret')",[player,room]);
  await db.query(`insert into multiplayer_match_questions(room_id,question_number,question_id,difficulty,started_at,ends_at,hard_ends_at)
    values($1,1,42,2,clock_timestamp()-interval '1 second',clock_timestamp()+interval '59 seconds',clock_timestamp()+interval '64 seconds'),
    ($1,2,43,2,null,null,null)`,[room]);
  const accept = (id) => db.query("select accept_multiplayer_answer($1,$2,$3,'A',true)",[room,player,id]);
  await accept(42);
  let snapshot=(await db.query("select read_multiplayer_snapshot($1,$2) as s",[room,player])).rows[0].s;
  assert.ok(snapshot.upcoming.started_at);
  assert.equal(snapshot.question.question_number,1);
  assert.equal(new Date(snapshot.upcoming.started_at).getTime(),new Date(snapshot.question.intermission_ends_at).getTime());
  const savedVersion=snapshot.stateVersion;
  assert.equal((await db.query("select read_multiplayer_snapshot($1,$2,$3) as s",[room,player,savedVersion])).rows[0].s.unchanged,true);
  assert.ok(!JSON.stringify(snapshot).includes('secret'));
  assert.equal((await db.query("select advance_multiplayer_round_state($1) as state",[room])).rows[0].state,'intermission');
  // Simulate the scheduled reveal before the periodic worker runs.
  await db.query("update multiplayer_match_questions set intermission_ends_at=clock_timestamp()-interval '1 second' where room_id=$1 and question_number=1",[room]);
  await db.query("update multiplayer_match_questions set started_at=clock_timestamp()-interval '1 second' where room_id=$1 and question_number=2",[room]);
  await accept(43);
  await db.exec("select tick_multiplayer_rooms()");
  assert.equal((await db.query("select count(*)::int n from multiplayer_match_results where room_id=$1",[room])).rows[0].n,1);
  const score=(await db.query("select score from multiplayer_players where id=$1",[player])).rows[0].score;
  await accept(42);
  await db.exec("select tick_multiplayer_rooms()");
  assert.equal((await db.query("select score from multiplayer_players where id=$1",[player])).rows[0].score,score);
  assert.ok((await db.query("select payload from realtime.test_events")).rows.some(({payload})=>payload.kind==='results_ready'));

  // No browser and no submissions: the scheduled worker still ends a timed-out match.
  const abandoned='00000000-0000-0000-0000-000000000020';
  await db.query(`insert into multiplayer_rooms(id,code,visibility,mode,division,question_count,seconds_per_question,status,capacity,started_at,current_question_number)
    values($1,'IDLER0OM','private','unranked','Mu',1,60,'in-progress',30,clock_timestamp(),1)`,[abandoned]);
  await db.query(`insert into multiplayer_players(room_id,guest_nickname,reconnect_token_hash) values($1,'IdlePlayer','other-secret')`,[abandoned]);
  await db.query(`insert into multiplayer_match_questions(room_id,question_number,question_id,difficulty,started_at,ends_at,hard_ends_at)
    values($1,1,77,1,clock_timestamp()-interval '61 seconds',clock_timestamp()-interval '1 second',clock_timestamp()-interval '1 second')`,[abandoned]);
  await db.exec("select tick_multiplayer_rooms()");
  assert.ok((await db.query("select results_finalized_at from multiplayer_rooms where id=$1",[abandoned])).rows[0].results_finalized_at);

  // Two signed players: finalization failure must roll back both results and ratings.
  const rankedRoom='00000000-0000-0000-0000-000000000010';
  const users=['00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000012'];
  await db.query(`insert into multiplayer_rooms(id,code,visibility,mode,division,question_count,seconds_per_question,status,capacity,started_at,completed_at,current_question_number)
    values($1,'RANKROOM','private','ranked','Mu',5,60,'completed',30,clock_timestamp(),clock_timestamp(),5)`,[rankedRoom]);
  for (const user of users) {
    await db.query("insert into auth.users values($1)",[user]);
    await db.query("insert into multiplayer_profiles(user_id,rp) values($1,1000)",[user]);
    await db.query("insert into multiplayer_players(id,room_id,user_id) values($1,$2,$1)",[user,rankedRoom]);
  }
  await db.query(`insert into multiplayer_match_questions(room_id,question_number,question_id,difficulty,started_at,ends_at)
    select $1,n,100+n,1,clock_timestamp(),clock_timestamp() from generate_series(1,5) n`,[rankedRoom]);
  await db.exec(`create function reject_rating() returns trigger language plpgsql as $$begin raise exception 'rating failure'; end;$$;
    create trigger reject_rating before update on multiplayer_profiles for each row execute function reject_rating();`);
  await assert.rejects(db.query("select finalize_multiplayer_match($1)",[rankedRoom]),/rating failure/);
  assert.equal((await db.query("select count(*)::int n from multiplayer_match_results where room_id=$1",[rankedRoom])).rows[0].n,0);
  await db.exec("select tick_multiplayer_rooms()");
  assert.equal((await db.query("select count(*)::int n from multiplayer_worker_errors where room_id=$1",[rankedRoom])).rows[0].n,1);
  await db.exec("drop trigger reject_rating on multiplayer_profiles; update multiplayer_worker_errors set updated_at=clock_timestamp()-interval '11 seconds'; select tick_multiplayer_rooms(); select tick_multiplayer_rooms();");
  const profiles=(await db.query("select rp,ranked_matches_played from multiplayer_profiles order by user_id")).rows;
  assert.deepEqual(profiles,[{rp:1016,ranked_matches_played:1},{rp:994,ranked_matches_played:1}]);
  assert.equal((await db.query("select count(*)::int n from multiplayer_worker_errors")).rows[0].n,0);
  for (const signature of ['read_multiplayer_snapshot(uuid,uuid,bigint)','tick_multiplayer_rooms()','finalize_multiplayer_match(uuid)']) {
    assert.equal((await db.query("select has_function_privilege('anon',$1,'EXECUTE') allowed",[signature])).rows[0].allowed,false);
  }
  await db.exec(await migration("036_multiplayer_readiness_countdown"));
  const readyRoom='00000000-0000-0000-0000-000000000030';
  const readyPlayers=['00000000-0000-0000-0000-000000000031','00000000-0000-0000-0000-000000000032'];
  await db.query(`insert into multiplayer_rooms(id,code,visibility,mode,division,question_count,seconds_per_question,status,capacity,started_at,current_question_number)
    values($1,'READYROM','private','unranked','Alpha',2,60,'in-progress',30,clock_timestamp(),1)`,[readyRoom]);
  for (const id of readyPlayers) await db.query("insert into multiplayer_players(id,room_id,guest_nickname,reconnect_token_hash) values($1,$2,$3,$4)",[id,readyRoom,"Ready "+id.slice(-2),id]);
  await db.query(`insert into multiplayer_match_questions(room_id,question_number,question_id,difficulty,preparation_deadline_at)
    values($1,1,301,2,clock_timestamp()+interval '15 seconds'),($1,2,302,2,null)`,[readyRoom]);
  const ready = (player,q) => db.query("select acknowledge_multiplayer_question_ready($1,$2,$3)",[readyRoom,player,q]);
  const snap = async () => (await db.query("select read_multiplayer_snapshot($1,$2) s",[readyRoom,readyPlayers[0]])).rows[0].s;
  const answerReady = (player,q) => db.query("select accept_multiplayer_answer($1,$2,$3,'A',true)",[readyRoom,player,q]);
  const initialVersion=(await snap()).stateVersion;
  await ready(readyPlayers[0],1);
  assert.equal((await snap()).question.started_at,null);
  assert.equal((await snap()).stateVersion,initialVersion,"readiness alone must not broadcast");
  await assert.rejects(ready(readyPlayers[0],2),/not preparing/);
  await assert.rejects(ready(player,1),/not in an active room/);
  await assert.rejects(answerReady(readyPlayers[0],301),/closed/);
  await ready(readyPlayers[1],1);
  let s=await snap();
  const scheduled=s.question.started_at;
  const lead=new Date(scheduled).getTime()-Date.now();
  assert.ok(lead>14500 && lead<=15500,"first countdown gets 5s announcement + 10s");
  await ready(readyPlayers[0],1);
  assert.equal((await snap()).question.started_at,scheduled,"retry cannot restart countdown");
  await assert.rejects(answerReady(readyPlayers[0],301),/not started/);
  await db.query("update multiplayer_match_questions set started_at=clock_timestamp()-interval '1 second' where room_id=$1 and question_number=1",[readyRoom]);
  await answerReady(readyPlayers[0],301);
  await answerReady(readyPlayers[1],301);
  s=await snap();
  assert.ok(s.question.round_finished_at);
  assert.equal(s.question.intermission_ends_at,null);
  assert.equal(s.upcoming.started_at,null);
  assert.ok(s.upcoming.preparation_deadline_at);
  await ready(readyPlayers[0],2);
  assert.equal((await snap()).upcoming.started_at,null);
  // A missing player's acknowledgement must not hold the room forever.
  await db.query("update multiplayer_match_questions set preparation_deadline_at=clock_timestamp()-interval '1 second' where room_id=$1 and question_number=2",[readyRoom]);
  await db.exec("select tick_multiplayer_rooms()");
  s=await snap();
  assert.equal(s.upcoming.started_at,s.question.intermission_ends_at);
  const laterLead=new Date(s.upcoming.started_at).getTime()-Date.now();
  assert.ok(laterLead>9500 && laterLead<=10500,"later countdown gets 5s announcement + 5s");
  await assert.rejects(answerReady(readyPlayers[0],302),/closed/);
  await db.query("update multiplayer_match_questions set intermission_ends_at=clock_timestamp()-interval '1 second' where room_id=$1 and question_number=1",[readyRoom]);
  await db.query("update multiplayer_match_questions set started_at=clock_timestamp()-interval '1 second' where room_id=$1 and question_number=2",[readyRoom]);
  await answerReady(readyPlayers[0],302);
  await answerReady(readyPlayers[1],302);
  await db.exec("select tick_multiplayer_rooms()");
  assert.equal((await db.query("select count(*)::int n from multiplayer_match_results where room_id=$1",[readyRoom])).rows[0].n,2);
  assert.equal((await db.query("select count(*)::int n from multiplayer_worker_errors")).rows[0].n,0);
  for (const signature of ['schedule_ready_multiplayer_question(uuid,integer)','acknowledge_multiplayer_question_ready(uuid,uuid,integer)']) {
    assert.equal((await db.query("select has_function_privilege('anon',$1,'EXECUTE') allowed",[signature])).rows[0].allowed,false);
  }
await db.exec(await migration("037_multiplayer_balanced_rp"));
  let fixtureNumber = 100;
  async function ratedMatch(entries, count = 5, mode = 'ranked') {
    const uid = () => '00000000-0000-0000-0000-' + String(++fixtureNumber).padStart(12,'0');
    const id = uid();
    await db.query(`insert into multiplayer_rooms(id,code,visibility,mode,division,question_count,seconds_per_question,status,capacity,started_at,completed_at,current_question_number)
      values($1,$2,'private',$3,'Mu',$4,60,'completed',30,clock_timestamp(),clock_timestamp(),$4)`,
      [id, 'T'+String(fixtureNumber).padStart(7,'0'), mode, count]);
    await db.query(`insert into multiplayer_match_questions(room_id,question_number,question_id,difficulty,started_at,ends_at)
      select $1,n,1000+n,1,clock_timestamp(),clock_timestamp() from generate_series(1,$2::int) n`,[id,count]);
    for (const entry of entries) {
      entry.id = uid();
      if (!entry.guest) {
        await db.query("insert into auth.users values($1)",[entry.id]);
        await db.query("insert into multiplayer_profiles(user_id,rp) values($1,$2)",[entry.id,entry.rp]);
      }
      await db.query(`insert into multiplayer_players(id,room_id,user_id,guest_nickname,reconnect_token_hash,score)
        values($1,$2,$3,$4,$5,$6)`,[entry.id,id,entry.guest?null:entry.id,entry.guest?'Guest'+fixtureNumber:null,entry.guest?entry.id:null,entry.score]);
      if (entry.score > 0) {
        await db.query(`insert into multiplayer_submissions(room_id,player_id,question_number,question_id,selected_answer,correct,answer_time_ms,points_earned)
          select $1,$2,n,1000+n,'A',n<=3,$3,case when n<=3 then 1000 else 0 end from generate_series(1,$4::int) n`,[id,entry.id,entry.time??1000,count]);
      }
    }
    await db.query("select finalize_multiplayer_match($1)",[id]);
    const rows = (await db.query("select * from multiplayer_match_results where room_id=$1 order by final_score desc,player_id",[id])).rows;
    const before = (await db.query("select rp,ranked_matches_played,ranked_wins from multiplayer_profiles order by user_id")).rows;
    await db.query("select finalize_multiplayer_match($1)",[id]);
    assert.deepEqual((await db.query("select rp,ranked_matches_played,ranked_wins from multiplayer_profiles order by user_id")).rows,before);
    return rows;
  }
  const equal = await ratedMatch([{rp:1000,score:5000},{rp:1000,score:4000}]);
  assert.deepEqual(equal.map(r=>r.rp_change),[20,-12]);
  const favored = await ratedMatch([{rp:1400,score:5000},{rp:1000,score:4000}]);
  assert.ok(favored[0].rp_change>0 && favored[0].rp_change<=4);
  const upset = await ratedMatch([{rp:1000,score:5000},{rp:1400,score:4000}]);
  assert.ok(upset[0].rp_change>equal[0].rp_change);
  assert.ok(upset[1].rp_change<equal[1].rp_change);
  const floor = await ratedMatch([{rp:0,score:5000},{rp:0,score:4000}]);
  assert.equal(floor[1].rp_change,0);
  assert.ok(floor.every(r=>r.new_rp-r.previous_rp===r.rp_change));
  const zero = await ratedMatch([{rp:1000,score:0},{rp:500,score:0}]);
  assert.ok(zero.every(r=>r.rp_change===0));
  for (const row of zero) assert.equal((await db.query("select ranked_wins from multiplayer_profiles where user_id=$1",[row.user_id])).rows[0].ranked_wins,0);
  const tied = await ratedMatch([{rp:1000,score:5000},{rp:500,score:5000}]);
  assert.ok(tied.every(r=>r.rp_change===0));
  for (const row of tied) assert.equal((await db.query("select ranked_wins from multiplayer_profiles where user_id=$1",[row.user_id])).rows[0].ranked_wins,0);
  const guests = await ratedMatch([{rp:1000,score:5000},{guest:true,score:4000}]);
  assert.ok(guests.every(r=>!r.ranked && r.rp_change===null));
  const mixed = await ratedMatch([{guest:true,score:7000},{rp:1000,score:5000},{rp:1000,score:4000},{guest:true,score:0}]);
  assert.deepEqual(mixed.filter(r=>r.user_id).map(r=>r.rp_change),[20,-12]);
  assert.ok(mixed.filter(r=>!r.user_id).every(r=>r.rp_change===null));
  const casual = await ratedMatch([{rp:1000,score:5000},{rp:1000,score:4000}],5,'unranked');
  assert.ok(casual.every(r=>r.rp_change===null));
  console.log('PASS: RP +20/-12, stronger/weaker opponents, floor, zero-score and exact ties, guests, unranked games, and idempotence.');
  console.log('PASS: migrations, snapshots, finalization, rollback, readiness barrier, shared 10/5s schedules, timeout, duplicate readiness, early-answer rejection, and permissions.');
} catch (error) {
  console.error(error.message, error.where ?? "", error.detail ?? "");
  process.exitCode = 1;
} finally { await db.close(); }
