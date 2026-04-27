import { Badge } from "@/components/ui/badge";

export function ApplicationStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none">Pending</Badge>;
    case 'accepted':
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">Accepted</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">Rejected</Badge>;
    case 'withdrawn':
      return <Badge variant="secondary">Withdrawn</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
