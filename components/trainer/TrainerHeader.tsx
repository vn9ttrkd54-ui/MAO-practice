import type { Division } from "@/types/question";

type TrainerHeaderProps = {
  division: Division;
  difficulty?: number;
  level: number;
  levelProgress: number;
  correct: number;
  incorrect: number;
  giveUps: number;
  onEndSession: () => void;
};

export default function TrainerHeader({
  division,
  difficulty,
  level,
  levelProgress,
  correct,
  incorrect,
  giveUps,
  onEndSession,
}: TrainerHeaderProps) {
  const safeLevelProgress = Math.min(
    30,
    Math.max(0, levelProgress)
  );

  const progressPercent =
    (safeLevelProgress / 30) * 100;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            MAO Trainer
          </h1>

          <p className="mt-1 text-gray-600">
            {division} Division
          </p>
        </div>

      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">
              Current Level
            </p>

            <p className="text-xl font-bold">
              Level {level}
            </p>
          </div>

          <p className="font-semibold">
            {safeLevelProgress} / 30
          </p>
        </div>

        <div
          className="
            mt-3
            h-3
            w-full
            overflow-hidden
            rounded-full
            bg-gray-200
          "
          role="progressbar"
          aria-label={`Progress to Level ${level + 1}`}
          aria-valuemin={0}
          aria-valuemax={30}
          aria-valuenow={safeLevelProgress}
        >
          <div
            className="
              h-full
              rounded-full
              bg-black
              transition-all
              duration-300
            "
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Progress to Level {level + 1}
        </p>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-5">
        <div>
          {difficulty !== undefined && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Difficulty
              </p>

              <p
                className="mt-1 font-semibold"
                aria-label={`Difficulty ${difficulty} out of 5`}
              >
                {"★".repeat(difficulty)}
                {"☆".repeat(
                  Math.max(0, 5 - difficulty)
                )}
              </p>
            </div>
          )}

          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-emerald-50 px-2 py-3">
              <p className="text-sm text-gray-500">
                Correct
              </p>

              <p className="mt-1 text-xl font-bold">
                {correct}
              </p>
            </div>

            <div className="rounded-xl bg-rose-50 px-2 py-3">
              <p className="text-sm text-gray-500">
                Incorrect
              </p>

              <p className="mt-1 text-xl font-bold">
                {incorrect}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 px-2 py-3">
              <p className="text-sm text-gray-500">
                Gave Up
              </p>

              <p className="mt-1 text-xl font-bold">
                {giveUps}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onEndSession}
        className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-2.5 font-semibold transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
      >
        End Session
      </button>
    </section>
  );
}
