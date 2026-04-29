import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/validations/bookings";

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-none hover:bg-amber-100",
  },
  accepted: {
    label: "Accepted",
    className: "bg-blue-100 text-blue-800 border-none hover:bg-blue-100",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-indigo-100 text-indigo-800 border-none hover:bg-indigo-100",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-100",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-600 border-none hover:bg-slate-100",
  },
};

export function BookingStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as BookingStatus];
  if (!config) {
    return <Badge variant="outline">{status}</Badge>;
  }
  return <Badge className={config.className}>{config.label}</Badge>;
}
