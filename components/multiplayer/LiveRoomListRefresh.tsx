"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";

export function LiveRoomListRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    let refreshOnReturn = false;

    const scheduleRefresh = () => {
      if (document.visibilityState !== "visible") {
        refreshOnReturn = true;
        return;
      }
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        refreshOnReturn = false;
        router.refresh();
      }, 150);
    };

    const refreshAfterReturn = () => {
      if (document.visibilityState !== "visible") {
        refreshOnReturn = true;
        return;
      }
      if (refreshOnReturn) scheduleRefresh();
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
    const pollTimer = window.setInterval(scheduleRefresh, 10_000);
    document.addEventListener("visibilitychange", refreshAfterReturn);
    window.addEventListener("focus", scheduleRefresh);

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      window.clearInterval(pollTimer);
      document.removeEventListener("visibilitychange", refreshAfterReturn);
      window.removeEventListener("focus", scheduleRefresh);
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
