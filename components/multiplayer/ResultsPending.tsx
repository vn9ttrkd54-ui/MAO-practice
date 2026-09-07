"use client";
import MatchWaiting from "./MatchWaiting";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToMultiplayerRoom } from "@/lib/multiplayerRealtime";

export default function ResultsPending({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [waitingLong, setWaitingLong] = useState(false);
  useEffect(() => {
    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (attempts >= 10) { setWaitingLong(true); window.clearInterval(interval); }
      else router.refresh();
    }, 3_000);
    const unsubscribe = subscribeToMultiplayerRoom(roomId, () => router.refresh());
    return () => { window.clearInterval(interval); unsubscribe(); };
  }, [roomId, router]);
  return <MatchWaiting description={waitingLong ? "Results are taking longer than expected. Try checking again shortly." : "Your match has finished. The podium reveal will begin as soon as results are ready."}>
    <button className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white" onClick={() => router.refresh()}>Check results</button>
  </MatchWaiting>;
}
