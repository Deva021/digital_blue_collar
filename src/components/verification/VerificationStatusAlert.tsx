import { AlertCircle, CheckCircle2, Clock, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationStatusAlertProps {
  status: "unverified" | "pending" | "verified" | "rejected";
  adminNotes?: string | null;
  onResubmit?: () => void;
}

export function VerificationStatusAlert({ status, adminNotes, onResubmit }: VerificationStatusAlertProps) {
  if (status === "unverified") {
    return null; 
  }

  if (status === "verified") {
    return (
      <div className="border border-green-200 bg-green-50 text-green-900 rounded-lg p-4 flex gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-semibold text-green-800">Account Verified</h5>
          <p className="text-green-700 mt-1 text-sm">
            Your identity has been verified. The verified badge is now visible on your profile to customers.
          </p>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="border border-blue-200 bg-blue-50 text-blue-900 rounded-lg p-4 flex gap-3">
        <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-semibold text-blue-800">Verification Pending</h5>
          <p className="text-blue-700 mt-1 text-sm">
            Your documents have been submitted and are currently under review by our team. This usually takes 1-2 business days.
          </p>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="border border-red-200 bg-red-50 text-red-900 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h5 className="font-semibold text-red-800">Verification Rejected</h5>
          <div className="text-red-700 mt-1 text-sm flex flex-col gap-3">
            <p>Unfortunately, we could not verify your identity with the provided documents.</p>
            
            {adminNotes && (
              <div className="bg-red-100/50 p-3 rounded border border-red-100 flex gap-2">
                <FileWarning className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <div>
                  <span className="font-semibold text-red-900 block mb-0.5">Reason for rejection:</span>
                  <span className="text-red-800">{adminNotes}</span>
                </div>
              </div>
            )}
            
            {onResubmit && (
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={onResubmit} className="bg-white hover:bg-red-50 text-red-700 border-red-200">
                  Submit New Documents
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
