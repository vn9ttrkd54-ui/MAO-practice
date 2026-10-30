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
    let lastRefresh = -Infinity;
    const refresh = () => {
      if (performance.now() - lastRefresh < 750) return;
      lastRefresh = performance.now();
      router.refresh();
    };
    const fastTimers = [800, 1800].map(delay => window.setTimeout(refresh, delay + Math.random() * 150));
    const interval = window.setInterval(() => {
      attempts += 1;
      if (attempts >= 10) { setWaitingLong(true); window.clearInterval(interval); }
      else refresh();
    }, 3_000);
    const unsubscribe = subscribeToMultiplayerRoom(roomId, refresh);
    return () => { window.clearInterval(interval); fastTimers.forEach(window.clearTimeout); unsubscribe(); };
  }, [roomId, router]);
  return <MatchWaiting description={waitingLong ? "Results are taking longer than expected. Try checking again shortly." : "Your match has finished. Results will appear here when ready."}>
    <button className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white" onClick={() => router.refresh()}>Check results</button>
  </MatchWaiting>;
}
