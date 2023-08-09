import React, { FC, useEffect, useState } from "react";
import { GameMode, GameState } from "../interfaces";

interface SchulteTileProps {
  gameMode: GameMode;
  tileNumber: number;
  expectedNumber: number;
  gameState: GameState;
  handleTile: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    pressedNumber: number,
    setPlayAnimation: React.Dispatch<React.SetStateAction<boolean>>,
    tileInstance: React.ReactInstance | null | undefined
  ) => void;
}

const SchulteTile: FC<SchulteTileProps> = (props) => {
  const { gameMode, tileNumber, expectedNumber, gameState, handleTile } = props;

  const [playAnimation, setPlayAnimation] = useState<boolean>(false);

  const thisTileInstance = this;
  console.log(this);
  console.log(thisTileInstance);

  const GameModeStyleRule =
    gameMode === GameMode.Reverse
      ? tileNumber > expectedNumber
      : tileNumber < expectedNumber;
  return (
    <button
      className={`tile ${
        GameModeStyleRule && gameState !== "NotStarted"
          ? "clicked"
          : "unclicked"
      }`}
      onClick={(event) =>
        handleTile(event, tileNumber, setPlayAnimation, thisTileInstance)
      }
    >
      <div
        className={`${
          gameMode === GameMode.Reaction &&
          tileNumber !== expectedNumber &&
          gameState !== "Completed"
            ? "hidden"
            : ""
        } ${
          // for testing purposes
          gameMode === GameMode.Memory
            ? playAnimation
              ? "revealTileShortly"
              : "hidden"
            : ""
        }`}
      >
        {tileNumber}
      </div>
    </button>
  );
};

export default SchulteTile;
