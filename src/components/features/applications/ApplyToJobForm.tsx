"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, ApplicationFormValues } from "@/lib/validations/application";
import { applyToJobAction } from "@/lib/services/applications";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ApplyToJobForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    // @ts-expect-error - Zod coerce.number type mismatch with react-hook-form
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      job_id: jobId,
      application_message: "",
      proposed_price: 0,
    },
  });

  const onSubmit = (data: ApplicationFormValues) => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        const res = await applyToJobAction(data);
        if (!res.success) {
          setErrorMsg(res.error || "Failed to submit application");
          return;
        }
        // Successfully applied - redirect to applications
        router.push("/dashboard/applications");
      } catch (err: any) {
        setErrorMsg("An unexpected server error occurred.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-slate-200">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm font-medium border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-lg font-semibold border-b pb-2">Apply for this Job</h4>
        
        <div className="space-y-2">
          <Label htmlFor="proposed_price">Proposed Price (ETB)</Label>
          <Input 
            id="proposed_price" 
            type="number" 
            {...register("proposed_price", { valueAsNumber: true })} 
            placeholder="e.g. 500" 
          />
          {errors.proposed_price && <p className="text-sm text-red-500">{errors.proposed_price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="application_message">Application Message</Label>
          <textarea
            id="application_message"
            {...register("application_message")}
            rows={5}
            placeholder="Introduce yourself and explain why you're a good fit..."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.application_message && <p className="text-sm text-red-500">{errors.application_message.message}</p>}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto px-8">
          {isPending ? "Submitting Application..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
