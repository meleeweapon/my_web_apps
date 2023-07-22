import React, { FC } from "react";
import { GameState } from "../interfaces";

interface SchulteTableProps {
  gameState: GameState;
  expectedNumber: number;
  setExpectedNumber: React.Dispatch<React.SetStateAction<number>>;
  numbers: number[] | undefined;
  orderedNumbers: number[];
  endGame: () => void;
}

const SchulteTable: FC<SchulteTableProps> = (props) => {
  const {
    gameState,
    expectedNumber,
    setExpectedNumber,
    numbers,
    orderedNumbers,
    endGame,
  } = props;

  const handleTile = (theNumber: number): void => {
    if (theNumber !== expectedNumber || gameState !== "Playing" || !numbers) {
      return;
    }

    // win condition
    if (theNumber === Math.max(...numbers)) {
      endGame();
    }

    setExpectedNumber((previousExpectedNumber) => previousExpectedNumber + 1);
  };

  const renderTile = (tileNumber: number, index: number) => {
    return (
      <button
        className={`tile ${
          tileNumber < expectedNumber ? " clicked" : " unclicked"
        }`}
        key={index}
        onClick={() => handleTile(tileNumber)}
      >
        {tileNumber}
      </button>
    );
  };

  return (
    <div className="schulteTable">
      {!numbers ? orderedNumbers.map(renderTile) : numbers.map(renderTile)}
    </div>
  );
};

export default SchulteTable;
