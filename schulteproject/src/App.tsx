import React, { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import SchulteTable from "./components/SchulteTable";
import ControlPanel from "./components/ControlPanel";
import Statistics from "./components/Statistics";
import { GameState, MatchesType } from "./interfaces";
import { shuffleInPlace } from "./utils";

// TODO: change the replay/play buttons place into schultes table
// TODO: with position absolute.

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

const orderedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
Object.freeze(orderedNumbers);

const App = () => {
  const [gameState, setGameState] = useState<GameState>("NotStarted");
  const [matches, setMatches] = useState<MatchesType>(
    getMatchesFromLocalStorage
  );
  const [roundStartTimestamp, setRoundStartTimestamp] = useState<
    number | undefined
  >();
  const [numbers, setNumbers] = useState<number[] | undefined>();
  const [expectedNumber, setExpectedNumber] = useState<number>(
    Math.min(...orderedNumbers)
  );
  const [displayOnlyTable, setDisplayOnlyTable] = useState<boolean>(false);

  // const [currentRoundTime, setCurrentRoundTime] = useState<
  //   number | undefined
  // >();

  const startGame = () => {
    setNumbers(shuffleInPlace([...orderedNumbers]));
    setExpectedNumber(Math.min(...orderedNumbers));
    setGameState("Playing");
    setRoundStartTimestamp(new Date().getTime());
  };

  const endGame = () => {
    setGameState("Completed");
    if (!roundStartTimestamp)
      throw new Error("Round start time can't be undefined.");
    const temporaryRoundTime = new Date().getTime() - roundStartTimestamp;
    // setCurrentRoundTime(temporaryRoundTime);
    setMatches((previousMatches) => [...previousMatches, temporaryRoundTime]);
  };

  useEffect(() => {
    localStorage.setItem(matchesKey, JSON.stringify(matches));
  }, [matches]);

  return (
    <div className="App">
      <ControlPanel
        gameState={gameState}
        setGameState={setGameState}
        setRoundStartTimestamp={setRoundStartTimestamp}
        startGame={startGame}
        setDisplayOnlyTable={setDisplayOnlyTable}
        hidden={displayOnlyTable}
      />
      <div className="tableContainer">
        <SchulteTable
          gameState={gameState}
          expectedNumber={expectedNumber}
          setExpectedNumber={setExpectedNumber}
          numbers={numbers}
          orderedNumbers={orderedNumbers}
          endGame={endGame}
        />
      </div>
      <MatchesContext.Provider value={matches}>
        <SetMatchesContext.Provider value={setMatches}>
          <GameStateContext.Provider value={gameState}>
            <Statistics hidden={displayOnlyTable} />
          </GameStateContext.Provider>
        </SetMatchesContext.Provider>
      </MatchesContext.Provider>
    </div>
  );
};

export default App;
