import type { LatinSquarePuzzle, SymbolValue } from "./types";
export function validateTarget(puzzle:LatinSquarePuzzle,value:SymbolValue|null):boolean{return value===puzzle.targetValue;}
