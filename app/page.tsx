import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">
        Mathematics Daily
      </h1>

      <p className="mt-4 text-lg">
        Practice math. Improve skills. Compete.
      </p>

      <Link
        href="/multiplayer"
        className="mt-8 rounded-lg bg-black px-6 py-3 text-white"
      >
        Play
      </Link>
    </main>
  );
}
