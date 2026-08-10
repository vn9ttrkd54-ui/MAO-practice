import Link from "next/link";

const divisions = [
  {
    name: "Mu",
    description: "Advanced mathematics",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Alpha",
    description: "Algebra and precalculus",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Theta",
    description: "Foundational competition math",
    color: "from-emerald-500 to-teal-600",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-[calc(100vh-81px)] overflow-hidden bg-[#f7f8fc] text-slate-950">
      <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-8 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />

      <section className="relative mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-14 px-6 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:px-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Practice. Compete. Improve daily.
          </div>

          <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            Mathematics,
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              made competitive.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
            Train with competition questions, protect your daily streak, and
            climb the multiplayer ranks with students who love mathematics.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/multiplayer"
              className="rounded-xl bg-slate-950 px-7 py-3.5 font-bold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Play Multiplayer
              <span className="ml-2" aria-hidden="true">→</span>
            </Link>

            <Link
              href="/practice"
              className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
            >
              Start Practicing
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-2">
              <span className="text-emerald-500">●</span>
              Live multiplayer
            </span>
            <span className="flex items-center gap-2">
              <span className="text-orange-500">◆</span>
              Daily challenges
            </span>
            <span className="flex items-center gap-2">
              <span className="text-blue-500">▲</span>
              Adaptive training
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-8 rounded-[2rem] bg-gradient-to-br from-blue-500 to-violet-600 opacity-25 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-2xl shadow-indigo-950/15 backdrop-blur-xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  Mathematics Daily
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  Choose your path
                </h2>
              </div>

              <div className="rounded-2xl bg-slate-950 px-3 py-2 text-center text-white">
                <p className="text-lg font-black">3</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Divisions
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {divisions.map((division, index) => (
                <div
                  key={division.name}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${division.color} text-lg font-black text-white shadow-md`}
                  >
                    {division.name.slice(0, 1)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold">{division.name}</p>
                    <p className="truncate text-sm text-slate-500">
                      {division.description}
                    </p>
                  </div>

                  <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    0{index + 1}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/challenge"
                className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100 p-4 transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Daily
                </p>
                <p className="mt-1 font-extrabold">Challenge</p>
              </Link>

              <Link
                href="/practice/question-bank"
                className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-4 transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Explore
                </p>
                <p className="mt-1 font-extrabold">Question Bank</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
