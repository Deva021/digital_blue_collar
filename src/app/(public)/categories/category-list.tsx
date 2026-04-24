"use client";

import { useState } from "react";
import { CategoryWithChildren } from "@/lib/services/categories";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CategoryBadge } from "@/components/shared/category-badge";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CategoryListProps {
  initialCategories: CategoryWithChildren[];
}

export function CategoryList({ initialCategories }: CategoryListProps) {
  const [search, setSearch] = useState("");

  const lowerSearch = search.toLowerCase();

  const filteredCategories = initialCategories.map((parent) => {
    const parentMatches = parent.name.toLowerCase().includes(lowerSearch);
    const matchingChildren = parent.children.filter((child) =>
      child.name.toLowerCase().includes(lowerSearch)
    );

    if (parentMatches || matchingChildren.length > 0) {
      return {
        ...parent,
        children: parentMatches ? parent.children : matchingChildren,
      };
    }

    return null;
  }).filter(Boolean) as CategoryWithChildren[];

  return (
    <div className="space-y-8">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-400" />
        <Input
          type="text"
          placeholder="Search categories (e.g., Plumbing, Cleaning)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-muted-200 rounded-2xl">
          <p className="text-muted-500">No categories found matching &ldquo;{search}&rdquo;.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((parent) => (
            <Link key={parent.id} href={`/workers?category=${parent.id}`} className="group drop-shadow-sm hover:drop-shadow-md transition-all">
              <Card className="h-full border-muted-200 group-hover:border-primary-500 transition-colors">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary-600 transition-colors">{parent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {parent.description && (
                    <p className="text-sm text-muted-500 mb-4">{parent.description}</p>
                  )}
                  {parent.children.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-muted-100">
                      {parent.children.map((child) => (
                        <CategoryBadge key={child.id} name={child.name} variant="secondary" />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
