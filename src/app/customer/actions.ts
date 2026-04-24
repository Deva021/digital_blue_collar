"use server";

import { createClient } from "@/lib/supabase/server";
import { customerProfileSchema, type CustomerProfileValues } from "@/lib/validations/customer";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function upsertCustomerProfile(data: CustomerProfileValues): Promise<ActionResponse> {
  const supabase = await createClient();
  
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return { success: false, message: "You must be logged in to update your profile." };
  }

  const validatedFields = customerProfileSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid mapping in profile submission",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const payload = validatedFields.data;

  const { error } = await supabase
    .from('customer_profiles')
    .upsert({
      id: authData.user.id,
      location_text: payload.location_text,
    });

  if (error) {
    if (error.code === '23503') { 
        return { success: false, message: "User identity sync incomplete. Please establish login properly first."}
    }
    return { success: false, message: error.message || "Failed to structure customer profile." };
  }

  revalidatePath('/customer/settings/profile');
  revalidatePath('/customer/dashboard');
  return { success: true, message: "Customer profile successfully established" };
}
