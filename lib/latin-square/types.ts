export type Difficulty = "easy" | "medium" | "hard";
export type SymbolValue = string;
export type Grid = Array<Array<SymbolValue | null>>;
export interface LatinSquarePuzzle { size:number; symbols:SymbolValue[]; puzzle:Grid; solution:SymbolValue[][]; difficulty:Difficulty; clueCount:number; target:{row:number;column:number}; targetValue:SymbolValue; deductionDepth:number; initialCandidateCount:number; }
