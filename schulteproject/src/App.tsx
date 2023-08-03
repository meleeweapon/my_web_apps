import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import SchulteTable from "./components/SchulteTable";
import ControlPanel from "./components/ControlPanel";
import Statistics from "./components/Statistics";
import { GameModes, GameState, GridSize, MatchRecord } from "./interfaces";
import { gridSizeToArray, shuffleInPlace } from "./utils";

// TODO: implement game mode property for match record type and change matches info accordingly
// TODO: change styling logic based on game mode
// TODO: add new game modes: reaction, memory, reverse, vanilla...
// TODO: consider adding a "linear" gamemode, where
// numbers are in a 1x16 grid for example.

// misc: make a state machine
// misc: add special effect when pr is achieved.
// misc: add help features, accessibility features...
// misc: add indicator for the expected value.
// misc: add indicator for current game settings (grid size, gamemode etc).
// misc: make selected game settings styled differently

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
  const [gameMode, setGameMode] = useState<GameModes>(GameModes.Vanilla);

  const resetExpectedNumber = (): void => {
    // setExpectedNumber(Math.min(...gridSizeToArray(gridSize)));
    const orderedNumbers = gridSizeToArray(gridSize);
    switch (gameMode) {
      case GameModes.Vanilla:
        setExpectedNumber(Math.min(...orderedNumbers));
        break;
      case GameModes.Reverse:
        setExpectedNumber(Math.max(...orderedNumbers));
        console.log(expectedNumber);
        break;
      case GameModes.Reaction:
        setExpectedNumber(Math.min(...orderedNumbers));
        break;
      case GameModes.Memory:
        setExpectedNumber(Math.min(...orderedNumbers));
        break;
    }
  };

  const shuffleTable = (): void =>
    setNumbers(shuffleInPlace(gridSizeToArray(gridSize)));

  // const resetNumbers = () => setNumbers();

  const resetGame = (): void => {
    resetExpectedNumber();
  };

  const startGame = (): void => {
    resetGame();
    shuffleTable();
    setGameState("Playing");
    setRoundStartTimestamp(new Date().getTime());
  };

  const endGame = (): void => {
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

  // const setExpectedNumberWithGameMode = () => {
  //   if (!numbers) return;
  //   switch (gameMode) {
  //     case GameModes.Vanilla:
  //       setExpectedNumber(Math.min(...numbers));
  //       break;
  //     case GameModes.Reverse:
  //       setExpectedNumber(Math.max(...numbers));
  //       console.log(expectedNumber);
  //       break;
  //     case GameModes.Reaction:
  //       setExpectedNumber(Math.min(...numbers));
  //       break;
  //     case GameModes.Memory:
  //       setExpectedNumber(Math.min(...numbers));
  //       break;
  //   }
  // };

  const changeGameMode = (gameMode: GameModes): void => {
    setGameMode(gameMode);
    // setExpectedNumberWithGameMode();
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
        changeGameMode={changeGameMode}
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
          gameMode={gameMode}
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
