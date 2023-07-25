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
}

const ControlPanel: FC<ControlPanelProps> = (props) => {
  const { gameState, startGame, setDisplayOnlyTable, hidden } = props;

  const handleStartGame = () => {
    startGame();
  };

  const handleToggleVisibility = () => {
    setDisplayOnlyTable(
      (previousDisplayOnlyTable) => !previousDisplayOnlyTable
    );
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
      </div>
    </>
  );
};

export default ControlPanel;
