import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { Calendar, MapPin, Briefcase, User } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BookingCard({ booking }: { booking: any }) {
  const isCustomer = booking.currentUserId === booking.customer_id;

  // Determine context label
  const contextLabel = isCustomer ? "Worker" : "Customer";
  // Worker bio as identifier (no name columns in schema)
  const workerBio = booking.worker_profiles?.bio
    ? booking.worker_profiles.bio.slice(0, 40) + (booking.worker_profiles.bio.length > 40 ? "…" : "")
    : null;

  // Source: direct service or job-based
  const sourceLabel = booking.job_post_id
    ? booking.job_posts?.title ?? "Job Booking"
    : booking.worker_services?.service_categories?.name ?? "Direct Service";

  const formattedDate = booking.scheduled_at
    ? new Date(booking.scheduled_at).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const formattedTime = booking.scheduled_at
    ? new Date(booking.scheduled_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Link href={`/dashboard/bookings/${booking.id}`} className="block group">
      <Card className="w-full hover:shadow-md border-slate-200 transition-all group-hover:border-slate-300">
        <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 space-y-2.5">
            {/* Source + role */}
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-100 rounded-md">
                {booking.job_post_id ? (
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <User className="w-3.5 h-3.5 text-slate-500" />
                )}
              </div>
              <span className="text-sm font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">
                {sourceLabel}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">
                You are the{" "}
                <span className="font-medium text-slate-700">
                  {isCustomer ? "Customer" : "Worker"}
                </span>
              </span>
            </div>

            {/* Other party */}
            {!isCustomer && workerBio && (
              <p className="text-xs text-slate-500 ml-8 line-clamp-1">
                <span className="font-medium text-slate-600">{contextLabel}:</span>{" "}
                {workerBio}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 ml-8 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate} {formattedTime}
              </span>
              {booking.location_text && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {booking.location_text}
                </span>
              )}
            </div>
          </div>

          {/* Right side: price + status */}
          <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
            <BookingStatusBadge status={booking.status} />
            {booking.final_price != null && (
              <span className="text-sm font-semibold text-slate-900">
                {Number(booking.final_price).toLocaleString()} ETB
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
