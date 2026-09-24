// Actual application SQL, isolated from hosted users. Auth claims and Realtime are
// fixtures; this does not validate hosted JWT verification, cron or subscriptions.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

test('database account authorization matrix', async (t) => {
  assert.ok(process.env.PGLITE_MODULE_PATH, 'Set PGLITE_MODULE_PATH');
  const { PGlite } = await import(pathToFileURL(process.env.PGLITE_MODULE_PATH).href);
  const db = new PGlite();
  const uid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
  const scalar = async (sql, args = []) => Object.values((await db.query(sql, args)).rows[0])[0];
  const asUser = async (n, work) => {
    const role = n ? 'authenticated' : 'anon';
    await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)", [n ? uid(n) : '', role]);
    await db.exec(`set role ${role}`);
    try { return await work(); } finally { await db.exec('reset role'); }
  };
  try {
    await db.exec(`set timezone='UTC'; create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth;
      create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb not null default '{}');
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create function auth.role() returns text language sql stable as $$ select current_setting('request.jwt.claim.role',true) $$;
      grant usage on schema auth to anon,authenticated,service_role;
      create publication supabase_realtime;
      create schema realtime;
      create function realtime.send(payload jsonb,event text,topic text,private boolean) returns void language plpgsql as $$ begin return; end $$;`);
    const directory = new URL('../../supabase/migrations/', import.meta.url);
    for (const name of (await readdir(directory)).filter(n => n.endsWith('.sql')).sort()) {
      if (name.startsWith('035_') || name.startsWith('050_')) continue; // Hosted pg_cron only.
      try { await db.exec(await readFile(new URL(name, directory), 'utf8')); }
      catch (error) { throw new Error(`Migration ${name}: ${error.message}`, { cause: error }); }
    }
    for (let n = 1; n <= 4; n++) await db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2)', [uid(n), { username: `fixture_${n}`, role: 'owner', is_admin: true }]);
    await t.test('signup metadata cannot assign privileged roles', async () => {
      assert.deepEqual((await db.query('select distinct role from profiles')).rows, [{ role: 'user' }]);
    });
    await db.exec("select set_config('request.jwt.claim.role','service_role',false)");
    await db.query("update profiles set role='admin' where id=$1", [uid(3)]);
    await db.query("update profiles set role='owner' where id=$1", [uid(4)]);
    await t.test('recovery consumption is irreversible and inaccessible to browser roles', async () => {
      const hash = 'a'.repeat(64);
      await db.exec('set role service_role');
      try {
        assert.equal(await scalar('select consume_recovery_token($1,$2)', [uid(1), hash]), true);
        assert.equal(await scalar('select consume_recovery_token($1,$2)', [uid(1), hash]), false);
        assert.equal(await scalar('select consume_recovery_token($1,$2)', [uid(2), hash]), false);
        assert.equal(await scalar('select consume_recovery_token($1,$2)', [uid(1), 'invalid']), false);
        await assert.rejects(db.query('delete from consumed_recovery_tokens'), error => error.code === '42501');
      } finally { await db.exec('reset role'); }
      for (const n of [0, 1, 3, 4]) await asUser(n, async () => {
        await assert.rejects(db.query('select consume_recovery_token($1,$2)', [uid(1), hash]), error => error.code === '42501');
        await assert.rejects(db.query('select * from consumed_recovery_tokens'), error => error.code === '42501');
      });
      assert.equal(await scalar('select count(*)::int from consumed_recovery_tokens'), 1);
    });
    await t.test('every application table has row-level security enabled', async () => {
      const rows = (await db.query("select relname from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and not c.relrowsecurity")).rows;
      assert.deepEqual(rows, []);
    });
    await t.test('directory requires admin or owner, not merely an authenticated account', async () => {
      for (const n of [0, 1, 2]) await asUser(n, () => assert.rejects(db.query('select get_admin_users()'), error => error.code === '42501'));
      for (const n of [3, 4]) await asUser(n, async () => {
        assert.equal((await scalar('select get_admin_users()')).total, 4);
        assert.equal(await scalar('select is_admin()'), true);
        assert.equal(await scalar('select is_owner()'), n === 4);
      });
    });
    await t.test('even admin and owner browsers cannot directly edit roles or practice scores', async () => {
      for (const n of [1, 2, 3, 4]) await asUser(n, async () => {
        for (const sql of ["update profiles set role='owner'", 'update question_progress set correct=attempts', 'update user_levels set level=999']) {
          await assert.rejects(db.query(sql), error => error.code === '42501');
        }
      });
    });
    await t.test('bookmarks allow own writes but reject cross-account insert and hide other rows', async () => {
      for (const n of [1, 2, 3, 4]) await asUser(n, async () => {
        await db.query('insert into bookmarks(user_id,question_id) values($1,42)', [uid(n)]);
        await assert.rejects(db.query('insert into bookmarks(user_id,question_id) values($1,43)', [uid(n === 1 ? 2 : 1)]), error => error.code === '42501');
        assert.deepEqual((await db.query('select user_id from bookmarks')).rows, [{ user_id: uid(n) }]);
        assert.equal((await db.query('delete from bookmarks where user_id<>$1 returning user_id', [uid(n)])).rows.length, 0);
      });
      assert.equal(await scalar('select count(*)::int from bookmarks'), 4);
    });
    await t.test('private progress stays owner-only regardless of administrative role', async () => {
      for (let n = 1; n <= 4; n++) await db.query('insert into question_progress(user_id,question_id) values($1,42)', [uid(n)]);
      for (const n of [1, 2, 3, 4]) await asUser(n, async () => {
        assert.deepEqual((await db.query('select user_id from question_progress')).rows, [{ user_id: uid(n) }]);
        assert.deepEqual((await db.query('select user_id from user_levels')).rows, [{ user_id: uid(n) }]);
      });
    });
    await t.test('challenge answers and statistics are private, while the public leaderboard is limited', async () => {
      await db.exec("insert into daily_challenges(challenge_date,question_id,division) values(current_date,'AUTH-TEST','Mu') on conflict (challenge_date,division) do update set question_id=excluded.question_id");
      for (let n = 1; n <= 4; n++) await db.query("select submit_challenge_attempt($1,current_date,'AUTH-TEST','C',true)", [uid(n)]);
      for (const n of [0, 1, 2, 3, 4]) await asUser(n, async () => {
        assert.equal(await scalar("select count(*)::int from daily_challenges where question_id='AUTH-TEST'"), 1);
        const leaderboard = (await db.query('select * from get_challenge_leaderboard()')).rows;
        assert.equal(leaderboard.length, 4);
        assert.deepEqual(Object.keys(leaderboard[0]).sort(), ['current_streak', 'longest_streak', 'rank', 'user_id', 'username']);
        for (const table of ['challenge_attempts', 'challenge_user_statistics']) {
          if (!n) await assert.rejects(db.query(`select * from ${table}`), error => error.code === '42501');
          else assert.deepEqual((await db.query(`select user_id from ${table}`)).rows, [{ user_id: uid(n) }]);
          await assert.rejects(db.query(`delete from ${table}`), error => error.code === '42501');
        }
        await assert.rejects(db.query("select submit_challenge_attempt($1,current_date,'AUTH-TEST','A',true)", [uid(n || 1)]), error => error.code === '42501');
        await assert.rejects(db.query('select * from get_challenge_leaderboard_position($1)', [uid(2)]), error => error.code === '42501');
        if (n) assert.deepEqual((await db.query('select user_id from get_my_challenge_leaderboard_position()')).rows, [{ user_id: uid(n) }]);
        else await assert.rejects(db.query('select * from get_my_challenge_leaderboard_position()'), error => error.code === '42501');
      });
      await assert.rejects(db.query("select submit_challenge_attempt($1,current_date,'AUTH-TEST','A',false)", [uid(1)]), error => error.code === '23505');
      assert.equal(await scalar('select total_completed from challenge_user_statistics where user_id=$1', [uid(1)]), 1);
    });
    await t.test('trainer sessions and results enforce ownership on reads, inserts and deletes', async () => {
      const insertSession = (owner, session) => db.query(`insert into trainer_sessions
        (id,user_id,division,started_at,ended_at,starting_level,starting_progress,ending_level,ending_progress)
        values($1,$2,'Mu',now(),now(),1,0,1,0)`, [uid(session), uid(owner)]);
      const insertResult = (owner, session) => db.query(`insert into trainer_results
        (session_id,user_id,question_id,question_number,correct_answer,result)
        values($1,$2,42,1,'C','give-up')`, [uid(session), uid(owner)]);
      for (let n = 1; n <= 4; n++) await asUser(n, async () => {
        await insertSession(n, 100 + n);
        await insertResult(n, 100 + n);
      });
      for (const n of [1, 2, 3, 4]) await asUser(n, async () => {
        const other = n === 1 ? 2 : 1;
        await assert.rejects(insertSession(other, 200 + n), error => error.code === '42501');
        // Claiming your own user ID must not let you attach to someone else's session.
        await assert.rejects(insertResult(n, 100 + other), /Trainer result owner must match/);
        await assert.rejects(insertResult(other, 100 + other));
        for (const table of ['trainer_sessions', 'trainer_results']) {
          assert.deepEqual((await db.query(`select user_id from ${table}`)).rows, [{ user_id: uid(n) }]);
          assert.equal((await db.query(`delete from ${table} where user_id<>$1 returning user_id`, [uid(n)])).rows.length, 0);
        }
      });
      await asUser(0, async () => {
        for (const table of ['trainer_sessions', 'trainer_results']) await assert.rejects(db.query(`select * from ${table}`), error => error.code === '42501');
      });
      await asUser(1, () => db.query('delete from trainer_sessions where id=$1', [uid(101)]));
      assert.equal(await scalar('select count(*)::int from trainer_results'), 3, 'Own session deletion cascades only its own results');
      assert.equal(await scalar('select count(*)::int from trainer_sessions'), 3);
    });
    await t.test('scoring, room control and tutor accounting RPCs have no browser execution grant', async () => {
      const functions = (await db.query(`select p.oid,p.proname from pg_proc p
        join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'
        and (p.proname like '%multiplayer%' or p.proname like '%practice%'
          or p.proname like '%ai_tutor%') and p.prorettype<>'trigger'::regtype`)).rows;
      assert.ok(functions.length >= 10, 'Guard against accidentally testing an empty RPC inventory');
      for (const fn of functions) for (const role of ['anon', 'authenticated']) {
        assert.equal(await scalar("select has_function_privilege($1,$2::oid,'EXECUTE')", [role, fn.oid]), false, `${role}: ${fn.proname}`);
      }
    });
    await t.test('private room creation is atomic, account-limited, and rate-limited', async () => {
      const create = (user, code) => scalar(
        'select create_private_multiplayer_room($1,$2,\'unranked\',\'Mu\',5,60)',
        [uid(user), code],
      );
      const first = await create(1, 'LIFE0001');
      assert.equal(await scalar('select count(*)::int from multiplayer_players where room_id=$1 and user_id=$2 and is_host', [first, uid(1)]), 1);
      await assert.rejects(create(1, 'LIFE0002'), /Close or finish/);
      assert.equal(await scalar('select count(*)::int from multiplayer_room_creations where user_id=$1', [uid(1)]), 1);
      const other = await create(2, 'LIFE0003');
      assert.ok(other);
      await db.query('update multiplayer_rooms set capacity=1 where id=$1', [other]);
      await assert.rejects(db.query("insert into multiplayer_players(room_id,guest_nickname,reconnect_token_hash) values($1,'Extra Guest','test-hash')", [other]), /private room is full/);
      await db.query('update multiplayer_rooms set capacity=2 where id=$1', [other]);
      await db.query("insert into multiplayer_players(room_id,guest_nickname,reconnect_token_hash) values($1,'Extra Guest','test-hash')", [other]);
      await db.query("update multiplayer_rooms set status='countdown' where id=$1", [other]);
      await assert.rejects(db.query('insert into multiplayer_players(room_id,user_id) values($1,$2)', [other, uid(3)]), /no longer accepting players/);
      await db.query('update multiplayer_rooms set status=\'cancelled\' where id=$1', [first]);
      const second = await create(1, 'LIFE0004');
      await db.query('update multiplayer_rooms set status=\'cancelled\' where id=$1', [second]);
      const third = await create(1, 'LIFE0005');
      await db.query('update multiplayer_rooms set status=\'cancelled\' where id=$1', [third]);
      await assert.rejects(create(1, 'LIFE0006'), /up to 3 rooms every 10 minutes/);
      assert.equal(await scalar('select count(*)::int from multiplayer_room_creations where user_id=$1', [uid(1)]), 3);
    });
    await t.test('result receipts delete completed rooms but preserve private match history', async () => {
      const room = await scalar('select create_private_multiplayer_room($1,$2,\'unranked\',\'Alpha\',5,60)', [uid(3), 'LIFE0007']);
      const host = await scalar('select host_player_id from multiplayer_rooms where id=$1', [room]);
      const guest = await scalar('insert into multiplayer_players(room_id,user_id) values($1,$2) returning id', [room, uid(4)]);
      await db.query('update multiplayer_rooms set status=\'completed\',started_at=clock_timestamp(),completed_at=clock_timestamp() where id=$1', [room]);
      await db.query(`insert into multiplayer_match_results
        (room_id,player_id,user_id,placement,final_score,ranked,completion_factor)
        values($1,$2,$3,1,100,false,1),($1,$4,$5,2,50,false,1)`,
      [room, host, uid(3), guest, uid(4)]);
      await db.query('update multiplayer_rooms set results_finalized_at=clock_timestamp() where id=$1', [room]);
      assert.equal(await scalar('select count(*)::int from multiplayer_match_history where room_id=$1', [room]), 2);
      assert.equal(await scalar('select acknowledge_multiplayer_result($1,$2)', [room, host]), true);
      assert.equal(await scalar('select count(*)::int from multiplayer_rooms where id=$1', [room]), 1);
      assert.equal(await scalar('select acknowledge_multiplayer_result($1,$2)', [room, guest]), true);
      assert.equal(await scalar('select count(*)::int from multiplayer_rooms where id=$1', [room]), 0);
      assert.equal(await scalar('select count(*)::int from multiplayer_match_history where room_id=$1', [room]), 2);
      assert.equal(await scalar('select acknowledge_multiplayer_result($1,$2)', [room, host]), false);
      for (const n of [3, 4]) await asUser(n, async () => {
        assert.deepEqual((await db.query('select user_id from multiplayer_match_history where room_id=$1', [room])).rows, [{ user_id: uid(n) }]);
        await assert.rejects(db.query('delete from multiplayer_match_history where room_id=$1', [room]), error => error.code === '42501');
      });
    });
    await t.test('cleanup removes abandoned rooms and expired creation records in bounded batches', async () => {
      const stale = await scalar('select create_private_multiplayer_room($1,$2,\'unranked\',\'Theta\',5,60)', [uid(4), 'LIFE0008']);
      await db.query('update multiplayer_rooms set created_at=clock_timestamp()-interval \'2 hours\' where id=$1', [stale]);
      await db.query('update multiplayer_players set connected=false where room_id=$1', [stale]);
      assert.ok(await scalar('select cleanup_multiplayer_rooms()') >= 1);
      assert.equal(await scalar('select count(*)::int from multiplayer_rooms where id=$1', [stale]), 0);
      const finalized = await scalar('select create_private_multiplayer_room($1,$2,\'unranked\',\'Theta\',5,60)', [uid(3), 'LIFE0009']);
      const player = await scalar('select host_player_id from multiplayer_rooms where id=$1', [finalized]);
      await db.query('update multiplayer_rooms set status=\'completed\',started_at=clock_timestamp(),completed_at=clock_timestamp() where id=$1', [finalized]);
      await db.query('insert into multiplayer_match_results(room_id,player_id,user_id,placement,final_score,ranked,completion_factor) values($1,$2,$3,1,0,false,1)', [finalized, player, uid(3)]);
      await db.query('update multiplayer_rooms set results_finalized_at=clock_timestamp()-interval \'3 minutes\' where id=$1', [finalized]);
      await db.query('select cleanup_multiplayer_rooms()');
      assert.equal(await scalar('select count(*)::int from multiplayer_rooms where id=$1', [finalized]), 0);
      assert.equal(await scalar('select count(*)::int from multiplayer_match_history where room_id=$1', [finalized]), 1);
      const unfinished = await scalar('select create_private_multiplayer_room($1,$2,\'unranked\',\'Theta\',5,60)', [uid(4), 'LIFE0010']);
      await db.query(`update multiplayer_rooms set status='completed',
        created_at=clock_timestamp()-interval '4 hours',
        started_at=clock_timestamp()-interval '3 hours',
        completed_at=clock_timestamp()-interval '3 hours' where id=$1`, [unfinished]);
      await db.query('select cleanup_multiplayer_rooms()');
      assert.equal(await scalar('select count(*)::int from multiplayer_rooms where id=$1', [unfinished]), 0);
      await db.query('update multiplayer_room_creations set created_at=clock_timestamp()-interval \'2 days\' where user_id=$1', [uid(4)]);
      await db.query('select cleanup_multiplayer_rooms()');
      assert.equal(await scalar('select count(*)::int from multiplayer_room_creations where user_id=$1', [uid(4)]), 0);
    });
  } finally { await db.close(); }
});
