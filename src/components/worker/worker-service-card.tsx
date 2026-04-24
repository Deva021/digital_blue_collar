"use client";

import { useTransition } from "react";
import { WorkerService } from "@/lib/services/worker-services";
import { toggleServiceStatus } from "@/app/(protected)/dashboard/services/actions";
import { CategoryBadge } from "@/components/shared/category-badge";
import Link from "next/link";
import { Edit2, DollarSign, Calendar, Globe, AlertCircle } from "lucide-react";

export function WorkerServiceCard({ service }: { service: WorkerService }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleServiceStatus(service.id, !service.is_active);
    });
  };

  const isInactive = !service.is_active;

  return (
    <div className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-200 ${
      isInactive 
      ? "bg-slate-50 border-slate-200 opacity-80" 
      : "bg-white border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md"
    }`}>
      
      {/* Header section */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <h3 className={`text-lg font-bold ${isInactive ? "text-slate-500" : "text-slate-900"}`}>
            {service.title}
          </h3>
          <div className="mt-2 text-sm text-slate-500 flex items-center gap-2">
            {service.service_category ? (
               <CategoryBadge 
                 name={service.service_category.name} 
                 variant={isInactive ? "outline" : "secondary"} 
                 className="text-xs"
               />
            ) : (
                <span className="flex items-center text-amber-600">
                  <AlertCircle className="w-4 h-4 mr-1" /> Deleted Category
                </span>
            )}
          </div>
        </div>

        <Link 
          href={`/dashboard/services/${service.id}`}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit service"
        >
          <Edit2 size={18} />
        </Link>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 line-clamp-2 flex-grow mb-6">
        {service.description}
      </p>

      {/* Footer details */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between text-sm text-slate-500">
        <div className="flex flex-col gap-1">
          <span className="flex items-center font-medium text-slate-700">
            <DollarSign size={16} className="text-emerald-500 mr-1" />
            {service.is_negotiable 
              ? "Negotiable / Quote based" 
              : `Base Price: $${service.base_price?.toFixed(2)}`}
          </span>
          <span className="flex items-center text-xs text-slate-400">
            <Calendar size={14} className="mr-1" />
            Last updated {new Date(service.updated_at).toLocaleDateString()}
          </span>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold mr-1">
            {isInactive ? "Inactive" : "Active"}
          </span>
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors ${
              service.is_active ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                service.is_active ? 'translate-x-[8px]' : '-translate-x-[8px]'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
