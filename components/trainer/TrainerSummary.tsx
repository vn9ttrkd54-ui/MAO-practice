import type { Division } from "@/types/question";
import type { LevelProgress } from "@/types/level";

import type {
  TrainerQuestionResult,
  TrainerSessionStats,
} from "@/types/trainer";

type TrainerSummaryProps = {
  division: Division;
  stats: TrainerSessionStats;
  results: TrainerQuestionResult[];
  startingLevel: LevelProgress;
  endingLevel: LevelProgress;
  onStartNewSession: () => void;
  onReturnToPractice: () => void;
};

export default function TrainerSummary({
  division,
  stats,
  results,
  startingLevel,
  endingLevel,
  onStartNewSession,
  onReturnToPractice,
}: TrainerSummaryProps) {
  const sessionScore =
    stats.correct -
    stats.incorrect -
    stats.giveUps;

  return (
    <main className="max-w-5xl mx-auto p-8">
      <section className="border rounded-xl p-6">
        <p className="text-sm font-semibold text-gray-500">
          {division} Division
        </p>

        <h1 className="mt-1 text-4xl font-bold">
          Daily Trainer Summary
        </h1>

        <p className="mt-3 text-gray-600">
          Review your results from this training
          session.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Questions
            </p>

            <p className="mt-1 text-2xl font-bold">
              {stats.questionsAnswered}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Correct
            </p>

            <p className="mt-1 text-2xl font-bold">
              {stats.correct}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Incorrect
            </p>

            <p className="mt-1 text-2xl font-bold">
              {stats.incorrect}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Gave Up
            </p>

            <p className="mt-1 text-2xl font-bold">
              {stats.giveUps}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Accuracy
            </p>

            <p className="mt-1 text-2xl font-bold">
              {stats.accuracy}%
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Session Score
            </p>

            <p className="mt-1 text-2xl font-bold">
              {sessionScore > 0
                ? `+${sessionScore}`
                : sessionScore}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Starting Level
            </p>

            <p className="mt-1 text-2xl font-bold">
              Level {startingLevel.level}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {startingLevel.progress} / 30
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Ending Level
            </p>

            <p className="mt-1 text-2xl font-bold">
              Level {endingLevel.level}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {endingLevel.progress} / 30
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold">
            Session Results
          </h2>

          {results.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No questions were answered during this
              session.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {results.map((result, index) => (
                <div
                  key={`${result.questionId}-${index}`}
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-4
                    border
                    rounded-lg
                    p-4
                  "
                >
                  <div>
                    <p className="font-semibold">
                      Question {index + 1}
                    </p>

                    <p className="text-sm text-gray-500">
                      Your answer:{" "}
                      {result.selectedAnswer ?? "None"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {result.result === "correct"
                        ? "Correct"
                        : result.result === "incorrect"
                          ? "Incorrect"
                          : "Gave Up"}
                    </p>

                    <p className="text-sm text-gray-500">
                      Correct answer:{" "}
                      {result.correctAnswer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onStartNewSession}
            className="
              bg-black
              text-white
              rounded-lg
              px-6
              py-3
              hover:bg-gray-800
            "
          >
            Start New Session
          </button>

          <button
            type="button"
            onClick={onReturnToPractice}
            className="
              border
              rounded-lg
              px-6
              py-3
              hover:bg-gray-100
            "
          >
            Return to Practice
          </button>
        </div>
      </section>
    </main>
  );
}
