import Image from "next/image";
import logo from "@/app/apple-icon.png";
import type { Division } from "@/types/question";
import styles from "./trainer-session.module.css";

type TrainerHeaderProps = { division: Division; level: number; levelProgress: number };

export default function TrainerHeader({ division, level, levelProgress }: TrainerHeaderProps) {
  const safeLevelProgress = Math.min(30, Math.max(0, levelProgress));
  const progressPercent = (safeLevelProgress / 30) * 100;
  return (
    <header className={styles.header}>
      <Image src={logo} alt="" width={170} height={170} unoptimized className={styles.watermark} />
      <div className={styles.title}>
        <p>{division.toUpperCase()} DIVISION</p>
        <h1>Daily Trainer</h1>
        <span className={styles.rule} aria-hidden="true" />
      </div>
      <div className={styles.level}>
        <div className={styles.levelLabels}><p>Level {level}</p><p>{safeLevelProgress} / 30</p></div>
        <div className={styles.track} role="progressbar" aria-label={`Progress to Level ${level + 1}`} aria-valuemin={0} aria-valuemax={30} aria-valuenow={safeLevelProgress}>
          <div className={styles.fill} style={{ width: `${progressPercent}%` }} />
        </div>
        <p>Progress to Level {level + 1}</p>
      </div>
    </header>
  );
}
