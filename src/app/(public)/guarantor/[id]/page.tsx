"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getGuarantorSubmission, submitGuarantorAction } from "@/lib/services/applications";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SignatureCanvas from "react-signature-canvas";

export default function GuarantorFormPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const signatureRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getGuarantorSubmission(params.id);
      setSubmission(data);
      setLoading(false);
    }
    loadData();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p>Loading...</p></div>;
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Invalid Link</CardTitle>
            <CardDescription>This link is invalid or has expired.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (submission.status !== 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="text-emerald-700">Already Submitted</CardTitle>
            <CardDescription>Thank you! Your guarantor documents have already been successfully submitted.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    if (signatureRef.current?.isEmpty()) {
      setErrorMsg("Please provide your signature.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append('signature_data', signatureRef.current!.toDataURL());

    const result = await submitGuarantorAction(params.id, formData);
    if (!result.success) {
      setErrorMsg(result.error || "Failed to submit.");
      setSubmitting(false);
    } else {
      router.refresh(); // Will trigger re-render and show success message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Third Accountable Person (Guarantor) Form</CardTitle>
          <CardDescription>
            You have been requested to be a guarantor for a job application ({submission.job_applications?.job_posts?.title}). 
            Please provide your details below. This is a legally binding document.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-md border border-red-200">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Legal Name</Label>
              <Input id="full_name" name="full_name" required placeholder="Abebe Kebede" disabled={submitting} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fan_number">FAN</Label>
              <Input id="fan_number" name="fan_number" required placeholder="Enter your FAN number" disabled={submitting} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_file">Upload National ID Picture</Label>
              <Input id="id_file" name="id_file" type="file" accept="image/*" required disabled={submitting} />
            </div>

            <div className="space-y-2">
              <Label>Digital Signature</Label>
              <div className="border border-slate-200 rounded-md bg-white overflow-hidden">
                <SignatureCanvas 
                  ref={signatureRef} 
                  penColor="blue"
                  canvasProps={{ className: 'w-full h-40' }} 
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => signatureRef.current?.clear()}
                  disabled={submitting}
                >
                  Clear Signature
                </Button>
              </div>
            </div>
            
          </CardContent>
          <CardFooter className="bg-slate-50 border-t rounded-b-xl flex justify-end p-6">
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Submitting..." : "Submit Guarantor Agreement"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
