"use client";

import { useTransition, useState } from "react";
import { reviewApplicationAction } from "@/lib/services/applications";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Check, X } from "lucide-react";

type ApplicantProps = {
  applicationId: string;
  workerName: string;
  message: string;
  price: number;
  status: string;
  createdAt: string;
  jobHasAccepted: boolean;
};

export function ApplicantCard({
  applicationId,
  workerName,
  message,
  price,
  status,
  createdAt,
  jobHasAccepted
}: ApplicantProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReview = (newStatus: 'accepted' | 'rejected') => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        const res = await reviewApplicationAction(applicationId, newStatus);
        if (!res.success) {
          setErrorMsg(res.error || `Failed to mark as ${newStatus}`);
        }
      } catch (err) {
        setErrorMsg("An unexpected server error occurred.");
      }
    });
  };

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
                {workerName}
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
              "{message}"
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-56 bg-slate-50/50 p-5 rounded-lg border border-slate-100 flex flex-col gap-4 self-stretch">
          <div className="hidden md:block text-right">
            <ApplicationStatusBadge status={status} />
          </div>
          
          <div className="flex-1 flex justify-center md:justify-end items-center">
            <div className="text-center md:text-right">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold block mb-1">Proposed Price</span>
              <span className="text-2xl font-bold text-slate-900 leading-none">{price} <span className="text-sm font-normal text-slate-500">ETB</span></span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 mt-auto">
            {status === 'pending' ? (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  onClick={() => handleReview('rejected')}
                  disabled={isPending}
                >
                  {isPending ? "..." : <><X className="w-3.5 h-3.5 mr-1" /> Reject</>}
                </Button>
                
                <Button 
                  size="sm" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleReview('accepted')}
                  disabled={isPending || jobHasAccepted}
                  title={jobHasAccepted ? "Job already has an accepted worker" : ""}
                >
                  {isPending ? "..." : <><Check className="w-3.5 h-3.5 mr-1" /> Accept</>}
                </Button>
              </div>
            ) : (
              <div className="text-sm text-center text-slate-500 bg-slate-100 py-1.5 rounded-md w-full">
                {status === 'accepted' ? 'Worker Accepted' : 'Worker Rejected'}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
