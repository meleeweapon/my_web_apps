import React, { FC } from "react";
import { GameState, GridSize } from "../interfaces";
import { gridSizeToDisplay } from "../utils";

interface ControlPanelProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setRoundStartTimestamp: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  startGame: () => void;
  setDisplayOnlyTable: React.Dispatch<React.SetStateAction<boolean>>;
  hidden: boolean;
  setGridSize: React.Dispatch<React.SetStateAction<GridSize>>;
  resetGame: () => void;
}

const ControlPanel: FC<ControlPanelProps> = (props) => {
  const {
    gameState,
    setGameState,
    startGame,
    setDisplayOnlyTable,
    hidden,
    setGridSize,
    resetGame,
  } = props;

  const handleStartGame = () => {
    startGame();
  };

  const handleToggleVisibility = () => {
    setDisplayOnlyTable(
      (previousDisplayOnlyTable) => !previousDisplayOnlyTable
    );
  };

  const handleGridSizeSetting = (gridSize: GridSize): void => {
    switch (gameState) {
      case "Playing":
        return;
      case "NotStarted":
        break;
      case "Completed":
        // TODO: change game state to not started
        setGameState("NotStarted");
        resetGame();
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
            <button onClick={() => handleGridSizeSetting(GridSize.Size3x3)}>
              {gridSizeToDisplay(GridSize.Size3x3)}
            </button>
            <button onClick={() => handleGridSizeSetting(GridSize.Size4x4)}>
              {gridSizeToDisplay(GridSize.Size4x4)}
            </button>
            <button onClick={() => handleGridSizeSetting(GridSize.Size5x5)}>
              {gridSizeToDisplay(GridSize.Size5x5)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
