import React from "react";

interface Props {
  word: string;
  guessedLetters: string[];
}

const WordDisplay: React.FC<Props> = ({ word, guessedLetters }) => {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {word.split("").map((letter, idx) => (
        <div
          key={idx}
          className="w-10 h-12 flex items-center justify-center border-2 rounded border-gray-500 text-2xl font-mono bg-white shadow"
        >
          {guessedLetters.includes(letter) ? letter : "_"}
        </div>
      ))}
    </div>
  );
};

export default WordDisplay;
