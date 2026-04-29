import { getUserBookings } from "@/lib/services/bookings";
import { BookingCard } from "@/components/bookings/BookingCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase, Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "My Bookings - Digital Blue Collar",
};

export default async function BookingsListPage() {
  const bookings = await getUserBookings();

  return (
    <div className="flex flex-col space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Bookings</h1>
          <p className="text-slate-500 mt-1">Manage your service engagements and job schedules.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-6 h-6" />}
          title="No bookings yet"
          description="You don't have any active bookings or service requests. Browse the marketplace to find workers or jobs."
          action={
            <div className="flex gap-4">
              <Link href="/dashboard/discover" className={buttonVariants({ variant: "primary" })}>
                Discover Workers
              </Link>
              <Link href="/jobs" className={buttonVariants({ variant: "outline" })}>
                Browse Jobs
              </Link>
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
