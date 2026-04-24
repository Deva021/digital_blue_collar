"use client";

import { useState, useTransition } from "react";
import { CategoryWithChildren } from "@/lib/services/categories";
import { upsertWorkerCategories } from "@/app/worker/category-actions";
import { Button } from "@/components/ui/button";

interface WorkerCategoryFormProps {
  categories: CategoryWithChildren[];
  initialSelectedCategoryIds: string[];
}

export function WorkerCategoryForm({
  categories,
  initialSelectedCategoryIds,
}: WorkerCategoryFormProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedCategoryIds));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (id: string, parentId: string | null) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
      // If a parent is deselected, deselect its children.
      if (!parentId) {
        const parent = categories.find((c) => c.id === id);
        if (parent) {
          parent.children.forEach((child) => newSelected.delete(child.id));
        }
      }
    } else {
      newSelected.add(id);
      // If a child is selected, we should automatically select the parent.
      if (parentId) {
        newSelected.add(parentId);
      }
    }
    setSelectedIds(newSelected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await upsertWorkerCategories(Array.from(selectedIds));
      if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {categories.map((parent) => (
          <div key={parent.id} className="p-4 border rounded-lg bg-card">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`cat-${parent.id}`}
                checked={selectedIds.has(parent.id)}
                onChange={() => toggleCategory(parent.id, null)}
                className="h-4 w-4 rounded border-muted-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor={`cat-${parent.id}`} className="font-medium">
                {parent.name}
              </label>
            </div>
            {parent.description && (
              <p className="text-sm text-muted-500 mt-1 pl-6">{parent.description}</p>
            )}

            {parent.children.length > 0 && (
              <div className="mt-3 ml-6 space-y-2 border-t border-muted-100 pt-3">
                {parent.children.map((child) => (
                  <div key={child.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`cat-${child.id}`}
                      checked={selectedIds.has(child.id)}
                      onChange={() => toggleCategory(child.id, parent.id)}
                      className="h-4 w-4 rounded border-muted-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor={`cat-${child.id}`} className="text-sm cursor-pointer">
                      {child.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-muted-500 italic">No categories available at the moment.</p>
        )}
      </div>

      {error && <p className="text-error-500 text-sm">{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving Categories..." : "Save Categories"}
      </Button>
    </form>
  );
}
