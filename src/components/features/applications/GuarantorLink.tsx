"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";

export function GuarantorLink({ submissionId }: { submissionId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const fullLink = `${window.location.origin}/guarantor/${submissionId}`;
      navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-2 pt-4 border-t border-slate-200/60">
      <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit">Guarantor Required</span>
      <span className="text-[11px] text-slate-500 leading-tight">
        Send this secure link to your third accountable person.
      </span>
      
      <div className="flex gap-2 items-center bg-white border border-slate-200 rounded-md p-1.5 shadow-sm max-w-full overflow-hidden">
        <span className="text-xs text-slate-500 truncate flex-1 pl-2 select-all">
          .../guarantor/{submissionId.split('-')[0]}
        </span>
        <Button 
          variant={copied ? "primary" : "secondary"} 
          size="sm" 
          className={`h-7 px-3 text-[11px] shrink-0 ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
          onClick={handleCopy}
        >
          {copied ? (
            <><CheckCircle2 className="w-3 h-3 mr-1" /> Copied</>
          ) : (
            <><Copy className="w-3 h-3 mr-1" /> Copy Link</>
          )}
        </Button>
      </div>
    </div>
  );
}
