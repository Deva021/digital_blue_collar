import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-blue-600 tracking-tight">Blue Collar Marketplace</div>
        <nav className="space-x-4 text-sm font-medium text-gray-600">
          <span>Home</span>
          <span>Workers</span>
          <span>Jobs</span>
        </nav>
      </header>
      <main className="flex-1 bg-white">{children}</main>
      <footer className="border-t border-gray-100 bg-gray-50 px-6 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Blue Collar Marketplace for Ethiopia. All rights reserved.</p>
      </footer>
    </div>
  );
}
