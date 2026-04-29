"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  directBookingSchema,
  DirectBookingInput,
  bookingStatusUpdateSchema,
  BookingStatus,
} from "@/lib/validations/bookings";

// Allowed status transitions per role
type AllowedTransitions = Partial<Record<BookingStatus, BookingStatus[]>>;

const WORKER_TRANSITIONS: AllowedTransitions = {
  pending: ["accepted", "cancelled"],
  accepted: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
};

const CUSTOMER_TRANSITIONS: AllowedTransitions = {
  pending: ["cancelled"],
  accepted: ["cancelled"],
  in_progress: ["cancelled"],
};

// ─── Create a direct service booking ─────────────────────────────────────────

export async function createDirectBooking(data: DirectBookingInput) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { success: false, error: "Unauthorized" };

  const validated = directBookingSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { worker_id, worker_service_id, scheduled_at, location_text, final_price } = validated.data;

  // Ensure user has a customer profile
  const { data: customerProfile } = await supabase
    .from("customer_profiles")
    .select("id")
    .eq("id", authData.user.id)
    .single();

  if (!customerProfile) {
    return {
      success: false,
      error: "You must complete your customer profile before making a booking.",
    };
  }

  // Prevent self-booking
  if (authData.user.id === worker_id) {
    return { success: false, error: "You cannot book yourself." };
  }

  const payload: Record<string, unknown> = {
    customer_id: authData.user.id,
    worker_id,
    scheduled_at,
    location_text,
    final_price,
    status: "pending",
  };

  if (worker_service_id) {
    payload.worker_service_id = worker_service_id;
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("Booking insertion error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/bookings");
  return { success: true, bookingId: booking.id };
}

// ─── Fetch all bookings for the authenticated user ────────────────────────────

export async function getUserBookings() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      worker_profiles (
        id,
        bio,
        location_text
      ),
      customer_profiles (
        id,
        location_text
      ),
      worker_services (
        id,
        description,
        service_categories ( name )
      ),
      job_posts (
        id,
        title
      )
    `)
    .or(`customer_id.eq.${authData.user.id},worker_id.eq.${authData.user.id}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch user bookings error:", error);
    return [];
  }

  return data.map((b) => ({ ...b, currentUserId: authData.user!.id }));
}

// ─── Fetch a single booking by ID ─────────────────────────────────────────────

export async function getBookingById(bookingId: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      worker_profiles (
        id,
        bio,
        location_text
      ),
      customer_profiles (
        id,
        location_text
      ),
      worker_services (
        id,
        description,
        service_categories ( name )
      ),
      job_posts (
        id,
        title,
        description,
        location_text
      )
    `)
    .eq("id", bookingId)
    .or(`customer_id.eq.${authData.user.id},worker_id.eq.${authData.user.id}`)
    .single();

  if (error || !data) return null;

  return { ...data, currentUserId: authData.user.id };
}

// ─── Update booking status ────────────────────────────────────────────────────

export async function updateBookingStatus(bookingId: string, newStatus: BookingStatus) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { success: false, error: "Unauthorized" };

  const validated = bookingStatusUpdateSchema.safeParse({
    booking_id: bookingId,
    new_status: newStatus,
  });
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  // Fetch current booking to validate transition
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("status, customer_id, worker_id")
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) {
    return { success: false, error: "Booking not found." };
  }

  const isWorker = booking.worker_id === authData.user.id;
  const isCustomer = booking.customer_id === authData.user.id;

  if (!isWorker && !isCustomer) {
    return { success: false, error: "Unauthorized: you are not a party to this booking." };
  }

  const currentStatus = booking.status as BookingStatus;
  const transitions = isWorker ? WORKER_TRANSITIONS : CUSTOMER_TRANSITIONS;
  const allowed = transitions[currentStatus] ?? [];

  if (!allowed.includes(newStatus)) {
    return {
      success: false,
      error: `Cannot transition booking from '${currentStatus}' to '${newStatus}'.`,
    };
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", bookingId);

  if (updateError) {
    console.error("Booking status update error:", updateError);
    return { success: false, error: updateError.message };
  }

  revalidatePath(`/dashboard/bookings/${bookingId}`);
  revalidatePath("/dashboard/bookings");
  return { success: true };
}
