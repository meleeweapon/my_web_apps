import {
  GameMode,
  GridSize,
  MatchRecord,
  gameModeToDisplayLookUp,
  gridSizeToCssLookUp,
  gridSizeToDisplayLookUp,
} from "./interfaces";

export const shuffleInPlace = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export const formatMatchDuration = (match: MatchRecord) => {
  const matchMilliseconds = match.durationInMilliseconds;
  return formatMillisecondsToSeconds(matchMilliseconds);
};

export const formatMillisecondsToSeconds = (milliseconds: number) =>
  (milliseconds / 1000).toFixed(2);

export const numberArray = (
  start: number,
  end: number,
  step: number
): number[] => {
  const numbers = [];
  for (let index = start; index < end; index += step) {
    numbers.push(index);
  }
  return numbers;
};

export const gridSizeToArray = (gridSize: GridSize) =>
  numberArray(1, gridSize + 1, 1);

export const gridSizeToCss = (gridSize: GridSize) =>
  gridSizeToCssLookUp[gridSize];

export const gridSizeToDisplay = (gridSize: GridSize) =>
  gridSizeToDisplayLookUp[gridSize];

export const last = <T,>(arr: T[]): T | undefined => arr[arr.length - 1];

export const findLastPlayed = (matches: MatchRecord[]) => last(matches);

export const findPersonalBestRecord = (matches: MatchRecord[]) =>
  matches.length
    ? matches.reduce((previousMatch, currentMatch) =>
        previousMatch.durationInMilliseconds <
        currentMatch.durationInMilliseconds
          ? previousMatch
          : currentMatch
      )
    : undefined;

export const findSettingSpecificMatches = (
  matches: MatchRecord[],
  gridSize: GridSize,
  gameMode: GameMode
) =>
  matches.filter(
    (match) => match.gridSize === gridSize && match.gameMode === gameMode
  );

export const gameModeToDisplay = (gameMode: GameMode) =>
  gameModeToDisplayLookUp[gameMode];
