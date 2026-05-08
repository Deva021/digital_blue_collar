"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createDirectBooking } from "@/lib/services/bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin, DollarSign, Info } from "lucide-react";

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
    <Card className="w-full max-w-2xl mx-auto shadow-xl shadow-slate-200/50 rounded-2xl border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 rounded-t-2xl">
        <CardTitle>Direct Hire Request</CardTitle>
        <CardDescription>
          Send a direct booking request to {workerName || "this worker"}.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
      {workerServiceId && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
          <p>
            <span className="font-semibold block mb-0.5">Booking for service:</span>
            {serviceLabel || "Selected Service"}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900">
          Select Your Job Post <span className="text-red-500">*</span>
        </label>
        {customerOpenJobs.length > 0 ? (
          <Select 
            name="job_post_id" 
            required 
            value={jobPostId}
            onChange={(e) => {
              const jId = e.target.value;
              setJobPostId(jId);
              setSelectedJob(customerOpenJobs.find(j => j.id === jId));
            }}
          >
            <option value="" disabled>-- Choose an open job --</option>
            {customerOpenJobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} {j.budget_range ? `(${j.budget_range})` : ''}
              </option>
            ))}
          </Select>
        ) : (
          <div className="flex items-start gap-3 p-4 text-sm text-amber-800 bg-amber-50 rounded-xl border border-amber-200">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <p>You don't have any open job posts. Please create a job post first to hire a worker directly.</p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Date & Time */}
      <div className="space-y-2">
        <label
          htmlFor="scheduled_at"
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-900"
        >
          <Calendar className="w-4 h-4 text-slate-500" />
          Date &amp; Time <span className="text-red-500">*</span>
        </label>
        <Input
          id="scheduled_at"
          name="scheduled_at"
          type="datetime-local"
          min={minDateTime}
          required
        />
        <p className="text-xs text-slate-500">Must be a future date and time.</p>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label
          htmlFor="location_text"
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-900"
        >
          <MapPin className="w-4 h-4 text-slate-500" />
          Location <span className="text-red-500">*</span>
        </label>
        <Input
          id="location_text"
          name="location_text"
          type="text"
          placeholder="e.g. Bole, Addis Ababa"
          required
          minLength={3}
        />
        <p className="text-xs text-slate-500">Where the service will be performed.</p>
      </div>

      {/* Price offer */}
      <div className="space-y-2">
        <label
          htmlFor="final_price"
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-900"
        >
          <DollarSign className="w-4 h-4 text-slate-500" />
          Your Price Offer (ETB) <span className="text-red-500">*</span>
        </label>
        <Input
          id="final_price"
          name="final_price"
          type="number"
          min="1"
          step="0.01"
          key={selectedJob?.id || 'no-job'}
          defaultValue={initialBasePrice || ""}
          placeholder={initialBasePrice ? String(initialBasePrice) : "e.g. 500"}
          required
        />
        {initialBasePrice && (
          <p className="text-xs text-slate-500">
            Worker's base price: {Number(initialBasePrice).toLocaleString()} ETB
          </p>
        )}
      </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
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
      </CardFooter>
      </form>
    </Card>
  );
}
