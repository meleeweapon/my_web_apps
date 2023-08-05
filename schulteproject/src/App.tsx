import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import SchulteTable from "./components/SchulteTable";
import ControlPanel from "./components/ControlPanel";
import Statistics from "./components/Statistics";
import { GameMode, GameState, GridSize, MatchRecord } from "./interfaces";
import { gridSizeToArray, shuffleInPlace } from "./utils";

// TODO: i have to research about how to work with css animations in react,
// the animations aren't working correctly.
// TODO: implement memory game mode, it's gonna need a timer and it has to reveal the number
// if the selected tile is the wrong one.
// TODO: implement game mode property for match record type and change matches info accordingly
// TODO: add new game modes: reaction, memory, reverse, vanilla...
// TODO: consider adding a "linear" gamemode, where
// numbers are in a 1x16 grid for example.

// misc: instead of making reverse a gamemode, add a direction setting.
// misc: refactor the gamemode code, try to decouple different gamemodes.
// misc: refactor in general.
// misc: make a state machine.
// misc: add special effect when pr is achieved.
// misc: add help features, accessibility features...
// misc: add indicator for the expected value.
// misc: add indicator for current game settings (grid size, gamemode etc).
// misc: make selected game settings styled differently.

export const GameStateContext = createContext<GameState>("NotStarted");
export const MatchesContext = createContext<MatchRecord[]>([]);
export const SetMatchesContext = createContext<React.Dispatch<
  React.SetStateAction<MatchRecord[]>
> | null>(null);
export const GridSizeContext = createContext<GridSize>(GridSize.Size4x4);
export const GameModeContext = createContext<GameMode>(GameMode.Vanilla);

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
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Vanilla);

  const resetExpectedNumber = (): void => {
    // setExpectedNumber(Math.min(...gridSizeToArray(gridSize)));
    const orderedNumbers = gridSizeToArray(gridSize);
    switch (gameMode) {
      case GameMode.Vanilla:
      case GameMode.Reaction:
      case GameMode.Memory:
        setExpectedNumber(Math.min(...orderedNumbers));
        break;
      case GameMode.Reverse:
        setExpectedNumber(Math.max(...orderedNumbers));
        console.log(expectedNumber);
        break;
    }
  };

  const shuffleTable = (): void =>
    setNumbers(shuffleInPlace(gridSizeToArray(gridSize)));

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
      gameMode: gameMode,
    };
    setMatches((previousMatches) => [...previousMatches, record]);
  };

  // const setExpectedNumberWithGameMode = () => {
  //   if (!numbers) return;
  //   switch (gameMode) {
  //     case GameMode.Vanilla:
  //       setExpectedNumber(Math.min(...numbers));
  //       break;
  //     case GameMode.Reverse:
  //       setExpectedNumber(Math.max(...numbers));
  //       console.log(expectedNumber);
  //       break;
  //     case GameMode.Reaction:
  //       setExpectedNumber(Math.min(...numbers));
  //       break;
  //     case GameMode.Memory:
  //       setExpectedNumber(Math.min(...numbers));
  //       break;
  //   }
  // };

  const changeGameMode = (gameMode: GameMode): void => {
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
      <GameModeContext.Provider value={gameMode}>
        <GridSizeContext.Provider value={gridSize}>
          <MatchesContext.Provider value={matches}>
            <SetMatchesContext.Provider value={setMatches}>
              <GameStateContext.Provider value={gameState}>
                <Statistics hidden={displayOnlyTable} />
              </GameStateContext.Provider>
            </SetMatchesContext.Provider>
          </MatchesContext.Provider>
        </GridSizeContext.Provider>
      </GameModeContext.Provider>
    </div>
  );
};

export default App;
