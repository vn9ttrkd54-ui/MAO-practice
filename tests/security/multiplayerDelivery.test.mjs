// Isolated security regression: no network, credentials, or persistent database.
// Supply PGLITE_MODULE_PATH pointing to an already installed PGlite module.
// Run after installing migrations through 040 in the in-memory fixture below.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";

test("delaying a client delivery acknowledgment must not improve speed scoring", async () => {
  assert.ok(process.env.PGLITE_MODULE_PATH, "Set PGLITE_MODULE_PATH to the local PGlite dist/index.js");
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const migration = (name) => readFile(new URL(`../../supabase/migrations/${name}.sql`, import.meta.url), "utf8");
  try {
    // Auth and Realtime are local stubs, matching the existing architecture harness.
    // This test does not claim to exercise hosted RLS or multi-connection concurrency.
    await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role;
      create schema auth; create table auth.users(id uuid primary key);
      create table public.profiles(id uuid primary key, username text);
      create function public.set_updated_at() returns trigger language plpgsql as
        $$begin new.updated_at=clock_timestamp(); return new; end;$$;
      create schema realtime; create table realtime.test_events(payload jsonb);
      create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language sql as
        $$insert into realtime.test_events values(payload)$$;`);
    const schema = await migration("009_multiplayer_pack_m2_schema");
    await db.exec(schema.slice(0, schema.indexOf("-- Row Level Security")) + "\ncommit;");
    await db.exec("alter table multiplayer_spectators add column last_seen_at timestamptz default clock_timestamp()");
    for (const name of [
      "022_multiplayer_realtime_foundation", "023_multiplayer_realtime_signal_filter",
      "024_multiplayer_atomic_round_transitions", "025_fix_multiplayer_transition_timestamp",
      "026_multiplayer_request_storm_control", "027_multiplayer_transition_recovery",
      "028_fix_multiplayer_state_trigger", "029_preload_multiplayer_questions",
      "030_confirm_preloaded_round_before_reveal", "031_multiplayer_atomic_submissions",
      "032_multiplayer_atomic_finalization", "033_multiplayer_event_snapshots",
      "034_multiplayer_database_worker", "036_multiplayer_readiness_countdown",
      "037_multiplayer_balanced_rp",
      "040_multiplayer_authoritative_scoring_clock",
    ]) await db.exec(await migration(name));

    // Migration 035 installs the hosted pg_cron job only, not application functions.
    // 038/039 concern daily challenges/admin directory, not this scoring path.
    for (const role of ["anon", "authenticated"]) {
      const permission = await db.query("select has_function_privilege($1,$2,'EXECUTE') allowed", [
        role, "public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean)",
      ]);
      assert.equal(permission.rows[0].allowed, false, "clients must not call the scoring function directly");
    }
    assert.equal((await db.query("select has_function_privilege('service_role',$1,'EXECUTE') allowed", [
      "public.accept_multiplayer_answer(uuid,uuid,integer,text,boolean)",
    ])).rows[0].allowed, true);
    const room = "00000000-0000-0000-0000-000000000801";
    const honest = "00000000-0000-0000-0000-000000000802";
    const delayed = "00000000-0000-0000-0000-000000000803";
    const idle = "00000000-0000-0000-0000-000000000804";
    const noReceipt = "00000000-0000-0000-0000-000000000805";
    await db.query(`insert into multiplayer_rooms
      (id,code,visibility,mode,division,question_count,seconds_per_question,status,capacity,created_at,started_at,current_question_number)
      values($1,'AUDIT801','private','unranked','Mu',1,60,'in-progress',30,
        clock_timestamp()-interval '30 seconds',clock_timestamp()-interval '20 seconds',1)`, [room]);
    for (const [id, nickname] of [[honest, "Honest"], [delayed, "Delayed"], [idle, "Idle"], [noReceipt, "NoReceipt"]]) {
      await db.query(`insert into multiplayer_players(id,room_id,guest_nickname,reconnect_token_hash)
        values($1,$2,$3,$4)`, [id, room, nickname, `fixture-${nickname}`]);
    }
    await db.query(`insert into multiplayer_match_questions
      (room_id,question_number,question_id,difficulty,started_at,ends_at,hard_ends_at)
      values($1,1,42,2,clock_timestamp()-interval '20 seconds',
        clock_timestamp()+interval '40 seconds',clock_timestamp()+interval '45 seconds')`, [room]);
    // Same question has been available for twenty seconds to both players.
    // The honest client acknowledged at reveal; the other waits until just before answering.
    await db.query(`insert into multiplayer_question_deliveries(room_id,question_number,player_id,delivered_at)
      select room_id,question_number,$2,started_at from multiplayer_match_questions where room_id=$1`, [room, honest]);
    const firstReceipt = await db.query("select acknowledge_multiplayer_question_delivery($1,1,$2) receipt", [room, delayed]);
    const repeatedReceipt = await db.query("select acknowledge_multiplayer_question_delivery($1,1,$2) receipt", [room, delayed]);
    assert.deepEqual(repeatedReceipt.rows, firstReceipt.rows, "reconnects cannot replace first receipt time");
    for (const id of [honest, delayed, noReceipt]) {
      const accepted = await db.query("select accept_multiplayer_answer($1,$2,42,'A',true) receipt", [room, id]);
      assert.deepEqual(accepted.rows[0].receipt, {
        accepted: true, questionId: 42, questionNumber: 1, selectedAnswer: "A",
      }, "acceptance must not leak correctness or points");
    }
    const { rows } = await db.query(`select player_id,answer_time_ms,points_earned
      from multiplayer_submissions where room_id=$1 order by submitted_at`, [room]);
    const first = rows.find((row) => row.player_id === honest);
    const second = rows.find((row) => row.player_id === delayed);
    console.log("Isolated scoring observations:", { honest: first, delayedAcknowledgment: second });
    assert.ok(first.answer_time_ms >= 19_000, "fixture must expose twenty seconds of solving time");
    assert.ok(second.answer_time_ms >= first.answer_time_ms,
      "SEC-02: delaying the acknowledgment must not improve stored time or tie-breaks");
    assert.ok(second.points_earned <= first.points_earned,
      "SEC-02: delaying the acknowledgment incorrectly awards more points than the earlier honest answer");
    const third = rows.find((row) => row.player_id === noReceipt);
    assert.ok(third.answer_time_ms >= second.answer_time_ms);
    assert.ok(third.points_earned <= second.points_earned, "omitting ACK cannot improve points");
    await db.query("select accept_multiplayer_answer($1,$2,42,'B',false)", [room, delayed]);
    assert.deepEqual((await db.query(`select player_id,answer_time_ms,points_earned
      from multiplayer_submissions where room_id=$1 order by submitted_at`, [room])).rows, rows,
    "retry with another choice must not alter scores, times, or answers");
    assert.equal((await db.query("select selected_answer from multiplayer_submissions where player_id=$1", [delayed])).rows[0].selected_answer, "A");
    assert.equal((await db.query("select score from multiplayer_players where id=$1", [delayed])).rows[0].score, second.points_earned);

    // Both normal and deliberately delayed clients get the SAME existing grace.
    // It is transport tolerance, never speed credit or extra displayed time.
    const graceRoom = "00000000-0000-0000-0000-000000000811";
    await db.query(`insert into multiplayer_rooms
      (id,code,visibility,mode,division,question_count,seconds_per_question,status,capacity,current_question_number,created_at,started_at)
      values($1,'GRACE811','private','unranked','Mu',1,60,'in-progress',30,1,
        clock_timestamp()-interval '90 seconds',clock_timestamp()-interval '80 seconds')`, [graceRoom]);
    const gracePlayers = [812, 813, 814, 815].map((n) => `00000000-0000-0000-0000-${String(n).padStart(12, "0")}`);
    for (const id of gracePlayers) await db.query(`insert into multiplayer_players
      (id,room_id,guest_nickname,reconnect_token_hash) values($1,$2,$3,$3)`, [id, graceRoom, `Grace${id.slice(-3)}`]);
    await db.query(`insert into multiplayer_match_questions
      (room_id,question_number,question_id,difficulty,started_at,ends_at,hard_ends_at)
      values($1,1,43,2,clock_timestamp()-interval '61 seconds',
        clock_timestamp()+interval '4 seconds',clock_timestamp()+interval '4 seconds')`, [graceRoom]);
    await db.query("select acknowledge_multiplayer_question_delivery($1,1,$2)", [graceRoom, gracePlayers[1]]);
    await db.query(`insert into multiplayer_question_deliveries(room_id,question_number,player_id,delivered_at)
      select room_id,question_number,$2,started_at from multiplayer_match_questions where room_id=$1`, [graceRoom, gracePlayers[2]]);
    for (const id of gracePlayers.slice(0, 3)) {
      await db.query("select accept_multiplayer_answer($1,$2,43,'A',true)", [graceRoom, id]);
    }
    const graceRows = (await db.query(`select answer_time_ms,points_earned from multiplayer_submissions
      where room_id=$1 order by submitted_at`, [graceRoom])).rows;
    assert.equal(graceRows.length, 3, "missing, delayed and prompt receipts must share grace");
    assert.deepEqual(graceRows.map((row) => row.points_earned), [1030, 1029, 1028], "no speed bonus during grace");
    assert.ok(graceRows.every((row) => row.answer_time_ms >= 60_000));
    await db.query(`update multiplayer_match_questions set
      started_at=clock_timestamp()-interval '70 seconds', ends_at=clock_timestamp()-interval '5 seconds',
      hard_ends_at=clock_timestamp()-interval '5 seconds' where room_id=$1`, [graceRoom]);
    // Worker intentionally never ticks: the RPC must still reject after hard end.
    await assert.rejects(db.query("select accept_multiplayer_answer($1,$2,43,'A',true)", [graceRoom, gracePlayers[3]]), /closed|expired/);
    assert.equal((await db.query("select count(*)::int n from multiplayer_submissions where player_id=$1", [gracePlayers[3]])).rows[0].n, 0);
    // A valid retry remains recoverable even after the deadline.
    assert.equal((await db.query("select accept_multiplayer_answer($1,$2,43,'B',false) receipt", [graceRoom, gracePlayers[0]])).rows[0].receipt.selectedAnswer, "A");

    // Preloading a future question (even with a forged-looking receipt) cannot reveal it early.
    await db.query(`update multiplayer_match_questions set started_at=clock_timestamp()+interval '10 seconds',
      ends_at=clock_timestamp()+interval '75 seconds',hard_ends_at=clock_timestamp()+interval '75 seconds' where room_id=$1`, [room]);
    await db.query("select acknowledge_multiplayer_question_delivery($1,1,$2)", [room, idle]);
    await assert.rejects(db.query("select accept_multiplayer_answer($1,$2,42,'A',true)", [room, idle]), /not started/);
  } finally {
    await db.close();
  }
});
