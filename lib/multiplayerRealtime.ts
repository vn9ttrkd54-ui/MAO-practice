"use client";

import { createClient } from "@/lib/supabase/client";

export function subscribeToMultiplayerRoom(roomId: string, onRoomChange: () => void) {
  const supabase = createClient();
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  const scheduleRefresh = () => {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(onRoomChange, 100);
  };

  const channel = supabase
    .channel(`multiplayer-room:${roomId}`)
    .on(
      "broadcast",
      { event: "room_changed" },
      scheduleRefresh,
    )
    .subscribe();

  return () => {
    if (refreshTimer) clearTimeout(refreshTimer);
    void supabase.removeChannel(channel);
  };
}
