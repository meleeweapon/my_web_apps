import React, { FC } from "react";
import ReactDOM from "react-dom";
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
import SchulteTile from "./SchulteTile";

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

  const handleTile = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    pressedNumber: number,
    setPlayAnimation: React.Dispatch<React.SetStateAction<boolean>>,
    tileInstance: React.ReactInstance | null | undefined
  ): void => {
    if (gameState !== "Playing" || !numbers) {
      return;
    }

    if (gameMode === GameMode.Memory) {
      setPlayAnimation(true);
      const tileElement = ReactDOM.findDOMNode(tileInstance);
      console.log(tileElement);
      console.log(tileInstance);
      tileElement?.addEventListener("animationend", () =>
        setPlayAnimation(false)
      );
    }

    if (pressedNumber !== expectedNumber) {
      return;
    }
    const rules = GameModeRules[gameMode];

    // win condition
    if (rules.winCondition(pressedNumber, numbers, expectedNumber)) {
      endGame();
    }

    setExpectedNumber(rules.expectedNumberSetter);
  };

  const tileWithStandardPropsGiven = (tileNumber: number, index: number) => {
    return (
      <SchulteTile
        expectedNumber={expectedNumber}
        gameMode={gameMode}
        gameState={gameState}
        handleTile={handleTile}
        key={index}
        tileNumber={tileNumber}
      />
    );
  };

  const orderedTable = () =>
    gridSizeToArray(gridSize).map(tileWithStandardPropsGiven);

  // const actualTable = () => numbers.map(tileWithStandardPropsGiven);

  return (
    <div className={`schulteTable ${gridSizeToCss(gridSize)}`}>
      {!numbers || gameState === "NotStarted"
        ? orderedTable()
        : numbers.map(tileWithStandardPropsGiven)}
      {gameState !== "Playing" && (
        <button className="tableReplay" onClick={startGame}>
          {gameState === "NotStarted" ? <PlaySvg /> : <ReplaySvg />}
        </button>
      )}
    </div>
  );
};

export default SchulteTable;
