import React, { FC, useContext, useEffect, useState } from "react";
import { GameStateContext } from "../App";

interface ChronometerProps {}

const Chronometer: FC<ChronometerProps> = (props) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [chronometerRunning, setChronometerRunning] = useState<boolean>(false);
  const [clearChronometer, setClearChronometer] = useState<() => void>(
    () => {}
  );
  const gameState = useContext(GameStateContext);

  const initiateChronometer = () => {
    const interval = setInterval(() => {
      setSeconds((previousSeconds) => {
        return previousSeconds + 1;
      });
    }, 1000);

    return interval;
  };

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    switch (gameState) {
      case "NotStarted":
        break;

      case "Playing":
        if (chronometerRunning) {
          interval = setInterval(() => {
            setSeconds((previousSeconds) => {
              return previousSeconds + 1;
            });
          }, 1000);
        }
        break;

      case "Completed":
        break;
    }
    // switch (gameState) {
    //   case "NotStarted":
    //     break;

    //   case "Playing":
    //     if (chronometerRunning) break;
    //     // interval = initiateChronometer();
    //     interval = setInterval(() => {
    //       setSeconds((previousSeconds) => {
    //         return previousSeconds + 1;
    //       });
    //     }, 1000);
    //     setChronometerRunning(true);
    //     break;

    //   case "Completed":
    //     if (!chronometerRunning) break;
    //     // if (!interval) throw new Error();
    //     // clearInterval(interval);
    //     setChronometerRunning(false);
    //     break;
    // }

    return () => clearInterval(interval);
  }, [chronometerRunning, gameState]);

  return (
    <div className="chronometer">
      <span>{seconds} s</span>
    </div>
  );
};

export default Chronometer;
