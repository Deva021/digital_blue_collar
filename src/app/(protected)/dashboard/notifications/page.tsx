import { getNotifications } from "@/server/notifications/actions";
import { NotificationList } from "@/components/notifications/NotificationList";
import { Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Notifications — Digital Blue Collar",
  description: "Your in-app notification center.",
};

export default async function NotificationsPage() {
  const { notifications, total } = await getNotifications(1, 30);

  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-md text-primary">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">Stay on top of your activity</p>
          </div>
        </div>
      </div>

      {/* Notification list card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <NotificationList initialNotifications={notifications} total={total} />
      </div>
    </div>
  );
}
