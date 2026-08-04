import Link from "next/link";

import { joinPrivateRoomAction } from "@/app/multiplayer/actions";
import { createClient } from "@/lib/supabase/server";

interface MultiplayerPageProps {
  searchParams: Promise<{ error?: string }>;
}

const fieldClass = "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm";

export default async function MultiplayerPage({ searchParams }: MultiplayerPageProps) {
  const [{ error }, supabase] = await Promise.all([searchParams, createClient()]);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Multiplayer</p>
        <h1 className="mt-1.5 text-3xl font-bold tracking-tight">Create or join a private room</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">Enter a code to join, or create a room with your own settings.</p>
      </header>

      {error ? <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 grid items-start gap-4 md:grid-cols-2">
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Join with a code</h2>
          <form action={joinPrivateRoomAction} className="mt-3 space-y-3">
            <label className="block text-sm font-semibold">Room code
              <input name="code" required minLength={8} maxLength={8} autoCapitalize="characters" placeholder="ABCD2345" className={`${fieldClass} uppercase tracking-widest`} />
            </label>
            {!user ? <label className="block text-sm font-semibold">Guest nickname
              <input name="guestNickname" required minLength={1} maxLength={20} placeholder="MathPlayer" className={fieldClass} />
            </label> : null}
            <button className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700">Join Room</button>
          </form>
        </section>

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Create a room</h2>
          <p className="mt-2 text-sm leading-5 text-gray-600">Choose your division, question count, timer, and rating mode.</p>
          <Link href="/multiplayer/create" className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Create Room</Link>
        </section>
      </div>

      <section className="mt-5 rounded-2xl border border-dashed bg-gray-50 px-5 py-4 text-gray-600">
        <h2 className="text-sm font-bold text-gray-900">Public rooms</h2>
        <p className="mt-1 text-sm">Public queues and ongoing matches are coming in a later pack.</p>
      </section>
    </main>
  );
}
