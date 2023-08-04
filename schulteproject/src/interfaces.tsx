export type GameState = "NotStarted" | "Playing" | "Completed";
export enum GridSize {
  Size3x3 = 9,
  Size4x4 = 16,
  Size5x5 = 25,
}
export interface MatchRecord {
  gridSize: GridSize;
  durationInMilliseconds: number;
  gameMode: GameMode;
}
export const gridSizeToCssLookUp: { [key in GridSize]: string } = {
  [GridSize.Size3x3]: "grid3x3",
  [GridSize.Size4x4]: "grid4x4",
  [GridSize.Size5x5]: "grid5x5",
};
export const gridSizeToDisplayLookUp: { [key in GridSize]: string } = {
  [GridSize.Size3x3]: "3 x 3",
  [GridSize.Size4x4]: "4 x 4",
  [GridSize.Size5x5]: "5 x 5",
};
export enum GameMode {
  Vanilla,
  Reverse,
  Memory,
  Reaction,
}
export const gameModeToDisplayLookUp: { [key in GameMode]: string } = {
  [GameMode.Vanilla]: "Vanilla",
  [GameMode.Reverse]: "Reverse",
  [GameMode.Memory]: "Memory",
  [GameMode.Reaction]: "Reaction",
};
export interface GameModeRule {
  winCondition: (
    pressedNumber: number,
    numbers: number[],
    expectedNumber: number
  ) => boolean;
  expectedNumberSetter: (previousExpectedNumber: number) => number;
}
