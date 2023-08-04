import React, { FC } from "react";
import {
  GameModeRule,
  GameMode,
  GameState,
  GridSize,
  gameModeToDisplayLookUp,
} from "../interfaces";
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
  gameMode: GameMode;
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

  const GameModeRules: { [key in GameMode]: GameModeRule } = {
    [GameMode.Vanilla]: {
      expectedNumberSetter: (previousExpectedNumber) =>
        previousExpectedNumber + 1,
      winCondition: (pressedNumber, numbers, expectedNumber) =>
        pressedNumber === Math.max(...numbers),
    },
    [GameMode.Reverse]: {
      expectedNumberSetter: (previousExpectedNumber) =>
        previousExpectedNumber - 1,
      winCondition: (pressedNumber, numbers, expectedNumber) =>
        pressedNumber === Math.min(...numbers),
    },
    [GameMode.Reaction]: {
      expectedNumberSetter: (previousExpectedNumber) =>
        previousExpectedNumber + 1,
      winCondition: (pressedNumber, numbers, expectedNumber) =>
        pressedNumber === Math.max(...numbers),
    },
    [GameMode.Memory]: {
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
    const GameModetyleRule =
      gameMode === GameMode.Reverse
        ? tileNumber > expectedNumber
        : tileNumber < expectedNumber;
    return (
      <button
        className={`tile ${
          GameModetyleRule && gameState !== "NotStarted"
            ? " clicked"
            : " unclicked"
        }`}
        key={index}
        onClick={() => handleTile(tileNumber)}
      >
        <div
          className={`${
            gameMode === GameMode.Reaction &&
            tileNumber !== expectedNumber &&
            gameState !== "Completed"
              ? "hidden"
              : ""
          }`}
        >
          {tileNumber}
        </div>
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
