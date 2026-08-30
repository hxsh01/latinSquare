# Latin Square Trainer

A responsive Next.js + TypeScript + Tailwind application for practicing 5×5 Latin-square questions in the style of the supplied dMAT reference.

## Behaviour

- Easy, Medium and Hard difficulty levels.
- Every puzzle has exactly 10–12 prefilled cells plus one highlighted question-mark cell.
- The player answers only the highlighted cell, matching the reference format.
- The timer starts when a puzzle is generated and stops when Submit Answer is pressed.
- Difficulty is generated from reasoning complexity rather than blank count: the generator controls the number of initial candidates for the target and the number of deduction rounds required by a human-style row/column elimination solver.
- After submission, the complete correct Latin square is shown.
- An AI-ready text prompt can be copied without sending an image.
- Mobile users can select A–E using buttons; desktop users can also use the keyboard.

## Run locally

Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For a production build:

```bash
npm run build
npm start
```

## Project structure

- `app/page.tsx` — application state, timer and main UI
- `components/` — reusable UI components
- `lib/latin-square/generator.ts` — solution/puzzle generation and difficulty engine
- `lib/latin-square/validator.ts` — target-answer validation
- `lib/latin-square/prompt.ts` — AI prompt generation
- `app/globals.css` — responsive grid and styling

## Difficulty model

The generator keeps the number of visible clues in the same 10–12 range for all levels. It then classifies puzzles using two signals:

- Initial candidate count for the highlighted cell.
- Deduction depth: how many rounds of naked-single and hidden-single row/column deductions are required before the highlighted cell becomes forced.

This makes Hard harder because the solver has to make more linked deductions, not because the grid simply contains more empty cells.
