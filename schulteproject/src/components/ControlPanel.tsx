import React, { FC } from "react";
import { GameState } from "../interfaces";

interface ControlPanelProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setRoundStartTimestamp: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  startGame: () => void;
  setDisplayOnlyTable: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean;
  setGridSize: React.Dispatch<React.SetStateAction<number>>;
  setGridSizeChangedWhenCompleted: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  resetExpectedNumber: () => void;
}

const ControlPanel: FC<ControlPanelProps> = (props) => {
  const {
    gameState,
    startGame,
    setDisplayOnlyTable,
    hidden,
    setGridSize,
    setGridSizeChangedWhenCompleted,
    resetExpectedNumber,
  } = props;

  const handleStartGame = () => {
    startGame();
  };

  const handleToggleVisibility = () => {
    setDisplayOnlyTable(
      (previousDisplayOnlyTable) => !previousDisplayOnlyTable
    );
  };

  const handleGridSizeSetting = (gridSize: number): void => {
    switch (gameState) {
      case "Playing":
        return;
      case "NotStarted":
        break;
      case "Completed":
        setGridSizeChangedWhenCompleted(true);
        resetExpectedNumber();
        break;
    }

    setGridSize(gridSize);
  };

  return (
    <>
      <button
        className={`exposePanels tile unclicked ${!hidden && "hidden"}`}
        onClick={handleToggleVisibility}
      >
        →
      </button>
      <div className={`controlPanel ${hidden && "hidden"}`}>
        <div className="toggleVisibilityContainer">
          <button
            className="toggleVisibility tile unclicked"
            onClick={handleToggleVisibility}
          >
            ←
          </button>
        </div>

        <div className="playAgainContainer">
          {gameState === "NotStarted" && (
            <button className="playAgain" onClick={handleStartGame}>
              Start
            </button>
          )}
          {gameState === "Completed" && (
            <button className="playAgain" onClick={handleStartGame}>
              Play Again
            </button>
          )}
        </div>

        <div className="gameSettings">
          <div className="gridSetting">
            <button onClick={() => handleGridSizeSetting(3)}>3 x 3</button>
            <button onClick={() => handleGridSizeSetting(4)}>4 x 4</button>
            <button onClick={() => handleGridSizeSetting(5)}>5 x 5</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
