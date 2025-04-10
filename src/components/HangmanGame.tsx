"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getRandomWord } from "@/lib/word-utils";
import { Difficulty, ScoreEntry } from "@/types";
import WordDisplay from "@/components/WordDisplay";
import Keyboard from "@/components/Keyboard";
import HintDisplay from "@/components/HintDisplay";

const API_URL = "http://localhost:11434";
const MODEL = "gemma3:4b";
const MAX_ATTEMPTS = 6;

const HangmanGame: React.FC = () => {
  const [difficulty] = useState<Difficulty>("hard");
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [hint, setHint] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [shownHint, setShownHint] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const startGame = useCallback(() => {
    setWord(getRandomWord(difficulty));
    setGuessedLetters([]);
    setAttemptsLeft(MAX_ATTEMPTS);
    setHint(null);
    setMessage("");
    setShownHint(0);
  }, [difficulty]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || message) return;

    const updatedGuessed = [...guessedLetters, letter];
    setGuessedLetters(updatedGuessed);

    if (!word.includes(letter)) {
      setAttemptsLeft((prev) => prev - 1);
      if (attemptsLeft <= 1) {
        setMessage(`💀 Game Over! The word was "${word}"`);
      }
    } else if (word.split("").every((l) => updatedGuessed.includes(l))) {
      setMessage("🎉 You won!");
      saveScore();
    }
  };

  const saveScore = () => {
    const prev = localStorage.getItem("hangmanScores");
    const updated: ScoreEntry[] = prev ? JSON.parse(prev) : [];
    updated.push({ word, difficulty, date: new Date().toISOString() });
    localStorage.setItem("hangmanScores", JSON.stringify(updated));
  };

  const getHint = async () => {
    if (shownHint >= 102) {
      setHint("Hint limit reached");
      return;
    }
    setShownHint((prev) => prev + 1);

    try {
      const prompt = `
        Give a helpful, single-sentence hint for guessing the word "${word}".
Only these letters have been guessed so far: ${guessedLetters.join(", ") || "none"}.
Don't reveal the word, just give a strategic hint for what letter or pattern to try next.

The hint should be in English and not contain any special characters or emojis.
The hint should be a single sentence, and not more than 20 words long.
The hint should be related to the word, don't compliate using saying about sounds etc.

       `;

      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, prompt, stream: false }),
      });
      const data = await res.json();
      setHint(data.response?.trim() || "Couldn't get a hint this time.");
    } catch (err) {
      console.error(err);
      setHint("Try common vowels or consonants.");
    }
  };

  const handleSubmit = async () => {
    // if (shownHint >= 5) {
    //   setHint("Hint limit reached");
    //   return;
    // }
    // setShownHint((prev) => prev + 1);

    console.log("question", question);

    try {
      const prompt = `You are an expert Hangman assistant. The secret word is "${word}", but NEVER reveal the word or any of its letters. 

        A player asked: "${question}". 
        
        If the question relates to the word or seems to be a guess in disguise, respond with a **strategic, clever hint** that nudges the player toward useful patterns (like prefixes, suffixes, or common letter positions) **without directly revealing any letters or the word**.
        
        If the question is off-topic or too direct, reply with encouragement, redirection, or a gentle puzzle-style clue.
        
        Keep it brief, engaging, and fun. DO NOT use phrases like "I can't tell you that" or "I'm not allowed to reveal..." — just stay helpful and sneaky.`;
      console.log("prompt", prompt);

      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, prompt, stream: false }),
      });
      const data = await res.json();
      setAnswer(data.response?.trim() || "Couldn't get a hint this time.");

      console.log("data", data.response);
    } catch (err) {
      console.error(err);
      setAnswer("Try common vowels or consonants.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-4">
          🧠 AI SEEK: Hangman
        </h1>
        <div className="text-center text-lg font-semibold">
          Attempts Left:{" "}
          <span
            className={attemptsLeft <= 2 ? "text-red-500" : "text-green-600"}
          >
            {attemptsLeft}
          </span>
        </div>
        <WordDisplay word={word} guessedLetters={guessedLetters} />
        {message && (
          <div className="mt-4 text-center text-xl font-bold text-green-600">
            {message}
          </div>
        )}
        <HintDisplay hint={hint} />
        <Keyboard
          guessedLetters={guessedLetters}
          handleGuess={handleGuess}
          disabled={!!message}
        />
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <button
            onClick={startGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            🔁 Restart
          </button>
          <button
            onClick={() => setAiEnabled(!aiEnabled)}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            🤖 AI: {aiEnabled ? "On" : "Off"}
          </button>
          {aiEnabled && (
            <button
              onClick={getHint}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              💡 Get Hint
            </button>
          )}
        </div>
        <div className="">
          <h1>Ask AI</h1>
          <input
            type="text"
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
            className="mt-2 p-2 rounded-lg border-2 border-gray-500 w-full"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 "
            onClick={handleSubmit}
          >
            Submit
          </button>
          <div className="mt-2 text-center text-lg font-semibold">{answer}</div>
        </div>
      </div>
    </div>
  );
};

export default HangmanGame;
