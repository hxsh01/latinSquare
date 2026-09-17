import type {
  Difficulty,
  Grid,
  LatinSquarePuzzle,
  SymbolValue,
} from "./types";

type SharedPuzzle = {
  puzzle: Grid;
  solution: SymbolValue[][];
  difficulty: Difficulty;
  target: {
    row: number;
    column: number;
  };
  targetValue: SymbolValue;
};

export function encodePuzzle(puzzle: LatinSquarePuzzle): string {
  const shared: SharedPuzzle = {
    puzzle: puzzle.puzzle,
    solution: puzzle.solution,
    difficulty: puzzle.difficulty,
    target: puzzle.target,
    targetValue: puzzle.targetValue,
  };

  return encodeURIComponent(
    btoa(JSON.stringify(shared)),
  );
}

export function decodePuzzle(
  value: string,
): SharedPuzzle | null {
  try {
    const decoded = JSON.parse(
      atob(decodeURIComponent(value)),
    ) as SharedPuzzle;

    if (
      !decoded.puzzle ||
      !decoded.solution ||
      !decoded.difficulty ||
      !decoded.target ||
      !decoded.targetValue
    ) {
      return null;
    }

    if (
      decoded.difficulty !== "easy" &&
      decoded.difficulty !== "medium" &&
      decoded.difficulty !== "hard"
    ) {
      return null;
    }

    if (
      decoded.target.row < 0 ||
      decoded.target.row >= 5 ||
      decoded.target.column < 0 ||
      decoded.target.column >= 5
    ) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}