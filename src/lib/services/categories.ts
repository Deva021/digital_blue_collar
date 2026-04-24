import { createClient } from "@/lib/supabase/server";

export type Category = {
  id: string;
  name: string;
  parent_id: string | null;
  description: string | null;
  is_active: boolean;
};

export type CategoryWithChildren = Category & {
  children: Category[];
};

export async function getActiveCategories(): Promise<CategoryWithChildren[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_categories")
    .select("id, name, parent_id, description, is_active")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }

  const categories: Category[] = data || [];
  
  const parentCategories = categories.filter((c) => !c.parent_id);
  const childCategories = categories.filter((c) => c.parent_id);
  
  const mapped = parentCategories.map((parent) => ({
    ...parent,
    children: childCategories.filter((child) => child.parent_id === parent.id),
  }));
  
  return mapped;
}

export async function getWorkerCategoryIds(workerId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("worker_categories")
    .select("category_id")
    .eq("worker_id", workerId);

  if (error) {
    console.error("Error fetching worker categories:", error);
    return [];
  }

  return (data || []).map((row) => row.category_id);
}
