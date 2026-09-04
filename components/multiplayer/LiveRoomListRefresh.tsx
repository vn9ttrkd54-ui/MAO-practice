"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";

export function LiveRoomListRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => router.refresh(), 150);
    };

    const channel = supabase
      .channel("multiplayer-public-room-list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "multiplayer_rooms",
          filter: "visibility=eq.public",
        },
        scheduleRefresh,
      )
      .subscribe();
    const pollTimer = window.setInterval(() => router.refresh(), 10_000);

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      window.clearInterval(pollTimer);
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
