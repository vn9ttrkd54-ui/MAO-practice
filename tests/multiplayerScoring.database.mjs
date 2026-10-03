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
    "047_multiplayer_host_account_deletion", "049_multiplayer_room_lifecycle", "051_multiplayer_confirmed_lobby_transitions",
    "059_multiplayer_room_settings", "060_multiplayer_lobby_ready"]) await db.exec(await migration(name));

  const setup = async ({ duration=90, count=2, players=3 } = {}) => {
    const r = await scalar(`insert into multiplayer_rooms(code,visibility,mode,division,question_count,seconds_per_question,capacity)
      values($1,'private','unranked','Mu',$2,$3,30) returning id`, [randomUUID().slice(0,8).toUpperCase(),count,duration]);
    const ids=[];
    for(let i=0;i<players;i++) {
      const user=randomUUID();
      await db.query("insert into auth.users values($1)",[user]);
      await db.query("insert into profiles values($1,$2)",[user,`Player ${i}`]);
      ids.push(await scalar("insert into multiplayer_players(room_id,user_id) values($1,$2) returning id",[r,user]));
    }
    for(let q=1;q<=count;q++) await db.query(`insert into multiplayer_match_questions(room_id,question_number,question_id,difficulty,
      started_at,ends_at,hard_ends_at) values($1,$2,$3,3,
      case when $2=1 then clock_timestamp()-interval '10 seconds' end,
      case when $2=1 then clock_timestamp()+($4-10)*interval '1 second' end,
      case when $2=1 then clock_timestamp()+($4-5)*interval '1 second' end)`,[r,q,100+q,duration]);
    await db.query("update multiplayer_rooms set status='in-progress', started_at=clock_timestamp(), current_question_number=1 where id=$1",[r]);
    return {r,ids};
  };
  const accept=(r,p,choice,correct=false,q=101)=>scalar("select accept_multiplayer_answer($1,$2,$3,$4,$5)",[r,p,q,choice,correct]);
  const row=(r,p)=>scalar("select to_jsonb(s) from multiplayer_submissions s where room_id=$1 and player_id=$2 and question_number=1",[r,p]);
  const score=(r,p)=>scalar("select score from multiplayer_players where room_id=$1 and id=$2",[r,p]);
  const snapshot=(r,p)=>scalar("select read_multiplayer_snapshot($1,$2)",[r,p]);

  const old=await setup();
  await accept(old.r,old.ids[0],"B",true);
  const oldCompleted=await setup({count:1,players:1});
  await accept(oldCompleted.r,oldCompleted.ids[0],"A",true);
  await scalar("select finalize_multiplayer_match($1)",[oldCompleted.r]);
  const oldSubmission=await row(old.r,old.ids[0]);
  const oldRooms=(await db.query("select to_jsonb(r) row from multiplayer_rooms r order by id")).rows;
  const oldPlayers=(await db.query("select to_jsonb(p) row from multiplayer_players p order by id")).rows;
  const oldResults=(await db.query("select to_jsonb(m) row from multiplayer_match_results m order by player_id")).rows;
  const oldHistory=(await db.query("select to_jsonb(h) row from multiplayer_match_history h order by user_id")).rows;
  await db.exec(await migration("061_multiplayer_scoring_give_up"));
  await check("migration preserves existing rows and legacy room scoring",async()=>{
    assert.deepEqual((await db.query("select to_jsonb(r)-'scoring_version' row from multiplayer_rooms r order by id")).rows,oldRooms);
    assert.deepEqual((await db.query("select to_jsonb(p) row from multiplayer_players p order by id")).rows,oldPlayers);
    assert.deepEqual((await db.query("select to_jsonb(m) row from multiplayer_match_results m order by player_id")).rows,oldResults);
    assert.deepEqual((await db.query("select to_jsonb(h) row from multiplayer_match_history h order by user_id")).rows,oldHistory);
    const after=await row(old.r,old.ids[0]);delete after.scoring_version;assert.deepEqual(after,oldSubmission);
    assert.equal((await snapshot(old.r,old.ids[0])).scoringVersion,1);
    await accept(old.r,old.ids[1],"A",false);assert.equal(await score(old.r,old.ids[1]),0);
    await assert.rejects(accept(old.r,old.ids[2],null),/valid answer/);
  });
  await check("new rooms score correctness, speed and negative totals from the database clock",async()=>{
    for(const duration of [30,90,180]) {
      const {r,ids}=await setup({duration});
      assert.equal((await snapshot(r,ids[0])).scoringVersion,2);
      await accept(r,ids[0],"A",true);
      const s=await row(r,ids[0]);
      assert.equal(s.points_earned,1000+Math.round(500*(1-Math.min(s.answer_time_ms,duration*1000)/(duration*1000))));
      assert.equal(s.scoring_version,2);
      await accept(r,ids[1],"B",false);assert.equal(await score(r,ids[1]),-300);
      const receipt=await accept(r,ids[2],null);
      assert.deepEqual(receipt,{accepted:true,questionId:101,questionNumber:1,selectedAnswer:null});
      assert.equal(await score(r,ids[2]),0);
      assert.ok((await snapshot(r,ids[0])).upcoming,"everyone submitted, including Give up, finishes the round");
    }
  });
  await check("wrong answers cost exactly 300 at any time; transport grace has no speed bonus",async()=>{
    const {r,ids}=await setup();
    await accept(r,ids[0],"B");assert.equal(await score(r,ids[0]),-300);
    await db.query(`update multiplayer_match_questions set started_at=clock_timestamp()-interval '91 seconds',
      ends_at=clock_timestamp()+interval '3 seconds',hard_ends_at=clock_timestamp()+interval '3 seconds'
      where room_id=$1 and question_number=1`,[r]);
    await accept(r,ids[1],"B");assert.equal(await score(r,ids[1]),-300);
    await accept(r,ids[2],"A",true);assert.equal(await score(r,ids[2]),1000);
  });
  await check("retries cannot erase a wrong-answer penalty, replace Give up, or score twice",async()=>{
    const {r,ids}=await setup({count:1});
    await accept(r,ids[0],"B");await accept(r,ids[1],null);await accept(r,ids[2],"A",true);
    const before=(await db.query("select to_jsonb(s) row from multiplayer_submissions s where room_id=$1 order by player_id",[r])).rows;
    for(let i=0;i<4;i++) { await accept(r,ids[0],null);await accept(r,ids[1],"A",true); }
    assert.equal(await score(r,ids[0]),-300);assert.equal(await score(r,ids[1]),0);
    assert.deepEqual((await db.query("select to_jsonb(s) row from multiplayer_submissions s where room_id=$1 order by player_id",[r])).rows,before);
  });
  await check("Give up does not end the round while someone is still working; timeout blanks earn zero",async()=>{
    const {r,ids}=await setup({count:1,players:2});
    const deadline=await scalar("select ends_at from multiplayer_match_questions where room_id=$1",[r]);
    await accept(r,ids[0],null);
    assert.equal(await scalar("select status from multiplayer_rooms where id=$1",[r]),"in-progress");
    assert.deepEqual(await scalar("select ends_at from multiplayer_match_questions where room_id=$1",[r]),deadline);
    await db.query(`update multiplayer_match_questions set started_at=clock_timestamp()-interval '100 seconds',
      ends_at=clock_timestamp()-interval '10 seconds',hard_ends_at=clock_timestamp()-interval '5 seconds' where room_id=$1`,[r]);
    await scalar("select advance_multiplayer_round_state($1)",[r]);
    assert.equal(await score(r,ids[1]),0);
    assert.equal(await scalar("select count(*)::int from multiplayer_submissions where room_id=$1 and player_id=$2",[r,ids[1]]),0);
    await scalar("select finalize_multiplayer_match($1)",[r]);
    assert.deepEqual((await db.query("select final_score from multiplayer_match_history where room_id=$1",[r])).rows,[{final_score:0},{final_score:0}]);
  });
  await check("negative scores finalize, archive and rank below blanks; finalization remains idempotent",async()=>{
    const {r,ids}=await setup({count:1});
    await accept(r,ids[0],"B");await accept(r,ids[1],"C");await accept(r,ids[2],null);
    await scalar("select finalize_multiplayer_match($1)",[r]);
    const before=(await db.query("select to_jsonb(m) row from multiplayer_match_results m where room_id=$1 order by player_id",[r])).rows;
    assert.deepEqual((await db.query("select final_score from multiplayer_match_history where room_id=$1 order by final_score",[r])).rows,
      [{final_score:-300},{final_score:-300},{final_score:0}]);
    assert.equal(await scalar("select placement from multiplayer_match_results where room_id=$1 and player_id=$2",[r,ids[2]]),1);
    await scalar("select finalize_multiplayer_match($1)",[r]);
    assert.deepEqual((await db.query("select to_jsonb(m) row from multiplayer_match_results m where room_id=$1 order by player_id",[r])).rows,before);
  });
  await check("ranked negative totals retain bounded ratings and ignore wrong-answer speed in ties",async()=>{
    const {r,ids}=await setup({count:5,players:2});
    await db.query("update multiplayer_rooms set mode='ranked' where id=$1",[r]);
    // A completed five-round fixture; use the atomic scoring RPC for every answer.
    for(let q=1;q<=5;q++) {
      await db.query(`update multiplayer_match_questions set started_at=clock_timestamp()-interval '10 seconds',
        ends_at=clock_timestamp()+interval '80 seconds',hard_ends_at=clock_timestamp()+interval '85 seconds'
        where room_id=$1 and question_number=$2`,[r,q]);
      await db.query("update multiplayer_rooms set current_question_number=$2 where id=$1",[r,q]);
      for(const id of ids)await accept(r,id,"B",false,100+q);
    }
    await scalar("select finalize_multiplayer_match($1)",[r]);
    const results=(await db.query("select final_score,rp_change,new_rp,performance_index from multiplayer_match_results where room_id=$1",[r])).rows;
    assert.equal(results.length,2);
    for(const result of results) {
      assert.equal(result.final_score,-1500);assert.equal(result.rp_change,0);
      assert.equal(result.new_rp,0);assert.equal(Number(result.performance_index),0);
    }
    assert.equal(await scalar("select count(*)::int from multiplayer_match_history where room_id=$1 and final_score=-1500",[r]),2);
  });
  await check("database constraints reject impossible Give up and scoring combinations",async()=>{
    const {r,ids}=await setup();
    const insert=(answer,correct,points,version)=>db.query(`insert into multiplayer_submissions
      (room_id,player_id,question_number,question_id,selected_answer,correct,points_earned,answer_time_ms,scoring_version)
      values($1,$2,1,101,$3,$4,$5,1000,$6)`,[r,ids[0],answer,correct,points,version]);
    for(const values of [[null,true,1500,2],[null,false,-300,2],[null,false,0,1],["A",false,0,2],["A",false,-300,1],["A",true,1501,2]])
      await assert.rejects(insert(...values),/check constraint/);
    assert.equal(await scalar("select count(*)::int from multiplayer_submissions where room_id=$1",[r]),0);
  });
  await check("a failed score write rolls back the submission, including Give up",async()=>{
    const {r,ids}=await setup();
    await db.exec(`create function reject_stage_three_score() returns trigger language plpgsql as $$
      begin raise exception 'Injected failure'; end; $$;
      create trigger reject_stage_three before update on multiplayer_players for each row execute function reject_stage_three_score();`);
    for(const choice of ["B",null]) await assert.rejects(accept(r,ids[0],choice),/Injected failure/);
    assert.equal(await score(r,ids[0]),0);
    assert.equal(await scalar("select count(*)::int from multiplayer_submissions where room_id=$1",[r]),0);
    await db.exec("drop trigger reject_stage_three on multiplayer_players");
  });
  await check("Give up retains membership, validation, future and expired deadline guards",async()=>{
    const {r,ids}=await setup();
    await assert.rejects(accept(r,randomUUID(),null),/not in this room/);
    for(const [choice,correct] of [[null,true],[null,null],["X",false]])await assert.rejects(accept(r,ids[0],choice,correct),/valid answer/);
    await db.query("update multiplayer_match_questions set started_at=clock_timestamp()+interval '10 seconds' where room_id=$1 and question_number=1",[r]);
    await assert.rejects(accept(r,ids[0],null),/not started/);
    await db.query(`update multiplayer_match_questions set started_at=clock_timestamp()-interval '100 seconds',
      ends_at=clock_timestamp()-interval '10 seconds',hard_ends_at=clock_timestamp()-interval '5 seconds' where room_id=$1 and question_number=1`,[r]);
    await assert.rejects(accept(r,ids[0],null),/closed|expired/);
    assert.equal(await score(r,ids[0]),0);
  });
  await check("no browser execution or table write privileges are added",async()=>{
    for(const signature of ["accept_multiplayer_answer(uuid,uuid,integer,text,boolean)","read_multiplayer_snapshot(uuid,uuid,bigint)","finalize_multiplayer_match(uuid)"]) {
      for(const role of ["anon","authenticated"])assert.equal(await scalar("select has_function_privilege($1,$2,'EXECUTE')",[role,signature]),false);
      assert.equal(await scalar("select has_function_privilege('service_role',$1,'EXECUTE')",[signature]),true);
    }
    for(const role of ["anon","authenticated"])assert.equal(await scalar("select has_column_privilege($1,'multiplayer_rooms','scoring_version','UPDATE')",[role]),false);
  });
  await check("documented structural verification returns all true",async()=>{
    const doc=await readFile(new URL("../docs/multiplayer-scoring-stage-3.md",import.meta.url),"utf8");
    const sql=doc.split("```sql\n")[1].split("```")[0];
    const result=(await db.query(sql)).rows[0];
    assert.equal(Object.keys(result).length,4);
    assert.ok(Object.values(result).every(value=>value===true));
  });
  console.log(`PASS: ${checks} Stage 3 database checks. Isolated tests are not a 200-player hosted load test.`);
} finally { await db.close(); }
