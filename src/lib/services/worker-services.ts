import { createClient } from "@/lib/supabase/server";
import { Category } from "./categories";

export type WorkerService = {
  id: string;
  worker_id: string;
  category_id: string;
  title: string;
  description: string;
  base_price: number | null;
  is_negotiable: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  service_category?: Category; // Joined explicitly
};

export async function getWorkerServices(): Promise<WorkerService[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("worker_services")
    .select(`
      *,
      service_category:service_categories(id, name, parent_id, description, is_active)
    `)
    .eq("worker_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching worker services:", error);
    return [];
  }

  // Handle single vs array response from Supabase joint
  return (data || []).map(row => ({
    ...row,
    service_category: Array.isArray(row.service_category) ? row.service_category[0] : row.service_category
  })) as WorkerService[];
}

export async function getWorkerServiceById(id: string): Promise<WorkerService | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("worker_services")
    .select("*")
    .eq("id", id)
    .eq("worker_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching service ${id}:`, error);
    return null;
  }

  return data as WorkerService | null;
}
