import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import SchulteTable from "./components/SchulteTable";
import ControlPanel from "./components/ControlPanel";
import Statistics from "./components/Statistics";
import { GameState, GridSize, MatchRecord } from "./interfaces";
import { gridSizeToArray, shuffleInPlace } from "./utils";

// TODO: change set game state so it does needed things when changing state.
// TODO: add new game modes: reaction, memory, reverse, vanilla...
// TODO: consider adding a "linear" gamemode, where
// numbers are in a 1x16 grid for example.

// misc: add special effect when pr is achieved.
// misc: add help features, accessibility features...
// misc: add indicator for the expected value.
// misc: add indicator for current game settings (grid size, gamemode etc).

export const GameStateContext = createContext<GameState>("NotStarted");
export const MatchesContext = createContext<MatchRecord[]>([]);
export const SetMatchesContext = createContext<React.Dispatch<
  React.SetStateAction<MatchRecord[]>
> | null>(null);
export const GridSizeContext = createContext<GridSize>(GridSize.Size4x4);

export const matchesKey = "matches";
const getMatchesFromLocalStorage = (): MatchRecord[] => {
  const matches = localStorage.getItem(matchesKey);
  if (matches === null) {
    localStorage.setItem(matchesKey, JSON.stringify([]));
    return [];
  }
  return JSON.parse(matches) as MatchRecord[];
};

const App = () => {
  const [gameState, setGameState] = useState<GameState>("NotStarted");
  const [matches, setMatches] = useState<MatchRecord[]>(
    getMatchesFromLocalStorage
  );
  const [roundStartTimestamp, setRoundStartTimestamp] = useState<
    number | undefined
  >();
  const [numbers, setNumbers] = useState<number[] | undefined>();
  const [displayOnlyTable, setDisplayOnlyTable] = useState<boolean>(false);
  const [gridSize, setGridSize] = useState<GridSize>(GridSize.Size4x4);
  const [expectedNumber, setExpectedNumber] = useState<number>(
    Math.min(...gridSizeToArray(gridSize))
  );

  const resetExpectedNumber = () =>
    setExpectedNumber(Math.min(...gridSizeToArray(gridSize)));

  const shuffleTable = () =>
    setNumbers(shuffleInPlace([...gridSizeToArray(gridSize)]));

  // const resetNumbers = () => setNumbers();

  const resetGame = () => {
    resetExpectedNumber();
  };

  const startGame = () => {
    resetGame();
    shuffleTable();
    setGameState("Playing");
    setRoundStartTimestamp(new Date().getTime());
  };

  const endGame = () => {
    setGameState("Completed");
    if (!roundStartTimestamp)
      throw new Error("Round start time can't be undefined.");
    const temporaryRoundTime = new Date().getTime() - roundStartTimestamp;
    // setCurrentRoundTime(temporaryRoundTime);
    const record: MatchRecord = {
      durationInMilliseconds: temporaryRoundTime,
      gridSize: gridSize,
    };
    setMatches((previousMatches) => [...previousMatches, record]);
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
        setGridSize={setGridSize}
        hidden={displayOnlyTable}
        resetGame={resetGame}
      />
      <div className="tableContainer">
        <SchulteTable
          gameState={gameState}
          expectedNumber={expectedNumber}
          setExpectedNumber={setExpectedNumber}
          numbers={numbers}
          gridSize={gridSize}
          endGame={endGame}
          startGame={startGame}
        />
      </div>
      <GridSizeContext.Provider value={gridSize}>
        <MatchesContext.Provider value={matches}>
          <SetMatchesContext.Provider value={setMatches}>
            <GameStateContext.Provider value={gameState}>
              <Statistics hidden={displayOnlyTable} />
            </GameStateContext.Provider>
          </SetMatchesContext.Provider>
        </MatchesContext.Provider>
      </GridSizeContext.Provider>
    </div>
  );
};

export default App;
