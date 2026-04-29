import { getPublicServiceById, getWorkerProfileById } from "@/lib/services/worker-profiles";
import { DirectBookingForm } from "@/components/bookings/DirectBookingForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User } from "lucide-react";

export const metadata = {
  title: "New Booking Request - Digital Blue Collar",
};

export default async function NewBookingPage(props: {
  searchParams: Promise<{ worker_id?: string; service_id?: string }>;
}) {
  const searchParams = await props.searchParams;
  const { worker_id, service_id } = searchParams;

  if (!worker_id) {
    notFound();
  }

  let worker: any = null;
  let service: any = null;

  if (service_id) {
    service = await getPublicServiceById(service_id);
    if (!service || service.worker_id !== worker_id) {
      notFound();
    }
    worker = service.worker_profiles;
  } else {
    worker = await getWorkerProfileById(worker_id);
    if (!worker) {
      notFound();
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard/discover"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-fit"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Discover
      </Link>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-2xl font-bold text-slate-900">Request a Booking</h1>
          <p className="text-slate-500 mt-1">Send a service request to this professional.</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Worker Summary */}
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="p-3 bg-white rounded-full border border-slate-200 shadow-sm">
              <User className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Professional Worker</h2>
              <p className="text-sm text-slate-600 line-clamp-2">{worker.bio || "No bio provided"}</p>
              {worker.location_text && (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {worker.location_text}
                </p>
              )}
            </div>
          </div>

          <DirectBookingForm
            workerId={worker_id}
            workerServiceId={service_id}
            serviceLabel={service?.service_categories?.name}
            basePrice={service?.base_price}
          />
        </div>
      </div>
    </div>
  );
}
