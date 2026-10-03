"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { nextLobbyConnection } from "@/lib/multiplayerLobbyConnection";
import { subscribeToMultiplayerRoom } from "@/lib/multiplayerRealtime";
import { withRequestTimeout } from "@/lib/requestTimeout";
import type { MultiplayerDifficultyBand, MultiplayerLobbyState } from "@/types/multiplayer";

export function useLobbyConnection(initialLobby: MultiplayerLobbyState) {
  const [lobby, setLobby] = useState(initialLobby);
  const [warning, setWarning] = useState(false);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const [blocked, setBlocked] = useState("");
  const operations = useRef<{ retry: () => void; leave: () => Promise<void>;
    saveDifficulty: (band: MultiplayerDifficultyBand, version: number) => Promise<void> }>({
    retry: () => {}, leave: async () => {}, saveDifficulty: async () => { throw new Error("Connect to the lobby first."); },
  });
  const router = useRouter();
  const roomId = initialLobby.room.id;
  const playerId = initialLobby.currentPlayer.playerId;

  useEffect(() => {
    const endpoint = `/api/multiplayer/rooms/${roomId}/lobby`;
    let connection = nextLobbyConnection(roomId);
    let stopped = false, suspended = false, navigating = false, leavingRoom = false, blockedRoom = false;
    let connected = false, inFlight = false, leaveInFlight = false, queuedRead = false, queuedHeartbeat = false;
    let version = -1;
    let active: AbortController | null = null;
    let eventTimer: ReturnType<typeof setTimeout> | undefined;
    let boundaryTimer: ReturnType<typeof setTimeout> | undefined;
    let attemptedBoundary: number | null = null;
    const canUpdate = () => !stopped && !suspended && !navigating && !leavingRoom && !blockedRoom;

    function apply(next: MultiplayerLobbyState) {
      if (!canUpdate() || next.room.stateVersion < version) return;
      version = next.room.stateVersion;
      setLobby(next);
      setWarning(false);
      clearTimeout(boundaryTimer);
      if (next.room.status === "in-progress" || next.room.status === "completed") {
        navigating = true;
        router.replace(`/multiplayer/room/${roomId}/${next.room.status === "completed" ? "results" : "play"}`);
      } else if (next.room.status === "cancelled") {
        navigating = true;
        router.replace("/multiplayer");
      } else if (next.room.countdownEndsAt && next.room.countdownEndsAt !== attemptedBoundary) {
        // One start-boundary heartbeat, not a faster periodic poll.
        const deadline = next.room.countdownEndsAt;
        boundaryTimer = setTimeout(() => {
          attemptedBoundary = deadline;
          void refresh(true);
        }, Math.max(100, deadline - Date.now() + 100));
      } else if (!next.room.countdownEndsAt) {
        attemptedBoundary = null;
      }
    }

    async function refresh(heartbeat = false) {
      if (!canUpdate()) return;
      if (inFlight) { queuedRead = true; queuedHeartbeat ||= heartbeat; return; }
      inFlight = true;
      const controller = new AbortController();
      active = controller;
      const action = !connected ? "connect" : heartbeat ? "heartbeat" : null;
      try {
        const { response, payload } = await withRequestTimeout(async (signal) => {
          const response = await fetch(endpoint, action ? {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, playerId, ...connection }), signal,
          } : { cache: "no-store", signal });
          return { response, payload: await response.json() };
        }, { timeoutMs: 8_000, signal: controller.signal });
        if (!canUpdate()) return;
        if (response.status === 404 || payload.status === "left") {
          navigating = true;
          router.replace("/multiplayer");
          return;
        }
        if (!response.ok) throw new Error("Unable to refresh lobby");
        if (payload.status === "conflict" || payload.status === "disconnected" || payload.status === "full") {
          blockedRoom = true;
          setReady(false);
          setBlocked(payload.status === "full" ? "This room filled while you were away. Return to rooms to join another one." : "This room connection is no longer active. Return to your active tab, or reload after closing it.");
          return;
        }
        const next = action ? payload.lobby : payload;
        if (!next?.room || !Array.isArray(next.players)) throw new Error("Invalid lobby update");
        if (action) { connected = true; setReady(true); }
        apply(next as MultiplayerLobbyState);
      } catch {
        if (canUpdate()) setWarning(true);
      } finally {
        inFlight = false;
        if (active === controller) active = null;
        if (queuedRead && canUpdate()) {
          const heartbeat = queuedHeartbeat;
          queuedRead = queuedHeartbeat = false;
          void refresh(heartbeat);
        }
      }
    }

    function disconnect() {
      if (navigating || leavingRoom || suspended || blockedRoom) return;
      suspended = true;
      active?.abort();
      // Explicit presence message, fenced to this page generation. A delayed
      // message cannot disconnect a newer page or change an active game's roster.
      void fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect", playerId, ...connection }), keepalive: true }).catch(() => undefined);
    }

    async function leave() {
      if (stopped || navigating || blockedRoom || !connected || leaveInFlight) return;
      leaveInFlight = true;
      leavingRoom = true;
      setLeaving(true);
      setLeaveError("");
      active?.abort();
      clearTimeout(boundaryTimer);
      try {
        const payload = await withRequestTimeout(async signal => {
          const response = await fetch(endpoint, { method: "DELETE", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ connectionId: connection.connectionId }), signal });
          const payload = await response.json();
          if (!response.ok) throw new Error("Leave not confirmed");
          return payload;
        }, { timeoutMs: 8_000 });
        if (stopped) return;
        if (payload.status === "left") {
          navigating = true;
          // A distinct destination avoids restoring the pre-leave directory view.
          router.replace(`/multiplayer?left=${encodeURIComponent(roomId)}`);
        } else if (payload.status === "started") {
          blockedRoom = true;
          setBlocked("The game started before your leave was accepted. You are still in that game; use Rejoin Game to return.");
          setLeaving(false);
        } else if (payload.status === "conflict") {
          blockedRoom = true;
          setBlocked("Your room connection changed in another tab. Reload to check your current membership.");
          setLeaving(false);
        } else throw new Error("Invalid leave confirmation");
      } catch {
        if (!stopped) {
          setLeaving(false);
          setLeaveError("Your leave has not been confirmed. Retry leave to check safely; you may already be out.");
        }
      } finally {
        leaveInFlight = false;
      }
      // On an ambiguous timeout do not resume heartbeats or falsely claim success.
    }

    async function saveDifficulty(difficultyBand: MultiplayerDifficultyBand, settingsVersion: number) {
      if (!canUpdate() || !connected) throw new Error("Reconnect to the lobby before changing settings.");
      const next = await withRequestTimeout(async signal => {
        const response = await fetch(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ difficultyBand, settingsVersion, connectionId: connection.connectionId, playerId }), signal });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Unable to save difficulty. Please retry.");
        if (!payload?.room || !Array.isArray(payload.players)) throw new Error("Unable to confirm the new settings. Retry the lobby connection.");
        return payload as MultiplayerLobbyState;
      }, { timeoutMs: 8_000 });
      apply(next);
    }

    const retry = () => void refresh(true);
    const resume = () => {
      if (document.visibilityState !== "visible" || stopped || leavingRoom || blockedRoom || navigating) return;
      if (suspended) { connection = nextLobbyConnection(roomId); connected = false; suspended = false; }
      void refresh(true);
    };
    const outsideLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin === window.location.origin && !destination.pathname.startsWith(`/multiplayer/room/${roomId}`)) disconnect();
    };
    operations.current = { retry, leave, saveDifficulty };
    void refresh(true);
    const unsubscribe = subscribeToMultiplayerRoom(roomId, event => {
      // Broadcasts are hints, never trusted roster data. Coalesce bursts and read
      // one authenticated SQL snapshot; never copy arbitrary broadcast payloads.
      if (!canUpdate() || (event && event.stateVersion <= version) || eventTimer) return;
      eventTimer = setTimeout(() => { eventTimer = undefined; void refresh(); }, 100);
    });
    const heartbeat = setInterval(() => void refresh(true), 5_000);
    window.addEventListener("pagehide", disconnect);
    window.addEventListener("popstate", disconnect);
    window.addEventListener("pageshow", resume);
    window.addEventListener("focus", resume);
    window.addEventListener("online", resume);
    document.addEventListener("visibilitychange", resume);
    document.addEventListener("click", outsideLink, true);
    return () => {
      disconnect();
      stopped = true;
      active?.abort();
      clearInterval(heartbeat);
      clearTimeout(eventTimer);
      clearTimeout(boundaryTimer);
      unsubscribe();
      operations.current = { retry: () => {}, leave: async () => {}, saveDifficulty: async () => { throw new Error("Reconnect to the lobby first."); } };
      window.removeEventListener("pagehide", disconnect);
      window.removeEventListener("popstate", disconnect);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("focus", resume);
      window.removeEventListener("online", resume);
      document.removeEventListener("visibilitychange", resume);
      document.removeEventListener("click", outsideLink, true);
    };
  }, [roomId, playerId, router]);

  return { lobby, warning, ready, leaving, leaveError, blocked,
    retry: () => operations.current.retry(), leave: () => operations.current.leave(),
    saveDifficulty: (band: MultiplayerDifficultyBand, version: number) => operations.current.saveDifficulty(band, version) };
}
