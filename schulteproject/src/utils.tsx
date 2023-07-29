import { GridSize, MatchRecord } from "./interfaces";

export const shuffleInPlace = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export const formatMatchDuration = (match: MatchRecord) => {
  const matchMilliseconds = match.durationInMilliseconds;
  return (matchMilliseconds / 1000).toFixed(2);
};

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

export const gridSizeToCss = (gridSize: GridSize) => {
  switch (gridSize) {
    case GridSize.Size3x3:
      return "grid3x3";
    case GridSize.Size4x4:
      return "grid4x4";
    case GridSize.Size5x5:
      return "grid5x5";
    default:
      throw new Error("Undefined grid size.");
  }
};
