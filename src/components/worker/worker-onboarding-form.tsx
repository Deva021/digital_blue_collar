"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { workerProfileSchema, type WorkerProfileValues } from "@/lib/validations/worker";
import { upsertWorkerProfile } from "@/app/worker/actions";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
      bio: "",
      location_text: "",
      can_travel: false,
      has_tools: false,
      availability_status: "available",
    },
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const response = await upsertWorkerProfile(data as WorkerProfileValues);
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
        // Success redirect - immediately send them to fill out categories
        router.push("/worker/settings/profile");
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
              <Label htmlFor="bio">Professional Bio</Label>
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
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="can_travel" 
                  className="rounded border-slate-300 text-blue-600 shadow-sm focus:ring-blue-500"
                  {...register("can_travel")}
                  disabled={pending}
                />
                <Label htmlFor="can_travel" className="font-normal cursor-pointer">I am able to travel to customer locations</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="has_tools" 
                  className="rounded border-slate-300 text-blue-600 shadow-sm focus:ring-blue-500"
                  {...register("has_tools")}
                  disabled={pending}
                />
                <Label htmlFor="has_tools" className="font-normal cursor-pointer">I have my own tools/equipment</Label>
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
