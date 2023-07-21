import React, { FC, useState } from "react";
import { shuffleInPlace } from "../utils";
import { GameState, MatchesType } from "../interfaces";

interface SchulteTableProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setMatches: React.Dispatch<React.SetStateAction<MatchesType>>;
  roundStartTimestamp: number | undefined;
}

const orderedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
Object.freeze(orderedNumbers);

const SchulteTable: FC<SchulteTableProps> = (props) => {
  const { gameState, setGameState, setMatches, roundStartTimestamp } = props;

  const [numbers, setNumbers] = useState<number[]>(
    shuffleInPlace([...orderedNumbers])
  );

  const [expectedNumber, setExpectedNumber] = useState<number>(
    Math.min(...numbers)
  );

  const [currentRoundTime, setCurrentRoundTime] = useState<
    number | undefined
  >();

  const handleTile = (theNumber: number): void => {
    if (theNumber !== expectedNumber || gameState !== "Playing") {
      return;
    }

    if (theNumber === Math.max(...numbers)) {
      setGameState("Completed");
      if (!roundStartTimestamp)
        throw new Error("Round start time can't be undefined.");
      const temporaryRoundTime = new Date().getTime() - roundStartTimestamp;
      setCurrentRoundTime(temporaryRoundTime);
      // if (!currentRoundTime) throw new Error("Round time can't be undefined.");
      setMatches((previousMatches) => [...previousMatches, temporaryRoundTime]);
    }
    setExpectedNumber((previousExpectedNumber) => previousExpectedNumber + 1);
  };

  return (
    <div className="schulteTable">
      {numbers.map((theNumber, index) => {
        return (
          <button
            className={`tile ${
              theNumber < expectedNumber ? " clicked" : " unclicked"
            }`}
            key={index}
            onClick={() => handleTile(theNumber)}
          >
            {theNumber}
          </button>
        );
      })}
    </div>
  );
};

export default SchulteTable;
