"use client";

import { useState, useTransition } from "react";
import { CategoryWithChildren } from "@/lib/services/categories";
import { upsertWorkerCategories } from "@/app/worker/category-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

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
          <div key={parent.id} className={cn(
            "p-5 border rounded-2xl bg-white shadow-sm hover:border-slate-300 transition-colors focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:border-primary-500",
            selectedIds.has(parent.id) ? "border-primary-500 bg-primary-50/20" : "border-slate-200"
          )}>
            <div className="flex items-start space-x-3">
              <div className="flex h-5 items-center mt-0.5">
                <input
                  type="checkbox"
                  id={`cat-${parent.id}`}
                  checked={selectedIds.has(parent.id)}
                  onChange={() => toggleCategory(parent.id, null)}
                  className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-all"
                />
              </div>
              <div>
                <label htmlFor={`cat-${parent.id}`} className="text-base font-semibold text-slate-900 cursor-pointer">
                  {parent.name}
                </label>
                {parent.description && (
                  <p className="text-sm text-slate-500 mt-1">{parent.description}</p>
                )}
              </div>
            </div>

            {parent.children.length > 0 && (
              <div className="mt-4 ml-8 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                {parent.children.map((child) => (
                  <div key={child.id} className={cn(
                    "flex items-center space-x-2 p-2 rounded-lg transition-colors cursor-pointer border border-transparent",
                    selectedIds.has(child.id) ? "bg-primary-50 border-primary-100" : "hover:bg-slate-50"
                  )}>
                    <input
                      type="checkbox"
                      id={`cat-${child.id}`}
                      checked={selectedIds.has(child.id)}
                      onChange={() => toggleCategory(child.id, parent.id)}
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <label htmlFor={`cat-${child.id}`} className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
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
