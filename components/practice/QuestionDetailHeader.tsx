import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import logo from "@/app/apple-icon.png";
import styles from "./question-detail.module.css";

type Props = { questionNumber: number; division: string; topic: string; difficulty: string; status: string; backHref: string };

export default function QuestionDetailHeader({ questionNumber, division, topic, difficulty, status, backHref }: Props) {
  return <>
    <Link href={backHref} className={styles.back} aria-label="← Question Bank"><ArrowLeft size={16} aria-hidden="true" />Question Bank</Link>
    <header className={styles.header}>
      <Image src={logo} alt="" width={180} height={180} className={styles.watermark} unoptimized />
      <div className={styles.title}><p>{division.toUpperCase()} DIVISION</p><h1>Question {questionNumber}</h1><span className={styles.goldRule} aria-hidden="true" /></div>
      <div className={styles.metadata}><span>{topic}</span><span aria-label={`Difficulty: ${difficulty.length} of 5`}>{difficulty}</span><span>{status}</span></div>
    </header>
  </>;
}
