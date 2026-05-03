"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { getUnreadNotificationCount } from "@/server/notifications/actions";

export function NotificationBell() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = useCallback(async () => {
    try {
      const c = await getUnreadNotificationCount();
      setCount(c);
    } catch {
      // silently fail — non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    // Poll every 60 seconds for freshness (no websockets per spec)
    const interval = setInterval(fetchCount, 60_000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  const displayCount = count > 99 ? "99+" : count;

  return (
    <Link
      href="/dashboard/notifications"
      aria-label={`Notifications${count > 0 ? ` — ${displayCount} unread` : ""}`}
      className="relative inline-flex items-center justify-center p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
    >
      <Bell className="h-5 w-5" />
      {!loading && count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold leading-none px-1 shadow"
        >
          {displayCount}
        </span>
      )}
    </Link>
  );
}
