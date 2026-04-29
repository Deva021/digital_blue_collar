"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { applicationSchema, ApplicationFormValues } from "../validations/application";

export async function applyToJobAction(data: ApplicationFormValues) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  
  if (authError || !authData.user) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = applicationSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  // Ensure job is open
  const { data: job } = await supabase
    .from('job_posts')
    .select('status, customer_id')
    .eq('id', validated.data.job_id)
    .single();

  if (!job) return { success: false, error: "Job not found" };
  if (job.status !== 'open') return { success: false, error: "This job is no longer open for applications." };
  if (job.customer_id === authData.user.id) return { success: false, error: "You cannot apply to your own job." };

  const payload = {
    job_post_id: validated.data.job_id,
    worker_id: authData.user.id,
    message: validated.data.application_message,
    proposed_price: validated.data.proposed_price,
    status: 'pending'
  };

  const { error } = await supabase.from('job_applications').insert(payload);
  
  if (error) {
    // 23505 is the PostgreSQL unique violation error code
    if (error.code === '23505') {
      return { success: false, error: "You have already applied for this job." };
    }
    console.error("Application insertion error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath('/jobs');
  revalidatePath(`/jobs/${validated.data.job_id}`);
  revalidatePath('/dashboard/applications');
  
  return { success: true };
}

export async function getWorkerApplications() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return [];

  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      job_posts (
        title,
        location_text
      )
    `)
    .eq('worker_id', authData.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Fetch worker applications error:", error);
    return [];
  }
  return data;
}

export async function getReceivedApplications(jobId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  // Verify ownership of the job
  const { data: job, error: jobError } = await supabase
    .from('job_posts')
    .select('id, title, status, customer_id')
    .eq('id', jobId)
    .single();

  if (jobError || !job || job.customer_id !== authData.user.id) {
    return null; // Don't expose existence or error explicitly for security
  }

  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      worker_profiles (
        first_name,
        last_name,
        bio
      )
    `)
    .eq('job_post_id', jobId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Fetch received applications error:", error);
    return { job, applications: [] };
  }
  
  return { job, applications: data };
}

export async function reviewApplicationAction(applicationId: string, status: 'rejected') {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { success: false, error: "Unauthorized" };

  const { data: application, error: appError } = await supabase
    .from('job_applications')
    .select('*, job_posts(customer_id)')
    .eq('id', applicationId)
    .single();

  if (appError || !application) return { success: false, error: "Application not found" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((application.job_posts as any)?.customer_id !== authData.user.id) {
    return { success: false, error: "Unauthorized: You do not own this job." };
  }

  if (application.status !== 'pending') {
    return { success: false, error: "This application has already been reviewed." };
  }

  const { error: updateError } = await supabase
    .from('job_applications')
    .update({ status })
    .eq('id', applicationId);

  if (updateError) {
    console.error("Application reject error:", updateError);
    return { success: false, error: updateError.message };
  }

  revalidatePath(`/dashboard/jobs/${application.job_post_id}/applications`);
  revalidatePath('/dashboard/applications');

  return { success: true };
}

export async function acceptApplicationAction(
  applicationId: string,
  scheduledAt: string,
  locationText: string
) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { success: false, error: "Unauthorized" };

  // Validate inputs
  if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
    return { success: false, error: "Scheduled time must be in the future." };
  }
  if (!locationText || locationText.trim().length < 3) {
    return { success: false, error: "Location must be at least 3 characters." };
  }

  const { data: application, error: appError } = await supabase
    .from('job_applications')
    .select('*, job_posts(customer_id, id)')
    .eq('id', applicationId)
    .single();

  if (appError || !application) return { success: false, error: "Application not found" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobPosts = application.job_posts as any;
  if (jobPosts?.customer_id !== authData.user.id) {
    return { success: false, error: "Unauthorized: You do not own this job." };
  }

  if (application.status !== 'pending') {
    return { success: false, error: "This application has already been reviewed." };
  }

  // Ensure no other accepted application exists for this job
  const { count, error: countError } = await supabase
    .from('job_applications')
    .select('id', { count: 'exact', head: true })
    .eq('job_post_id', application.job_post_id)
    .eq('status', 'accepted');

  if (countError) return { success: false, error: countError.message };
  if (count && count > 0) {
    return { success: false, error: "This job already has an accepted worker." };
  }

  // 1) Update application to accepted
  const { error: updateError } = await supabase
    .from('job_applications')
    .update({ status: 'accepted' })
    .eq('id', applicationId);

  if (updateError) {
    console.error("Application accept error:", updateError);
    return { success: false, error: updateError.message };
  }

  // 2) Create booking record from the accepted application
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      customer_id: authData.user.id,
      worker_id: application.worker_id,
      job_post_id: application.job_post_id,
      final_price: application.proposed_price,
      scheduled_at: scheduledAt,
      location_text: locationText,
      status: 'accepted',
    })
    .select('id')
    .single();

  if (bookingError) {
    // Rollback application status
    await supabase
      .from('job_applications')
      .update({ status: 'pending' })
      .eq('id', applicationId);
    console.error("Booking creation error after acceptance:", bookingError);
    return { success: false, error: "Failed to create booking. Application acceptance reverted." };
  }

  revalidatePath(`/dashboard/jobs/${application.job_post_id}/applications`);
  revalidatePath('/dashboard/applications');
  revalidatePath('/dashboard/bookings');

  return { success: true, bookingId: booking.id };
}
