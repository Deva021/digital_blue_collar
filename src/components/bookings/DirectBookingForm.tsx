"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createDirectBooking } from "@/lib/services/bookings";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign } from "lucide-react";

type Props = {
  workerId: string;
  workerName?: string;
  workerServiceId?: string;
  serviceLabel?: string;
  basePrice?: number | null;
  customerOpenJobs?: any[];
};

export function DirectBookingForm({
  workerId,
  workerName,
  workerServiceId,
  serviceLabel,
  basePrice: initialBasePrice,
  customerOpenJobs = [],
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [jobPostId, setJobPostId] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const minDateTime = new Date(Date.now() + 5 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    const fd = new FormData(e.currentTarget);

    const scheduled_at = fd.get("scheduled_at") as string;
    const location_text = fd.get("location_text") as string;
    const final_price = Number(fd.get("final_price"));

    startTransition(async () => {
      const res = await createDirectBooking({
        worker_id: workerId,
        worker_service_id: workerServiceId,
        job_post_id: jobPostId || undefined,
        scheduled_at,
        location_text,
        final_price,
      });

      if (!res.success) {
        setErrorMsg(res.error ?? "Failed to create booking.");
      } else {
        router.push(`/dashboard/bookings/${res.bookingId}`);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {workerServiceId && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
          <span className="font-semibold">Booking for service: </span>
          {serviceLabel || "Selected Service"}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Select Your Job Post <span className="text-red-500">*</span>
        </label>
        {customerOpenJobs.length > 0 ? (
          <select 
            name="job_post_id" 
            required 
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            value={jobPostId}
            onChange={(e) => {
              const jId = e.target.value;
              setJobPostId(jId);
              setSelectedJob(customerOpenJobs.find(j => j.id === jId));
            }}
          >
            <option value="">-- Choose an open job --</option>
            {customerOpenJobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} {j.budget_range ? `(${j.budget_range})` : ''}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
            You don't have any open job posts. Please create a job post first to hire a worker directly.
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Date & Time */}
      <div className="space-y-1.5">
        <label
          htmlFor="scheduled_at"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
        >
          <Calendar className="w-4 h-4 text-slate-400" />
          Date &amp; Time <span className="text-red-500">*</span>
        </label>
        <input
          id="scheduled_at"
          name="scheduled_at"
          type="datetime-local"
          min={minDateTime}
          required
          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        />
        <p className="text-xs text-slate-400">Must be a future date and time.</p>
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <label
          htmlFor="location_text"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
        >
          <MapPin className="w-4 h-4 text-slate-400" />
          Location <span className="text-red-500">*</span>
        </label>
        <input
          id="location_text"
          name="location_text"
          type="text"
          placeholder="e.g. Bole, Addis Ababa"
          required
          minLength={3}
          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        />
        <p className="text-xs text-slate-400">Where the service will be performed.</p>
      </div>

      {/* Price offer */}
      <div className="space-y-1.5">
        <label
          htmlFor="final_price"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
        >
          <DollarSign className="w-4 h-4 text-slate-400" />
          Your Price Offer (ETB) <span className="text-red-500">*</span>
        </label>
        <input
          id="final_price"
          name="final_price"
          type="number"
          min="1"
          step="0.01"
          key={selectedJob?.id || 'no-job'}
          defaultValue={initialBasePrice || ""}
          placeholder={initialBasePrice ? String(initialBasePrice) : "e.g. 500"}
          required
          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        />
        {initialBasePrice && (
          <p className="text-xs text-slate-400">
            Worker's base price: {Number(initialBasePrice).toLocaleString()} ETB
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Submitting…" : "Send Booking Request"}
        </Button>
      </div>
    </form>
  );
}
