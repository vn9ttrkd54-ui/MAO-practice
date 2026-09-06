"use client";
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
  return <main className="mx-auto max-w-xl px-6 py-16 text-center">
    <h1 className="text-3xl font-bold">Preparing final results</h1>
    <p className="mt-3 text-gray-600">{waitingLong ? "Results are taking longer than expected. Your saved answers are safe; try again shortly." : "Your match has finished. Results will appear shortly."}</p>
    <button className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white" onClick={() => router.refresh()}>Check results</button>
  </main>;
}
