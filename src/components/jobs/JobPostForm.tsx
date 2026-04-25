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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-slate-200">
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
        <select
          id="category_id"
          {...register("category_id")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
        </select>
        {errors.category_id && <p className="text-sm text-red-500">{errors.category_id.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register("description")}
          rows={5}
          placeholder="Describe the job in detail..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location_text">Location</Label>
        <Input id="location_text" {...register("location_text")} placeholder="E.g., Subcity, Addis Ababa" />
        {errors.location_text && <p className="text-sm text-red-500">{errors.location_text.message}</p>}
      </div>

      </div>

      <div className="space-y-6 pt-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b pb-2">Requirements & Budget</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="budget_range">Budget Estimate (Optional)</Label>
          <Input id="budget_range" {...register("budget_range")} placeholder="E.g., 2000-5000 ETB" />
          {errors.budget_range && <p className="text-sm text-red-500">{errors.budget_range.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="workers_needed">Workers Needed</Label>
          <Input id="workers_needed" type="number" min={1} {...register("workers_needed", { valueAsNumber: true })} />
          {errors.workers_needed && <p className="text-sm text-red-500">{errors.workers_needed.message}</p>}
        </div>
      </div>

        <div className="flex items-center space-x-2 pt-2 pb-4">
          <input 
            type="checkbox" 
            id="is_negotiable" 
            {...register("is_negotiable")}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="is_negotiable" className="font-normal cursor-pointer">Budget is negotiable</Label>
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto px-8">
          {isPending ? "Posting Job..." : "Post Job"}
        </Button>
      </div>
    </form>
  );
}
