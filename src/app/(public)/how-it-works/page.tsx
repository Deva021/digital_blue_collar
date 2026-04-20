import React from "react";
import { Container } from "@/components/layouts/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata = { title: "How It Works" };

export default function HowItWorksPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h1 className="text-4xl font-bold tracking-tight">How It Works</h1>
        <p className="text-lg text-muted-500">Everything you need to know about finding work or hiring professionals safely.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Customer Flow */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary-600 mb-6">For Customers</h2>
          
          <Card>
            <CardHeader><CardTitle>1. Post a Job or Search</CardTitle></CardHeader>
            <CardContent className="text-muted-500">
              Easily describe the service you need or actively browse the marketplace for verified professionals in your proximity.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>2. Agree on Terms</CardTitle></CardHeader>
            <CardContent className="text-muted-500">
              Through the platform, finalize the exact payment expectations, timelines, and deliverables safely documented.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>3. Complete & Review</CardTitle></CardHeader>
            <CardContent className="text-muted-500">
              Once the job is completed safely, leave a verified review to help the worker build their reputation.
            </CardContent>
          </Card>
        </div>

        {/* Worker Flow */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-success-600 mb-6">For Workers</h2>
          
          <Card>
            <CardHeader><CardTitle>1. Create Your Profile</CardTitle></CardHeader>
            <CardContent className="text-muted-500">
              Sign up securely, list your verified skills, upload previous portfolios, and specify your rate parameters.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>2. Apply or Get Invited</CardTitle></CardHeader>
            <CardContent className="text-muted-500">
              Bid on actively posted customer jobs or accept direct invitations based on your highly-ranked profile.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>3. Work & Get Rated</CardTitle></CardHeader>
            <CardContent className="text-muted-500">
              Deliver excellent service to capture 5-star ratings which immediately boosts your discoverability for the next job.
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
