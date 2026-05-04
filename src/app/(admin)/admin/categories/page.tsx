import { getAdminCategories, type AdminCategory } from '@/lib/services/admin'
import AdminDataTable from '@/components/admin/AdminDataTable'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Categories Management — Admin Dashboard',
}

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories()

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'is_active',
      header: 'Status',
      render: (row: AdminCategory) => (
        <Badge variant={row.is_active ? 'default' : 'secondary'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    { key: 'description', header: 'Description' },
    {
      key: 'created_at',
      header: 'Created',
      render: (row: AdminCategory) => new Date(row.created_at).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Categories</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Platform service categories hierarchy.
        </p>
      </div>

      <AdminDataTable
        data={categories}
        columns={columns}
        emptyMessage="No categories"
        emptyDescription="System service categories haven't been configured."
      />
    </div>
  )
}
