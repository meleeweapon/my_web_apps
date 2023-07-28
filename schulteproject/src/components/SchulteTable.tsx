import React, { FC } from "react";
import { GameState } from "../interfaces";
import ReplaySvg from "./ReplaySvg";
import PlaySvg from "./PlaySvg";
import { gridSizeToArray, gridSizeToCss } from "../utils";

interface SchulteTableProps {
  gameState: GameState;
  expectedNumber: number;
  setExpectedNumber: React.Dispatch<React.SetStateAction<number>>;
  numbers: number[] | undefined;
  gridSize: number;
  endGame: () => void;
  startGame: () => void;
  gridSizeChangedWhenCompleted: boolean;
}

const SchulteTable: FC<SchulteTableProps> = (props) => {
  const {
    gameState,
    expectedNumber,
    setExpectedNumber,
    numbers,
    gridSize,
    endGame,
    startGame,
    gridSizeChangedWhenCompleted,
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

  const orderedTable = () => gridSizeToArray(gridSize).map(renderTile);

  return (
    <div className={`schulteTable ${gridSizeToCss(gridSize)}`}>
      {!numbers || gridSizeChangedWhenCompleted
        ? orderedTable()
        : numbers.map(renderTile)}
      {gameState !== "Playing" && (
        <button className="tableReplay" onClick={startGame}>
          {gameState === "NotStarted" ? <PlaySvg /> : <ReplaySvg />}
        </button>
      )}
    </div>
  );
};

export default SchulteTable;
