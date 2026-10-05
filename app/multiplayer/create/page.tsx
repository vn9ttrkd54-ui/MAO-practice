import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { ArrowUpRight, Hash, Layers, LockKeyhole, Timer, Trophy, Users } from "lucide-react";

import { createPrivateRoomAction } from "@/app/multiplayer/actions";
import PendingSubmitButton from "@/components/multiplayer/PendingSubmitButton";
import PrivateRoomRecovery from "@/components/multiplayer/PrivateRoomRecovery";
import { hasAdminAccess } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { getMultiplayerProfile, listMyActiveMultiplayerRooms } from "@/lib/services/multiplayerService";
import { rankPageClass } from "@/components/multiplayer/RankTheme";
import styles from "./create.module.css";

interface CreateRoomPageProps {
  searchParams: Promise<{ error?: string }>;
}

const fieldClass = `${styles.field} mt-2 w-full rounded-xl border px-3 py-2.5 text-sm`;

export default async function CreateRoomPage({ searchParams }: CreateRoomPageProps) {
  const [{ error }, supabase, profile, activeRooms] = await Promise.all([searchParams, createClient(), getMultiplayerProfile(),
    listMyActiveMultiplayerRooms().catch(failure => { unstable_rethrow(failure); return null; })]);
  const { data: { user } } = await supabase.auth.getUser();
  // Display only: the creation RPC rechecks the protected role under a row lock.
  const { data: accountProfile, error: roleError } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle<{ role: string }>()
    : { data: null, error: null };
  const unlimitedCreation = !roleError && hasAdminAccess(accountProfile?.role);
  const existingHostRoom = activeRooms?.find(room => room.visibility === "private" && room.isHost);

  return (
    <div className={rankPageClass(profile?.rankTier ?? "Novice")}>
    <main className={`${styles.page} mx-auto max-w-3xl px-6 py-10 sm:px-8`}>
      <Link href="/multiplayer" className="text-sm font-semibold text-blue-600 hover:text-blue-800">← Multiplayer</Link>

      <section className={`${styles.panel} mt-5 rounded-3xl border bg-white p-6 shadow-sm sm:p-8`}>
        <div className={styles.headingIcon}><LockKeyhole size={24} aria-hidden="true" /></div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Private room</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Choose your room settings</h1>
        <p className="mt-3 text-gray-600">You can invite up to 30 players after the room is created.</p>
        {unlimitedCreation ? <p className="mt-2 text-sm text-blue-700">Admins and owners can create unlimited rooms, including multiple active private rooms.</p> : <p className="mt-2 text-sm text-slate-600">You can host one active private room and create up to 3 rooms every 10 minutes.</p>}
        <div className={styles.roomDetails}><span><Users size={14} aria-hidden="true" />Up to 30 players</span><span><LockKeyhole size={14} aria-hidden="true" />Join with a code</span></div>

        {error ? <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
        {activeRooms === null ? <p role="alert" className="mt-4 text-sm text-amber-800">Unable to check your existing rooms. Refresh to try again before creating a room.</p> : <PrivateRoomRecovery rooms={activeRooms} />}
        {existingHostRoom?.status === "in-progress" ? <p className="mt-4 text-sm text-slate-700">Your private game is already running. <Link href={`/multiplayer/room/${existingHostRoom.id}/play`} className="font-semibold text-blue-700 underline">Rejoin Game</Link></p> : null}

        {!user ? <div className="mt-7 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
          <p>Sign in to host a private room. Guests can still join with a room code.</p>
          <Link href="/login" className="mt-3 inline-flex font-semibold text-blue-700 hover:underline">Sign in</Link>
        </div> : <form action={createPrivateRoomAction} className={`${styles.form} mt-7 grid gap-5 sm:grid-cols-2`}>
          <label className="block text-sm font-semibold"><span id="division-label" className={styles.label}><Layers size={16} aria-hidden="true" />Division</span>
            <select name="division" aria-labelledby="division-label" className={fieldClass}><option>Mu</option><option>Alpha</option><option>Theta</option></select>
          </label>
          <label className="block text-sm font-semibold"><span className={styles.label}><Hash size={16} aria-hidden="true" />Questions</span>
            <input name="questionCount" type="number" min={1} max={30} defaultValue={5} required className={fieldClass} />
          </label>
          <label className="block text-sm font-semibold"><span id="time-label" className={styles.label}><Timer size={16} aria-hidden="true" />Time per question</span>
            <select name="secondsPerQuestion" aria-labelledby="time-label" defaultValue="60" className={fieldClass}><option value="30">30 seconds</option><option value="60">60 seconds</option><option value="90">90 seconds</option><option value="120">2 minutes</option><option value="150">2 minutes 30 seconds</option><option value="180">3 minutes</option></select>
          </label>
          <label className="block text-sm font-semibold"><span id="difficulty-label" className={styles.label}><Layers size={16} aria-hidden="true" />Difficulty</span>
            <select name="difficultyBand" aria-labelledby="difficulty-label" defaultValue="2-4" className={fieldClass}><option value="1-3">Levels 1–3</option><option value="2-4">Levels 2–4</option><option value="3-5">Levels 3–5</option></select>
          </label>
          <label className="block text-sm font-semibold"><span id="mode-label" className={styles.label}><Trophy size={16} aria-hidden="true" />Rating mode</span>
            <select name="mode" aria-labelledby="mode-label" defaultValue="unranked" className={fieldClass}><option value="unranked">Unranked</option><option value="ranked">Ranked (5+ questions)</option></select>
          </label>
          <PendingSubmitButton pendingText="Creating room…" disabled={activeRooms === null || (!!existingHostRoom && !unlimitedCreation)} className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md shadow-blue-600/15 hover:bg-blue-700 sm:col-span-2">Create Room<ArrowUpRight size={18} aria-hidden="true" /></PendingSubmitButton>
        </form>}
      </section>
    </main>
    </div>
  );
}
