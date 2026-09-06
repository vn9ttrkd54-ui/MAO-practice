import Link from "next/link";
import { ArrowUpRight, Hash, Layers, LockKeyhole, Timer, Trophy, Users } from "lucide-react";

import { createPrivateRoomAction } from "@/app/multiplayer/actions";
import PendingSubmitButton from "@/components/multiplayer/PendingSubmitButton";
import { createClient } from "@/lib/supabase/server";
import { getMultiplayerProfile } from "@/lib/services/multiplayerService";
import { rankPageClass } from "@/components/multiplayer/RankTheme";
import styles from "./create.module.css";

interface CreateRoomPageProps {
  searchParams: Promise<{ error?: string }>;
}

const fieldClass = `${styles.field} mt-2 w-full rounded-xl border px-3 py-2.5 text-sm`;

export default async function CreateRoomPage({ searchParams }: CreateRoomPageProps) {
  const [{ error }, supabase, profile] = await Promise.all([searchParams, createClient(), getMultiplayerProfile()]);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className={rankPageClass(profile?.rankTier ?? "Novice")}>
    <main className={`${styles.page} mx-auto max-w-3xl px-6 py-10 sm:px-8`}>
      <Link href="/multiplayer" className="text-sm font-semibold text-blue-600 hover:text-blue-800">← Multiplayer</Link>

      <section className={`${styles.panel} mt-5 rounded-3xl border bg-white p-6 shadow-sm sm:p-8`}>
        <div className={styles.headingIcon}><LockKeyhole size={24} aria-hidden="true" /></div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Private room</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Choose your room settings</h1>
        <p className="mt-3 text-gray-600">You can invite up to 30 players after the room is created.</p>
        <div className={styles.roomDetails}><span><Users size={14} aria-hidden="true" />Up to 30 players</span><span><LockKeyhole size={14} aria-hidden="true" />Join with a code</span></div>

        {error ? <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}

        <form action={createPrivateRoomAction} className={`${styles.form} mt-7 grid gap-5 sm:grid-cols-2`}>
          {!user ? <label className="block text-sm font-semibold sm:col-span-2">Your guest nickname
            <input name="guestNickname" required minLength={1} maxLength={20} placeholder="MathPlayer" className={fieldClass} />
          </label> : null}
          <label className="block text-sm font-semibold"><span id="division-label" className={styles.label}><Layers size={16} aria-hidden="true" />Division</span>
            <select name="division" aria-labelledby="division-label" className={fieldClass}><option>Mu</option><option>Alpha</option><option>Theta</option></select>
          </label>
          <label className="block text-sm font-semibold"><span className={styles.label}><Hash size={16} aria-hidden="true" />Questions</span>
            <input name="questionCount" type="number" min={1} max={30} defaultValue={5} required className={fieldClass} />
          </label>
          <label className="block text-sm font-semibold"><span id="time-label" className={styles.label}><Timer size={16} aria-hidden="true" />Time per question</span>
            <select name="secondsPerQuestion" aria-labelledby="time-label" defaultValue="60" className={fieldClass}><option value="30">30 seconds</option><option value="60">60 seconds</option><option value="90">90 seconds</option><option value="120">120 seconds</option></select>
          </label>
          <label className="block text-sm font-semibold"><span id="mode-label" className={styles.label}><Trophy size={16} aria-hidden="true" />Rating mode</span>
            <select name="mode" aria-labelledby="mode-label" defaultValue="unranked" className={fieldClass}><option value="unranked">Unranked</option><option value="ranked">Ranked (5+ questions)</option></select>
          </label>
          <PendingSubmitButton pendingText="Creating room…" className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md shadow-blue-600/15 hover:bg-blue-700 sm:col-span-2">Create Room<ArrowUpRight size={18} aria-hidden="true" /></PendingSubmitButton>
        </form>
      </section>
    </main>
    </div>
  );
}
