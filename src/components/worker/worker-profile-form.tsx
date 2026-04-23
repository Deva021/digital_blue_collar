"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UploadCloud } from "lucide-react";

import { workerProfileSchema, type WorkerProfileValues } from "@/lib/validations/worker";
import { upsertWorkerProfile } from "@/app/worker/actions";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

interface WorkerProfileFormProps {
  initialData: {
    bio?: string | null;
    location_text?: string | null;
    can_travel?: boolean | null;
    has_tools?: boolean | null;
    availability_status?: string | null;
  };
}

export function WorkerProfileForm({ initialData }: WorkerProfileFormProps) {
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(workerProfileSchema),
    defaultValues: {
      bio: initialData.bio || "",
      location_text: initialData.location_text || "",
      can_travel: initialData.can_travel || false,
      has_tools: initialData.has_tools || false,
      availability_status: (initialData.availability_status as any) || "available",
    },
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const response = await upsertWorkerProfile(data as WorkerProfileValues);
      if (!response.success) {
        if (response.errors) {
          for (const [key, value] of Object.entries(response.errors)) {
            setError(key as keyof WorkerProfileValues, { type: "server", message: value[0] });
          }
        } else {
          setError("root", { type: "server", message: response.message });
        }
      } else {
        setSuccessMsg("Your worker profile has been successfully saved.");
        router.refresh();
      }
    });
  };

  const pending = isPending || isSubmitting;

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
          <CardDescription>
            Manage how you look to potential customers on the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {successMsg && (
            <div className="p-3 text-sm text-emerald-700 bg-emerald-100/50 border border-emerald-200 rounded-md">
              {successMsg}
            </div>
          )}
          {errors.root && (
            <div className="p-3 text-sm text-red-500 bg-red-100/50 border border-red-200 rounded-md">
              {errors.root.message}
            </div>
          )}

          {/* Profile Image Expectation/Placeholder */}
          <div className="space-y-2 pb-4 border-b border-slate-100">
             <Label>Profile Picture</Label>
             <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-400">
                   <UploadCloud size={24} />
                </div>
                <div className="text-sm text-slate-500">
                    <p>Image uploads will be available soon.</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
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
            
            <div className="space-y-2">
              <Label htmlFor="availability_status">Current Availability</Label>
              <Select id="availability_status" {...register("availability_status")} disabled={pending}>
                <option value="available">Available for work</option>
                <option value="busy">Busy / Fully Booked</option>
                <option value="offline">Offline / Paused</option>
              </Select>
              {errors.availability_status && <p className="text-sm text-red-500">{errors.availability_status.message}</p>}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-medium text-slate-900">Work Logistics</h4>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="can_travel" 
                  className="rounded border-slate-300 text-blue-600 shadow-sm focus:ring-blue-500 disabled:opacity-50"
                  {...register("can_travel")}
                  disabled={pending}
                />
                <Label htmlFor="can_travel" className="font-normal cursor-pointer">I am able to travel to customer locations</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="has_tools" 
                  className="rounded border-slate-300 text-blue-600 shadow-sm focus:ring-blue-500 disabled:opacity-50"
                  {...register("has_tools")}
                  disabled={pending}
                />
                <Label htmlFor="has_tools" className="font-normal cursor-pointer">I have my own tools/equipment</Label>
              </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3 pt-6 bg-slate-50/50 border-t border-slate-100 rounded-b-xl">
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Profile Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
