import type { Difficulty } from "../lib/latin-square/types";
export function DifficultySelector({
  value,
  onChange,
  disabled,
}: {
  value: Difficulty;
  onChange: (v: Difficulty) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Difficulty)}
        disabled={disabled}
        className="h-11 rounded-xl border border-slate-300 bg-white px-2 text-sm font-semibold text-slate-900 shadow-sm disabled:opacity-60"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </label>
  );
}
