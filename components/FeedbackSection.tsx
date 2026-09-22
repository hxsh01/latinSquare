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
      <div
        className="flex w-full flex-col gap-4 p-4 text-left sm:flex-row sm:items-center sm:justify-between sm:p-6"
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

        <div
          className="flex items-center gap-2 sm:shrink-0"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-sm font-bold text-slate-700">
            Want to get in touch?
          </p>

          <a
            href="https://github.com/hxsh01"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-0.5 text-sm font-bold text-blue-600 hover:text-blue-700"
            aria-label="Contact me on GitHub"
          >

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z"
              />
            </svg>
            
            GitHub
            
          </a>
        </div>
      </div>

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