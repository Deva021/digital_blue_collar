"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings } from "lucide-react";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/customer/dashboard", icon: LayoutDashboard },
    { name: "Profile & Settings", href: "/customer/settings/profile", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r border-gray-200 bg-white flex flex-col md:flex-shrink-0">
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <div className="font-bold text-lg text-gray-900">Customer Area</div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto max-md:flex max-md:flex-row max-md:overflow-x-auto max-md:space-y-0 max-md:space-x-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
