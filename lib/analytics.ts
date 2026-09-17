export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(
  eventName: string,
  params?: EventParams,
) {
  if (
    typeof window === "undefined" ||
    !GA_MEASUREMENT_ID
  ) {
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }

  window.setTimeout(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  }, 1000);
}

export function trackGenerate(
  difficulty: string,
  source: "generated" | "shared",
) {
  trackEvent("generate_problem", {
    difficulty,
    source,
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

export function trackFeedbackSubmit(
  category: "feedback" | "feature",
  rating: number,
) {
  trackEvent("feedback_submit", {
    category,
    rating,
  });
}