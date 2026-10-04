import { RankIcon, rankSecondaryClass, rankThemeClass } from "@/components/multiplayer/RankTheme";
import { formatAnswerTime, formatRoundPoints, roundFeedbackForQuestion, roundOutcomeLabels } from "@/lib/multiplayerRoundFeedback";
import type { MultiplayerPlayer } from "@/types/multiplayer";

export default function RoundLeaderboard({ players, questionNumber, closed, final = false, currentPlayerId }: {
  players: MultiplayerPlayer[];
  questionNumber: number;
  closed: boolean;
  final?: boolean;
  currentPlayerId?: string;
}) {
  const ordered = [...players].sort((a, b) => final
    ? (a.placement ?? 999) - (b.placement ?? 999) : b.score - a.score);
  return <ol className="space-y-3" aria-label={final ? "Final standings" : "Round standings"}>
    {ordered.map((player, index) => {
      const feedback = roundFeedbackForQuestion(player, questionNumber, closed);
      return <li key={player.playerId} className={`${player.isGuest ? "border-gray-200 bg-white text-gray-950" : rankThemeClass(player.rankTier ?? "Novice")} rounded-2xl border px-4 py-4 shadow-sm sm:px-5`}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="break-words font-semibold">#{final ? player.placement ?? index + 1 : index + 1} {player.displayName}{player.playerId === currentPlayerId ? " (you)" : ""}</p>
            <div className={`mt-1 flex items-center gap-1.5 text-xs ${player.isGuest ? "text-gray-500" : rankSecondaryClass}`}>
              {player.isGuest ? null : <RankIcon rank={player.rankTier ?? "Novice"} size={14} />}
              <span>{player.isGuest ? "Unranked guest" : `${player.rankTier} · ${player.rp ?? 0} RP`}</span>
            </div>
          </div>
          <div className="shrink-0 text-right"><p className="text-xs">Total</p><p className="font-bold tabular-nums">{player.score} pts</p></div>
        </div>
        {feedback ? <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-current/15 pt-3 text-sm">
          <div><dt className="text-xs">Result</dt><dd className="mt-1 font-semibold">{roundOutcomeLabels[feedback.outcome]}</dd></div>
          <div><dt className="text-xs">Question {questionNumber}</dt><dd className="mt-1 font-semibold tabular-nums">{formatRoundPoints(feedback.pointsEarned)} pts</dd></div>
          <div><dt className="text-xs">Answer time</dt><dd className="mt-1 font-semibold tabular-nums">{formatAnswerTime(feedback.answerTimeMs)}</dd></div>
        </dl> : !closed ? <p className="mt-3 text-sm">{player.hasSubmittedCurrentQuestion ? "Submitted" : "Still answering"}</p> : null}
      </li>;
    })}
  </ol>;
}
