import type { Difficulty, Grid, LatinSquarePuzzle, SymbolValue } from "./types";

const SIZE = 5;
const SYMBOLS = ["A", "B", "C", "D", "E"];

type CandidateGrid = Array<Array<Set<SymbolValue>>>;

const TARGET_PROFILE: Record<
  Difficulty,
  { minDepth: number; maxDepth: number; minChoices: number; maxChoices: number }
> = {
  easy: { minDepth: 0, maxDepth: 1, minChoices: 1, maxChoices: 2 },
  medium: { minDepth: 2, maxDepth: 3, minChoices: 2, maxChoices: 3 },
  hard: { minDepth: 4, maxDepth: 8, minChoices: 3, maxChoices: 4 },
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function baseSquare(): number[][] {
  return Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => (r + c) % SIZE),
  );
}
function randomSolution(): SymbolValue[][] {
  const base = baseSquare();
  const rows = shuffle([0, 1, 2, 3, 4]);
  const cols = shuffle([0, 1, 2, 3, 4]);
  const symbols = shuffle(SYMBOLS);
  return rows.map((r) => cols.map((c) => symbols[base[r][c]]));
}
function candidates(grid: Grid): CandidateGrid {
  const result: Array<Array<Set<SymbolValue>>> = Array.from(
    { length: SIZE },
    () => Array.from({ length: SIZE }, () => new Set(SYMBOLS)),
  );
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] !== null) {
        result[r][c] = new Set([grid[r][c] as string]);
        continue;
      }
      for (const s of SYMBOLS) {
        for (let x = 0; x < SIZE; x++) {
          if (grid[r][x] === s || grid[x][c] === s) {
            result[r][c].delete(s);
            break;
          }
        }
      }
    }
  return result;
}

function humanDeductionDepth(
  input: Grid,
  target: { row: number; column: number },
): number | null {
  const grid = input.map((r) => [...r]);
  if (grid[target.row][target.column] !== null) return null;
  let depth = 0;
  const maxRounds = 12;
  while (depth <= maxRounds) {
    const cand = candidates(grid);
    if (cand[target.row][target.column].size === 1) return depth;
    let progress = false;
    // Naked singles: a blank cell has one possible symbol.
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++)
        if (grid[r][c] === null && cand[r][c].size === 1) {
          grid[r][c] = [...cand[r][c]][0];
          progress = true;
        }
    if (progress) {
      depth++;
      continue;
    }
    // Hidden singles: within a row/column, a symbol has only one possible position.
    for (let r = 0; r < SIZE; r++) {
      for (const s of SYMBOLS) {
        const spots = [];
        for (let c = 0; c < SIZE; c++)
          if (grid[r][c] === null && cand[r][c].has(s)) spots.push(c);
        if (spots.length === 1) {
          grid[r][spots[0]] = s;
          progress = true;
        }
      }
    }
    for (let c = 0; c < SIZE; c++) {
      for (const s of SYMBOLS) {
        const spots = [];
        for (let r = 0; r < SIZE; r++)
          if (grid[r][c] === null && cand[r][c].has(s)) spots.push(r);
        if (spots.length === 1) {
          grid[spots[0]][c] = s;
          progress = true;
        }
      }
    }
    if (progress) {
      depth++;
      continue;
    }
    return null;
  }
  return null;
}

function makePuzzle(
  solution: SymbolValue[][],
  target: { row: number; column: number },
  clues: number,
): Grid {
  const grid: Grid = solution.map((r) => [...r]);
  const all = shuffle(Array.from({ length: SIZE * SIZE }, (_, i) => i));
  // Keep the target empty and remove exactly enough other cells to leave 10–12 clues.
  for (const index of all) {
    const r = Math.floor(index / SIZE),
      c = index % SIZE;
    if (r === target.row && c === target.column) continue;
    if (grid[r][c] === null) continue;
    const remaining = grid.reduce(
      (n, row) => n + row.filter(Boolean).length,
      0,
    );
    if (remaining <= clues) break;
    grid[r][c] = null;
  }
  grid[target.row][target.column] = null;
  return grid;
}

function countClues(grid: Grid) {
  return grid.flat().filter(Boolean).length;
}

export function generateLatinSquarePuzzle(
  difficulty: Difficulty,
): LatinSquarePuzzle {
  const profile = TARGET_PROFILE[difficulty];
  for (let attempt = 0; attempt < 3000; attempt++) {
    const solution = randomSolution();
    const target = {
      row: Math.floor(Math.random() * SIZE),
      column: Math.floor(Math.random() * SIZE),
    };
    const clues = 10 + Math.floor(Math.random() * 3);
    const puzzle = makePuzzle(solution, target, clues);
    const actualClues = countClues(puzzle);
    if (actualClues < 10 || actualClues > 12) continue;
    const initialCandidateCount =
      candidates(puzzle)[target.row][target.column].size;
    const depth = humanDeductionDepth(puzzle, target);
    if (depth === null || depth < profile.minDepth || depth > profile.maxDepth)
      continue;
    if (
      initialCandidateCount < profile.minChoices ||
      initialCandidateCount > profile.maxChoices
    )
      continue;
    return {
      size: SIZE,
      symbols: [...SYMBOLS],
      puzzle,
      solution,
      difficulty,
      clueCount: actualClues,
      target,
      targetValue: solution[target.row][target.column],
      deductionDepth: depth,
      initialCandidateCount,
    };
  }
  throw new Error(
    "Unable to generate a suitable Latin square problem. Please generate another problem.",
  );
}
