export type GameState = "NotStarted" | "Playing" | "Completed";
export enum GridSize {
  Size3x3 = 9,
  Size4x4 = 16,
  Size5x5 = 25,
}
export interface MatchRecord {
  gridSize: GridSize;
  durationInMilliseconds: number;
}
