"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { workerServiceSchema } from "@/lib/validations/worker-service";

export async function upsertWorkerService(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const payload = {
      id: formData.get("id") as string || undefined,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category_id: formData.get("category_id") as string,
      is_negotiable: formData.get("is_negotiable") === "true",
      base_price: formData.get("base_price"),
      is_active: formData.get("is_active") === "true",
    };

    const validated = workerServiceSchema.safeParse(payload);

    if (!validated.success) {
      return { 
        error: "Validation failed", 
        fields: validated.error.flatten().fieldErrors 
      };
    }

    const serviceData = {
      worker_id: user.id,
      title: validated.data.title,
      description: validated.data.description,
      category_id: validated.data.category_id,
      is_negotiable: validated.data.is_negotiable,
      base_price: validated.data.base_price === "" ? null : Number(validated.data.base_price),
      is_active: validated.data.is_active,
      updated_at: new Date().toISOString(),
    };

    if (validated.data.id) {
      // Update
      const { error } = await supabase
        .from("worker_services")
        .update(serviceData)
        .eq("id", validated.data.id)
        .eq("worker_id", user.id);

      if (error) {
        console.error("Error updating service:", error);
        return { error: "Failed to update service." };
      }
    } else {
      // Insert
      const { error } = await supabase
        .from("worker_services")
        .insert(serviceData);
        
      if (error) {
        console.error("Error creating service:", error);
        return { error: "Failed to create service." };
      }
    }

    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    console.error("Unknown error in upsertWorkerService:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function toggleServiceStatus(id: string, isActive: boolean) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase
      .from("worker_services")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("worker_id", user.id);

    if (error) {
      console.error("Error toggling service status:", error);
      return { error: "Failed to update status." };
    }

    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error) {
    console.error("Error in toggleServiceStatus:", error);
    return { error: "An unexpected error occurred." };
  }
}
