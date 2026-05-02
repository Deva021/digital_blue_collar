"use client";

import { useTransition, useState } from "react";
import { reviewApplicationAction, acceptApplicationAction } from "@/lib/services/applications";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { User, Check, X, Calendar, MapPin } from "lucide-react";

type ApplicantProps = {
  applicationId: string;
  workerName: string;
  message: string;
  price: number;
  status: string;
  createdAt: string;
  jobHasAccepted: boolean;
  verificationStatus?: string;
};

export function ApplicantCard({
  applicationId,
  workerName,
  message,
  price,
  status,
  createdAt,
  jobHasAccepted,
  verificationStatus,
}: ApplicantProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [locationText, setLocationText] = useState("");

  const handleReject = () => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        const res = await reviewApplicationAction(applicationId, "rejected");
        if (!res.success) {
          setErrorMsg(res.error || "Failed to reject application");
        }
      } catch {
        setErrorMsg("An unexpected server error occurred.");
      }
    });
  };

  const handleAccept = () => {
    setErrorMsg(null);
    if (!scheduledAt) {
      setErrorMsg("Please select a scheduled date and time.");
      return;
    }
    if (!locationText || locationText.trim().length < 3) {
      setErrorMsg("Please enter a location (at least 3 characters).");
      return;
    }
    startTransition(async () => {
      try {
        const res = await acceptApplicationAction(applicationId, scheduledAt, locationText);
        if (!res.success) {
          setErrorMsg(res.error || "Failed to accept application");
        } else {
          setShowAcceptForm(false);
        }
      } catch {
        setErrorMsg("An unexpected server error occurred.");
      }
    });
  };

  // Min datetime for the date-time picker: now + 5 minutes
  const minDateTime = new Date(Date.now() + 5 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  return (
    <Card className="w-full flex shrink-0 hover:shadow-sm border-slate-200 overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row gap-6 w-full justify-between items-start">

        <div className="space-y-4 flex-1">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200 mb-2">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <div className="bg-slate-100 p-2 rounded-full hidden sm:block">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex items-center gap-1.5">
                  {workerName}
                  {verificationStatus === 'verified' && <VerifiedBadge />}
                </div>
              </h3>
              <div className="md:hidden">
                <ApplicationStatusBadge status={status} />
              </div>
            </div>

            <div className="text-sm text-slate-500 sm:ml-10">
              Applied {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="sm:ml-10">
            <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-md border border-slate-100 whitespace-pre-wrap">
              &quot;{message}&quot;
            </p>
          </div>

          {/* Accept scheduling form - shown inline when user clicks Accept */}
          {showAcceptForm && status === "pending" && (
            <div className="sm:ml-10 mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3">
              <p className="text-sm font-semibold text-emerald-800">
                Schedule this booking
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5" /> Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    min={minDateTime}
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bole, Addis Ababa"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setShowAcceptForm(false); setErrorMsg(null); }}
                  disabled={isPending}
                  className="bg-white"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleAccept}
                  disabled={isPending}
                >
                  {isPending ? "Confirming..." : "Confirm & Create Booking"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-56 bg-slate-50/50 p-5 rounded-lg border border-slate-100 flex flex-col gap-4 self-stretch">
          <div className="hidden md:block text-right">
            <ApplicationStatusBadge status={status} />
          </div>

          <div className="flex-1 flex justify-center md:justify-end items-center">
            <div className="text-center md:text-right">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold block mb-1">
                Proposed Price
              </span>
              <span className="text-2xl font-bold text-slate-900 leading-none">
                {price} <span className="text-sm font-normal text-slate-500">ETB</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 mt-auto">
            {status === "pending" ? (
              !showAcceptForm ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    onClick={handleReject}
                    disabled={isPending}
                  >
                    {isPending ? "..." : <><X className="w-3.5 h-3.5 mr-1" /> Reject</>}
                  </Button>

                  <Button
                    size="sm"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setShowAcceptForm(true)}
                    disabled={isPending || jobHasAccepted}
                    title={jobHasAccepted ? "Job already has an accepted worker" : ""}
                  >
                    <><Check className="w-3.5 h-3.5 mr-1" /> Accept</>
                  </Button>
                </div>
              ) : null
            ) : (
              <div className="text-sm text-center text-slate-500 bg-slate-100 py-1.5 rounded-md w-full">
                {status === "accepted" ? "Worker Accepted" : "Worker Rejected"}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
