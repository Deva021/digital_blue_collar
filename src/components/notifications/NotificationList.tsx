"use client";

import { useState, useTransition, useOptimistic } from "react";
import { markAllNotificationsAsRead } from "@/server/notifications/actions";
import { NotificationItem } from "./NotificationItem";
import { BellOff, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  type: string | null;
  title: string;
  body: string | null;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
};

interface NotificationListProps {
  initialNotifications: Notification[];
  total: number;
}

export function NotificationList({ initialNotifications, total }: NotificationListProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isPending, startTransition] = useTransition();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      const result = await markAllNotificationsAsRead();
      if (result.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      }
    });
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <div className="p-4 rounded-full bg-slate-100 text-slate-400">
          <BellOff className="h-8 w-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-700">You're all caught up!</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          No notifications yet. We'll let you know when something important happens.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Toolbar */}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/80">
          <span className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{unreadCount}</span> unread
          </span>
          <Button
            id="mark-all-read-btn"
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isPending}
            className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1.5 h-7"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </Button>
        </div>
      )}

      {/* List */}
      <div>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={handleMarkOneRead}
          />
        ))}
      </div>

      {total > notifications.length && (
        <p className="text-center text-xs text-slate-400 py-4">
          Showing {notifications.length} of {total} notifications.
        </p>
      )}
    </div>
  );
}
