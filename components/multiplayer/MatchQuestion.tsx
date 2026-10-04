"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import MatchWaiting from "./MatchWaiting";
import RoundLeaderboard from "./RoundLeaderboard";
import styles from "./matchSurface.module.css";
import MathText from "@/components/math/MathText";
import { RankPill } from "@/components/multiplayer/RankTheme";
import { subscribeToMultiplayerRoom } from "@/lib/multiplayerRealtime";
import { sendMultiplayerAnswer, SubmissionRejectedError } from "@/lib/multiplayerSubmission";
import { acceptRoundSnapshot, restoreMultiplayerAnswers } from "@/lib/multiplayerRecovery";
import type { SavedMultiplayerAnswer } from "@/lib/multiplayerRecovery";
import { countdownSeconds, MultiplayerClock, questionDisplayDeadline } from "@/lib/multiplayerTiming";
import type { MultiplayerRoundState } from "@/types/multiplayer";
import type { AnswerChoice } from "@/types/question";

const labels: AnswerChoice[] = ["A", "B", "C", "D", "E"];

function preloadedRound(round: MultiplayerRoundState): MultiplayerRoundState | null {
  const upcoming = round.upcomingQuestion;
  if (!upcoming) return null;
  return {
    ...round, ...upcoming, roundClosed: false, intermissionEndsAt: null, upcomingQuestion: null,
    players: round.players.map(player => ({ ...player, roundResult: null, hasSubmittedCurrentQuestion: false })),
  };
}

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
  const stateVersion = useRef(initialRound.stateVersion);
  const lastConfirmedQuestion = useRef<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [selected, setSelected] = useState<AnswerChoice | null>(null);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const [givenUpQuestion, setGivenUpQuestion] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [outbox, setOutbox] = useState<Array<SavedMultiplayerAnswer & { status: "pending" | "failed"; message?: string }>>([]);
  const submissionsInFlight = useRef(new Set<number>());
  const [outboxLoaded, setOutboxLoaded] = useState(false);
  const outboxKey = `multiplayer-answers:${round.roomId}:${round.currentPlayerId}`;
  const currentSubmission = outbox.find((entry) => entry.questionId === round.question.questionId);
  const isSubmitting = currentSubmission?.status === "pending";
  const [pendingRound, setPendingRound] = useState<MultiplayerRoundState | null>(() => preloadedRound(initialRound));
  const questionNumber = useRef(initialRound.questionNumber);
  const refreshRound = useRef<() => void>(() => undefined);
  const navigatingToResults = useRef(false);
  const currentPlayer = round.players.find((player) => player.playerId === round.currentPlayerId);
  const submitted = currentPlayer?.hasSubmittedCurrentQuestion ?? false;
  const secondsLeft = now === null ? null : Math.max(0, Math.ceil((displayEndsAt - now) / 1000));
  const effectiveIntermissionEndsAt = round.intermissionEndsAt
    ?? (pendingRound?.questionNumber === round.questionNumber + 1 ? pendingRound.questionStartedAt : null);
  const intermissionLeft = countdownSeconds(effectiveIntermissionEndsAt ?? 0, now, round.questionNumber + 1);
  const questionStartsIn = countdownSeconds(round.questionStartedAt, now, round.questionNumber);
  const preparingNext = Boolean(round.upcomingQuestion?.preparing || pendingRound?.preparing);
  const readyQuestion = pendingRound?.preparing ? pendingRound.questionNumber
    : round.upcomingQuestion?.preparing ? round.upcomingQuestion.questionNumber
    : round.preparing ? round.questionNumber : null;

  // One idempotent acknowledgement after the question payload reaches React.
  // This never controls scoring time or waits at the reveal boundary.
  useEffect(() => {
    if (readyQuestion === null) return;
    let stopped = false;
    let retryTimer: number | undefined;
    async function acknowledge() {
      try {
        const response = await fetch(`/api/multiplayer/rooms/${round.roomId}/ready`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionNumber: readyQuestion }), signal: AbortSignal.timeout(5_000),
        });
        if (!response.ok && response.status >= 500) throw new Error("Retry readiness");
      } catch {
        if (!stopped) retryTimer = window.setTimeout(() => void acknowledge(), 1500 + Math.random() * 500);
      }
    }
    void acknowledge();
    return () => { stopped = true; window.clearTimeout(retryTimer); };
  }, [readyQuestion, round.roomId]);

  useEffect(() => {
    let stopped = false;
    let requestInFlight = false;
    let refreshQueued = false;
    const clock = window.setInterval(() => setNow(serverClock.now(performance.now())), 250);

    async function pollRound() {
      if (stopped || navigatingToResults.current) return;
      if (requestInFlight) {
        refreshQueued = true;
        return;
      }
      requestInFlight = true;
      try {
        const sentTick = performance.now();
        const response = await fetch(`/api/multiplayer/rooms/${round.roomId}/round?version=${stateVersion.current}`, { cache: "no-store", signal: AbortSignal.timeout(8_000) });
        if (stopped) return;
        if (response.status === 204) {
          navigatingToResults.current = true;
          setFinished(true);
          router.replace(`/multiplayer/room/${round.roomId}/results`);
          return;
        }
        if (!response.ok) throw new Error("Unable to refresh the match.");
        if (response.status === 200) {
          const payload = await response.json();
          const nextRound = payload as MultiplayerRoundState & { serverReceivedAt: number; serverSentAt: number };
          if (stopped) return;
          if (serverClock.synchronize(sentTick, performance.now(), nextRound.serverReceivedAt, nextRound.serverSentAt)) {
            setNow(serverClock.now(performance.now()));
            setClockRevision((value) => value + 1);
          }
          if (payload.unchanged) {
            setError((current) => current === "Connection interrupted. Reconnecting…" ? null : current);
            return;
          }
          if (!acceptRoundSnapshot(nextRound.stateVersion, nextRound.questionNumber, stateVersion.current, questionNumber.current)) return;
          stateVersion.current = nextRound.stateVersion;
          setError((current) => current === "Connection interrupted. Reconnecting…" ? null : current);
          const upcoming = nextRound.upcomingQuestion;
          if (upcoming && upcoming.questionNumber > questionNumber.current) {
            setPendingRound(preloadedRound(nextRound));
          }
          if (nextRound.questionNumber >= questionNumber.current) {
            if (nextRound.questionNumber > questionNumber.current) {
              // The database snapshot includes flags for this exact question.
              if (nextRound.preparing || nextRound.questionStartedAt > serverClock.now(performance.now())) {
                setPendingRound(nextRound);
                return;
              }
              questionNumber.current = nextRound.questionNumber;
              setPendingRound(null);
              setSelected(null);
              setConfirmGiveUp(false);
              setShowLeaderboard(false);
            }
            if (lastConfirmedQuestion.current === nextRound.question.questionId) {
              nextRound.players = nextRound.players.map((player) => player.playerId === nextRound.currentPlayerId
                ? { ...player, hasSubmittedCurrentQuestion: true } : player);
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
    let eventTimer: number | null = null;
    const unsubscribe = subscribeToMultiplayerRoom(round.roomId, (event) => {
      if (event && event.stateVersion <= stateVersion.current) return;
      // Broadcasts are hints, not authority: only authenticated snapshots change state.
      if (eventTimer !== null) return;
      eventTimer = window.setTimeout(() => {
        eventTimer = null;
        refreshRound.current();
      }, 50 + Math.random() * 200);
    });
    const recoveryPoll = window.setInterval(refreshRound.current, 15_000 + Math.random() * 3_000);
    const recover = () => {
      setNow(serverClock.now(performance.now()));
      refreshRound.current();
    };
    const recoverWhenVisible = () => {
      if (document.visibilityState === "visible") recover();
    };
    window.addEventListener("online", recover);
    window.addEventListener("focus", recover);
    window.addEventListener("pageshow", recoverWhenVisible);
    document.addEventListener("visibilitychange", recoverWhenVisible);
    return () => {
      stopped = true;
      refreshRound.current = () => undefined;
      window.clearInterval(clock);
      window.clearInterval(recoveryPoll);
      if (eventTimer !== null) window.clearTimeout(eventTimer);
      window.removeEventListener("online", recover);
      window.removeEventListener("focus", recover);
      window.removeEventListener("pageshow", recoverWhenVisible);
      document.removeEventListener("visibilitychange", recoverWhenVisible);
      unsubscribe();
    };
  }, [round.roomId, router, serverClock]);

  // A few cheap, versioned reads cover lost broadcasts at critical handoffs.
  // Never turn this into per-second polling throughout the game.
  const finalDeadlineReached = round.questionNumber === round.totalQuestions
    && round.questionEndsAt > 0 && now !== null && now >= round.questionEndsAt;
  const fastRecovery = !finished && (round.preparing || finalDeadlineReached ||
    (round.questionNumber === round.totalQuestions && (submitted || round.roundClosed === true)));
  useEffect(() => {
    if (!fastRecovery) return;
    const timers = [800, 1800, 3000].map(delay => window.setTimeout(() => refreshRound.current(), delay + Math.random() * 150));
    return () => timers.forEach(window.clearTimeout);
  }, [fastRecovery, finalDeadlineReached, round.roomId, round.questionNumber]);

  // HTTP acknowledgements never own reveal or countdown. Re-arm only this local
  // timer on a clock correction; no network request is scheduled at a boundary.
  useEffect(() => {
    if (!pendingRound || pendingRound.preparing || !pendingRound.questionStartedAt) return;
    const revealTimer = window.setTimeout(() => {
      if (pendingRound.questionNumber <= questionNumber.current) return;
      questionNumber.current = pendingRound.questionNumber;
      setNow(serverClock.now(performance.now()));
      setSelected(null);
      setConfirmGiveUp(false);
      setShowLeaderboard(false);
      setRound(pendingRound);
      setPendingRound(null);
    }, Math.max(0, pendingRound.questionStartedAt - serverClock.now(performance.now())));
    return () => window.clearTimeout(revealTimer);
  }, [pendingRound, serverClock, clockRevision]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const restored = restoreMultiplayerAnswers(sessionStorage.getItem(outboxKey));
        setOutbox((current) => [...current, ...restored.filter((entry) => !current.some((item) => item.questionId === entry.questionId))
          .map((entry) => ({ ...entry, status: "failed" as const, message: "Saved answer awaiting confirmation." }))]);
      } catch { /* Storage may be disabled; in-memory recovery remains available. */ }
      setOutboxLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [outboxKey]);

  useEffect(() => {
    if (!outboxLoaded) return;
    try { sessionStorage.setItem(outboxKey, JSON.stringify(outbox)); } catch { /* Optional persistence. */ }
  }, [outbox, outboxKey, outboxLoaded]);

  async function submitAnswer() {
    if ((!selected && !currentSubmission) || isSubmitting || !outboxLoaded) return;
    setError(null);
    setShowLeaderboard(true);
    await submitSavedAnswer(currentSubmission ?? {
      questionId: round.question.questionId,
      questionNumber: round.questionNumber,
      selectedAnswer: selected!,
    });
  }

  async function submitSavedAnswer(answer: SavedMultiplayerAnswer) {
    if (submissionsInFlight.current.has(answer.questionId)) return;
    submissionsInFlight.current.add(answer.questionId);
    setOutbox((current) => [...current.filter((entry) => entry.questionId !== answer.questionId), { ...answer, status: "pending" }]);
    try {
      await sendMultiplayerAnswer({ roomId: round.roomId, questionId: answer.questionId, selectedAnswer: answer.selectedAnswer });
      lastConfirmedQuestion.current = answer.questionId;
      if (answer.selectedAnswer === null) setGivenUpQuestion(answer.questionId);
      setOutbox((current) => current.filter((entry) => entry.questionId !== answer.questionId));
      setRound((current) => current.question.questionId !== answer.questionId ? current : ({
        ...current,
        players: current.players.map((player) => player.playerId === current.currentPlayerId
          ? { ...player, hasSubmittedCurrentQuestion: true }
          : player),
      }));
      if (questionNumber.current === answer.questionNumber) setShowLeaderboard(true);
      // Catch an all-answered completion even when its broadcast was missed.
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
        <p>Question {entry.questionNumber}, {entry.selectedAnswer === null ? "Give up (0 points)" : `answer ${entry.selectedAnswer}`}: {entry.status === "pending" ? "Confirming your answer…" : entry.message}</p>
        {entry.status === "failed" ? <button className="mt-2 font-semibold text-blue-600" onClick={() => void submitSavedAnswer(entry)}>Retry saved answer</button> : null}
      </div>)}
    </div>
  );

  if (finished) {
    return <MatchWaiting>{submissionNotice}</MatchWaiting>;
  }

  const inIntermission = preparingNext || Boolean(effectiveIntermissionEndsAt);
  const personalTimeExpired = !round.preparing && secondsLeft === 0;
  if (inIntermission || round.roundClosed || submitted || currentSubmission || showLeaderboard || personalTimeExpired) {
    const closed = round.roundClosed === true;
    const finalQuestion = round.questionNumber >= round.totalQuestions;
    return <main className={`${styles.page} mx-auto max-w-5xl px-6 py-8`}>
      <header className={`${styles.header} text-center`}>
        <p className="text-sm font-semibold text-blue-600">{closed ? `Question ${round.questionNumber} complete` : personalTimeExpired && !submitted ? "Time expired" : isSubmitting ? "Submitting answer…" : currentSubmission ? "Answer awaiting confirmation" : givenUpQuestion === round.question.questionId ? "Give up recorded · 0 points" : "Answer submitted"}</p>
        <h1 className="mt-1 text-3xl font-bold">{closed ? `Question ${round.questionNumber} results` : finalQuestion ? "Waiting for final results" : "Live leaderboard"}</h1>
        <p className="mt-2 text-gray-600">{closed || inIntermission
          ? finalQuestion ? "Preparing final results…" : intermissionLeft === null ? "Preparing next question…" : `Next question in ${intermissionLeft}s`
          : secondsLeft === 0 ? "Waiting for the round to close…" : "Waiting for the other players…"}</p>
        {!closed && !inIntermission ? <p className="mt-3 text-xl font-bold tabular-nums" data-testid="remaining-time">Time remaining: {secondsLeft === null ? "--" : `${secondsLeft}s`}</p> : null}
        <p className="mt-2 text-sm text-slate-600">{closed ? "This question’s points are included in each total." : "Totals show completed questions. Results appear when this round closes."}</p>
      </header>
      {submissionNotice}
      {error ? <p role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error} <button type="button" className="min-h-11 font-semibold underline" onClick={() => refreshRound.current()}>Retry now</button></p> : null}
      <div className={`mt-6 grid items-start gap-4 ${round.spectators.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_16rem]" : ""}`}>
        <RoundLeaderboard players={round.players} questionNumber={round.questionNumber} closed={closed} currentPlayerId={round.currentPlayerId} />
        <SpectatorList round={round} />
      </div>
    </main>;
  }

  if (round.preparing || questionStartsIn === null || questionStartsIn > 0) {
    return <MatchWaiting preparing title={round.preparing || questionStartsIn === null ? "Preparing…" : `Question ${round.questionNumber} starts in ${questionStartsIn}s`} description={round.preparing ? "Waiting for players to load the question…" : "Take a breath. Get ready for your next challenge."} />;
  }

  return (
    <main className={`${styles.page} mx-auto max-w-6xl px-6 py-8 sm:px-8`}>
      <header className={`${styles.header} flex items-center justify-between gap-4`}><div><p className="text-sm font-semibold text-blue-600">{round.question.division} · {round.question.topic}</p><h1 className="mt-1 text-2xl font-bold">Question {round.questionNumber} of {round.totalQuestions}</h1></div><div className={`rounded-2xl px-5 py-3 text-center ${secondsLeft !== null && secondsLeft <= 10 ? "bg-red-100 text-red-700" : "bg-gray-100"}`}><p className="text-xs font-semibold uppercase">Time</p><p className="text-2xl font-bold tabular-nums">{secondsLeft === null ? "--" : `${secondsLeft}s`}</p></div></header>
      <div className={`mt-6 grid items-start gap-4 ${round.spectators.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_16rem]" : ""}`}><section className={`${styles.panel} rounded-3xl border bg-white p-6 shadow-sm sm:p-8`}>
        {submissionNotice}
        <p className="mb-4 text-sm text-slate-600">{round.scoringVersion === 2
          ? "Correct: 1,000 + up to 500 speed bonus · Wrong: −300 · Blank / Give up: 0"
          : "Legacy scoring: correct answers earn 1,000–1,500 points; wrong or blank earns 0."}</p>
        <div className="text-lg font-semibold leading-8"><MathText>{round.question.question}</MathText></div>
        <div className="mt-6 grid gap-3">{round.question.choices.map((choice, index) => { const label = labels[index]; const active = selected === label; return <button key={label} disabled={submitted || secondsLeft === null || secondsLeft === 0} onClick={() => setSelected(label)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left ${active ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-slate-200 bg-slate-50/60 hover:border-blue-300 hover:bg-blue-50"} disabled:cursor-not-allowed disabled:opacity-60`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold">{label}</span><MathText>{choice}</MathText></button>; })}</div>
        {error ? <p role="alert" className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button onClick={submitAnswer} disabled={!selected || !outboxLoaded || submitted || isSubmitting || confirmGiveUp || secondsLeft === null || secondsLeft === 0} className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600">{isSubmitting ? "Submitting…" : submitted ? "Answer submitted" : "Submit Answer"}</button>
        {round.scoringVersion === 2 ? confirmGiveUp ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4" role="group" aria-label="Confirm Give up">
            <p className="text-sm text-slate-700">Leave this question blank for 0 points? You cannot answer it afterward.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700"
                onClick={() => setConfirmGiveUp(false)}>Keep working</button>
              <button type="button" className="min-h-11 rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
                disabled={!outboxLoaded || submitted || !!currentSubmission || secondsLeft === null || secondsLeft === 0}
                onClick={() => {
                  setConfirmGiveUp(false); setError(null); setShowLeaderboard(true);
                  void submitSavedAnswer({ questionId: round.question.questionId, questionNumber: round.questionNumber, selectedAnswer: null });
                }}>Confirm Give up</button>
            </div>
          </div>
        ) : <button type="button" onClick={() => setConfirmGiveUp(true)}
          disabled={!outboxLoaded || submitted || !!currentSubmission || secondsLeft === null || secondsLeft === 0}
          className="mt-3 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Give up · 0 points</button> : null}
      </section>
      <SpectatorList round={round} />
      </div>
    </main>
  );
}
