"use client";

import { getPracticeTiming } from "@/lib/practiceTiming";
import type { PracticeTiming } from "@/types/progress";

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

    <div className="rounded-2xl border-2 border-[#111827] bg-[#f8fafc] p-5 shadow-[0_12px_30px_rgba(17,24,39,0.14)]">

      <h2 className="font-bold text-xl mb-4">
        Statistics
      </h2>


      <div className="space-y-3">
        <Stat label="Attempts" value={attempts} />
        <Stat label="Correct" value={correct} />
        <Stat label="Best Time" value={formatTime(bestTime)} />
        <Stat label="Average Time" value={formatTime(averageTime)} />
      </div>


    </div>

  );

}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <span className="font-bold text-slate-950">{value}</span>
    </div>
  );
}
