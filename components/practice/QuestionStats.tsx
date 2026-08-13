"use client";

type Props = {
  attempts:number;
  correct:number;
  times:number[];
};


export default function QuestionStats({
  attempts,
  correct,
  times,
}:Props){


  const bestTime =
    times.length > 0
    ? Math.min(...times)
    : null;


  const averageTime =
    times.length > 0
    ? Math.round(
        times.reduce((a,b)=>a+b,0)
        /
        times.length
      )
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