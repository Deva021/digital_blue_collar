import React from "react";
import { Container } from "@/components/layouts/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata = { title: "FAQ" };

export default function FAQPage() {
  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      <div className="space-y-8 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-500">Common questions about platform safety, payments, and trust.</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Is the platform free to use?</CardTitle></CardHeader>
          <CardContent className="text-muted-500">
            Yes, creating an account, browsing workers, and applying for jobs is completely free during this phase.
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>How are workers verified?</CardTitle></CardHeader>
          <CardContent className="text-muted-500">
            Workers provide national IDs and optionally upload certifications related to their trade areas to gain a Verified Badge.
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>How do payments work?</CardTitle></CardHeader>
          <CardContent className="text-muted-500">
            Currently, payments are conducted traditionally off-platform between the two parties, but formal agreements and receipts are tracked digitally.
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
