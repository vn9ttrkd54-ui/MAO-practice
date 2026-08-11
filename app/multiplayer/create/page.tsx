import Link from "next/link";

import { createPrivateRoomAction } from "@/app/multiplayer/actions";
import PendingSubmitButton from "@/components/multiplayer/PendingSubmitButton";
import { createClient } from "@/lib/supabase/server";

interface CreateRoomPageProps {
  searchParams: Promise<{ error?: string }>;
}

const fieldClass = "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm";

export default async function CreateRoomPage({ searchParams }: CreateRoomPageProps) {
  const [{ error }, supabase] = await Promise.all([searchParams, createClient()]);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:px-8">
      <Link href="/multiplayer" className="text-sm font-semibold text-blue-600 hover:text-blue-800">← Multiplayer</Link>

      <section className="mt-5 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Private room</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Choose your room settings</h1>
        <p className="mt-3 text-gray-600">You can invite up to 30 players after the room is created.</p>

        {error ? <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}

        <form action={createPrivateRoomAction} className="mt-7 grid gap-5 sm:grid-cols-2">
          {!user ? <label className="block text-sm font-semibold sm:col-span-2">Your guest nickname
            <input name="guestNickname" required minLength={1} maxLength={20} placeholder="MathPlayer" className={fieldClass} />
          </label> : null}
          <label className="block text-sm font-semibold">Division
            <select name="division" className={fieldClass}><option>Mu</option><option>Alpha</option><option>Theta</option></select>
          </label>
          <label className="block text-sm font-semibold">Questions
            <input name="questionCount" type="number" min={1} max={30} defaultValue={5} required className={fieldClass} />
          </label>
          <label className="block text-sm font-semibold">Time per question
            <select name="secondsPerQuestion" defaultValue="60" className={fieldClass}><option value="30">30 seconds</option><option value="60">60 seconds</option><option value="90">90 seconds</option><option value="120">120 seconds</option></select>
          </label>
          <label className="block text-sm font-semibold">Rating mode
            <select name="mode" defaultValue="unranked" className={fieldClass}><option value="unranked">Unranked</option><option value="ranked">Ranked (5+ questions)</option></select>
          </label>
          <PendingSubmitButton pendingText="Creating room…" className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 sm:col-span-2">Create Room</PendingSubmitButton>
        </form>
      </section>
    </main>
  );
}
