import { CheckCircle2 } from "lucide-react";

export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center group relative ${className}`}>
      <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-50" />
      <span className="sr-only">Verified Professional</span>
      
      {/* Simple CSS Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-max bg-slate-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
        Identity Verified
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </div>
    </div>
  );
}
