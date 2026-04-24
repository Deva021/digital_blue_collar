"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { customerProfileSchema, type CustomerProfileValues } from "@/lib/validations/customer";
import { upsertCustomerProfile } from "@/app/customer/actions";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CustomerProfileFormProps {
  initialData?: {
    location_text?: string | null;
  };
}

export function CustomerProfileForm({ initialData }: CustomerProfileFormProps) {
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: {
      location_text: initialData?.location_text || "",
    },
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const response = await upsertCustomerProfile(data as CustomerProfileValues);
      if (!response.success) {
        if (response.errors) {
          for (const [key, value] of Object.entries(response.errors)) {
            setError(key as keyof CustomerProfileValues, { type: "server", message: value[0] });
          }
        } else {
          setError("root", { type: "server", message: response.message });
        }
      } else {
        setSuccessMsg("Customer profile saved successfully.");
        // If they were originally onboarding (no initialData), navigate manually to the dashboard
        if (!initialData) {
            router.push("/customer/dashboard");
        } else {
            router.refresh();
        }
      }
    });
  };

  const pending = isPending || isSubmitting;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Update Location" : "Create Customer Account"}</CardTitle>
        <CardDescription>
          {initialData 
            ? "Ensure your default location reflects your typical request area."
            : "Complete your basic customer details to unlock booking capabilities on the marketplace."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location_text">Default Location (e.g., Neighborhood, City)</Label>
              <Input 
                id="location_text"
                placeholder="e.g. CMC, Addis Ababa"
                {...register("location_text")}
                disabled={pending}
              />
              {errors.location_text && (
                  <p className="text-sm font-medium text-red-500">{errors.location_text.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3 pt-6 border-t border-slate-100 bg-slate-50 rounded-b-xl">
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
