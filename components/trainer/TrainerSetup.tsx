import type { Division } from "@/types/question";

type TrainerSetupProps = {
  division: Division;
  error: string | null;
  loading: boolean;
  onDivisionChange: (division: Division) => void;
  onStart: () => void;
};

export default function TrainerSetup({
  division,
  error,
  loading,
  onDivisionChange,
  onStart,
}: TrainerSetupProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#e5e7eb] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-[#2563eb]">
            Adaptive practice
          </p>

          <h1 className="text-4xl font-bold text-slate-950 sm:text-5xl">
            Daily Trainer
          </h1>

          <p className="mt-3 max-w-2xl text-slate-700">
            Choose your division and begin a continuous training session.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border-2 border-[#111827] bg-[#f8fafc] shadow-[0_12px_30px_rgba(17,24,39,0.16)]">
          <div className="border-b-2 border-[#111827] bg-gradient-to-r from-[#2563eb] to-[#111827] px-6 py-6 text-white sm:px-8">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl ring-1 ring-white/25"
              >
                ⚡
              </span>

              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Start your session
                </h2>
                <p className="mt-1 text-sm text-blue-100">
                  Questions adapt to your progress as you train.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <label
              htmlFor="trainer-division"
              className="mb-2 block font-semibold text-slate-950"
            >
              Division
            </label>

            <select
              id="trainer-division"
              value={division}
              disabled={loading}
              onChange={(event) =>
                onDivisionChange(event.target.value as Division)
              }
              className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-blue-100"
            >
              <option value="Mu">Mu</option>
              <option value="Alpha">Alpha</option>
              <option value="Theta">Theta</option>
            </select>

            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={onStart}
              disabled={loading}
              aria-busy={loading}
              className="mt-6 w-full rounded-lg bg-gradient-to-br from-[#2563eb] to-[#111827] px-6 py-3.5 font-semibold text-white shadow-md transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-wait disabled:opacity-75"
            >
              {loading ? "Loading Trainer…" : "Start Trainer"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
