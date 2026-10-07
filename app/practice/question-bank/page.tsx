import Image from "next/image";

import logo from "@/app/apple-icon.png";
import DivisionCard from "@/components/practice/DivisionCard";
import { questions } from "@/data/questions";
import type { Division } from "@/types/question";

import styles from "./division-picker.module.css";

const divisions: Array<{ name: Division; slug: string; symbol: string }> = [
  { name: "Mu", slug: "mu", symbol: "Μ" },
  { name: "Alpha", slug: "alpha", symbol: "Α" },
  { name: "Theta", slug: "theta", symbol: "Θ" },
];

export default function QuestionBankPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Image src={logo} alt="" className={styles.watermark} aria-hidden="true" />
        <header className={styles.heading}>
          <p>Practice library</p>
          <h1>Choose your division</h1>
          <span className={styles.goldRule} aria-hidden="true" />
        </header>
        <div className={styles.cards}>
          {divisions.map((division) => (
            <DivisionCard
              key={division.name}
              {...division}
              count={questions.filter((question) => question.division === division.name).length}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
