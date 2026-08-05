import type { Division } from "@/types/question";

type TrainerHeaderProps = {
  division: Division;
  level: number;
  levelProgress: number;
};

export default function TrainerHeader({
  division,
  level,
  levelProgress,
}: TrainerHeaderProps) {
  const safeLevelProgress = Math.min(
    30,
    Math.max(0, levelProgress)
  );

  const progressPercent =
    (safeLevelProgress / 30) * 100;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5">
      <div className="grid items-center gap-5 md:grid-cols-[auto_minmax(260px,1fr)]">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold">
            MAO Trainer
          </h1>

          <p className="mt-1 text-gray-600">
            {division} Division
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="font-semibold">Level {level}</p>
            <p className="font-semibold">{safeLevelProgress} / 30</p>
          </div>

          <div className="mt-2 h-3 w-full overflow-hidden rounded-full border-2 border-slate-400 bg-white shadow-inner" role="progressbar" aria-label={`Progress to Level ${level + 1}`} aria-valuemin={0} aria-valuemax={30} aria-valuenow={safeLevelProgress}>
            <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>

          <p className="mt-1.5 text-xs text-gray-500">Progress to Level {level + 1}</p>
        </div>

      </div>
    </section>
  );
}
