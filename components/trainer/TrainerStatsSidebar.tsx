type TrainerStatsSidebarProps = {
  difficulty: number;
  correct: number;
  incorrect: number;
  giveUps: number;
  onEndSession: () => void;
};

export default function TrainerStatsSidebar({ difficulty, correct, incorrect, giveUps, onEndSession }: TrainerStatsSidebarProps) {
  return (
    <section className="rounded-2xl border-2 border-[#111827] bg-[#f8fafc] p-5 shadow-[0_12px_30px_rgba(17,24,39,0.14)]">
      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Current question</p>
      <div className="mt-4 rounded-xl bg-blue-50 p-4">
        <p className="text-sm text-slate-500">Difficulty</p>
        <p className="mt-1 text-xl font-bold" aria-label={`Difficulty ${difficulty} out of 5`}>
          {"★".repeat(difficulty)}{"☆".repeat(Math.max(0, 5 - difficulty))}
        </p>
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-500">This session</p>
      <div className="mt-3 space-y-3">
        <StatRow label="Correct" value={correct} className="bg-emerald-50 text-emerald-800" />
        <StatRow label="Incorrect" value={incorrect} className="bg-rose-50 text-rose-800" />
        <StatRow label="Gave Up" value={giveUps} className="bg-amber-50 text-amber-800" />
      </div>

      <button type="button" onClick={onEndSession} className="mt-5 w-full rounded-xl bg-gradient-to-br from-[#2563eb] to-[#111827] px-4 py-3 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg">End Session</button>
    </section>
  );
}

function StatRow({ label, value, className }: { label: string; value: number; className: string }) {
  return <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${className}`}><span className="font-semibold">{label}</span><span className="text-xl font-bold">{value}</span></div>;
}
