import { useState } from "react";
import type { LatinSquarePuzzle } from "../lib/latin-square/types";
import { buildAiPrompt } from "../lib/latin-square/prompt";
export function AiPrompt({ puzzle }: { puzzle: LatinSquarePuzzle }) {
  const [copied, setCopied] = useState(false);
  const prompt = buildAiPrompt(puzzle);
  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">AI-ready question prompt</h3>
          <p className="mt-1 text-sm text-slate-500">
            Copy this text into an AI without uploading the puzzle image.
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-700">
        {prompt}
      </pre>
    </section>
  );
}
