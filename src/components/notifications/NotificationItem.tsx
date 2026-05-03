"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markNotificationAsRead } from "@/server/notifications/actions";
import { cn } from "@/lib/utils/cn";
import {
  Briefcase,
  Calendar,
  CheckCircle,
  ShieldCheck,
  XCircle,
  Info,
} from "lucide-react";

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

type Notification = {
  id: string;
  type: string | null;
  title: string;
  body: string | null;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
};

function getNotificationIcon(type: string | null) {
  switch (type) {
    case "application_received":
      return <Briefcase className="h-4 w-4" />;
    case "application_accepted":
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case "application_rejected":
      return <XCircle className="h-4 w-4 text-rose-500" />;
    case "booking_created":
    case "booking_updated":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "verification_result":
      return <ShieldCheck className="h-4 w-4 text-indigo-500" />;
    case "new_job":
      return <Briefcase className="h-4 w-4 text-amber-500" />;
    default:
      return <Info className="h-4 w-4 text-slate-400" />;
  }
}

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      if (!notification.is_read) {
        await markNotificationAsRead(notification.id);
        onRead?.(notification.id);
      }
      if (notification.action_url) {
        router.push(notification.action_url);
      }
    });
  };

  const isClickable = !notification.is_read || !!notification.action_url;

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) handleClick();
      }}
      aria-label={notification.title}
      className={cn(
        "group flex gap-4 px-5 py-4 transition-colors border-b border-slate-100 last:border-none",
        !notification.is_read && "bg-blue-50/50",
        isClickable && "cursor-pointer hover:bg-slate-50",
        isPending && "opacity-60 pointer-events-none"
      )}
    >
      {/* Icon bubble */}
      <div
        className={cn(
          "mt-0.5 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          notification.is_read ? "bg-slate-100 text-slate-400" : "bg-white shadow-sm border border-slate-200 text-slate-600"
        )}
      >
        {getNotificationIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-medium leading-snug",
              notification.is_read ? "text-slate-500" : "text-slate-900"
            )}
          >
            {notification.title}
          </p>
          {!notification.is_read && (
            <span className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-blue-500" aria-label="Unread" />
          )}
        </div>
        {notification.body && (
          <p className="mt-0.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
            {notification.body}
          </p>
        )}
        <p className="mt-1 text-[11px] text-slate-400">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>
    </div>
  );
}
