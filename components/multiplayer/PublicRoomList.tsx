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
const divisionStyles = { Mu: styles.muRoom, Alpha: styles.alphaRoom, Theta: styles.thetaRoom };
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
      <section className={styles.publicRooms}><div><h2 className="flex items-center gap-2 text-xl font-bold"><Users size={21} className="text-blue-600" aria-hidden="true" />Public rooms</h2><p className="mt-1 text-sm text-gray-600">Ranked · 90 seconds per question · up to 20 players</p></div><div className={styles.roomGrid}>{orderedRooms.map((room) => { const occupied = room.playerCount > 0; return <article key={room.id} data-division={room.settings.division} className={`${styles.roomCard} ${divisionStyles[room.settings.division]} ${occupied ? styles.occupied : ""}`}><div className={styles.roomHeading}><p className={styles.roomDivision}>{room.settings.division.toUpperCase()}</p><span className={styles.occupancy}>{room.playerCount}/{room.capacity}</span></div><p className={styles.questionCount}>{room.settings.questionCount} questions</p><div className={styles.roomMeta}><span><Timer size={13} aria-hidden="true" />{room.settings.secondsPerQuestion}s / question</span><span><Trophy size={13} aria-hidden="true" />Ranked</span></div><p className="mt-2 text-xs font-medium text-gray-600">Difficulty {room.settings.difficultyBand?.replace("-", "–") ?? "1–5"}</p><PublicRoomPresence room={room} />{signedIn ? <form action={joinPublicRoomAction} className="mt-3"><input type="hidden" name="roomId" value={room.id} /><PendingSubmitButton pendingText="Joining…" className={styles.joinRoom}>{occupied ? "Join players" : "Join"}</PendingSubmitButton></form> : <Link href="/login" className={styles.guestJoin}>Sign in to join</Link>}</article>; })}</div></section>
  </>;
}
