import Link from "next/link";

export default function Home() {
  return (
    <main
      className="flex flex-col items-center justify-center px-6 text-center"
      style={{ minHeight: "calc(100vh - 81px)" }}
    >
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
