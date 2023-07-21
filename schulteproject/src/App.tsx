import React, { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import SchulteTable from "./components/SchulteTable";
import ControlPanel from "./components/ControlPanel";
import Statistics from "./components/Statistics";
import { GameState, MatchesType } from "./interfaces";

export const GameStateContext = createContext<GameState>("NotStarted");
export const MatchesContext = createContext<MatchesType>([]);
export const SetMatchesContext = createContext<React.Dispatch<
  React.SetStateAction<MatchesType>
> | null>(null);

export const matchesKey = "matches";
const getMatchesFromLocalStorage = () => {
  const matches = localStorage.getItem(matchesKey);
  if (matches === null) {
    localStorage.setItem(matchesKey, JSON.stringify([]));
    return [];
  }
  return JSON.parse(matches);
};

function App() {
  // const [completed, setCompleted] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>("NotStarted");
  const [matches, setMatches] = useState<MatchesType>(
    getMatchesFromLocalStorage
  );
  const [roundStartTimestamp, setRoundStartTimestamp] = useState<
    number | undefined
  >();

  useEffect(() => {
    localStorage.setItem(matchesKey, JSON.stringify(matches));
  }, [matches]);

  return (
    <div className="App">
      <ControlPanel
        gameState={gameState}
        setGameState={setGameState}
        setRoundStartTimestamp={setRoundStartTimestamp}
      />
      <SchulteTable
        gameState={gameState}
        setGameState={setGameState}
        setMatches={setMatches}
        roundStartTimestamp={roundStartTimestamp}
      />
      <MatchesContext.Provider value={matches}>
        <SetMatchesContext.Provider value={setMatches}>
          <GameStateContext.Provider value={gameState}>
            <Statistics />
          </GameStateContext.Provider>
        </SetMatchesContext.Provider>
      </MatchesContext.Provider>
    </div>
  );
}

export default App;
