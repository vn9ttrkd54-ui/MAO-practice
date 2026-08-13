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
    <section className="overflow-hidden rounded-2xl border-2 border-[#111827] bg-gradient-to-r from-[#2563eb] to-[#111827] p-5 text-white shadow-[0_12px_30px_rgba(17,24,39,0.18)] sm:p-6">
      <div className="grid items-center gap-5 md:grid-cols-[auto_minmax(260px,1fr)]">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold">
            Daily Trainer
          </h1>

          <p className="mt-1 text-blue-100">
            {division} Division
          </p>
        </div>

        <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20">
          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="font-semibold">Level {level}</p>
            <p className="font-semibold">{safeLevelProgress} / 30</p>
          </div>

          <div
            className="mt-2 overflow-hidden rounded-full shadow-inner"
            style={{ width: "100%", height: "14px", border: "2px solid rgba(255,255,255,0.72)", backgroundColor: "rgba(255,255,255,0.2)", boxSizing: "border-box" }}
            role="progressbar"
            aria-label={`Progress to Level ${level + 1}`}
            aria-valuemin={0}
            aria-valuemax={30}
            aria-valuenow={safeLevelProgress}
          >
            <div className="h-full rounded-full bg-white transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>

          <p className="mt-1.5 text-xs text-blue-100">Progress to Level {level + 1}</p>
        </div>

      </div>
    </section>
  );
}
