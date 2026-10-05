"use client";

import { useState } from "react";
import Link from "next/link";
import { closePrivateLobbyAction } from "@/app/multiplayer/actions";
import PendingSubmitButton from "./PendingSubmitButton";
import type { MultiplayerActiveRoom } from "@/types/multiplayer";

export default function PrivateRoomRecovery({ rooms }: { rooms: MultiplayerActiveRoom[] }) {
  const [confirming, setConfirming] = useState<string | null>(null);
  const waiting = rooms.filter(room => room.visibility === "private" && (room.status === "waiting" || room.status === "countdown"));
  if (waiting.length === 0) return null;
  return <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/70 p-5" aria-label="Your unfinished private rooms">
    <h2 className="text-lg font-bold text-slate-900">Your unfinished private rooms</h2>
    <div className="mt-4 space-y-3">{waiting.map(room => <article key={room.id} className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-semibold text-slate-900">{room.settings.division} · {room.settings.questionCount} questions</h3>
      <p className="mt-1 break-words text-sm text-slate-600">{room.code} · {room.settings.secondsPerQuestion}s per question · {room.isHost ? "You are the host" : "Waiting for the host"}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={`/multiplayer/room/${room.id}`} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Return to Room</Link>
        {room.isHost && confirming !== room.id ? <button type="button" onClick={() => setConfirming(room.id)} className="min-h-11 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Close Room</button> : null}
      </div>
      {room.isHost && confirming === room.id ? <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3" role="group" aria-label={`Confirm closing ${room.code}`}>
        <p className="text-sm text-red-900">Close this unstarted room for everyone? Players will need a new room. Saved progress and completed scores will not be removed.</p>
        <form action={closePrivateLobbyAction} className="mt-3 flex flex-wrap gap-2">
          <input type="hidden" name="roomId" value={room.id} />
          <input type="hidden" name="confirmation" value="close" />
          <PendingSubmitButton pendingText="Closing room…" className="min-h-11 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white">Confirm Close Room</PendingSubmitButton>
          <button type="button" onClick={() => setConfirming(null)} className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Keep Room</button>
        </form>
      </div> : null}
    </article>)}</div>
  </section>;
}
