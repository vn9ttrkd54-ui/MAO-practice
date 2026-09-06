"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import MathText from "@/components/math/MathText";
import { RankIcon, RankPill, rankSecondaryClass, rankThemeClass } from "@/components/multiplayer/RankTheme";
import { subscribeToMultiplayerRoom } from "@/lib/multiplayerRealtime";
import { sendMultiplayerAnswer, SubmissionRejectedError } from "@/lib/multiplayerSubmission";
import { FIRST_QUESTION_READY_MS, MultiplayerClock, questionDisplayDeadline } from "@/lib/multiplayerTiming";
import type { MultiplayerRoundState } from "@/types/multiplayer";
import type { AnswerChoice } from "@/types/question";

const labels: AnswerChoice[] = ["A", "B", "C", "D", "E"];

function SpectatorList({ round }: { round: MultiplayerRoundState }) {
  if (round.spectators.length === 0) return null;
  return <aside className="rounded-2xl border bg-gray-50 p-4"><h2 className="text-sm font-bold">Spectators · {round.spectators.length}</h2><div className="mt-3 space-y-2">{round.spectators.map((person) => <div key={person.playerId} className="rounded-xl bg-white px-3 py-2 shadow-sm"><p className="truncate text-sm font-semibold">{person.displayName}</p><div className="mt-1 flex items-center gap-2"><RankPill rank={person.rankTier} /><span className="text-xs text-gray-500">{person.rp} RP</span></div></div>)}</div></aside>;
}

export default function MatchQuestion({ round: initialRound }: { round: MultiplayerRoundState }) {
  const router = useRouter();
  const [round, setRound] = useState(initialRound);
  const displayEndsAt = questionDisplayDeadline(round);
  const [serverClock] = useState(() => new MultiplayerClock(Date.now(), performance.now()));
  const [clockRevision, setClockRevision] = useState(0);
  const [now, setNow] = useState<number | null>(null);
  const [selected, setSelected] = useState<AnswerChoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [outbox, setOutbox] = useState<Array<{ questionId: number; questionNumber: number; selectedAnswer: AnswerChoice; status: "pending" | "failed"; message?: string }>>([]);
  const submissionsInFlight = useRef(new Set<number>());
  const currentSubmission = outbox.find((entry) => entry.questionId === round.question.questionId);
  const isSubmitting = currentSubmission?.status === "pending";
  const [pendingRound, setPendingRound] = useState<MultiplayerRoundState | null>(null);
  const questionNumber = useRef(initialRound.questionNumber);
  const refreshRound = useRef<() => void>(() => undefined);
  const currentPlayer = round.players.find((player) => player.playerId === round.currentPlayerId);
  const submitted = currentPlayer?.hasSubmittedCurrentQuestion ?? false;
  const secondsLeft = now === null ? null : Math.max(0, Math.ceil((displayEndsAt - now) / 1000));
  const effectiveIntermissionEndsAt = round.intermissionEndsAt
    ?? (pendingRound?.questionNumber === round.questionNumber + 1 ? pendingRound.questionStartedAt : null);
  const intermissionLeft = now === null || !effectiveIntermissionEndsAt
    ? null
    : Math.max(0, Math.ceil((effectiveIntermissionEndsAt - now) / 1000));
  const questionStartsIn = now === null ? null : Math.max(0, Math.ceil((round.questionStartedAt - now) / 1000));

  useEffect(() => {
    let stopped = false;
    let requestInFlight = false;
    let refreshQueued = false;
    const clock = window.setInterval(() => setNow(serverClock.now(performance.now())), 250);

    async function pollRound() {
      if (requestInFlight) {
        refreshQueued = true;
        return;
      }
      requestInFlight = true;
      try {
        const sentTick = performance.now();
        const response = await fetch(`/api/multiplayer/rooms/${round.roomId}/round`, { cache: "no-store", signal: AbortSignal.timeout(8_000) });
        if (stopped) return;
        if (response.status === 204) {
          setFinished(true);
          router.replace(`/multiplayer/room/${round.roomId}/results`);
          return;
        }
        if (response.status === 200) {
          let nextRound = await response.json() as MultiplayerRoundState & { serverReceivedAt: number; serverSentAt: number };
          if (stopped) return;
          if (serverClock.synchronize(sentTick, performance.now(), nextRound.serverReceivedAt, nextRound.serverSentAt)) {
            setNow(serverClock.now(performance.now()));
            setClockRevision((value) => value + 1);
          }
          setError((current) => current === "Connection interrupted. Reconnecting…" ? null : current);
          const upcoming = nextRound.upcomingQuestion;
          if (upcoming && upcoming.questionNumber > questionNumber.current) {
            const preloadedRound: MultiplayerRoundState = {
              ...nextRound,
              questionNumber: upcoming.questionNumber,
              question: upcoming.question,
              questionStartedAt: upcoming.questionStartedAt,
              questionEndsAt: upcoming.questionEndsAt,
              intermissionEndsAt: null,
              players: nextRound.players.map((player) => ({
                ...player,
                hasSubmittedCurrentQuestion: false,
              })),
              upcomingQuestion: null,
            };
            setPendingRound((current) => current?.questionNumber === upcoming.questionNumber
              ? current
              : preloadedRound);
          }
          if (nextRound.questionNumber >= questionNumber.current) {
            if (nextRound.questionNumber > questionNumber.current) {
              // Concurrent transition requests can briefly return player flags
              // read from the previous question. A new round always starts clean.
              nextRound = {
                ...nextRound,
                players: nextRound.players.map((player) => ({
                  ...player,
                  hasSubmittedCurrentQuestion: false,
                })),
              };
              if (nextRound.questionStartedAt > serverClock.now(performance.now())) {
                setPendingRound((current) => current?.questionNumber === nextRound.questionNumber ? current : nextRound);
                return;
              }
              questionNumber.current = nextRound.questionNumber;
              setPendingRound(null);
              setSelected(null);
              setShowLeaderboard(false);
            }
            setRound(nextRound);
          }
        }
      } catch {
        if (!stopped) setError("Connection interrupted. Reconnecting…");
      } finally {
        requestInFlight = false;
        if (refreshQueued && !stopped) {
          refreshQueued = false;
          void pollRound();
        }
      }
    }

    refreshRound.current = () => void pollRound();
    void pollRound();
    const unsubscribe = subscribeToMultiplayerRoom(round.roomId, refreshRound.current);
    const recoveryPoll = window.setInterval(refreshRound.current, 7_000);
    const recover = () => {
      setNow(serverClock.now(performance.now()));
      refreshRound.current();
    };
    window.addEventListener("online", recover);
    window.addEventListener("focus", recover);
    return () => {
      stopped = true;
      refreshRound.current = () => undefined;
      window.clearInterval(clock);
      window.clearInterval(recoveryPoll);
      window.removeEventListener("online", recover);
      window.removeEventListener("focus", recover);
      unsubscribe();
    };
  }, [round.roomId, router, serverClock]);

  useEffect(() => {
    let stopped = false;
    let retryTimer: number | null = null;
    const deliveredQuestionNumber = round.questionNumber;
    let attempts = 0;

    async function acknowledgeDelivery() {
      attempts += 1;
      try {
        const response = await fetch(`/api/multiplayer/rooms/${round.roomId}/delivery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionNumber: deliveredQuestionNumber }),
          signal: AbortSignal.timeout(5_000),
        });
        if (!response.ok) throw new Error("Delivery acknowledgement failed.");
        // Receipt timing never changes the visible deadline or answer controls.
      } catch {
        if (!stopped && attempts < 3) {
          retryTimer = window.setTimeout(acknowledgeDelivery, 1_500);
        }
      }
    }

    void acknowledgeDelivery();
    return () => {
      stopped = true;
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [round.questionNumber, round.roomId]);

  useEffect(() => {
    if (!pendingRound) return;
    let stopped = false;
    let retryTimer: number | null = null;
    let attempts = 0;

    async function acknowledgePendingDelivery() {
      attempts += 1;
      try {
        const response = await fetch(`/api/multiplayer/rooms/${pendingRound!.roomId}/delivery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionNumber: pendingRound!.questionNumber }),
          signal: AbortSignal.timeout(5_000),
        });
        if (!response.ok) throw new Error("Pending delivery acknowledgement failed.");
        // Preload acknowledgement is independent of local reveal.
      } catch {
        if (!stopped && attempts < 3) retryTimer = window.setTimeout(acknowledgePendingDelivery, 1_500);
      }
    }

    void acknowledgePendingDelivery();
    const revealDelay = Math.max(0, pendingRound.questionStartedAt - serverClock.now(performance.now()));
    const revealTimer = window.setTimeout(() => {
      if (stopped || pendingRound.questionNumber <= questionNumber.current) return;
      questionNumber.current = pendingRound.questionNumber;
      setNow(serverClock.now(performance.now()));
      setSelected(null);
      setShowLeaderboard(false);
      // The server can safely accept an answer even if the idempotent delivery
      // receipt is still finishing, so reveal the question and controls together.
      setRound(pendingRound);
      setPendingRound(null);
    }, revealDelay);

    return () => {
      stopped = true;
      window.clearTimeout(revealTimer);
      if (retryTimer !== null) window.clearTimeout(retryTimer);
    };
  }, [pendingRound, serverClock, clockRevision]);

  useEffect(() => {
    const boundary = round.intermissionEndsAt ?? round.questionEndsAt;
    const delay = Math.max(0, boundary - serverClock.now(performance.now()) + 100);
    const boundaryTimer = window.setTimeout(() => refreshRound.current(), delay);
    const preflightDelay = round.intermissionEndsAt
      ? Math.max(0, round.intermissionEndsAt - serverClock.now(performance.now()) - 4_000)
      : null;
    const preflightTimer = preflightDelay === null
      ? null
      : window.setTimeout(() => refreshRound.current(), preflightDelay);
    return () => {
      window.clearTimeout(boundaryTimer);
      if (preflightTimer !== null) window.clearTimeout(preflightTimer);
    };
  }, [round.intermissionEndsAt, round.questionEndsAt, serverClock, clockRevision]);

  async function submitAnswer() {
    if ((!selected && !currentSubmission) || isSubmitting) return;
    setError(null);
    setShowLeaderboard(true);
    await submitSavedAnswer(currentSubmission ?? {
      questionId: round.question.questionId,
      questionNumber: round.questionNumber,
      selectedAnswer: selected!,
    });
  }

  async function submitSavedAnswer(answer: { questionId: number; questionNumber: number; selectedAnswer: AnswerChoice }) {
    if (submissionsInFlight.current.has(answer.questionId)) return;
    submissionsInFlight.current.add(answer.questionId);
    setOutbox((current) => [...current.filter((entry) => entry.questionId !== answer.questionId), { ...answer, status: "pending" }]);
    try {
      await sendMultiplayerAnswer({ roomId: round.roomId, questionId: answer.questionId, selectedAnswer: answer.selectedAnswer });
      setOutbox((current) => current.filter((entry) => entry.questionId !== answer.questionId));
      setRound((current) => current.question.questionId !== answer.questionId ? current : ({
        ...current,
        players: current.players.map((player) => player.playerId === current.currentPlayerId
          ? { ...player, hasSubmittedCurrentQuestion: true }
          : player),
      }));
      if (questionNumber.current === answer.questionNumber) setShowLeaderboard(true);
      refreshRound.current();
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : "Unable to confirm answer.";
      setOutbox((current) => current.map((entry) => entry.questionId === answer.questionId
        ? { ...entry, status: "failed", message } : entry));
      if (failure instanceof SubmissionRejectedError) refreshRound.current();
    } finally {
      submissionsInFlight.current.delete(answer.questionId);
    }
  }

  const submissionNotice = outbox.length === 0 ? null : (
    <div className="my-4 space-y-2" aria-live="polite">
      {outbox.map((entry) => <div key={entry.questionId} className="rounded-xl border bg-gray-50 p-3 text-sm">
        <p>Question {entry.questionNumber}, answer {entry.selectedAnswer}: {entry.status === "pending" ? "Confirming your answer…" : entry.message}</p>
        {entry.status === "failed" ? <button className="mt-2 font-semibold text-blue-600" onClick={() => void submitSavedAnswer(entry)}>Retry saved answer</button> : null}
      </div>)}
    </div>
  );

  if (finished) {
    return <main className="mx-auto max-w-3xl px-6 py-16 text-center"><div className="rounded-3xl border bg-white p-10 shadow-sm"><h1 className="text-3xl font-bold">Match complete</h1><p className="mt-3 text-gray-600">Loading final results and question review…</p></div></main>;
  }

  const inIntermission = effectiveIntermissionEndsAt !== null;
  const personalTimeExpired = secondsLeft === 0;
  if (inIntermission || submitted || showLeaderboard || personalTimeExpired) {
    const leaderboard = [...round.players].sort((a, b) => b.score - a.score);
    return <main className="mx-auto max-w-5xl px-6 py-8"><header className="text-center"><p className="text-sm font-semibold text-blue-600">{personalTimeExpired && !submitted ? "Time expired" : isSubmitting ? "Submitting answer…" : currentSubmission ? "Answer awaiting confirmation" : "Answer submitted"}</p><h1 className="mt-1 text-3xl font-bold">Live leaderboard</h1><p className="mt-2 text-gray-600">{inIntermission ? `Next question in ${intermissionLeft ?? 5}s` : "Waiting for the other players…"}</p></header>{submissionNotice}<div className={`mt-6 grid items-start gap-4 ${round.spectators.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_16rem]" : ""}`}><ol className="space-y-3">{leaderboard.map((player, index) => <li key={player.playerId} className={`${player.isGuest ? "border-gray-200 bg-white text-gray-950" : rankThemeClass(player.rankTier ?? "Novice")} flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 shadow-sm`}><div><span className="font-semibold">{index + 1}. {player.displayName}</span><div className={`mt-1 flex items-center gap-1.5 text-xs ${player.isGuest ? "text-gray-500" : rankSecondaryClass}`}>{player.isGuest ? null : <RankIcon rank={player.rankTier ?? "Novice"} size={14} />}<span>{player.isGuest ? "Unranked guest" : player.rankTier}</span></div></div><span className="font-bold tabular-nums">{player.score} pts</span></li>)}</ol><SpectatorList round={round} /></div></main>;
  }

  if (questionStartsIn === null || questionStartsIn > 0) {
    return <main className="mx-auto max-w-3xl px-6 py-16 text-center"><div className="rounded-3xl border bg-white p-10 shadow-sm"><p className="text-sm font-semibold text-blue-600">Get ready</p><h1 className="mt-2 text-3xl font-bold">Question {round.questionNumber} starts in {questionStartsIn ?? FIRST_QUESTION_READY_MS / 1000}s</h1></div></main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
      <header className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-blue-600">{round.question.division} · {round.question.topic}</p><h1 className="mt-1 text-2xl font-bold">Question {round.questionNumber} of {round.totalQuestions}</h1></div><div className={`rounded-2xl px-5 py-3 text-center ${secondsLeft !== null && secondsLeft <= 10 ? "bg-red-100 text-red-700" : "bg-gray-100"}`}><p className="text-xs font-semibold uppercase">Time</p><p className="text-2xl font-bold tabular-nums">{secondsLeft === null ? "--" : `${secondsLeft}s`}</p></div></header>
      <div className={`mt-6 grid items-start gap-4 ${round.spectators.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_16rem]" : ""}`}><section className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
        {submissionNotice}
        <div className="text-lg font-semibold leading-8"><MathText>{round.question.question}</MathText></div>
        <div className="mt-6 grid gap-3">{round.question.choices.map((choice, index) => { const label = labels[index]; const active = selected === label; return <button key={label} disabled={submitted || secondsLeft === null || secondsLeft === 0} onClick={() => setSelected(label)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left ${active ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "hover:bg-gray-50"} disabled:cursor-not-allowed disabled:opacity-60`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold">{label}</span><MathText>{choice}</MathText></button>; })}</div>
        {error ? <p role="alert" className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button onClick={submitAnswer} disabled={!selected || submitted || isSubmitting || secondsLeft === null || secondsLeft === 0} className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600">{isSubmitting ? "Submitting…" : submitted ? "Answer submitted" : "Submit Answer"}</button>
      </section>
      <SpectatorList round={round} />
      </div>
    </main>
  );
}
