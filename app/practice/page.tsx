import Link from "next/link";

export default function PracticePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#dbeafe] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-bold text-slate-950">
          Practice
        </h1>

        <p className="mb-10 text-slate-700">
          Choose how you want to practice.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="rounded-2xl border-2 border-slate-900 bg-white p-8 shadow-[0_12px_30px_rgba(30,64,175,0.16)]">
            <h2 className="mb-3 text-2xl font-bold">
              📚 Question Bank
            </h2>

            <p className="mb-8 text-slate-600">
              Explore Mu, Alpha, and Theta questions with
              filters for topic, method, difficulty, progress,
              and bookmarks.
            </p>

            <Link
              href="/practice/question-bank"
              className="inline-block rounded-lg bg-black px-6 py-3 text-white transition hover:bg-slate-800"
            >
              Open
            </Link>
          </section>

          <section className="rounded-2xl border-2 border-slate-900 bg-white p-8 shadow-[0_12px_30px_rgba(30,64,175,0.16)]">
            <h2 className="mb-3 text-2xl font-bold">
              ⚡ Daily Trainer
            </h2>

            <p className="mb-8 text-slate-600">
              Build your skills with adaptive questions,
              level progression, instant solutions, and
              session tracking.
            </p>

            <Link
              href="/practice/trainer"
              className="inline-block rounded-lg bg-black px-6 py-3 text-white transition hover:bg-slate-800"
            >
              Start
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
