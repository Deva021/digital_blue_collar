import { createClient } from "@/lib/supabase/server";

export interface SearchFilters {
  q?: string;
  category?: string;
  location?: string;
  available?: string;
  sort?: string;
  page?: string;
}

export async function getPublicWorkers(filters: SearchFilters) {
  const supabase = await createClient();
  const PAGE_SIZE = 20;
  const page = parseInt(filters.page || "1", 10);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("worker_profiles")
    .select(`
      id,
      bio,
      location_text,
      availability_status,
      created_at,
      worker_categories!inner ( category_id ),
      worker_services ( id, base_price, is_negotiable, description, service_categories(name) )
    `, { count: "exact" });

  if (filters.category) {
    query = query.eq("worker_categories.category_id", filters.category);
  }
  
  if (filters.location) {
    query = query.ilike("location_text", `%${filters.location}%`);
  }

  if (filters.available === "true") {
    query = query.eq("availability_status", "available");
  }

  if (filters.q) {
    // 1. Find categories matching keyword
    const { data: matchedCats } = await supabase
      .from('service_categories')
      .select('id')
      .ilike('name', `%${filters.q}%`);
    
    let matchedWorkerIds: string[] = [];
    if (matchedCats && matchedCats.length > 0) {
      const catIds = matchedCats.map(c => c.id);
      const { data: workerCats } = await supabase
        .from('worker_categories')
        .select('worker_id')
        .in('category_id', catIds);
      if (workerCats) {
        matchedWorkerIds = workerCats.map(wc => wc.worker_id);
      }
    }

    let orFilter = `bio.ilike.%${filters.q}%`;
    if (matchedWorkerIds.length > 0) {
      orFilter += `,id.in.(${matchedWorkerIds.join(',')})`;
    }
    
    query = query.or(orFilter);
  }

  if (filters.sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false }); // newest DEFAULT
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error fetching workers:", error);
    return { data: [], count: 0, error: error.message };
  }

  return { data, count: count || 0, error: null };
}

export async function searchJobs(filters: SearchFilters) {
  const supabase = await createClient();
  const PAGE_SIZE = 20;
  const page = parseInt(filters.page || "1", 10);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("job_posts")
    .select(`
      id,
      title,
      description,
      location_text,
      budget_range,
      status,
      created_at,
      category_id,
      service_categories(name)
    `, { count: "exact" })
    .eq("status", "open"); // Implicitly only search open jobs

  if (filters.category) {
    query = query.eq("category_id", filters.category);
  }

  if (filters.location) {
    query = query.ilike("location_text", `%${filters.location}%`);
  }

  if (filters.q) {
    // Advanced: Search categories too
    const { data: matchedCats } = await supabase
      .from('service_categories')
      .select('id')
      .ilike('name', `%${filters.q}%`);
      
    let matchedCategoryIds: string[] = [];
    if (matchedCats) matchedCategoryIds = matchedCats.map(c => c.id);

    let orFilter = `title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`;
    if (matchedCategoryIds.length > 0) {
      orFilter += `,category_id.in.(${matchedCategoryIds.join(',')})`;
    }
    query = query.or(orFilter);
  }

  if (filters.sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false }); // newest DEFAULT
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error fetching jobs:", error);
    return { data: [], count: 0, error: error.message };
  }

  return { data, count: count || 0, error: null };
}
