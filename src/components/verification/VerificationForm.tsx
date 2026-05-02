"use client";

import { useState, useTransition, useRef } from "react";
import { submitVerification } from "@/features/verification/actions/submitVerification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertCircle, Upload, CheckCircle2, FileText, Camera } from "lucide-react";

export function VerificationForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    // Basic client validation
    const document = formData.get("document") as File;
    if (!document || document.size === 0) {
      setError("Document is required.");
      return;
    }

    startTransition(async () => {
      const result = await submitVerification(null, formData);
      if (!result.success) {
        setError(result.error || "Failed to submit verification.");
      } else {
        setSuccess(true);
        formRef.current?.reset();
      }
    });
  };

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">Submission Successful</h3>
          <p className="text-green-700 max-w-sm">
            Your verification documents have been submitted and are now pending review. We will notify you once your status is updated.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Submit a valid ID document to receive a verified badge on your profile. Verified workers get up to 3x more bookings.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                Primary ID Document (Required)
              </Label>
              <div className="text-xs text-muted-foreground mb-2">
                Upload a clear picture of your National ID, Passport, or Kebele ID. Max 5MB.
              </div>
              <Input 
                id="document" 
                name="document" 
                type="file" 
                accept="image/jpeg,image/png,image/webp,application/pdf"
                disabled={isPending}
                required
                className="cursor-pointer file:text-sm file:font-medium"
              />
            </div>

            <div className="space-y-2 pt-2 border-t">
              <Label htmlFor="selfie" className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-slate-500" />
                Selfie with ID (Optional, Recommended)
              </Label>
              <div className="text-xs text-muted-foreground mb-2">
                A photo of you holding your ID next to your face helps speed up approval. Max 5MB.
              </div>
              <Input 
                id="selfie" 
                name="selfie" 
                type="file" 
                accept="image/jpeg,image/png,image/webp,application/pdf"
                disabled={isPending}
                className="cursor-pointer file:text-sm file:font-medium"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 px-6 py-4 border-t">
          <Button 
            type="submit" 
            className="w-full sm:w-auto ml-auto" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit Verification
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
