import { createClient } from "@/lib/supabase/server";

export async function getWorkerProfileById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("worker_profiles")
    .select(`
      *,
      worker_services (
        id,
        title,
        description,
        base_price,
        is_negotiable,
        service_categories ( name )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching worker profile:", error);
    return null;
  }

  return data;
}

export async function getPublicServiceById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("worker_services")
    .select(`
      *,
      service_categories ( name ),
      worker_profiles (
        id,
        bio,
        location_text
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching service:", error);
    return null;
  }

  return data;
}
