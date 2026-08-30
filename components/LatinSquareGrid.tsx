import type { LatinSquarePuzzle, SymbolValue } from "../lib/latin-square/types";

interface Props {
  puzzle: LatinSquarePuzzle;
  answer: SymbolValue | null;
  result?: "correct" | "incorrect" | null;
}

export function LatinSquareGrid({ puzzle, answer, result }: Props) {
  return (
    <div className="latin-grid" role="grid" aria-label="5 by 5 Latin square">
      {puzzle.puzzle.map((row, r) =>
        row.map((value, c) => {
          const target = r === puzzle.target.row && c === puzzle.target.column;

          if (target) {
            return (
              <div
                key={`${r}-${c}`}
                className={`latin-cell target ${result ?? ""}`}
                role="gridcell"
                aria-label={`Question mark at row ${r + 1}, column ${c + 1}`}
              >
                {result ? answer : "?"}
              </div>
            );
          }

          return (
            <div
              key={`${r}-${c}`}
              className={`latin-cell ${value ? "given" : "blank"}`}
              role="gridcell"
            >
              {value}
            </div>
          );
        }),
      )}
    </div>
  );
}
