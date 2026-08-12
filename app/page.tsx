import Image from "next/image";
import Link from "next/link";

import AnimatedLogo from "@/components/brand/AnimatedLogo";

export default function Home() {
  return (
    <main
      className="relative isolate flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 px-6 text-center"
      style={{ minHeight: "calc(100vh - 81px)" }}
    >
      <Image
        src="/icon.svg"
        alt=""
        aria-hidden="true"
        width={544}
        height={544}
        className="pointer-events-none absolute -bottom-24 -right-20 -z-10 w-[min(34rem,72vw)] -rotate-6 opacity-[0.07]"
      />

      <AnimatedLogo className="mb-7 h-28 w-28 drop-shadow-[0_18px_25px_rgba(37,99,235,0.24)]" />

      <h1
        className="font-black tracking-tight"
        style={{
          fontSize: "clamp(4rem, 8vw, 7.5rem)",
          lineHeight: 0.95,
          letterSpacing: "-0.05em",
        }}
      >
        Mathematics Daily
      </h1>

      <p
        className="text-gray-600"
        style={{
          marginTop: "2rem",
          fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
          lineHeight: 1.5,
        }}
      >
        Practice math. Improve skills. Compete.
      </p>

      <Link
        href="/multiplayer"
        className="inline-flex items-center justify-center bg-black font-semibold text-white transition hover:bg-gray-800"
        style={{
          marginTop: "2.75rem",
          minWidth: "9rem",
          padding: "1rem 2.5rem",
          borderRadius: "0.75rem",
          fontSize: "1.25rem",
        }}
      >
        Play
      </Link>
    </main>
  );
}
