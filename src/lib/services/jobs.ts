"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { jobPostSchema, JobPostFormValues } from "../validations/job";

export async function createJobAction(data: JobPostFormValues) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { success: false, error: "Unauthorized" };

  const validated = jobPostSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  // Ensure user has a customer profile
  const { data: profile } = await supabase
    .from('customer_profiles')
    .select('id')
    .eq('id', authData.user.id)
    .single();

  if (!profile) {
    return { success: false, error: "You must complete your customer profile setup before posting jobs." };
  }

  const payload = {
    customer_id: authData.user.id,
    title: validated.data.title,
    description: validated.data.description,
    category_id: validated.data.category_id,
    location_text: validated.data.location_text,
    budget_range: validated.data.budget_range,
    is_negotiable: validated.data.is_negotiable,
    workers_needed: validated.data.workers_needed,
    status: 'open'
  };

  const { data: job, error } = await supabase.from('job_posts').insert(payload).select().single();
  
  if (error) {
    console.error("Job insertion error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard/discover');
  revalidatePath('/jobs');
  
  return { success: true, jobId: job.id };
}

export async function getCustomerJobs() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return [];

  const { data, error } = await supabase
    .from('job_posts')
    .select(`*, service_categories(name)`)
    .eq('customer_id', authData.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Fetch jobs error:", error);
    return [];
  }
  return data;
}

export async function getJobPostById(jobId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data, error } = await supabase
    .from('job_posts')
    .select(`*, service_categories(name)`)
    .eq('id', jobId)
    .eq('customer_id', authData.user.id)
    .single();
    
  if (error) return null;
  return data;
}

export async function getAvailableJobs() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return [];

  // TODO: Implement category filtering if supported based on worker_categories
  // For MVP, just return all open jobs where customer != current user
  
  const { data, error } = await supabase
    .from('job_posts')
    .select(`*, service_categories(name)`)
    .eq('status', 'open')
    .neq('customer_id', authData.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Fetch available jobs error:", error);
    return [];
  }
  return data;
}

export async function getPublicJobById(jobId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('job_posts')
    .select(`*, service_categories(name)`)
    .eq('id', jobId)
    .single();

  if (error || !data) return null;

  // Check if there is an accepted worker for this job
  const { count: acceptedCount } = await supabase
    .from('job_applications')
    .select('id', { count: 'exact', head: true })
    .eq('job_post_id', jobId)
    .eq('status', 'accepted');

  const hasAcceptedWorker = acceptedCount ? acceptedCount > 0 : false;

  let isOwner = false;
  let hasApplied = false;
  let applicationStatus = null;

  if (authData.user) {
    isOwner = data.customer_id === authData.user.id;
    
    if (!isOwner) {
      const { data: appData } = await supabase
        .from('job_applications')
        .select('status')
        .eq('job_post_id', jobId)
        .eq('worker_id', authData.user.id)
        .single();
        
      if (appData) {
        hasApplied = true;
        applicationStatus = appData.status;
      }
    }
  }

  return {
    ...data,
    isAuthenticated: !!authData.user,
    isOwner,
    hasApplied,
    applicationStatus,
    hasAcceptedWorker
  };
}
