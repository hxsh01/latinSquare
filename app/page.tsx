"use client";

import { useCallback, useEffect, useState } from "react";
import { AiPrompt } from "../components/AiPrompt";
import { DifficultySelector } from "../components/DifficultySelector";
import { LatinSquareGrid } from "../components/LatinSquareGrid";
import { SymbolPicker } from "../components/SymbolPicker";
import { Timer } from "../components/Timer";
import { generateLatinSquarePuzzle } from "../lib/latin-square/generator";
import { validateTarget } from "../lib/latin-square/validator";
import type {
  Difficulty,
  LatinSquarePuzzle,
  SymbolValue,
} from "../lib/latin-square/types";

export default function Home() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [puzzle, setPuzzle] = useState<LatinSquarePuzzle | null>(null);
  const [answer, setAnswer] = useState<SymbolValue | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [generating, setGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  const generate = useCallback(() => {
    setGenerating(true);

    requestAnimationFrame(() => {
      try {
        const next = generateLatinSquarePuzzle(difficulty);

        setPuzzle(next);
        setAnswer(null);
        setResult(null);

        const start = Date.now();

        setStartedAt(start);
        setFinishedAt(null);
        setNow(start);
        setIsSettingsOpen(false);
      } finally {
        setGenerating(false);
      }
    });
  }, [difficulty]);

  useEffect(() => {
    if (!startedAt || finishedAt) return;

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 200);

    return () => window.clearInterval(id);
  }, [startedAt, finishedAt]);

  const submitted = result !== null;

  useEffect(() => {
    if (!puzzle || submitted) return;

    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toUpperCase();

      if (puzzle?.symbols.includes(key)) {
        setAnswer(key);
      }

      if (event.key === "Enter" && answer) {
        submit();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [puzzle, submitted, answer]);

  const elapsed = startedAt ? (finishedAt ?? now) - startedAt : 0;

  function handleDifficultyChange(value: Difficulty) {
    setDifficulty(value);
    setPuzzle(null);
    setAnswer(null);
    setResult(null);
    setStartedAt(null);
    setFinishedAt(null);
    setIsSettingsOpen(true);
  }

  function submit() {
    if (!puzzle || !answer) return;

    const end = Date.now();

    setFinishedAt(end);
    setNow(end);
    setResult(validateTarget(puzzle, answer) ? "correct" : "incorrect");
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <section className="rounded-3xl border border-slate-200 bg-white shadow-soft">
          <button
            type="button"
            onClick={() => setIsSettingsOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-2 px-2 py-1 text-left sm"
            aria-expanded={isSettingsOpen}
            aria-controls="problem-settings"
          >
            <div className="min-w-0">
              <div className="text-xl font-black tracking-tight sm:text-4xl">
                Latin Square Generator
              </div>
              {!isSettingsOpen && (
                <p className="mt-3 text-sm font-bold capitalize text-slate-900">
                  Difficulty: {difficulty}
                </p>
              )}
            </div>

            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-transform duration-200 ${
                isSettingsOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          <div
            id="problem-settings"
            className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
              isSettingsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-slate-100 p-2 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <DifficultySelector
                    value={difficulty}
                    onChange={handleDifficultyChange}
                    disabled={generating}
                  />

                  <button
                    type="button"
                    onClick={generate}
                    disabled={generating}
                    className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-44"
                  >
                    {generating
                      ? "Generating…"
                      : puzzle
                        ? "Generate New Problem"
                        : "Generate Problem"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {puzzle && (
          <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {puzzle.difficulty} problem
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold">
                <Timer elapsedMs={elapsed} />
              </div>
            </div>

            <div className="flex flex-col items-center gap-5">
              <LatinSquareGrid
                puzzle={puzzle}
                answer={answer}
                result={result}
              />

              <SymbolPicker
                symbols={puzzle.symbols}
                value={answer}
                onChange={setAnswer}
              />

              <button
                type="button"
                onClick={submit}
                disabled={!answer || submitted}
                className="w-full max-w-[520px] rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit Answer
              </button>
            </div>

            {result && (
              <div
                className={`mt-6 rounded-2xl border p-4 ${
                  result === "correct"
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p
                      className={`font-bold ${
                        result === "correct" ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {result === "correct" ? "Correct" : "Incorrect"}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Your answer: <strong>{answer}</strong> · Correct answer:{" "}
                      <strong>{puzzle.targetValue}</strong>
                    </p>
                  </div>

                  <p className="text-sm font-bold text-slate-700">
                    Time: <Timer elapsedMs={elapsed} />
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {puzzle && result && (
          <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
            <div className="mb-4">
              <h2 className="text-xl font-black">
                Correctly filled Latin square
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                The complete valid square is shown after submission.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="latin-grid">
                {puzzle.solution.map((row, r) =>
                  row.map((value, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="latin-cell given"
                      role="gridcell"
                    >
                      {value}
                    </div>
                  )),
                )}
              </div>
            </div>
          </section>
        )}

        {puzzle && result && (
          <section className="mt-5">
            <AiPrompt puzzle={puzzle} />
          </section>
        )}

        {/* {!puzzle && (
          <section className="mt-12 border-t border-slate-200 pt-10">
            <div className="max-w-none text-slate-700">
              <h2 className="text-2xl font-black text-slate-900">
                Free 5×5 Latin Square Generator
              </h2>

              <p className="mt-3 text-sm leading-7 sm:text-base">
                Generate random 5×5 Latin square puzzles and practice solving
                them under timed conditions. Choose Easy, Medium, or Hard
                difficulty and find the symbol that belongs in the highlighted
                cell.
              </p>

              <p className="mt-3 text-sm leading-7 sm:text-base">
                Each puzzle contains a similar number of prefilled cells. The
                difficulty changes based on the logical deductions needed to
                determine the answer rather than simply increasing the number of
                empty cells.
              </p>

              <h2 className="mt-8 text-xl font-black text-slate-900">
                What is a Latin Square?
              </h2>

              <p className="mt-3 text-sm leading-7 sm:text-base">
                A Latin square is an n×n grid containing n different symbols
                where each symbol occurs exactly once in every row and exactly
                once in every column.
              </p>

              <p className="mt-3 text-sm leading-7 sm:text-base">
                In a 5×5 Latin square, the five symbols are A, B, C, D, and E.
                Every row and every column must contain each of these symbols
                exactly once.
              </p>

              <h2 className="mt-8 text-xl font-black text-slate-900">
                How to Solve a Latin Square Puzzle
              </h2>

              <p className="mt-3 text-sm leading-7 sm:text-base">
                To solve a Latin square problem, examine the highlighted cell
                and use the symbols already present in its row and column to
                eliminate possible answers.
              </p>

              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 sm:text-base">
                <li>Look at the symbols already present in the target row.</li>
                <li>Identify which symbols are missing from that row.</li>
                <li>
                  Check the target column and eliminate symbols already present
                  there.
                </li>
                <li>
                  Use information from other rows and columns if multiple
                  candidates remain.
                </li>
                <li>Enter the remaining symbol and submit your answer.</li>
              </ol>

              <h2 className="mt-8 text-xl font-black text-slate-900">
                Latin Square Difficulty Levels
              </h2>

              <h3 className="mt-5 text-lg font-bold text-slate-900">Easy</h3>

              <p className="mt-2 text-sm leading-7 sm:text-base">
                Easy Latin square problems can be solved using short and
                relatively direct deductions. They are suitable for learning the
                basic row and column elimination technique.
              </p>

              <h3 className="mt-5 text-lg font-bold text-slate-900">Medium</h3>

              <p className="mt-2 text-sm leading-7 sm:text-base">
                Medium problems require several connected deductions. You may
                need to use information from other rows or columns before the
                highlighted cell can be determined.
              </p>

              <h3 className="mt-5 text-lg font-bold text-slate-900">Hard</h3>

              <p className="mt-2 text-sm leading-7 sm:text-base">
                Hard problems require longer chains of logical reasoning and
                consideration of multiple possible candidates before the correct
                symbol becomes clear.
              </p>

              <h2 className="mt-8 text-xl font-black text-slate-900">
                Latin Square Reasoning Practice
              </h2>

              <p className="mt-3 text-sm leading-7 sm:text-base">
                Use this Latin square generator to practice reasoning questions
                under timed conditions. The timer starts when a problem is
                generated and stops when you submit your answer. After
                submission, you can see the complete Latin square, the correct
                answer, and the time taken to solve the problem.
              </p>
            </div>
          </section>
        )} */}
      </div>
    </main>
  );
}
