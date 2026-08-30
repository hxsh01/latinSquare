import type { LatinSquarePuzzle } from "./types";

export function buildAiPrompt(puzzle: LatinSquarePuzzle): string {
  const rows = puzzle.puzzle.map(
    (row, r) => `R${r + 1}: ${row.map((v) => v ?? "?").join("  ")}`,
  );
  const target = `R${puzzle.target.row + 1}C${puzzle.target.column + 1}`;

  return [
    "Solve this Latin square question.",
    "",
    `It is a ${puzzle.size}×${puzzle.size} Latin square using the symbols ${puzzle.symbols.join(", ")}.`,
    "",
    "Rules:",
    `1. Each row contains ${puzzle.symbols.join(", ")} exactly once.`,
    `2. Each column contains ${puzzle.symbols.join(", ")} exactly once.`,
    "3. The question mark (?) marks the single cell whose value must be determined.",
    "4. Blank cells are intentionally unknown; you only need to determine the question-mark cell.",
    "",
    "Grid:",
    ...rows,
    "",
    `Question: What symbol belongs in ${target}?`,
    `Explain the deductions step by step and give the final answer for ${target}.`,
  ].join("\n");
}
