import { Difficulty } from "@/types";

const words: Record<Difficulty, string[]> = {
  easy: ["dog", "book", "dog"],
  medium: ["planet", "bridge", "rocket"],
  hard: ["Urdu", "BRUH", "PewDiePie"],
};

export const getRandomWord = (difficulty: Difficulty): string => {
  const list = words[difficulty];
  return list[Math.floor(Math.random() * list.length)].toUpperCase();
};
