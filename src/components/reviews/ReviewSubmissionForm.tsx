"use client";

import { useState, useTransition } from "react";
import { StarRating } from "./StarRating";
import { createReview } from "@/lib/services/reviews";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

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
    <Card className="mt-6 shadow-xl shadow-slate-200/50 rounded-2xl border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 rounded-t-2xl">
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900">
              Rate your experience
            </label>
            <StarRating rating={rating} onRatingChange={setRating} size={28} />
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="block text-sm font-semibold text-slate-900">
              Share details of your experience (optional)
            </label>
            <Textarea
              id="comment"
              rows={4}
              placeholder="How did it go?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isPending}
              maxLength={1000}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <Button
            type="submit"
            disabled={isPending || rating === 0}
            className="w-full sm:w-auto px-8"
          >
            {isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
