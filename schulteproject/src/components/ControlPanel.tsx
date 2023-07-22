import React, { FC, useContext } from "react";
import { GameState } from "../interfaces";

interface ControlPanelProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setRoundStartTimestamp: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  startGame: () => void;
}

const ControlPanel: FC<ControlPanelProps> = (props) => {
  const { gameState, startGame } = props;

  const handleStartGame = () => {
    startGame();
  };

  return (
    <div className="controlPanel">
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
  );
};

export default ControlPanel;
