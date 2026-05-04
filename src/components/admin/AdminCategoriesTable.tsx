'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AdminConfirmDialog from './AdminConfirmDialog'
import { toggleCategoryActive, type AdminCategory } from '@/lib/services/admin'

interface AdminCategoriesTableProps {
  categories: AdminCategory[]
}

export default function AdminCategoriesTable({ categories }: AdminCategoriesTableProps) {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<AdminCategory | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  const handleToggleClick = (category: AdminCategory) => {
    setSelectedCategory(category)
    setError(null)
    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!selectedCategory) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await toggleCategoryActive(
        selectedCategory.id,
        !selectedCategory.is_active
      )

      if (result.success) {
        setIsConfirmOpen(false)
        router.refresh()
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (e) {
      setError('A network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr 
                  key={category.id} 
                  className={`hover:bg-neutral-50 transition-colors ${!category.is_active ? 'opacity-70 bg-neutral-50/50' : ''}`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900">{category.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant={category.is_active ? 'default' : 'secondary'}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500 max-w-xs truncate">{category.description || '—'}</td>
                  <td className="px-4 py-3 text-sm text-neutral-500">
                    {new Date(category.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Button
                      variant={category.is_active ? 'outline' : 'secondary'}
                      size="sm"
                      onClick={() => handleToggleClick(category)}
                    >
                      {category.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50">
        <p className="text-xs text-neutral-400">
          Showing {categories.length} categories ({categories.filter(c => c.is_active).length} active, {categories.filter(c => !c.is_active).length} inactive)
        </p>
      </div>

      {selectedCategory && (
        <AdminConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirm}
          isLoading={isLoading}
          title={selectedCategory.is_active ? 'Deactivate Category?' : 'Activate Category?'}
          description={
            selectedCategory.is_active
              ? `Are you sure you want to deactivate "${selectedCategory.name}"? It will be hidden from the public marketplace.`
              : `Are you sure you want to activate "${selectedCategory.name}"? It will become visible on the public marketplace.`
          }
          confirmLabel={selectedCategory.is_active ? 'Deactivate' : 'Activate'}
          confirmVariant={selectedCategory.is_active ? 'destructive' : 'primary'}
        >
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
              {error}
            </div>
          )}
        </AdminConfirmDialog>
      )}
    </div>
  )
}
