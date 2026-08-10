import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-81px)] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl">
        Mathematics Daily
      </h1>

      <p className="mt-6 text-xl text-gray-600 sm:text-2xl">
        Practice math. Improve skills. Compete.
      </p>

      <Link
        href="/multiplayer"
        className="mt-10 rounded-xl bg-black px-9 py-4 text-lg font-semibold text-white transition hover:bg-gray-800 sm:text-xl"
      >
        Play
      </Link>
    </main>
  );
}
