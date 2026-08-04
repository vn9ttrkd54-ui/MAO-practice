import Link from "next/link";

import { joinPrivateRoomAction } from "@/app/multiplayer/actions";
import { createClient } from "@/lib/supabase/server";

interface MultiplayerPageProps {
  searchParams: Promise<{ error?: string }>;
}

const fieldClass = "mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm";

export default async function MultiplayerPage({ searchParams }: MultiplayerPageProps) {
  const [{ error }, supabase] = await Promise.all([searchParams, createClient()]);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Multiplayer</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Create or join a private room</h1>
        <p className="mt-3 max-w-2xl text-gray-600">Private rooms are ready for setup and code joining. Live rosters and match play arrive in the next packs.</p>
      </header>

      {error ? <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Join with a code</h2>
          <form action={joinPrivateRoomAction} className="mt-5 space-y-4">
            <label className="block text-sm font-semibold">Room code
              <input name="code" required minLength={8} maxLength={8} autoCapitalize="characters" placeholder="ABCD2345" className={`${fieldClass} uppercase tracking-widest`} />
            </label>
            {!user ? <label className="block text-sm font-semibold">Guest nickname
              <input name="guestNickname" required minLength={3} maxLength={20} pattern="[A-Za-z0-9_ ]{3,20}" placeholder="MathPlayer" className={fieldClass} />
            </label> : null}
            <button className="w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white hover:bg-gray-700">Join private room</button>
          </form>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Create a private room</h2>
          <p className="mt-3 text-sm text-gray-600">Choose the division, question count, timer, and rating mode on the next page.</p>
          <Link href="/multiplayer/create" className="mt-8 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">Create Room</Link>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-dashed bg-gray-50 p-6 text-gray-600">
        <h2 className="font-bold text-gray-900">Public rooms</h2>
        <p className="mt-2 text-sm">The nine public room queues and ongoing matches will be added after the private lobby flow is complete.</p>
      </section>
    </main>
  );
}
