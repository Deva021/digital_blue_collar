"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { reviewSchema, ReviewInput, Review } from "@/lib/validations/reviews";

export async function createReview(data: ReviewInput) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  
  if (!authData.user) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = reviewSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { booking_id, reviewee_id, rating, comment } = validated.data;
  const reviewer_id = authData.user.id;

  // 1. Verify booking exists, belongs to user, and is completed
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("status, customer_id")
    .eq("id", booking_id)
    .single();

  if (fetchError || !booking) {
    return { success: false, error: "Booking not found." };
  }

  if (booking.customer_id !== reviewer_id) {
    return { success: false, error: "You can only review your own bookings." };
  }

  if (booking.status !== "completed") {
    return { success: false, error: "Only completed bookings can be reviewed." };
  }

  // 2. Attempt insert
  const { error: insertError } = await supabase
    .from("reviews")
    .insert({
      booking_id,
      reviewee_id,
      reviewer_id,
      rating,
      comment,
    });

  if (insertError) {
    console.error("Review insertion error:", insertError);
    // Postgres unique constraint violation code is '23505'
    if (insertError.code === '23505') {
        return { success: false, error: "You have already reviewed this booking." };
    }
    return { success: false, error: insertError.message };
  }

  revalidatePath(`/dashboard/bookings/${booking_id}`);
  // Also invalidate discovery where worker cards might live
  revalidatePath("/dashboard/discover");
  
  return { success: true };
}

export async function getReviewByBookingId(bookingId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      customer_profiles!reviews_reviewer_id_fkey (
        id,
        location_text
      )
    `)
    .eq("booking_id", bookingId)
    .single();

  if (error || !data) return null;

  return data as Review;
}

export async function getReviewsByWorkerId(workerId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      customer_profiles!reviews_reviewer_id_fkey (
        id,
        location_text
      )
    `)
    .eq("reviewee_id", workerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch reviews error:", error);
    return [];
  }

  return data as Review[];
}

export async function getWorkerRatingSummary(workerId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .rpc('get_worker_rating_summary', { p_worker_id: workerId })
    .single();
    
  if (error || !data) {
    return { average_rating: 0, review_count: 0 };
  }
  
  const typedData = data as { average_rating: string | number; review_count: string | number };
  
  return {
    average_rating: Number(typedData.average_rating) || 0,
    review_count: Number(typedData.review_count) || 0,
  };
}
