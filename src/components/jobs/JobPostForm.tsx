"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobPostSchema, JobPostFormValues } from "@/lib/validations/job";
import { createJobAction } from "@/lib/services/jobs";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CheckboxCard } from "@/components/ui/checkbox-card";
import { Info } from "lucide-react";
import type { CategoryWithChildren } from "@/lib/services/categories";

export function JobPostForm({ categories }: { categories: CategoryWithChildren[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobPostFormValues>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: "",
      description: "",
      category_id: "",
      location_text: "",
      budget_range: "",
      is_negotiable: false,
      workers_needed: 1,
    },
  });

  const onSubmit = (data: JobPostFormValues) => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        const res = await createJobAction(data);
        if (!res.success) {
          setErrorMsg(res.error || "Failed to create job posting");
          return;
        }
        router.push("/dashboard/jobs");
      } catch (err: any) {
        setErrorMsg("An unexpected server error occurred.");
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a Job Post</CardTitle>
        <CardDescription>
          Provide clear details to attract the best workers for your task.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm font-medium border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="space-y-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b pb-2">Job Description</h4>
            
            <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
        <Input id="title" {...register("title")} placeholder="E.g., Need experienced plumber for bathroom remodel" />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">Category</Label>
        <Select
          id="category_id"
          {...register("category_id")}
          disabled={isPending}
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <optgroup key={cat.id} label={cat.name}>
              <option value={cat.id}>{cat.name}</option>
              {cat.children?.map(sub => (
                <option key={sub.id} value={sub.id}>-- {sub.name}</option>
              ))}
            </optgroup>
          ))}
        </Select>
        {errors.category_id && <p className="text-sm text-red-500">{errors.category_id.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 mb-2">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
          <p className="text-sm">
            <strong>Tip:</strong> The more details you provide, the better quotes you will receive from workers.
          </p>
        </div>
        <Textarea
          id="description"
          {...register("description")}
          rows={5}
          placeholder="Describe the job in detail..."
          disabled={isPending}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location_text">Location</Label>
        <Input id="location_text" {...register("location_text")} placeholder="E.g., Subcity, Addis Ababa" />
        {errors.location_text && <p className="text-sm text-red-500">{errors.location_text.message}</p>}
      </div>

      </div>

      <div className="mt-6 p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-6">
        <h4 className="text-sm font-semibold text-slate-900 border-b border-slate-200/50 pb-2">Requirements & Budget</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="budget_range">Budget Estimate (Optional)</Label>
            <Input id="budget_range" {...register("budget_range")} placeholder="E.g., 2000-5000 ETB" disabled={isPending} />
            {errors.budget_range && <p className="text-sm text-red-500">{errors.budget_range.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workers_needed">Workers Needed</Label>
            <Input id="workers_needed" type="number" min={1} {...register("workers_needed", { valueAsNumber: true })} disabled={isPending} />
            {errors.workers_needed && <p className="text-sm text-red-500">{errors.workers_needed.message}</p>}
          </div>
        </div>

        <CheckboxCard
          label="Budget is negotiable"
          description="Check this if you are open to discussing the price"
          {...register("is_negotiable")}
          disabled={isPending}
        />
      </div>
      </CardContent>

      <CardFooter className="pt-6 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex justify-end">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto px-8">
          {isPending ? "Posting Job..." : "Post Job"}
        </Button>
      </CardFooter>
      </form>
    </Card>
  );
}
