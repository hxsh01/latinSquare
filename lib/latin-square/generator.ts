import type {
  Difficulty,
  Grid,
  LatinSquarePuzzle,
  SymbolValue,
} from "./types";

const SIZE = 5;
const SYMBOLS = ["A", "B", "C", "D", "E"];

/**
 * Each cell in a candidate grid contains the symbols that could
 * legally be placed in that cell based on the current clues.
 *
 * Example:
 *   candidates[2][3] = Set(["A", "C"])
 *
 * means that row 2, column 3 can currently contain either A or C.
 */
type CandidateGrid = Array<Array<Set<SymbolValue>>>;

/**
 * Difficulty is determined by two things:
 *
 * 1. minDepth / maxDepth
 *    How many rounds of deductions are required before the
 *    target cell can be determined using our human-style solver.
 *
 * 2. minChoices / maxChoices
 *    How many possible symbols the target cell has initially.
 *
 * The number of clues is intentionally kept roughly the same
 * for all difficulties. This means difficulty comes from the
 * reasoning required, rather than simply showing fewer clues.
 */
const TARGET_PROFILE: Record<
  Difficulty,
  {
    minDepth: number;
    maxDepth: number;
    minChoices: number;
    maxChoices: number;
  }
> = {
  easy: {
    minDepth: 1,
    maxDepth: 2,
    minChoices: 1,
    maxChoices: 2,
  },
  medium: {
    minDepth: 2,
    maxDepth: 3,
    minChoices: 2,
    maxChoices: 3,
  },
  hard: {
    minDepth: 4,
    maxDepth: 8,
    minChoices: 3,
    maxChoices: 4,
  },
};

/**
 * Returns a shuffled copy of an array using the Fisher-Yates algorithm.
 *
 * We use this when generating solutions and removing clues so that
 * every generated puzzle is randomized instead of always following
 * the same pattern.
 */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Creates the standard cyclic 5x5 Latin square:
 *
 * A B C D E
 * B C D E A
 * C D E A B
 * D E A B C
 * E A B C D
 *
 * At this stage the values are represented as numbers 0–4.
 *
 * We later randomize rows, columns and symbols so the final
 * solution does not always look like this.
 */
function baseSquare(): number[][] {
  return Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => (r + c) % SIZE),
  );
}

/**
 * Generates a randomized complete Latin square.
 *
 * We start from a known-valid Latin square and randomly:
 *
 * - reorder the rows
 * - reorder the columns
 * - reorder the symbols
 *
 * These operations preserve the Latin-square property.
 *
 * The result is therefore guaranteed to be a valid complete
 * Latin square before we remove any clues.
 */
function randomSolution(): SymbolValue[][] {
  const base = baseSquare();

  const rows = shuffle([0, 1, 2, 3, 4]);
  const cols = shuffle([0, 1, 2, 3, 4]);
  const symbols = shuffle(SYMBOLS);

  return rows.map((r) =>
    cols.map((c) => symbols[base[r][c]]),
  );
}

/**
 * Calculates the possible symbols for every empty cell.
 *
 * A symbol cannot be used if it already exists:
 *
 * - somewhere else in the same row, or
 * - somewhere else in the same column.
 *
 * Filled cells simply have themselves as their only candidate.
 *
 * This function is used both by the human-difficulty solver
 * and by the mathematical solution counter.
 */
function candidates(grid: Grid): CandidateGrid {
  const result: CandidateGrid = Array.from(
    { length: SIZE },
    () =>
      Array.from(
        { length: SIZE },
        () => new Set<SymbolValue>(SYMBOLS),
      ),
  );

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      // A filled cell has only one possible value.
      if (grid[r][c] !== null) {
        result[r][c] = new Set([
          grid[r][c] as SymbolValue,
        ]);
        continue;
      }

      // Remove symbols that already occur in this row
      // or this column.
      for (const s of SYMBOLS) {
        for (let x = 0; x < SIZE; x++) {
          if (
            grid[r][x] === s ||
            grid[x][c] === s
          ) {
            result[r][c].delete(s);
            break;
          }
        }
      }
    }
  }

  return result;
}

/**
 * Determines how difficult it is to solve the TARGET cell
 * using simple human-style deductions.
 *
 * The solver currently uses:
 *
 * 1. Naked singles
 *    A cell has only one possible value.
 *
 * 2. Hidden singles
 *    A particular symbol can only go in one position
 *    within a row or column.
 *
 * Each successful round of deductions increases `depth`.
 *
 * Returns:
 *
 *   0, 1, 2, ... -> number of deduction rounds required
 *   null         -> target cannot be solved using these rules
 *
 * IMPORTANT:
 * This function measures the intended puzzle difficulty.
 * It does NOT prove that the puzzle has a unique solution.
 * Uniqueness is checked separately by `countSolutions()`.
 */
function humanDeductionDepth(
  input: Grid,
  target: { row: number; column: number },
): number | null {
  // Work on a copy so that solving the puzzle does not
  // modify the original puzzle.
  const grid = input.map((r) => [...r]);

  // The target must be an empty cell.
  if (grid[target.row][target.column] !== null) {
    return null;
  }

  let depth = 0;

  // Prevent the deduction process from running indefinitely.
  const maxRounds = 12;

  while (depth <= maxRounds) {
    const cand = candidates(grid);

    // If the target has only one candidate, we know its value.
    if (
      cand[target.row][target.column].size === 1
    ) {
      return depth;
    }

    let progress = false;

    /**
     * ---------------------------------------------------------
     * Naked singles
     * ---------------------------------------------------------
     *
     * If an empty cell has exactly one possible symbol,
     * that symbol must be the answer.
     */
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (
          grid[r][c] === null &&
          cand[r][c].size === 1
        ) {
          grid[r][c] = [...cand[r][c]][0];
          progress = true;
        }
      }
    }

    // Recalculate candidates after making deductions.
    if (progress) {
      depth++;
      continue;
    }

    /**
     * ---------------------------------------------------------
     * Hidden singles in rows
     * ---------------------------------------------------------
     *
     * Even if a cell has multiple candidates, a symbol may
     * only have one possible position within the row.
     *
     * Example:
     *
     * Row: A B _ _ E
     *
     * If C can only go into column 3, then that cell must be C.
     */
    for (let r = 0; r < SIZE; r++) {
      for (const s of SYMBOLS) {
        const spots: number[] = [];

        for (let c = 0; c < SIZE; c++) {
          if (
            grid[r][c] === null &&
            cand[r][c].has(s)
          ) {
            spots.push(c);
          }
        }

        if (spots.length === 1) {
          grid[r][spots[0]] = s;
          progress = true;
          break;
        }
      }

      if (progress) {
        break;
      }
    }

    if (progress) {
      depth++;
      continue;
    }

    /**
     * ---------------------------------------------------------
     * Hidden singles in columns
     * ---------------------------------------------------------
     *
     * Same idea as hidden singles in rows, but we look
     * vertically through each column.
     */
    for (let c = 0; c < SIZE; c++) {
      for (const s of SYMBOLS) {
        const spots: number[] = [];

        for (let r = 0; r < SIZE; r++) {
          if (
            grid[r][c] === null &&
            cand[r][c].has(s)
          ) {
            spots.push(r);
          }
        }

        if (spots.length === 1) {
          grid[spots[0]][c] = s;
          progress = true;
          break;
        }
      }

      if (progress) {
        break;
      }
    }

    if (progress) {
      depth++;
      continue;
    }

    /**
     * No deduction could be made.
     *
     * This does not necessarily mean the puzzle has no solution.
     * It only means our current human-style deduction rules
     * cannot determine the target any further.
     */
    return null;
  }

  return null;
}

/**
 * Counts the number of mathematically valid complete Latin-square
 * solutions for a given puzzle.
 *
 * We stop searching after `limit` solutions are found.
 *
 * For puzzle generation we call:
 *
 *   countSolutions(puzzle, 2)
 *
 * because we only need to distinguish:
 *
 *   0 solutions -> invalid
 *   1 solution  -> uniquely solvable
 *   2+ solutions -> ambiguous
 *
 * We do NOT need to find every possible solution.
 *
 * The solver uses backtracking:
 *
 * 1. Find an empty cell.
 * 2. Try each legal candidate.
 * 3. Recursively solve the resulting puzzle.
 * 4. Count complete valid grids.
 *
 * The cell with the fewest candidates is selected first.
 * This is called the Minimum Remaining Values (MRV) heuristic
 * and greatly reduces unnecessary search.
 */
function countSolutions(
  grid: Grid,
  limit = 2,
): number {
  let solutionCount = 0;

  /**
   * Recursively searches for complete Latin-square solutions.
   */
  function solve(current: Grid) {
    // Stop immediately once we have enough solutions.
    if (solutionCount >= limit) {
      return;
    }

    const cand = candidates(current);

    let bestRow = -1;
    let bestColumn = -1;
    let bestCandidates: SymbolValue[] | null = null;

    /**
     * Find the empty cell with the fewest legal candidates.
     *
     * For example, if:
     *
     *   cell A -> [A, B, C]
     *   cell B -> [D]
     *   cell C -> [A, E]
     *
     * we choose cell B first because it has only one possibility.
     *
     * This reduces the branching factor of the backtracking search.
     */
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (current[r][c] !== null) {
          continue;
        }

        const cellCandidates = [...cand[r][c]];

        /**
         * An empty cell with zero candidates means this branch
         * is impossible.
         */
        if (cellCandidates.length === 0) {
          return;
        }

        if (
          bestCandidates === null ||
          cellCandidates.length <
            bestCandidates.length
        ) {
          bestRow = r;
          bestColumn = c;
          bestCandidates = cellCandidates;
        }
      }
    }

    /**
     * If there are no empty cells left, we have successfully
     * constructed one complete valid Latin square.
     */
    if (bestCandidates === null) {
      solutionCount++;
      return;
    }

    /**
     * Try each possible value for the selected cell.
     *
     * Each possibility creates a separate branch of the
     * backtracking search.
     */
    for (const value of bestCandidates) {
      if (solutionCount >= limit) {
        return;
      }

      // Never mutate the current branch.
      const next = current.map((row) => [...row]);

      next[bestRow][bestColumn] = value;

      solve(next);
    }
  }

  // Start the search using a copy of the original puzzle.
  solve(grid.map((row) => [...row]));

  return solutionCount;
}

/**
 * Creates a puzzle by removing values from a complete solution.
 *
 * The target cell is always kept empty because that is the cell
 * the player is expected to solve.
 *
 * `clues` determines how many filled cells should remain.
 *
 * We currently use 10–12 clues for every difficulty level so
 * that the number of clues itself does not determine difficulty.
 */
function makePuzzle(
  solution: SymbolValue[][],
  target: { row: number; column: number },
  clues: number,
): Grid {
  // Start with the complete valid Latin square.
  const grid: Grid = solution.map((r) => [...r]);

  // Randomize the order in which cells are considered for removal.
  const all = shuffle(
    Array.from(
      { length: SIZE * SIZE },
      (_, i) => i,
    ),
  );

  /**
   * Remove cells until only the requested number of clues remain.
   *
   * The target is skipped so it remains empty.
   */
  for (const index of all) {
    const r = Math.floor(index / SIZE);
    const c = index % SIZE;

    // The target must always be the cell the player solves.
    if (
      r === target.row &&
      c === target.column
    ) {
      continue;
    }

    // Skip cells that have already been removed.
    if (grid[r][c] === null) {
      continue;
    }

    // Count how many clues are currently left.
    const remaining = grid.reduce(
      (n, row) =>
        n + row.filter(Boolean).length,
      0,
    );

    // Stop once we have reached the requested clue count.
    if (remaining <= clues) {
      break;
    }

    grid[r][c] = null;
  }

  // Explicitly ensure the target is empty.
  grid[target.row][target.column] = null;

  return grid;
}

/**
 * Counts the number of filled cells in a puzzle.
 *
 * This is used to verify that the generated puzzle actually
 * contains between 10 and 12 clues.
 */
function countClues(grid: Grid) {
  return grid.flat().filter(Boolean).length;
}

/**
 * Main puzzle-generation function.
 *
 * The generator repeatedly creates candidate puzzles until
 * one satisfies ALL of our requirements.
 *
 * Requirements:
 *
 * 1. Valid complete Latin-square solution.
 * 2. 10–12 clues.
 * 3. Target has the required initial number of candidates.
 * 4. Target has the required human deduction depth.
 * 5. Puzzle has exactly ONE mathematical solution.
 *
 * The final uniqueness check is important because simply
 * removing cells from a valid Latin square does NOT guarantee
 * that the remaining clues uniquely identify the original square.
 */
export function generateLatinSquarePuzzle(
  difficulty: Difficulty,
): LatinSquarePuzzle {
  const profile = TARGET_PROFILE[difficulty];

  /**
   * We allow multiple attempts because the requirements are
   * restrictive, especially for Hard puzzles.
   *
   * A candidate puzzle that does not satisfy the requirements
   * is simply discarded and a new one is generated.
   */
  for (let attempt = 0; attempt < 3000; attempt++) {
    /**
     * Step 1:
     * Generate a random complete Latin square.
     */
    const solution = randomSolution();

    /**
     * Step 2:
     * Select a random cell that the player will have to solve.
     */
    const target = {
      row: Math.floor(Math.random() * SIZE),
      column: Math.floor(Math.random() * SIZE),
    };

    /**
     * Step 3:
     * Randomly choose whether the puzzle will contain
     * 10, 11, or 12 clues.
     */
    const clues =
      10 + Math.floor(Math.random() * 3);

    /**
     * Step 4:
     * Remove cells from the complete solution.
     */
    const puzzle = makePuzzle(
      solution,
      target,
      clues,
    );

    /**
     * Step 5:
     * Verify that the puzzle contains the expected
     * number of clues.
     */
    const actualClues = countClues(puzzle);

    if (
      actualClues < 10 ||
      actualClues > 12
    ) {
      continue;
    }

    /**
     * Step 6:
     * Determine how many possibilities the target cell
     * has before making any deductions.
     *
     * This is one of the factors used to determine difficulty.
     */
    const initialCandidateCount =
      candidates(puzzle)[target.row][
        target.column
      ].size;

    /**
     * Step 7:
     * Determine how many rounds of our human-style
     * deduction system are required to solve the target.
     */
    const depth = humanDeductionDepth(
      puzzle,
      target,
    );

    /**
     * Reject puzzles that:
     *
     * - cannot be solved using our current deduction rules, or
     * - fall outside the requested difficulty range.
     */
    if (
      depth === null ||
      depth < profile.minDepth ||
      depth > profile.maxDepth
    ) {
      continue;
    }

    /**
     * Step 8:
     * Verify the target's initial number of choices
     * also matches the requested difficulty.
     */
    if (
      initialCandidateCount <
        profile.minChoices ||
      initialCandidateCount >
        profile.maxChoices
    ) {
      continue;
    }

    /**
     * Step 9:
     * MOST IMPORTANT: verify uniqueness.
     *
     * Removing clues from a Latin square can result in:
     *
     * - no valid solution
     * - exactly one valid solution
     * - multiple valid solutions
     *
     * We only accept exactly one solution.
     *
     * Passing `2` means the search stops immediately after
     * discovering a second solution.
     */
    const solutionCount = countSolutions(
      puzzle,
      2,
    );

    if (solutionCount !== 1) {
      continue;
    }

    /**
     * All checks passed.
     *
     * The puzzle is:
     *
     * - a valid Latin square,
     * - within the requested difficulty,
     * - has 10–12 clues,
     * - has a solvable target,
     * - and has exactly one complete solution.
     */
    return {
      size: SIZE,
      symbols: [...SYMBOLS],
      puzzle,
      solution,
      difficulty,
      clueCount: actualClues,
      target,
      targetValue:
        solution[target.row][target.column],
      deductionDepth: depth,
      initialCandidateCount,
    };
  }

  /**
   * If we reach this point, none of the 3000 attempts
   * satisfied all requirements.
   *
   * Throwing an error allows the UI to handle the failure
   * rather than returning an invalid or ambiguous puzzle.
   */
  throw new Error(
    "Unable to generate a suitable Latin square problem. Please generate another problem.",
  );
}