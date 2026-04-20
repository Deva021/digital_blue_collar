import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="font-bold text-lg text-gray-900">Dashboard</div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">Overview</div>
          <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">My Profile</div>
          <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">Settings</div>
        </nav>
      </aside>

      {/* Main Area Placeholder */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 justify-end">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs ring-2 ring-white">
            U
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
