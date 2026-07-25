"use client";

import { useEffect, useState } from "react";

type TimerProps = {
  running: boolean;
  resetKey: number;
};

export default function Timer({
  running,
  resetKey,
}: TimerProps) {

  const [seconds, setSeconds] = useState(0);



  useEffect(() => {

    setSeconds(0);

  }, [resetKey]);



  useEffect(() => {

    if (!running) return;


    const interval = setInterval(() => {

      setSeconds((prev) => prev + 1);

    }, 1000);



    return () => clearInterval(interval);


  }, [running]);




  const minutes =
    Math.floor(seconds / 60);


  const remainingSeconds =
    seconds % 60;



  return (

    <div className="text-gray-600 font-medium">

      ⏱ Time:{" "}

      {minutes}:
      {remainingSeconds
        .toString()
        .padStart(2, "0")}

    </div>

  );

}