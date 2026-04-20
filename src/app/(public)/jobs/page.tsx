import React from "react";
import { Container } from "@/components/layouts/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Find Jobs" };

const MOCK_JOBS = [
  { id: "1", title: "Need skilled plumber for leak", location: "Bole, Addis Ababa", category: "Home Services", type: "Fixed", price: "1500 ETB", posted: "2h ago" },
  { id: "2", title: "Farm workers needed for harvest", location: "Adama", category: "Agriculture", type: "Daily Rate", price: "300 ETB / day", posted: "5h ago" },
  { id: "3", title: "Mason required for wall repairs", location: "Lideta", category: "Construction", type: "Fixed", price: "Negotiable", posted: "1d ago" },
  { id: "4", title: "Delivery driver for 3 days", location: "Piassa", category: "Transportation", type: "Fixed", price: "2000 ETB total", posted: "1d ago" },
];

export default function JobsPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Available Jobs</h1>
          <p className="text-lg text-muted-500">Find real-world tasks posted locally by verified customers.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {MOCK_JOBS.map((job) => (
          <Card key={job.id} className="hover:border-primary-500 transition-colors">
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{job.category}</Badge>
                  <span className="text-xs text-muted-500">{job.posted}</span>
                </div>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {job.type}
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:w-48 shrink-0 border-t md:border-t-0 md:border-l border-muted-200 pt-4 md:pt-0 md:pl-6">
                <div className="text-right">
                  <span className="block text-lg font-bold text-foreground">{job.price}</span>
                </div>
                <Button>Apply Now</Button>
              </div>
              
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
