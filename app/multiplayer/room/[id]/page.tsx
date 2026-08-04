perl: warning: Setting locale failed.
perl: warning: Please check that your locale settings:
	LC_ALL = "C.UTF-8",
	LC_CTYPE = "C.UTF-8",
	LANG = "C.UTF-8"
    are supported and installed on your system.
perl: warning: Falling back to the standard locale ("C").
import Link from "next/link";
import { notFound } from "next/navigation";

import { getMultiplayerRoom } from "@/lib/services/multiplayerService";

interface PrivateRoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrivateRoomPage({ params }: PrivateRoomPageProps) {
  const { id } = await params;
  const access = await getMultiplayerRoom(id);
  if (!access) notFound();

  const { room, currentPlayer } = access;
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
      <Link href="/multiplayer" className="text-sm font-semibold text-blue-600 hover:text-blue-800">← Multiplayer</Link>
      <section className="mt-5 rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Private room</p>
            <h1 className="mt-2 text-4xl font-bold tracking-[0.12em]">{room.code}</h1>
            <p className="mt-3 text-gray-600">Share this code with up to 29 other players.</p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">Waiting</span>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-gray-50 p-4"><dt className="text-xs font-semibold uppercase text-gray-500">Division</dt><dd className="mt-1 text-lg font-bold">{room.settings.division}</dd></div>
          <div className="rounded-2xl bg-gray-50 p-4"><dt className="text-xs font-semibold uppercase text-gray-500">Questions</dt><dd className="mt-1 text-lg font-bold">{room.settings.questionCount}</dd></div>
          <div className="rounded-2xl bg-gray-50 p-4"><dt className="text-xs font-semibold uppercase text-gray-500">Time</dt><dd className="mt-1 text-lg font-bold">{room.settings.secondsPerQuestion}s</dd></div>
          <div className="rounded-2xl bg-gray-50 p-4"><dt className="text-xs font-semibold uppercase text-gray-500">Mode</dt><dd className="mt-1 text-lg font-bold capitalize">{room.settings.mode}</dd></div>
        </dl>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="font-semibold text-blue-950">You joined as {currentPlayer.displayName}{currentPlayer.isHost ? " (host)" : ""}.</p>
          <p className="mt-1 text-sm text-blue-800">{room.playerCount} of {room.capacity} players joined. The live player roster and host start button arrive in M4.</p>
        </div>
      </section>
    </main>
  );
}
