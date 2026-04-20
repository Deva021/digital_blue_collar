import React from "react";
import { Container } from "@/components/layouts/container";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <Container className="py-12 md:py-20 max-w-3xl">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Contact Support</h1>
        <p className="text-lg text-muted-500">We are here to help resolve disputes or answer queries.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <EmptyState 
            title="Form Coming Soon" 
            description="Our direct integration system is currently being provisioned. Please email support@example.com directly." 
            className="border-0 bg-transparent"
          />
        </CardContent>
      </Card>
    </Container>
  );
}
