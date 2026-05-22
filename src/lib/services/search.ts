import { createClient } from "@/lib/supabase/server";

export interface SearchFilters {
  q?: string;
  category?: string;
  location?: string;
  available?: string;
  sort?: string;
  page?: string;
  dateRange?: string;
  specificDate?: string;
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
      full_name,
      bio,
      location_text,
      availability_status,
      verification_status,
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

  if (filters.specificDate) {
    const startOfDay = new Date(filters.specificDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filters.specificDate);
    endOfDay.setHours(23, 59, 59, 999);
    query = query.gte("created_at", startOfDay.toISOString());
    query = query.lte("created_at", endOfDay.toISOString());
  } else if (filters.dateRange) {
    const now = new Date();
    if (filters.dateRange === "today") {
      const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      query = query.gte("created_at", past24h);
    } else if (filters.dateRange === "week") {
      const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte("created_at", pastWeek);
    } else if (filters.dateRange === "month") {
      const pastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte("created_at", pastMonth);
    }
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

export async function getPublicWorkerById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("worker_profiles")
    .select(`
      id,
      full_name,
      bio,
      location_text,
      availability_status,
      verification_status,
      created_at,
      worker_categories ( category_id, service_categories(name) ),
      worker_services ( id, base_price, is_negotiable, description, service_categories(name) )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching worker profile:", error);
    return null;
  }

  return data;
}
