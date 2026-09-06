import Image from "next/image";
import Link from "next/link";

import AnimatedLogo from "@/components/brand/AnimatedLogo";
import styles from "./home.module.css";

export default function Home() {
  return (
    <main
      className={`${styles.home} relative isolate flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 px-6 text-center`}
      style={{ minHeight: "calc(100vh - 81px)" }}
    >
      <Image
        src="/icon.svg"
        alt=""
        aria-hidden="true"
        width={544}
        height={544}
        className={`${styles.watermark} pointer-events-none absolute -bottom-24 -right-20 -z-10 w-[min(34rem,72vw)] -rotate-6 opacity-[0.07]`}
      />

      <div className={styles.decorations} aria-hidden="true">
        <svg className={styles.trails} viewBox="0 0 1000 600" preserveAspectRatio="none">
          <path className={styles.trace} pathLength="1" d="M55 407 C85 407 95 379 125 379 S165 435 195 435 S235 379 265 379 S305 407 335 407" />
          <path className={`${styles.trace} ${styles.axes}`} pathLength="1" d="M130 330V475 M40 407H350" />
          <path className={`${styles.trace} ${styles.triangle}`} pathLength="1" d="M755 90L875 190H690Z" />
        </svg>
        <span className={`${styles.equation} ${styles.eqOne}`}>x² + y² = r²</span>
        <span className={`${styles.equation} ${styles.eqTwo}`}>π</span>
        <span className={`${styles.equation} ${styles.eqThree}`}>∫ f(x) dx</span>
        <span className={`${styles.equation} ${styles.eqFour}`}>a² + b² = c²</span>
      </div>

      <div className={`${styles.logoEntrance} relative mb-7 h-28 w-28 shrink-0`}>
        <svg className={styles.orbits} viewBox="0 0 240 180" aria-hidden="true">
          <circle className={styles.trace} pathLength="1" cx="120" cy="90" r="76" />
          <ellipse className={`${styles.trace} ${styles.ellipse}`} pathLength="1" cx="120" cy="90" rx="116" ry="53" transform="rotate(-24 120 90)" />
        </svg>
        <AnimatedLogo className="h-28 w-28 drop-shadow-[0_18px_25px_rgba(37,99,235,0.24)]" />
      </div>

      <h1
        className={`${styles.title} font-black tracking-tight`}
        style={{
          fontSize: "clamp(4rem, 8vw, 7.5rem)",
          lineHeight: 0.95,
          letterSpacing: "-0.05em",
        }}
      >
        Mathematics Daily
      </h1>

      <p
        className={`${styles.tagline} text-gray-600`}
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
        className={`${styles.play} inline-flex items-center justify-center bg-black font-semibold text-white transition hover:bg-gray-800`}
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
