"use server";

import { createClient } from "@/lib/supabase/server";
import { workerProfileSchema, type WorkerProfileValues } from "@/lib/validations/worker";
import { customerProfileSchema, type CustomerProfileValues } from "@/lib/validations/customer";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

/**
 * Updates or creates a worker profile with identity and contact info.
 * This is a consolidated action for use in the unified dashboard.
 */
export async function updateWorkerProfile(data: WorkerProfileValues): Promise<ActionResponse> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, message: "Authentication required." };
  }

  const validatedFields = workerProfileSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const payload = validatedFields.data;

  const { error } = await supabase
    .from('worker_profiles')
    .upsert({
      id: user.id,
      full_name: payload.full_name,
      bio: payload.bio,
      location_text: payload.location_text,
      availability_status: payload.availability_status,
      contact_phone: payload.contact_phone,
      contact_address: payload.contact_address,
      contact_notes: payload.contact_notes,
      can_travel: payload.can_travel,
      has_tools: payload.has_tools,
    });

  if (error) {
    console.error("Worker profile update error:", error);
    return { success: false, message: "Failed to update worker profile." };
  }

  revalidatePath('/dashboard/profile');
  return { success: true, message: "Worker profile updated successfully." };
}

/**
 * Updates or creates a customer profile with identity and contact info.
 */
export async function updateCustomerProfile(data: CustomerProfileValues): Promise<ActionResponse> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, message: "Authentication required." };
  }

  const validatedFields = customerProfileSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const payload = validatedFields.data;

  const { error } = await supabase
    .from('customer_profiles')
    .upsert({
      id: user.id,
      full_name: payload.full_name,
      location_text: payload.location_text,
      contact_phone: payload.contact_phone,
      contact_address: payload.contact_address,
      contact_notes: payload.contact_notes,
    });

  if (error) {
    console.error("Customer profile update error:", error);
    return { success: false, message: "Failed to update customer profile." };
  }

  revalidatePath('/dashboard/profile');
  return { success: true, message: "Customer profile updated successfully." };
}
