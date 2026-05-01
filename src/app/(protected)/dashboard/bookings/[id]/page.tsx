import { getBookingById } from "@/lib/services/bookings";
import { getReviewByBookingId } from "@/lib/services/reviews";
import { BookingDetailView } from "@/components/bookings/BookingDetailView";
import { ReviewSubmissionForm } from "@/components/reviews/ReviewSubmissionForm";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Booking Details - Digital Blue Collar`,
  };
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBookingById(id);

  if (!booking) {
    notFound();
  }

  const isCustomer = booking.currentUserId === booking.customer_id;
  const review = await getReviewByBookingId(id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard/bookings"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to My Bookings
      </Link>

      <BookingDetailView booking={booking} />

      {review && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Review for this booking
          </h3>
          <ReviewCard review={review} />
        </div>
      )}

      {!review && isCustomer && booking.status === "completed" && (
        <ReviewSubmissionForm bookingId={booking.id} workerId={booking.worker_id} />
      )}
    </div>
  );
}
