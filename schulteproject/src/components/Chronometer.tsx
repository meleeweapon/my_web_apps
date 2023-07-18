import React, { FC, useContext, useEffect, useState } from "react";
import { CompletedContext } from "../App";

interface ChronometerProps {}

// let initiatedInterval = false;

const Chronometer: FC<ChronometerProps> = (props) => {
  const [seconds, setSeconds] = useState<number>(0);
  const completed = useContext(CompletedContext);

  useEffect(() => {
    // if (initiatedInterval) {
    //   return;
    // }
    // initiatedInterval = true;
    const interval = setInterval(() => {
      if (completed) {
        clearInterval(interval);
        return;
      }
      setSeconds((previousSeconds) => {
        return previousSeconds + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [completed]);

  return (
    <div className="chronometer">
      <span>{seconds} s</span>
    </div>
  );
};

export default Chronometer;
