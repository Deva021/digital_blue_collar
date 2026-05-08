"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkerServiceInput, workerServiceSchema } from "@/lib/validations/worker-service";
import { upsertWorkerService } from "@/app/(protected)/dashboard/services/actions";
import { CategoryWithChildren } from "@/lib/services/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CheckboxCard } from "@/components/ui/checkbox-card";
import { Info } from "lucide-react";

interface WorkerServiceFormProps {
  categories: CategoryWithChildren[];
  initialData?: WorkerServiceInput & { id: string };
  onSuccess?: () => void;
}

export function WorkerServiceForm({ categories, initialData, onSuccess }: WorkerServiceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WorkerServiceInput>({
    resolver: zodResolver(workerServiceSchema) as any,
    defaultValues: {
      id: initialData?.id || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      category_id: initialData?.category_id || "",
      is_negotiable: initialData?.is_negotiable ?? true,
      base_price: initialData?.base_price ?? "",
      is_active: initialData?.is_active ?? true,
    },
  });

  const isNegotiable = watch("is_negotiable");

  const onSubmit = (data: WorkerServiceInput) => {
    setGlobalError(null);
    startTransition(async () => {
      const formData = new FormData();
      if (data.id) formData.append("id", data.id);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category_id", data.category_id);
      formData.append("is_negotiable", String(data.is_negotiable));
      if (data.base_price) formData.append("base_price", String(data.base_price));
      formData.append("is_active", String(data.is_active));

      const result = await upsertWorkerService(formData);

      if (result.error) {
        setGlobalError(result.error);
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData?.id ? "Update Service" : "Create Service"}</CardTitle>
        <CardDescription>
          Define your service offering and set your pricing options.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {globalError && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {globalError}
            </div>
          )}

          <div className="space-y-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 border-b pb-2">Service Details</h4>

            {/* Service Title */}
        <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-semibold text-slate-900">
          Service Title
        </label>
        <Input
          id="title"
          placeholder="e.g. Professional Plumbing Repair"
          {...register("title")}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label htmlFor="category_id" className="text-sm font-semibold text-slate-900">
          Category
        </label>
        <Select
          id="category_id"
          {...register("category_id")}
          disabled={isPending}
        >
          <option value="" disabled>Select a category...</option>
          {categories.map((parent) => (
            <optgroup key={parent.id} label={parent.name}>
              <option value={parent.id}>{parent.name} (General)</option>
              {parent.children.map((child) => (
                <option key={child.id} value={child.id}>
                  -- {child.name}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
        {errors.category_id && <p className="text-xs text-red-500">{errors.category_id.message}</p>}
      </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-semibold text-slate-900">
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Describe your service in detail..."
            rows={5}
            {...register("description")}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="mt-6 p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-6">
        <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-200/50 pb-2">Pricing Details</h3>
        
        <CheckboxCard
          label="Price is negotiable (or quote based)"
          description="Allow customers to request custom quotes based on their specific needs"
          {...register("is_negotiable")}
          disabled={isPending}
        />

        {!isNegotiable && (
          <div className="space-y-2 pl-6 animate-in slide-in-from-top-2 fade-in duration-200">
            <label htmlFor="base_price" className="text-sm font-medium text-slate-700">
              Base Price (Required)
            </label>
            <div className="relative max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">$</span>
              <Input
                id="base_price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                {...register("base_price")}
                className={`pl-8 ${errors.base_price ? "border-red-500" : ""}`}
              />
            </div>
            {errors.base_price && <p className="text-xs text-red-500">{errors.base_price.message}</p>}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <CheckboxCard
          label="Make this service active immediately"
          description="Active services are visible to customers in search results"
          {...register("is_active")}
          disabled={isPending}
        />
      </div>
      </CardContent>

      {/* Active Toggle & Submit */}
      <CardFooter className="pt-6 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex justify-end">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto px-8">
          {isPending ? "Saving..." : (initialData?.id ? "Update Service" : "Create Service")}
        </Button>
      </CardFooter>
      </form>
    </Card>
  );
}
