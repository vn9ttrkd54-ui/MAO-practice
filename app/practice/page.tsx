import Link from "next/link";

export default function PracticePage() {
  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">
        Practice
      </h1>

      <p className="text-gray-600 mb-10">
        Choose how you want to practice.
      </p>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="border rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-3">
            📚 Question Bank
          </h2>

          <p className="text-gray-600 mb-8">
            Explore Mu, Alpha, and Theta questions with
            filters for topic, method, difficulty, progress,
            and bookmarks.
          </p>

          <Link
            href="/practice/question-bank"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg"
          >
            Open
          </Link>
        </div>

        <div className="border rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-3">
            ⚡ Daily Trainer
          </h2>

          <p className="text-gray-600 mb-8">
            Build your skills with adaptive questions,
            level progression, instant solutions, and
            session tracking.
          </p>

          <Link
            href="/practice/trainer"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg"
          >
            Start
          </Link>
        </div>

      </div>
    </main>
  );
}
