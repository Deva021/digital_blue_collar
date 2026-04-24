"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { workerCategoriesSchema } from "@/lib/validations/category";

export async function upsertWorkerCategories(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const categoryIds = formData.getAll("categories").map(String);
    const result = workerCategoriesSchema.safeParse({ categories: categoryIds });

    if (!result.success) {
      return { error: "Invalid category selection" };
    }

    // Replace all worker categories
    // 1. Delete existing for this worker_id
    const { error: deleteError } = await supabase
      .from("worker_categories")
      .delete()
      .eq("worker_id", user.id);

    if (deleteError) {
      console.error("Error deleting old categories:", deleteError);
      return { error: "Failed to update categories. Could not remove previous selections." };
    }

    // 2. Insert new selections
    if (result.data.categories.length > 0) {
      const inserts = result.data.categories.map((categoryId) => ({
        worker_id: user.id,
        category_id: categoryId,
      }));

      const { error: insertError } = await supabase
        .from("worker_categories")
        .insert(inserts);

      if (insertError) {
        console.error("Error inserting new categories:", insertError);
        return { error: "Failed to save category selections." };
      }
    }

    revalidatePath("/worker/settings/profile");
    revalidatePath("/worker/dashboard");
    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    console.error("Unknown error upserting categories:", error);
    return { error: "An unexpected error occurred." };
  }
}
