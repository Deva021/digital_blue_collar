import { getAdminCategories } from '@/lib/services/admin'
import AdminCategoriesTable from '@/components/admin/AdminCategoriesTable'

export const metadata = {
  title: 'Categories Management — Admin Dashboard',
}

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Categories</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Platform service categories hierarchy.
        </p>
      </div>

      <AdminCategoriesTable categories={categories} />
    </div>
  )
}
