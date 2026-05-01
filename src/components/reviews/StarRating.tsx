"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 20,
  readOnly = false,
  onRatingChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const currentRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxStars)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= currentRating;

        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            className={`transition-colors ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(null)}
            onClick={() => !readOnly && onRatingChange?.(starValue)}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
