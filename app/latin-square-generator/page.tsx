import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Latin Square Generator - Free 5×5 Puzzle Generator",
  description:
    "Generate and practice 5×5 Latin square puzzles online. Learn how to solve Latin square problems and practice Easy, Medium, and Hard reasoning questions.",
  alternates: {
    canonical: "/latin-square-generator",
  },
};

export default function LatinSquareGeneratorPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Latin Square Generator
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Generate free 5×5 Latin square puzzles and practice solving them
            under timed conditions. Choose Easy, Medium, or Hard difficulty
            and find the symbol that belongs in the highlighted cell.
          </p>

          <a
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
          >
            Start Generating
          </a>
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-black text-slate-900">
            What is a Latin Square?
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            A Latin square is an n×n grid containing n different symbols where
            each symbol occurs exactly once in every row and exactly once in
            every column.
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            In a 5×5 Latin square, the five symbols are A, B, C, D, and E.
            Every row and every column must contain each of these symbols
            exactly once.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-black text-slate-900">
            How to Solve a Latin Square Puzzle
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            Latin square puzzles can be solved using logical deduction. Start
            with the highlighted cell and examine the symbols already present
            in its row and column.
          </p>

          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            <li>Look at the symbols already present in the target row.</li>
            <li>Identify the symbols missing from that row.</li>
            <li>
              Check the target column and eliminate symbols already present.
            </li>
            <li>
              Use information from other rows and columns if multiple
              candidates remain.
            </li>
            <li>Enter the remaining symbol as your answer.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-black text-slate-900">
            5×5 Latin Square Practice
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            This generator creates 5×5 Latin square problems with a similar
            number of prefilled cells across all difficulty levels. The
            difficulty is based on the reasoning and number of deductions
            required to determine the highlighted cell.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900">Easy</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Problems that can be solved using short and direct deductions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900">Medium</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Problems requiring several connected deductions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900">Hard</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Problems requiring longer chains of logical reasoning.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-black text-slate-900">
            Practice Latin Square Reasoning Questions
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            Use the Latin square generator to practice reasoning questions
            under timed conditions. The timer starts when a new problem is
            generated and stops when you submit your answer. After submission,
            you can see the correct answer and the complete Latin square.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center sm:p-8">
          <h2 className="text-xl font-black text-slate-900">
            Ready to practice?
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Generate a 5×5 Latin square problem and test your solving speed.
          </p>

          <a
            href="/"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-bold text-white hover:bg-slate-700"
          >
            Open Latin Square Generator
          </a>
        </section>
      </div>
    </main>
  );
}