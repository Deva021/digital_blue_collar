"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProfileTabSwitcherProps {
  workerSection: ReactNode;
  customerSection: ReactNode;
  defaultTab?: "worker" | "customer";
}

export function ProfileTabSwitcher({ 
  workerSection, 
  customerSection, 
  defaultTab = "worker" 
}: ProfileTabSwitcherProps) {
  const [activeTab, setActiveTab] = useState<"worker" | "customer">(defaultTab);

  return (
    <div className="space-y-6">
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 w-full max-w-md">
        <button
          onClick={() => setActiveTab("worker")}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all w-full",
            activeTab === "worker" 
              ? "bg-white text-slate-950 shadow-sm" 
              : "hover:text-slate-900"
          )}
        >
          Worker Profile
        </button>
        <button
          onClick={() => setActiveTab("customer")}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all w-full",
            activeTab === "customer" 
              ? "bg-white text-slate-950 shadow-sm" 
              : "hover:text-slate-900"
          )}
        >
          Customer Profile
        </button>
      </div>

      <div className="animate-in fade-in duration-300">
        {activeTab === "worker" ? workerSection : customerSection}
      </div>
    </div>
  );
}
