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
    <section className="border rounded-xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            MAO Trainer
          </h1>

          <p className="mt-1 text-gray-600">
            {division} Division
          </p>
        </div>

        <button
          type="button"
          onClick={onEndSession}
          className="
            border
            rounded-lg
            px-4
            py-2
            hover:bg-gray-100
            transition
          "
        >
          End Session
        </button>
      </div>

      <div className="mt-6 border-t pt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">
              Current Level
            </p>

            <p className="text-2xl font-bold">
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

      <div className="mt-6 border-t pt-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          {difficulty !== undefined && (
            <div>
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

          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-sm text-gray-500">
                Correct
              </p>

              <p className="mt-1 text-xl font-bold">
                {correct}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Incorrect
              </p>

              <p className="mt-1 text-xl font-bold">
                {incorrect}
              </p>
            </div>

            <div>
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
    </section>
  );
}