export interface LevelProgress {
  level: number;
  progress: number;
}

export type LevelChangeResult = {
  previousLevel: number;
  previousProgress: number;
  level: number;
  progress: number;
  leveledUp: boolean;
};