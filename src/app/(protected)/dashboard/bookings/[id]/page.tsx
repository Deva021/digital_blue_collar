import { getBookingById } from "@/lib/services/bookings";
import { BookingDetailView } from "@/components/bookings/BookingDetailView";
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard/bookings"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to My Bookings
      </Link>

      <BookingDetailView booking={booking} />
    </div>
  );
}
