"use client";

import { useState, useTransition } from "react";
import { StarRating } from "./StarRating";
import { createReview } from "@/lib/services/reviews";
import { useRouter } from "next/navigation";

interface ReviewSubmissionFormProps {
  bookingId: string;
  workerId: string;
}

export function ReviewSubmissionForm({ bookingId, workerId }: ReviewSubmissionFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    startTransition(async () => {
      const result = await createReview({
        booking_id: bookingId,
        reviewee_id: workerId,
        rating,
        comment,
      });

      if (!result.success) {
        setError(result.error || "Failed to submit review.");
      } else {
        // Refresh the page so the new review is shown
        router.refresh();
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Leave a Review
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rate your experience
          </label>
          <StarRating rating={rating} onRatingChange={setRating} size={28} />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Share details of your experience (optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            placeholder="How did it go?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isPending}
            maxLength={1000}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || rating === 0}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
