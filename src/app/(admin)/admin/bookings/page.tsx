import { getAdminBookings, type AdminBooking } from '@/lib/services/admin'
import AdminDataTable from '@/components/admin/AdminDataTable'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Bookings Management — Admin Dashboard',
}

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings()

  const columns = [
    { key: 'id', header: 'Booking ID' },
    {
      key: 'status',
      header: 'Status',
      render: (row: AdminBooking) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          pending: 'secondary',
          accepted: 'default',
          in_progress: 'outline',
          completed: 'default',
          cancelled: 'destructive',
        }
        return <Badge variant={variants[row.status] || 'outline'}>{row.status}</Badge>
      },
    },
    {
      key: 'final_price',
      header: 'Price',
      render: (row: AdminBooking) => row.final_price ? `$${row.final_price}` : 'TBD',
    },
    {
      key: 'scheduled_at',
      header: 'Scheduled',
      render: (row: AdminBooking) => new Date(row.scheduled_at).toLocaleDateString(),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (row: AdminBooking) => new Date(row.created_at).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Bookings</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Global view of all service bookings and their current status.
        </p>
      </div>

      <AdminDataTable
        data={bookings}
        columns={columns}
        emptyMessage="No bookings found"
        emptyDescription="There are currently no bookings in the system."
      />
    </div>
  )
}
