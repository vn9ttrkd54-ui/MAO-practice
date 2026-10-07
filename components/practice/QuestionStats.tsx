"use client";

import { getPracticeTiming } from "@/lib/practiceTiming";
import type { PracticeTiming } from "@/types/progress";
import styles from "./question-detail.module.css";

type Props = {
  attempts:number;
  correct:number;
  times:number[];
  timing?: PracticeTiming;
};


export default function QuestionStats({
  attempts,
  correct,
  times,
  timing,
}:Props){


  const lifetime = getPracticeTiming({ times, timing });
  const bestTime = lifetime.bestSeconds;


  const averageTime =
    lifetime.count > 0
    ? Math.round(lifetime.totalSeconds / lifetime.count)
    : null;



  function formatTime(seconds:number|null){

    if(seconds===null)
      return "--";


    const min =
      Math.floor(seconds/60);

    const sec =
      seconds%60;


    return `${min}:${sec
      .toString()
      .padStart(2,"0")}`;

  }



  return (

    <aside className={styles.stats}>

      <h2>
        Statistics
      </h2>


      <dl>
        <Stat label="Attempts" value={attempts} />
        <Stat label="Correct" value={correct} />
        <Stat label="Best Time" value={formatTime(bestTime)} />
        <Stat label="Average Time" value={formatTime(averageTime)} />
      </dl>


    </aside>

  );

}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
