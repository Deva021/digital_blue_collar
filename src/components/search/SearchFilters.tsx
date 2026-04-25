"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, Search, X } from "lucide-react";
import type { CategoryWithChildren } from "@/lib/services/categories";

export function SearchFilters({
  categories = []
}: {
  categories: CategoryWithChildren[]
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [available, setAvailable] = useState(searchParams.get("available") === "true");
  
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (q) params.set("q", q); else params.delete("q");
    if (location) params.set("location", location); else params.delete("location");
    if (category) params.set("category", category); else params.delete("category");
    if (available) params.set("available", "true"); else params.delete("available");

    params.delete("page");
    router.push(pathname + "?" + params.toString());
    setShowFilters(false);
  };

  const clearFilters = () => {
    setQ("");
    setLocation("");
    setCategory("");
    setAvailable(false);
    router.push(pathname);
    setShowFilters(false);
  };

  const hasActiveFilters = location || category || available;

  return (
    <div className="w-full mb-8">
      <form onSubmit={applyFilters}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              id="q" 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search by keyword, title, or category..." 
              className="pl-10 h-12 text-lg shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant={hasActiveFilters ? "primary" : "outline"} className="h-12 px-6 shadow-sm hidden sm:flex" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters {hasActiveFilters && <span className="ml-2 w-2 h-2 rounded-full bg-blue-500"></span>}
            </Button>
            <Button type="button" variant={hasActiveFilters ? "primary" : "outline"} className="h-12 w-12 p-0 shadow-sm sm:hidden flex items-center justify-center" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-5 h-5" />
            </Button>
            <Button type="submit" className="h-12 px-8 shadow-sm">Search</Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-5 bg-white border border-gray-100 shadow-sm rounded-xl animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <h3 className="font-semibold text-gray-800">Advanced Filters</h3>
              <button type="button" onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <optgroup key={cat.id} label={cat.name}>
                      <option value={cat.id}>{cat.name}</option>
                      {cat.children?.map(child => (
                        <option key={child.id} value={child.id}>-- {child.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="E.g. Addis Ababa" 
                />
              </div>

              <div className="space-y-4">
                <Label>Availability</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="available" 
                    checked={available} 
                    onChange={(e) => setAvailable(e.target.checked)} 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="available" className="font-normal cursor-pointer">Only available now</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={clearFilters}>Clear Filters</Button>
              <Button type="submit">Apply Filters</Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
