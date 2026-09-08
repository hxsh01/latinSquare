export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(
  eventName: string,
  params?: EventParams,
) {
  if (
    typeof window === "undefined" ||
    !GA_MEASUREMENT_ID ||
    typeof window.gtag !== "function"
  ) {
    return;
  }

  window.gtag("event", eventName, params);
}

export function trackGenerate(difficulty: string) {
  trackEvent("generate_problem", {
    difficulty,
  });
}

export function trackPuzzleResult(
  difficulty: string,
  result: "correct" | "incorrect",
  solveTimeSeconds: number,
) {
  trackEvent("puzzle_result", {
    difficulty,
    result,
    solve_time_seconds: solveTimeSeconds,
  });
}