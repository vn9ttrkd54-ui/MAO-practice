import { Clock3 } from "lucide-react";

type TrainerStatsSidebarProps = {
  difficulty: number;
  questionSeconds: number;
  sessionSeconds: number;
  correct: number;
  incorrect: number;
  giveUps: number;
  onEndSession: () => void;
};

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function TrainerStatsSidebar({ difficulty, questionSeconds, sessionSeconds, correct, incorrect, giveUps, onEndSession }: TrainerStatsSidebarProps) {
  return (
    <section className="rounded-2xl border-2 border-[#111827] bg-[#f8fafc] p-5 shadow-[0_12px_30px_rgba(17,24,39,0.14)]">
      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Current question</p>
      <div className="mt-4 rounded-xl bg-blue-50 p-4">
        <p className="text-sm text-slate-500">Difficulty</p>
        <p className="mt-1 text-xl font-bold" aria-label={`Difficulty ${difficulty} out of 5`}>
          {"★".repeat(difficulty)}{"☆".repeat(Math.max(0, 5 - difficulty))}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <TimeStat label="Question" seconds={questionSeconds} />
        <TimeStat label="Session" seconds={sessionSeconds} />
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

function TimeStat({ label, seconds }: { label: string; seconds: number }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Clock3 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
      </div>
      <p className="mt-1 font-mono text-lg font-bold tabular-nums text-slate-900" aria-label={`${label} time ${formatTime(seconds)}`}>
        {formatTime(seconds)}
      </p>
    </div>
  );
}

function StatRow({ label, value, className }: { label: string; value: number; className: string }) {
  return <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${className}`}><span className="font-semibold">{label}</span><span className="text-xl font-bold">{value}</span></div>;
}
