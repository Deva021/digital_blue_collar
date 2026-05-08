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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Info } from "lucide-react";

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
    <Card className="w-full max-w-2xl mx-auto shadow-xl shadow-slate-200/50 rounded-2xl border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 rounded-t-2xl">
        <CardTitle>Apply for this Job</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <CardContent className="space-y-6 pt-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
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
          <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 mb-2">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
            <p className="text-sm">
              <strong>Tip:</strong> Introduce yourself and explain why you're a great fit. Highlight your experience!
            </p>
          </div>
          <Textarea
            id="application_message"
            {...register("application_message")}
            rows={5}
            placeholder="Introduce yourself and explain why you're a good fit..."
            disabled={isPending}
          />
          {errors.application_message && <p className="text-sm text-red-500">{errors.application_message.message}</p>}
        </div>
      </div>
      </CardContent>

      <CardFooter className="pt-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto px-8">
          {isPending ? "Submitting Application..." : "Submit Application"}
        </Button>
      </CardFooter>
      </form>
    </Card>
  );
}
