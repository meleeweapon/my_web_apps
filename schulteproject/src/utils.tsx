export const shuffleInPlace = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export const formatMatch = (matchMilliseconds: number) => {
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

export const gridSizeToArray = (gridSize: number) =>
  numberArray(1, gridSize * gridSize + 1, 1);

export const gridSizeToCss = (gridSize: number) => {
  switch (gridSize) {
    case 3:
      return "grid3x3";
    case 4:
      return "grid4x4";
    case 5:
      return "grid5x5";
    default:
      throw new Error("Undefined grid size.");
  }
};
