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

    <div className="border rounded-xl p-5">

      <h2 className="font-bold text-xl mb-4">
        Statistics
      </h2>


      <p>
        Attempts: {attempts}
      </p>


      <p>
        Correct: {correct}
      </p>


      <p>
        Best Time: {formatTime(bestTime)}
      </p>


      <p>
        Average Time: {formatTime(averageTime)}
      </p>


    </div>

  );

}