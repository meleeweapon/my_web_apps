import React, { FC, useContext } from "react";
import { GameState } from "../interfaces";

interface ControlPanelProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setRoundStartTimestamp: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

// function ControlPanel(props: ControlPanelProps) {
const ControlPanel: FC<ControlPanelProps> = (props) => {
  const { gameState, setGameState, setRoundStartTimestamp } = props;

  const handleStartGame = () => {
    setGameState("Playing");
    setRoundStartTimestamp(new Date().getTime());
  };

  return (
    <div className="controlPanel">
      {gameState === "NotStarted" && (
        <button className="playAgain" onClick={handleStartGame}>
          Start
        </button>
      )}
      {gameState === "Completed" && (
        <button className="playAgain">Play Again</button>
      )}
    </div>
  );
};

export default ControlPanel;
