"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function MultiplayerError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[55vh] max-w-xl items-center justify-center px-5 py-12 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Multiplayer</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-950">Connection interrupted</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">We could not refresh the live room data. Your account and match progress are still safe.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Try again</button>
          <Link href="/practice" className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50">Go to practice</Link>
        </div>
      </div>
    </main>
  );
}
