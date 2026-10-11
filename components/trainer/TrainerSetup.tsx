import Image from "next/image";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import logo from "@/app/apple-icon.png";
import type { Division } from "@/types/question";
import TrainerDivisionAnimation from "./TrainerDivisionAnimation";
import styles from "./trainer-setup.module.css";

type TrainerSetupProps = {
  division: Division;
  startingDifficulty: number | null;
  error: string | null;
  loading: boolean;
  onDivisionChange: (division: Division) => void;
  onStartingDifficultyChange: (difficulty: number | null) => void;
  onStart: () => void;
};

const divisions = [{ name: "Mu", symbol: "Μ" }, { name: "Alpha", symbol: "Α" }, { name: "Theta", symbol: "Θ" }] as const;

export default function TrainerSetup({ division, startingDifficulty, error, loading, onDivisionChange, onStartingDifficultyChange, onStart }: TrainerSetupProps) {
  return (
    <main className={`${styles.page} ${styles[division.toLowerCase()]}`}>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <Image src={logo} alt="" width={170} height={170} unoptimized className={styles.watermark} />
          <p>Adaptive practice</p>
          <h1>Daily Trainer</h1>
          <span className={styles.rule} aria-hidden="true" />
        </header>
        <TrainerDivisionAnimation division={division} />
        <form className={styles.form} onSubmit={event => { event.preventDefault(); if (!loading) onStart(); }}>
          <fieldset disabled={loading} className={styles.divisions}>
            <legend className={styles.hidden}>Division</legend>
            {divisions.map(item => (
              <label key={item.name} className={`${styles.choice} ${styles[item.name.toLowerCase()]} ${division === item.name ? styles.selected : ""}`}>
                <input type="radio" name="trainer-division" value={item.name} checked={division === item.name} onChange={() => onDivisionChange(item.name)} />
                <span className={styles.symbol} aria-hidden="true">{item.symbol}</span>
                <span>{item.name.toUpperCase()}</span>
                {division === item.name && <Check size={18} className={styles.check} aria-hidden="true" />}
              </label>
            ))}
          </fieldset>
          <div className={styles.difficulty}>
            <label htmlFor="trainer-starting-difficulty">Starting difficulty</label>
            <div className={styles.selectWrap}>
              <select
                id="trainer-starting-difficulty"
                value={startingDifficulty ?? "auto"}
                disabled={loading}
                onChange={event => onStartingDifficultyChange(event.target.value === "auto" ? null : Number(event.target.value))}
              >
                <option value="auto">Auto</option>
                {[1, 2, 3, 4, 5].map(difficulty => <option key={difficulty} value={difficulty}>{difficulty} / 5</option>)}
              </select>
              <ChevronDown size={18} aria-hidden="true" />
            </div>
          </div>
          {error && <p role="alert" className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} aria-busy={loading} className={styles.start}>
            {loading ? "Loading Trainer..." : "Start Trainer"}<ArrowRight size={19} aria-hidden="true" />
          </button>
        </form>
      </div>
    </main>
  );
}
