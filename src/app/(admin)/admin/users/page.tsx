import { getAdminUsers, type AdminUser } from '@/lib/services/admin'
import AdminDataTable from '@/components/admin/AdminDataTable'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Users Overview — Admin Dashboard',
}

export default async function AdminUsersPage() {
  const users = await getAdminUsers()

  const columns = [
    { key: 'email', header: 'Email' },
    {
      key: 'is_admin',
      header: 'Role',
      render: (row: AdminUser) => (
        <div className="flex gap-2">
          {row.is_admin && <Badge variant="default">Admin</Badge>}
          {row.has_worker_profile && <Badge variant="outline">Worker</Badge>}
          {row.has_customer_profile && <Badge variant="outline">Customer</Badge>}
          {!row.has_worker_profile && !row.has_customer_profile && (
            <span className="text-neutral-400">No profile</span>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined',
      render: (row: AdminUser) => new Date(row.created_at).toLocaleDateString(),
    },
    { key: 'id', header: 'User ID' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Complete list of registered platform users.
        </p>
      </div>

      <AdminDataTable
        data={users}
        columns={columns}
        emptyMessage="No users found"
        emptyDescription="It seems there are no registered users yet."
      />
    </div>
  )
}
