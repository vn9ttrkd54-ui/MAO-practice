"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { withRequestTimeout } from "@/lib/requestTimeout";
import type { MultiplayerPublicRoom } from "@/types/multiplayer";

export function LiveRoomListRefresh({ onRooms }: { onRooms: (rooms: MultiplayerPublicRoom[]) => void }) {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const lifecycle = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let pageTimer: ReturnType<typeof setTimeout> | undefined;
    const phases = new Map<string, string>();
    let pending = false, queued = false, stopped = false;
    let lastPageRefresh = Date.now();
    const refreshPage = () => {
      // History and ongoing games need far fewer full server renders than rosters.
      if (stopped || document.visibilityState !== "visible") return;
      const remaining = 5_000 - (Date.now() - lastPageRefresh);
      if (remaining > 0) {
        if (!pageTimer) pageTimer = setTimeout(() => { pageTimer = undefined; refreshPage(); }, remaining);
        return;
      }
      lastPageRefresh = Date.now();
      router.refresh();
    };
    const refresh = async () => {
      if (stopped || document.visibilityState !== "visible") return;
      if (pending) { queued = true; return; }
      pending = true;
      try {
        const rooms = await withRequestTimeout(async signal => {
          const response = await fetch("/api/multiplayer/public-rooms", { signal });
          if (!response.ok) throw new Error("Room refresh failed");
          const rooms = await response.json();
          if (!Array.isArray(rooms)) throw new Error("Invalid rooms");
          return rooms as MultiplayerPublicRoom[];
        }, { timeoutMs: 8_000, signal: lifecycle.signal });
        if (!stopped) onRooms(rooms);
      } catch { /* Retain the last good list; backup and focus refreshes retry. */ }
      finally {
        pending = false;
        if (queued && !stopped) { queued = false; schedule(); }
      }
    };
    const schedule = () => {
      if (stopped || timer || document.visibilityState !== "visible") return;
      timer = setTimeout(() => { timer = undefined; void refresh(); }, 150);
    };
    const changed = (payload: { new?: { id?: string; status?: string }; old?: { id?: string }; eventType?: string }) => {
      schedule();
      // One trailing read covers notifications received before the shared CDN
      // entry expires. This is event-driven, not a recurring fast poll.
      if (!settleTimer) settleTimer = setTimeout(() => { settleTimer = undefined; schedule(); }, 1_200);
      const id = payload.new?.id ?? payload.old?.id;
      const status = payload.new?.status;
      if (payload.eventType === "DELETE") {
        if (id) phases.delete(id);
        refreshPage();
      } else if (id && status) {
        if (phases.get(id) !== status && ["in-progress", "completed", "cancelled"].includes(status)) refreshPage();
        phases.set(id, status);
      }
    };
    const channel = supabase.channel("multiplayer-public-room-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "multiplayer_rooms", filter: "visibility=eq.public" }, changed)
      .subscribe(status => { if (status === "SUBSCRIBED") schedule(); });
    void refresh();
    // Subscription can start just after the event that changed the initial page.
    // Recheck once after any pre-mount CDN entry expires, even without an event.
    settleTimer = setTimeout(() => { settleTimer = undefined; schedule(); }, 1_200);
    const backup = setInterval(schedule, 10_000);
    const pageBackup = setInterval(refreshPage, 60_000);
    document.addEventListener("visibilitychange", schedule);
    window.addEventListener("focus", schedule);
    window.addEventListener("online", schedule);
    return () => {
      stopped = true;
      lifecycle.abort();
      clearTimeout(timer);
      clearTimeout(settleTimer);
      clearTimeout(pageTimer);
      clearInterval(backup);
      clearInterval(pageBackup);
      document.removeEventListener("visibilitychange", schedule);
      window.removeEventListener("focus", schedule);
      window.removeEventListener("online", schedule);
      void supabase.removeChannel(channel);
    };
  }, [router, onRooms]);
  return null;
}
