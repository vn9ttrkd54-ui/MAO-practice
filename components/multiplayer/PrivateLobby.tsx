"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { startPrivateRoomAction } from "@/app/multiplayer/actions";
import PendingSubmitButton from "@/components/multiplayer/PendingSubmitButton";
import { RankIcon, rankSecondaryClass, rankThemeClass } from "@/components/multiplayer/RankTheme";
import { useLobbyConnection } from "@/components/multiplayer/useLobbyConnection";
import type { MultiplayerDifficultyBand, MultiplayerLobbyState } from "@/types/multiplayer";

interface PrivateLobbyProps {
  initialLobby: MultiplayerLobbyState;
  error?: string;
}

export default function PrivateLobby({ initialLobby, error }: PrivateLobbyProps) {
  const { lobby, receivedAt, warning, ready, leaving, leaveError, blocked, retry, leave, saveDifficulty, setLobbyReady } = useLobbyConnection(initialLobby);
  const [now, setNow] = useState<number | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [savingReady, setSavingReady] = useState(false);
  const [readyError, setReadyError] = useState<{ value: boolean; version: number; message: string } | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  const isHost = lobby.currentPlayer.isHost;
  const started = lobby.room.status === "in-progress" || lobby.room.status === "completed";
  const publicRoom = lobby.room.visibility === "public";
  // A freshly shortened deadline must not use the previous interval's clock
  // value (which could briefly display 11 seconds or unlock the settings).
  const clockNow = now === null && receivedAt === null ? null : Math.max(now ?? 0, receivedAt ?? 0);
  const countdown = clockNow !== null && lobby.room.countdownEndsAt ? Math.max(0, Math.ceil((lobby.room.countdownEndsAt - clockNow) / 1000)) : null;
  const settingsLocked = started || (lobby.room.countdownEndsAt !== null && (clockNow === null || (countdown ?? 0) <= 10));
  const playerReady = lobby.currentPlayer.lobbyReady === true;
  // A lost response is retried with the same desired value, never as a toggle.
  const readyFailure = readyError?.version === lobby.room.settingsVersion && readyError.value !== playerReady ? readyError : null;
  const readyCount = lobby.players.filter(player => player.lobbyReady).length;

  return (
    <>
      {warning && !leaving && !leaveError && !blocked ? <div role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Connection interrupted. Reconnecting to the lobby… <button type="button" onClick={retry} className="ml-2 font-semibold underline">Retry now</button></div> : null}
      {leaveError ? <div role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{leaveError}</div> : null}
      {blocked ? <div role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{blocked} <Link href="/multiplayer" className="ml-2 font-semibold underline">Back to rooms</Link>{blocked.includes("game started") ? <Link href={`/multiplayer/room/${lobby.room.id}/play`} className="ml-2 font-semibold underline">Rejoin Game</Link> : null}</div> : null}
      {error ? <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-7 grid gap-5 md:grid-cols-[1fr_0.75fr]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Players</h2>
            <span className="text-sm text-gray-500">{lobby.players.length}/{lobby.room.capacity}</span>
          </div>
          <ul className="mt-3 space-y-3">
            {lobby.players.map((player) => (
              <li key={player.playerId} className={`${player.isGuest ? "border-gray-200 bg-white text-gray-950" : rankThemeClass(player.rankTier ?? "Novice")} flex items-center justify-between gap-4 rounded-lg border px-4 py-4`}>
                <div>
                  <p className="font-semibold">{player.displayName}{player.isHost ? <span className="ml-2 rounded-full border border-current/30 bg-white/15 px-2 py-0.5 text-[10px] font-bold">HOST</span> : null}</p>
                  <div className={`mt-1 flex items-center gap-2 text-xs ${player.isGuest ? "text-gray-500" : rankSecondaryClass}`}>
                    {player.isGuest ? null : <RankIcon rank={player.rankTier ?? "Novice"} size={14} />}
                    <span>{player.isGuest ? "Unranked guest" : `${player.rankTier} · ${player.rp} RP`}</span>
                  </div>
                </div>
                {publicRoom && !started ? <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${player.lobbyReady ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-600"}`}>{player.lobbyReady ? "Ready" : "Not ready"}</span> : <span className="h-2.5 w-2.5 rounded-full shrink-0 bg-blue-500 ring-4 ring-blue-100/50" aria-label="Connected" />}
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-slate-50 p-5">
          <h2 className="font-bold">Room settings</h2>
          {publicRoom || lobby.room.scoringVersion === 3 ? <section aria-label="How scoring works" className="mt-3 border-b border-blue-200 pb-4">
            <h3 className="text-sm font-semibold">How scoring works</h3>
            {lobby.room.scoringVersion === 3 ? <>
              <p className="mt-2 text-sm text-gray-700">Correct answers earn 750 points plus up to 750 speed bonus, based on the time remaining. The faster you answer, the bigger the bonus.</p>
              <p className="mt-2 text-sm text-gray-700">Wrong answers always lose 300 points, regardless of when you answer.</p>
              <p className="mt-2 text-sm text-gray-700">Blank answers, timeouts and giving up earn 0 points.</p>
            </> : lobby.room.scoringVersion === 2 ? <>
              <p className="mt-2 text-sm text-gray-700">Correct answers earn 1,000 points plus up to 500 speed bonus. The faster you answer, the bigger the bonus.</p>
              <p className="mt-2 text-sm text-gray-700">Wrong answers lose 300 points. Blank answers or giving up earn 0 points.</p>
            </> : <p className="mt-2 text-sm text-gray-700">Correct answers earn 1,000–1,500 points based on speed and answer order. Wrong or blank answers earn 0 points.</p>}
          </section> : null}
          {!publicRoom && lobby.room.scoringVersion !== 3 ? <p className="mt-2 text-sm text-gray-700">{lobby.room.scoringVersion === 2
            ? "Correct: 1,000 + up to 500 speed bonus · Wrong: −300 · Blank / Give up: 0"
            : "Legacy scoring: correct answers earn 1,000–1,500 points; wrong or blank earns 0."}</p> : null}
          <p className="mt-2 text-sm text-gray-700" aria-live="polite">Difficulty: {lobby.room.settings.difficultyBand?.replace("-", "–") ?? "1–5 (legacy room)"} · {lobby.room.settings.secondsPerQuestion}s per question</p>
          {isHost && !started ? <form className="my-4" onSubmit={async event => {
            event.preventDefault();
            if (savingSettings) return;
            const band = new FormData(event.currentTarget).get("difficultyBand") as MultiplayerDifficultyBand;
            setSavingSettings(true); setSettingsError("");
            try { await saveDifficulty(band, lobby.room.settingsVersion); }
            catch (failure) { setSettingsError(failure instanceof Error ? failure.message : "Unable to save difficulty. Please retry."); }
            finally { setSavingSettings(false); }
          }}>
            <label className="block text-sm font-semibold"><span id="lobby-difficulty-label">Question difficulty</span>
              <select key={`${lobby.room.settingsVersion}:${lobby.room.settings.difficultyBand}`} name="difficultyBand" aria-labelledby="lobby-difficulty-label" defaultValue={lobby.room.settings.difficultyBand ?? "2-4"}
                disabled={!ready || settingsLocked || savingSettings || savingReady || leaving || !!leaveError || !!blocked}
                className="mt-2 min-h-11 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-slate-900 disabled:opacity-60">
                <option value="1-3">Levels 1–3</option><option value="2-4">Levels 2–4</option><option value="3-5">Levels 3–5</option>
              </select>
            </label>
            <button type="submit" disabled={!ready || settingsLocked || savingSettings || savingReady || leaving || !!leaveError || !!blocked}
              className="mt-2 min-h-11 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 disabled:opacity-60">{savingSettings ? "Saving difficulty…" : "Save difficulty"}</button>
            <p className="mt-2 text-xs text-gray-600">{settingsLocked ? "Difficulty is locked for the start." : publicRoom ? "Only you can change difficulty. It locks in the final 10 seconds." : "You can change difficulty before starting."}</p>
          </form> : !started ? <p className="my-3 text-xs text-gray-600">The host chooses the difficulty.</p> : null}
          {settingsError ? <p role="alert" className="my-3 text-sm text-red-700">{settingsError}</p> : null}
          <h2 className="font-bold">Ready to play?</h2>
          <p className="mt-2 text-sm text-gray-600">{publicRoom ? (lobby.room.status === "countdown" ? countdown === null ? "Checking countdown…" : `Match begins in ${countdown}s` : "The countdown begins when a second player joins.") : isHost ? "Start whenever everyone has joined." : "Waiting for the host to start the game."}</p>
          {publicRoom && !started ? <div className="mt-4">
            <p className="text-sm font-semibold text-slate-700" aria-live="polite">{readyCount}/{lobby.players.length} ready</p>
            <button type="button" aria-pressed={playerReady} aria-busy={savingReady}
              disabled={!ready || savingReady || savingSettings || leaving || !!leaveError || !!blocked}
              onClick={async () => {
                if (savingReady) return;
                const value = readyFailure?.value ?? !playerReady;
                const version = lobby.room.settingsVersion;
                setSavingReady(true); setReadyError(null);
                try { await setLobbyReady(value, version); }
                catch (failure) { setReadyError({ value, version, message: failure instanceof Error ? failure.message : "Unable to save Ready. Please retry." }); }
                finally { setSavingReady(false); }
              }}
              className="mt-2 min-h-11 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
              {savingReady ? "Saving Ready…" : readyFailure ? "Retry Ready" : playerReady ? "Not ready" : "I'm ready"}
            </button>
            {readyFailure ? <p role="alert" className="mt-2 text-sm text-red-700">{readyFailure.message}</p> : null}
          </div> : null}
          {!publicRoom && isHost && !started ? (
            <form action={startPrivateRoomAction} className="mt-5">
              <input type="hidden" name="roomId" value={lobby.room.id} />
              <PendingSubmitButton pendingText="Starting game…" disabled={!ready || savingSettings || leaving || !!leaveError || !!blocked} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Start Game</PendingSubmitButton>
            </form>
          ) : null}
          {!publicRoom && isHost && lobby.players.length === 1 && !started ? <p className="mt-3 text-xs text-gray-500">Solo games automatically become unranked.</p> : null}
          {!started ? <button type="button" disabled={!ready || leaving || !!blocked} aria-busy={leaving} onClick={() => { if (leaveError || publicRoom || !isHost || window.confirm("Close this private room for everyone?")) void leave(); }} className="mt-3 w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-wait disabled:opacity-60">{leaving ? (!publicRoom && isHost ? "Closing room…" : "Leaving room…") : leaveError ? "Retry leave" : !ready ? "Connecting…" : !publicRoom && isHost ? "Close Room" : "Leave Room"}</button> : null}
          {started ? <div className="mt-5 rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-800">Game started</div> : null}
        </aside>
      </div>
    </>
  );
}
