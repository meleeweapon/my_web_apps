import React, { FC, useContext, useEffect, useState } from "react";
import { GameStateContext, MatchesContext } from "../App";
import { formatMatchDuration } from "../utils";

// TODO: make chronometer into a class or a closure

interface ChronometerProps {}

const Chronometer: FC<ChronometerProps> = (props) => {
  const matches = useContext(MatchesContext);
  const gameState = useContext(GameStateContext);
  const [seconds, setSeconds] = useState<number>(0);

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
        interval = initiateChronometer();
        break;

      case "Completed":
        clearInterval(interval);
        setSeconds(0);
        break;
    }
    return () => clearInterval(interval);
  }, [gameState]);

  return (
    <div className="chronometer">
      {(() => {
        switch (gameState) {
          case "NotStarted":
            return <div>--</div>;
          case "Playing":
            return <span>{seconds} s</span>;
          case "Completed":
            return (
              <span>
                {formatMatchDuration(matches[matches.length - 1])} seconds
              </span>
            );
        }
      })()}
    </div>
  );
};

export default Chronometer;
