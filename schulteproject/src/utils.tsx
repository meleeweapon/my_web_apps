import { GridSize, MatchRecord } from "./interfaces";

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

export const gridSizeToCss = (() => {
  const lookUp: { [key in GridSize]: string } = {
    [GridSize.Size3x3]: "grid3x3",
    [GridSize.Size4x4]: "grid4x4",
    [GridSize.Size5x5]: "grid5x5",
  };
  return (gridSize: GridSize) => lookUp[gridSize];
})();

// TODO: implement grid size to display

export const last = <T,>(arr: T[]): T | undefined => arr[arr.length - 1];

export const gridSizeToDisplay = (gridSize: number): string => "";
