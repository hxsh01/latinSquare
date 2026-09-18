"use client";

import { useState } from "react";
import { trackFeedbackSubmit } from "../lib/analytics";

export function FeedbackSection() {
  const [isOpen, setIsOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!message.trim() || rating === 0 || submitting) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: "feedback",
          rating,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      trackFeedbackSubmit("feedback", rating);

      setMessage("");
      setRating(0);

      alert("Thank you! Your feedback has been submitted.");
    } catch (error) {
      console.error(error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-5 rounded-3xl border border-slate-200 bg-white shadow-soft">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left sm:p-6"
        aria-expanded={isOpen}
      >
        <div>
          <h2 className="text-xl font-black">
            Feedback
          </h2>
          <p className="text-sm text-slate-500">
            Tell us what you think or suggest a feature you'd like to
            see.
          </p>

          {!isOpen && (
            <p className="mt-1 text-sm text-slate-500">
              Share feedback or suggest a feature you'd like to see.
            </p>
          )}
        </div>
        {/* accordian switch */}
        {/* <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span> */}
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 p-4 sm:p-6">
            <div className="flex flex-col gap-5">

              <div>
                <p className="mb-2 text-sm font-bold text-slate-700">
                  How would you rate the app?
                </p>

                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5`}
                      className="text-3xl leading-none transition-transform hover:scale-110"
                    >
                      <span
                        className={
                          star <= rating
                            ? "text-yellow-400"
                            : "text-slate-300"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="feedback-message"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  What do you think?
                </label>

                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell us what you think or suggest a feature..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!message.trim() || rating === 0 || submitting}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? "Submitting" : "Submit Feedback"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}