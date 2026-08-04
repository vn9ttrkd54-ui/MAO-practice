import Link from "next/link";
import { notFound } from "next/navigation";

import PrivateLobby from "@/components/multiplayer/PrivateLobby";
import { getPrivateLobby } from "@/lib/services/multiplayerService";

interface PrivateRoomPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function PrivateRoomPage({ params, searchParams }: PrivateRoomPageProps) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const lobby = await getPrivateLobby(id);
  if (!lobby) notFound();

  const { room } = lobby;
  return (
    <main className="mx-auto max-w-4xl px-6 py-8 sm:px-8">
      <Link href="/multiplayer" className="text-sm font-semibold text-blue-600 hover:text-blue-800">← Multiplayer</Link>
      <section className="mt-4 rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Private room</p>
            <h1 className="mt-1 text-3xl font-bold tracking-[0.12em]">{room.code}</h1>
            <p className="mt-2 text-sm text-gray-600">Share this code with other players.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${room.status === "waiting" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>{room.status === "waiting" ? "Waiting" : "In progress"}</span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-3"><dt className="text-xs font-semibold uppercase text-gray-500">Division</dt><dd className="mt-1 font-bold">{room.settings.division}</dd></div>
          <div className="rounded-xl bg-gray-50 p-3"><dt className="text-xs font-semibold uppercase text-gray-500">Questions</dt><dd className="mt-1 font-bold">{room.settings.questionCount}</dd></div>
          <div className="rounded-xl bg-gray-50 p-3"><dt className="text-xs font-semibold uppercase text-gray-500">Time</dt><dd className="mt-1 font-bold">{room.settings.secondsPerQuestion}s</dd></div>
          <div className="rounded-xl bg-gray-50 p-3"><dt className="text-xs font-semibold uppercase text-gray-500">Mode</dt><dd className="mt-1 font-bold capitalize">{room.settings.mode}</dd></div>
        </dl>

        <PrivateLobby initialLobby={lobby} error={error} />
      </section>
    </main>
  );
}
