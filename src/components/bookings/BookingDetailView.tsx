"use client";

import { useTransition, useState } from "react";
import { updateBookingStatus } from "@/lib/services/bookings";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  User,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import type { BookingStatus } from "@/lib/validations/bookings";

// Allowed transitions per role — mirrors the server-side guard
const WORKER_ACTIONS: Partial<Record<BookingStatus, { label: string; next: BookingStatus; variant: "primary" | "destructive" | "outline" }[]>> = {
  pending: [
    { label: "Accept Booking", next: "accepted", variant: "primary" },
    { label: "Cancel", next: "cancelled", variant: "destructive" },
  ],
  accepted: [
    { label: "Mark In Progress", next: "in_progress", variant: "primary" },
    { label: "Cancel", next: "cancelled", variant: "destructive" },
  ],
  in_progress: [
    { label: "Mark Completed", next: "completed", variant: "primary" },
    { label: "Cancel", next: "cancelled", variant: "destructive" },
  ],
};

const CUSTOMER_ACTIONS: Partial<Record<BookingStatus, { label: string; next: BookingStatus; variant: "primary" | "destructive" | "outline" }[]>> = {
  pending: [{ label: "Cancel Request", next: "cancelled", variant: "destructive" }],
  accepted: [{ label: "Cancel Booking", next: "cancelled", variant: "destructive" }],
  in_progress: [{ label: "Cancel Booking", next: "cancelled", variant: "destructive" }],
};

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 p-1.5 bg-slate-100 rounded-md text-slate-500 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-0.5">
          {label}
        </p>
        <p className="text-sm text-slate-800 font-medium">{value}</p>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BookingDetailView({ booking }: { booking: any }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isWorker = booking.currentUserId === booking.worker_id;
  const isCustomer = booking.currentUserId === booking.customer_id;
  const currentStatus = booking.status as BookingStatus;

  const actions = isWorker
    ? WORKER_ACTIONS[currentStatus] ?? []
    : isCustomer
    ? CUSTOMER_ACTIONS[currentStatus] ?? []
    : [];

  const handleTransition = (nextStatus: BookingStatus) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      const res = await updateBookingStatus(booking.id, nextStatus);
      if (!res.success) {
        setErrorMsg(res.error ?? "Failed to update status.");
      } else {
        setSuccessMsg(`Status updated to "${nextStatus.replace("_", " ")}".`);
      }
    });
  };

  const formattedDate = booking.scheduled_at
    ? new Date(booking.scheduled_at).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const formattedTime = booking.scheduled_at
    ? new Date(booking.scheduled_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const sourceLabel = booking.job_post_id
    ? `Job: ${booking.job_posts?.title ?? "—"}`
    : booking.worker_services?.service_categories?.name
    ? `Service: ${booking.worker_services.service_categories.name}`
    : "Direct Service Booking";

  const otherParty = isWorker ? booking.customer_profiles : booking.worker_profiles;
  const showContactInfo = ["accepted", "in_progress", "completed"].includes(currentStatus);

  const workerDescription = booking.worker_profiles?.full_name || "Unnamed Worker";

  const statusIcon: Record<BookingStatus, React.ReactNode> = {
    pending: <AlertCircle className="w-4 h-4 text-amber-600" />,
    accepted: <CheckCircle className="w-4 h-4 text-blue-600" />,
    in_progress: <PlayCircle className="w-4 h-4 text-indigo-600" />,
    completed: <CheckCircle className="w-4 h-4 text-emerald-600" />,
    cancelled: <XCircle className="w-4 h-4 text-slate-500" />,
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              {booking.job_post_id ? (
                <Briefcase className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>{sourceLabel}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Booking Details
            </h2>
            <p className="text-slate-500 text-sm">
              You are the{" "}
              <span className="font-semibold text-slate-700">
                {isWorker ? "Worker" : "Customer"}
              </span>{" "}
              on this booking.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {statusIcon[currentStatus]}
            <BookingStatusBadge status={currentStatus} />
          </div>
        </div>

        {/* Detail rows */}
        <div className="divide-y divide-slate-100">
          <DetailRow
            icon={<Calendar className="w-4 h-4" />}
            label="Scheduled Date"
            value={`${formattedDate} at ${formattedTime}`}
          />
          <DetailRow
            icon={<MapPin className="w-4 h-4" />}
            label="Location"
            value={booking.location_text ?? "—"}
          />
          <DetailRow
            icon={<DollarSign className="w-4 h-4" />}
            label="Agreed Price"
            value={
              booking.final_price != null
                ? `${Number(booking.final_price).toLocaleString()} ETB`
                : "To be agreed"
            }
          />
          <DetailRow
            icon={<Clock className="w-4 h-4" />}
            label="Booked On"
            value={new Date(booking.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
          {isWorker && booking.customer_profiles && (
            <DetailRow
              icon={<User className="w-4 h-4" />}
              label="Customer"
              value={booking.customer_profiles.full_name || "Unnamed Customer"}
            />
          )}
          {!isWorker && booking.worker_profiles && (
            <DetailRow
              icon={<User className="w-4 h-4" />}
              label="Worker"
              value={booking.worker_profiles.full_name || "Unnamed Worker"}
            />
          )}
          {booking.job_posts?.description && (
            <DetailRow
              icon={<Briefcase className="w-4 h-4" />}
              label="Job Description"
              value={booking.job_posts.description}
            />
          )}
        </div>
      </Card>

      {/* Contact Information Gated Section */}
      <Card className="p-6 overflow-hidden">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Contact Information
        </h3>
        
        {showContactInfo ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Full Name</p>
                <p className="text-sm font-semibold text-slate-900">{otherParty?.full_name || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Phone Number</p>
                <p className="text-sm font-semibold text-blue-600">{otherParty?.contact_phone || "No phone listed"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Service Address</p>
                <p className="text-sm font-semibold text-slate-900">{otherParty?.contact_address || "No address listed"}</p>
              </div>
              {otherParty?.contact_notes && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Contact Notes</p>
                  <p className="text-sm text-slate-600 italic">{otherParty.contact_notes}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-500">
              Contact information will be shared once the booking is <span className="font-semibold text-blue-600">Accepted</span>.
            </p>
          </div>
        )}
      </Card>

      {/* Messaging Placeholder */}
      <Card className="p-6 border-dashed border-2 bg-slate-50/30">
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
          <div className="p-3 bg-white rounded-full shadow-sm text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div className="max-w-xs space-y-1">
            <h4 className="font-bold text-slate-900">In-App Messaging</h4>
            <p className="text-xs text-slate-500">
              Direct messaging is coming soon. Please use the contact details shared above to coordinate after booking confirmation.
            </p>
          </div>
        </div>
      </Card>

      {/* Action card */}
      {actions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Available Actions
          </h3>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-md text-sm border border-emerald-200">
              {successMsg}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <Button
                key={action.next}
                variant={action.variant}
                disabled={isPending}
                onClick={() => handleTransition(action.next)}
                className="min-w-32"
              >
                {isPending ? "Updating…" : action.label}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Terminal state notice */}
      {(currentStatus === "completed" || currentStatus === "cancelled") && (
        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
          {statusIcon[currentStatus]}
          <span>
            This booking is{" "}
            <span className="font-semibold">
              {currentStatus === "completed" ? "completed" : "cancelled"}
            </span>{" "}
            and no further actions are available.
          </span>
        </div>
      )}
    </div>
  );
}
