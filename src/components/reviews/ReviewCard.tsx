import { Review } from "@/lib/validations/reviews";
import { StarRating } from "./StarRating";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const customerLocation = review.customer_profiles?.location_text || "Unknown location";
  const date = new Date(review.created_at);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={review.rating} readOnly size={16} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Customer from {customerLocation}
          </p>
        </div>
      </div>
      
      {review.comment ? (
        <p className="text-gray-800 dark:text-gray-200 text-sm mt-3 leading-relaxed whitespace-pre-wrap">
          "{review.comment}"
        </p>
      ) : (
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-3 italic">
          No comment provided.
        </p>
      )}
    </div>
  );
}
