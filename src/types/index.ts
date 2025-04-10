export type Difficulty = "easy" | "medium" | "hard";

export interface ScoreEntry {
  word: string;
  difficulty: Difficulty;
  date: string;
}
