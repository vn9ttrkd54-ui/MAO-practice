"use client";

import { useEffect } from "react";

export default function ResultDeliveryReceipt({ roomId, enabled }: { roomId: string; enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    let delivered = false;
    const acknowledge = async () => {
      if (delivered) return;
      try {
        const response = await fetch(`/api/multiplayer/rooms/${roomId}/results/acknowledge`, {
          method: "POST", credentials: "same-origin", keepalive: true,
        });
        if (response.ok || response.status === 404) {
          delivered = true;
          window.clearInterval(retry);
        }
      } catch {
        // The scheduled cleanup remains the fallback if delivery cannot be confirmed.
      }
    };
    const retry = window.setInterval(() => { void acknowledge(); }, 5_000);
    void acknowledge();
    return () => window.clearInterval(retry);
  }, [roomId, enabled]);

  return null;
}
