import Link from "next/link";
import { ArrowUpRight, BookOpen, Layers, SlidersHorizontal, Sparkles, TrendingUp, Zap } from "lucide-react";
import styles from "./practice.module.css";

export default function PracticePage() {
  return (
    <main className={`${styles.page} min-h-[calc(100vh-4rem)] px-5 py-12 sm:px-8 sm:py-16`}>
      <div className="mx-auto max-w-5xl">
        <header className={styles.hero}>
        <span className={styles.eyebrow}><Sparkles size={15} aria-hidden="true" />Build your skills</span>
        <h1 className="mb-2 text-4xl font-bold text-slate-950">
          Practice
        </h1>

        <p className="text-slate-600">
          Choose how you want to practice.
        </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <section className={`${styles.card} rounded-3xl border bg-white p-6 sm:p-8`}>
            <div className={styles.icon}><BookOpen size={28} aria-hidden="true" /></div>
            <h2 className="mb-3 text-2xl font-bold">
              Question Bank
            </h2>

            <p className="mb-8 text-slate-600">
              Explore Mu, Alpha, and Theta questions with
              filters for topic, method, difficulty, progress,
              and bookmarks.
            </p>

            <div className={styles.features}><span><Layers size={15} aria-hidden="true" />Mu · Alpha · Theta</span><span><SlidersHorizontal size={15} aria-hidden="true" />Practice your way</span></div>
            <Link
              href="/practice/question-bank"
              className={styles.button}
            >
              Open <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </section>

          <section className={`${styles.card} ${styles.trainer} rounded-3xl border bg-white p-6 sm:p-8`}>
            <div className={styles.icon}><Zap size={28} aria-hidden="true" /></div>
            <h2 className="mb-3 text-2xl font-bold">
              Daily Trainer
            </h2>

            <p className="mb-8 text-slate-600">
              Build your skills with adaptive questions,
              level progression, instant solutions, and
              session tracking.
            </p>

            <div className={styles.features}><span><Sparkles size={15} aria-hidden="true" />Adaptive questions</span><span><TrendingUp size={15} aria-hidden="true" />Level progression</span></div>
            <Link
              href="/practice/trainer"
              className={styles.button}
            >
              Start <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
