"use client";

import { createClient } from "@/lib/supabase/client";

export interface MultiplayerRoomEvent {
  roomId: string;
  stateVersion: number;
  kind: string;
  questionNumber: number;
  intermissionEndsAt: number | null;
}

export function subscribeToMultiplayerRoom(roomId: string, onRoomChange: (event?: MultiplayerRoomEvent) => void) {
  const supabase = createClient();
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  const scheduleRefresh = (message: { payload?: unknown }) => {
    const event = message.payload as MultiplayerRoomEvent | undefined;
    if (event?.roomId === roomId && Number.isSafeInteger(event.stateVersion)) {
      onRoomChange(event);
      return;
    }
    if (refreshTimer) return;
    refreshTimer = setTimeout(() => { refreshTimer = null; onRoomChange(); }, 100);
  };

  const channel = supabase
    .channel(`multiplayer-room:${roomId}`)
    .on(
      "broadcast",
      { event: "room_changed" },
      scheduleRefresh,
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") onRoomChange();
    });

  return () => {
    if (refreshTimer) clearTimeout(refreshTimer);
    void supabase.removeChannel(channel);
  };
}
