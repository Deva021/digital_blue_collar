"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Info } from "lucide-react";

import { workerProfileSchema, type WorkerProfileValues } from "@/lib/validations/worker";
import { updateWorkerProfile } from "@/server/actions/profiles";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckboxCard } from "@/components/ui/checkbox-card";

export function WorkerOnboardingForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(workerProfileSchema),
    defaultValues: {
      full_name: "",
      bio: "",
      location_text: "",
      contact_phone: "",
      contact_address: "",
      contact_notes: "",
      can_travel: false,
      has_tools: false,
      availability_status: "available",
    },
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const response = await updateWorkerProfile(data as WorkerProfileValues);
      if (!response.success) {
        if (response.errors) {
          // Flatten field errors into form state
          for (const [key, value] of Object.entries(response.errors)) {
            setError(key as keyof WorkerProfileValues, { type: "server", message: value[0] });
          }
        } else {
          setError("root", { type: "server", message: response.message });
        }
      } else {
        // Success redirect - immediately send them to the unified profile area
        router.push("/dashboard/profile");
      }
    });
  };

  const pending = isPending || isSubmitting;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Worker Profile</CardTitle>
        <CardDescription>
          Tell customers about your skills, location, and availability to start receiving jobs.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {errors.root && (
            <div className="p-3 text-sm text-red-500 bg-red-100/50 border border-red-200 rounded-md">
              {errors.root.message}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input 
                id="full_name"
                placeholder="e.g. Dawit Lema"
                {...register("full_name")}
                disabled={pending}
              />
              {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 mb-2">
                <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
                <p className="text-sm">
                  <strong>Tip:</strong> A detailed bio significantly increases your chances of getting hired. Highlight your experience and skills!
                </p>
              </div>
              <Textarea 
                id="bio"
                placeholder="I am an experienced professional doing..."
                className="min-h-32"
                {...register("bio")}
                disabled={pending}
              />
              {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_text">Primary Location</Label>
              <Input 
                id="location_text"
                placeholder="e.g. Addis Ababa, Bole"
                {...register("location_text")}
                disabled={pending}
              />
              {errors.location_text && <p className="text-sm text-red-500">{errors.location_text.message}</p>}
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-medium text-slate-900">Work Logistics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxCard
                  label="I am able to travel to customer locations"
                  description="Check this if you provide mobile services"
                  {...register("can_travel")}
                  disabled={pending}
                />
                <CheckboxCard
                  label="I have my own tools/equipment"
                  description="Check this if customers do not need to provide tools"
                  {...register("has_tools")}
                  disabled={pending}
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save & Continue to Dashboard
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
