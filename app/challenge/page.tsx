export default function ChallengePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Daily Challenge
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Challenge
        </h1>

        <p className="mt-4 max-w-2xl text-gray-600">
          Challenge is currently under development. Soon, you will be able
          to answer one official question each day, build a correct-answer
          streak, and compete for a place on the Top 20 leaderboard.
        </p>

        <span className="mt-6 inline-flex rounded-full border bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-600">
          Coming Soon
        </span>
      </section>
    </main>
  );
}
