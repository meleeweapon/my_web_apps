import React, { FC } from "react";
import { GameModeRule, GameModes, GameState, GridSize } from "../interfaces";
import ReplaySvg from "./ReplaySvg";
import PlaySvg from "./PlaySvg";
import { gridSizeToArray, gridSizeToCss } from "../utils";

interface SchulteTableProps {
  gameState: GameState;
  expectedNumber: number;
  setExpectedNumber: React.Dispatch<React.SetStateAction<number>>;
  numbers: number[] | undefined;
  gridSize: GridSize;
  endGame: () => void;
  startGame: () => void;
  gameMode: GameModes;
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
    gameMode,
  } = props;

  const GameModeRules: { [key in GameModes]: GameModeRule } = {
    [GameModes.Vanilla]: {
      expectedNumberSetter: (previousExpectedNumber) =>
        previousExpectedNumber + 1,
      winCondition: (pressedNumber, numbers, expectedNumber) =>
        pressedNumber === Math.max(...numbers),
    },
    [GameModes.Reverse]: {
      expectedNumberSetter: (previousExpectedNumber) =>
        previousExpectedNumber - 1,
      winCondition: (pressedNumber, numbers, expectedNumber) =>
        pressedNumber === Math.min(...numbers),
    },
    [GameModes.Reaction]: {
      expectedNumberSetter: (previousExpectedNumber) =>
        previousExpectedNumber + 1,
      winCondition: (pressedNumber, numbers, expectedNumber) =>
        pressedNumber === Math.max(...numbers),
    },
    [GameModes.Memory]: {
      expectedNumberSetter: (previousExpectedNumber) =>
        previousExpectedNumber + 1,
      winCondition: (pressedNumber, numbers, expectedNumber) =>
        pressedNumber === Math.max(...numbers),
    },
  };

  const handleTile = (pressedNumber: number): void => {
    if (
      pressedNumber !== expectedNumber ||
      gameState !== "Playing" ||
      !numbers
    ) {
      return;
    }

    const rules = GameModeRules[gameMode];

    // win condition
    if (rules.winCondition(pressedNumber, numbers, expectedNumber)) {
      endGame();
    }

    setExpectedNumber(rules.expectedNumberSetter);
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
      {!numbers || gameState === "NotStarted"
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
