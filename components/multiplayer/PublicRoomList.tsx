"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Timer, Trophy, Users } from "lucide-react";
import { joinPublicRoomAction } from "@/app/multiplayer/actions";
import { LiveRoomListRefresh } from "@/components/multiplayer/LiveRoomListRefresh";
import PendingSubmitButton from "@/components/multiplayer/PendingSubmitButton";
import { PublicRoomPresence } from "@/components/multiplayer/PublicRoomCard";
import type { MultiplayerPublicRoom } from "@/types/multiplayer";
import styles from "@/app/multiplayer/lobby.module.css";

const divisionOrder = { Mu: 0, Alpha: 1, Theta: 2 };
export default function PublicRoomList({ initialRooms, signedIn }: { initialRooms: MultiplayerPublicRoom[]; signedIn: boolean }) {
  const [rooms, setRooms] = useState(initialRooms);
  const updateRooms = useCallback((next: MultiplayerPublicRoom[]) => setRooms(current => next.map(room => {
    const previous = current.find(entry => entry.id === room.id);
    // A still-cached response must not put a confirmed departed player back on
    // a card whose server-rendered snapshot already has the newer room version.
    return previous && previous.stateVersion > room.stateVersion ? previous : room;
  })), []);
  const orderedRooms = [...rooms].sort((a,b) => divisionOrder[a.settings.division]-divisionOrder[b.settings.division] || a.settings.questionCount-b.settings.questionCount);
  return <><LiveRoomListRefresh onRooms={updateRooms} />
      <section><div><h2 className="flex items-center gap-2 text-xl font-bold"><Users size={21} className="text-blue-600" aria-hidden="true" />Public rooms</h2><p className="mt-1 text-sm text-gray-600">Ranked · 90 seconds per question · up to 20 players</p></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{orderedRooms.map((room) => { const occupied = room.playerCount > 0; return <article key={room.id} className={`${styles.roomCard} relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm ${occupied ? styles.occupied : ""}`}><div className={styles.roomAccent} aria-hidden="true" /><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className={styles.divisionMark} aria-hidden="true">{room.settings.division === "Alpha" ? "Α" : room.settings.division === "Mu" ? "Μ" : "θ"}</span><div><p className="text-lg font-bold">{room.settings.division}</p><p className="text-sm text-gray-600">{room.settings.questionCount} questions</p></div></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${occupied ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200" : "bg-gray-100"}`}>{room.playerCount}/{room.capacity}</span></div><div className={styles.roomMeta}><span><Timer size={13} aria-hidden="true" />{room.settings.secondsPerQuestion}s / question</span><span><Trophy size={13} aria-hidden="true" />Ranked</span></div><p className="mt-2 text-xs font-medium text-gray-600">Difficulty {room.settings.difficultyBand?.replace("-", "–") ?? "1–5"}</p><PublicRoomPresence room={room} />{signedIn ? <form action={joinPublicRoomAction} className="mt-3"><input type="hidden" name="roomId" value={room.id} /><PendingSubmitButton pendingText="Joining…" className={`w-full rounded-lg px-3 py-2 text-sm font-semibold text-white ${occupied ? "bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200" : "bg-slate-900 hover:bg-slate-700"}`}>{occupied ? "Join players" : "Join"}</PendingSubmitButton></form> : <Link href="/login" className="mt-3 flex w-full items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold">Sign in to join</Link>}</article>; })}</div></section>
  </>;
}
