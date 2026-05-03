"use server";

import { createClient } from "@/lib/supabase/server";
import { verificationSchema } from "../schemas";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/server/notifications/actions";
import { NOTIFICATION_TYPES } from "@/lib/constants/notifications";

export async function submitVerification(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if worker
    const { data: workerProfile } = await supabase
      .from("worker_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!workerProfile) {
      return { success: false, error: "Only workers can submit verification." };
    }

    // Check for existing active submissions
    const { data: existingRequest } = await supabase
      .from("verification_requests")
      .select("status")
      .eq("worker_id", user.id)
      .in("status", ["pending", "verified"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existingRequest) {
      return { success: false, error: "You already have a pending or verified request." };
    }

    const documentFile = formData.get("document") as File;
    const selfieFile = formData.get("selfie") as File | null;

    // Validate using Zod
    const validatedFields = verificationSchema.safeParse({
      document: documentFile,
      selfie: selfieFile && selfieFile.size > 0 ? selfieFile : undefined,
    });

    if (!validatedFields.success) {
      const errorMsg = validatedFields.error.issues[0]?.message || "Invalid fields";
      return { success: false, error: errorMsg };
    }

    // Upload files
    const uploadFile = async (file: File, type: string) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("verification_documents")
        .upload(fileName, file, {
          upsert: true,
        });
      
      if (error) throw new Error(`Upload failed: ${error.message}`);
      return data.path;
    };

    let documentUrl = "";
    let selfieUrl: string | null = null;

    try {
      documentUrl = await uploadFile(documentFile, "document");
      if (selfieFile && selfieFile.size > 0) {
        selfieUrl = await uploadFile(selfieFile, "selfie");
      }
    } catch (e: any) {
      return { success: false, error: e.message };
    }

    // Insert into DB
    const { error: dbError } = await supabase
      .from("verification_requests")
      .insert({
        worker_id: user.id,
        status: "pending",
        document_url: documentUrl,
        selfie_url: selfieUrl,
      });

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    revalidatePath("/dashboard/verification");
    revalidatePath("/dashboard/discover");

    // Notify the worker their docs have been received
    await createNotification(
      user.id,
      NOTIFICATION_TYPES.VERIFICATION_RESULT,
      'Verification documents submitted',
      'Your verification documents have been received and are under review.',
      '/dashboard/verification'
    );

    return { success: true };

  } catch (error: any) {
    console.error("Verification submit error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Called by admin flows when a verification request is approved or rejected.
 * Sends an in-app notification to the affected worker.
 */
export async function notifyVerificationResult(
  workerId: string,
  approved: boolean,
  adminNotes?: string
) {
  await createNotification(
    workerId,
    NOTIFICATION_TYPES.VERIFICATION_RESULT,
    approved ? 'Verification approved! 🎉' : 'Verification not approved',
    approved
      ? 'Your identity has been verified. You now carry the Verified badge.'
      : `Your verification was not approved.${adminNotes ? ` Reason: ${adminNotes}` : ' Please resubmit with updated documents.'}`,
    '/dashboard/verification'
  );
}
