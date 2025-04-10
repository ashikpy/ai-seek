import React from "react";

interface Props {
  guessedLetters: string[];
  handleGuess: (letter: string) => void;
  disabled: boolean;
}

const Keyboard: React.FC<Props> = ({
  guessedLetters,
  handleGuess,
  disabled,
}) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return (
    <div className="grid grid-cols-7 gap-2 mt-6">
      {alphabet.map((letter) => {
        const guessed = guessedLetters.includes(letter);
        return (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessed || disabled}
            className={`p-2 rounded text-white font-medium ${
              guessed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1F7A8C] hover:bg-teal-700"
            }`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard;
