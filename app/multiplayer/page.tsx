import Link from "next/link";

import { joinPrivateRoomAction, joinPublicRoomAction } from "@/app/multiplayer/actions";
import { listOngoingPublicMatches, listPublicRooms } from "@/lib/services/multiplayerService";
import { createClient } from "@/lib/supabase/server";

interface MultiplayerPageProps {
  searchParams: Promise<{ error?: string }>;
}

const fieldClass = "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm";

export default async function MultiplayerPage({ searchParams }: MultiplayerPageProps) {
  const [{ error }, supabase, publicRooms, ongoingMatches] = await Promise.all([searchParams, createClient(), listPublicRooms(), listOngoingPublicMatches()]);
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

      <section className="mt-8">
        <div><h2 className="text-xl font-bold">Public rooms</h2><p className="mt-1 text-sm text-gray-600">Ranked · 60 seconds per question · up to 20 players</p></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {publicRooms.map((room) => <article key={room.id} className="rounded-2xl border bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-lg font-bold">{room.settings.division}</p><p className="text-sm text-gray-600">{room.settings.questionCount} questions</p></div><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold">{room.playerCount}/20</span></div><p className="mt-3 text-xs text-gray-500">{room.status === "countdown" ? "Starting soon" : "Waiting for players"}</p>{user ? <form action={joinPublicRoomAction} className="mt-3"><input type="hidden" name="roomId" value={room.id} /><button className="w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">Join</button></form> : <Link href="/login" className="mt-3 flex w-full items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50">Sign in to join</Link>}</article>)}
        </div>
      </section>

      {ongoingMatches.length > 0 ? <section className="mt-8"><div><h2 className="text-xl font-bold">Ongoing games</h2><p className="mt-1 text-sm text-gray-600">Public matches currently in progress</p></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{ongoingMatches.map((room) => <article key={room.id} className="rounded-2xl border bg-gray-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{room.settings.division} · {room.settings.questionCount}</p><p className="mt-1 text-sm text-gray-600">{room.playerCount} players</p></div><span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">Live</span></div><p className="mt-3 text-xs text-gray-500">Spectating arrives in the next pack.</p></article>)}</div></section> : null}
    </main>
  );
}
