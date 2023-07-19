import React, { createContext, useState } from "react";
import "./App.css";
import SchulteTable from "./components/SchulteTable";
import ControlPanel from "./components/ControlPanel";
import Statistics from "./components/Statistics";
import { GameState } from "./interfaces";

export const GameStateContext = createContext<GameState>("NotStarted");

function App() {
  // const [completed, setCompleted] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>("NotStarted");
  return (
    <div className="App">
      <ControlPanel gameState={gameState} setGameState={setGameState} />
      <SchulteTable gameState={gameState} setGameState={setGameState} />
      <GameStateContext.Provider value={gameState}>
        <Statistics />
      </GameStateContext.Provider>
    </div>
  );
}

export default App;
