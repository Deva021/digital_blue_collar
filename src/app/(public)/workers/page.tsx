import React from "react";
import { Container } from "@/components/layouts/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Find Workers" };

const MOCK_WORKERS = [
  { id: "1", name: "Abebe B.", category: "Agriculture", role: "Farm Manager", rating: 4.8, reviews: 12, rate: "250 ETB / hr" },
  { id: "2", name: "Sara H.", category: "Home Services", role: "Electrician", rating: 4.9, reviews: 34, rate: "300 ETB / hr" },
  { id: "3", name: "Dawit M.", category: "Construction", role: "Mason", rating: 4.5, reviews: 8, rate: "Negotiable" },
  { id: "4", name: "Helen T.", category: "Home Services", role: "Housekeeper", rating: 5.0, reviews: 41, rate: "150 ETB / hr" },
];

export default function WorkersPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Verified Workers</h1>
          <p className="text-lg text-muted-500">Discover trusted professionals ready to start immediately.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_WORKERS.map((worker) => (
          <Card key={worker.id} className="flex flex-col">
            <CardContent className="pt-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold shrink-0">
                  {worker.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1 bg-warning-50 text-warning-600 px-2 py-0.5 rounded text-sm font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {worker.rating}
                </div>
              </div>
              
              <div className="space-y-1 mb-4 flex-1">
                <h3 className="font-semibold text-lg">{worker.name}</h3>
                <p className="text-muted-500 text-sm">{worker.role}</p>
              </div>

              <div className="space-y-4">
                <div><Badge variant="outline">{worker.category}</Badge></div>
                <div className="flex items-center justify-between border-t border-muted-200 pt-4">
                  <span className="text-sm font-medium text-foreground">{worker.rate}</span>
                  <span className="text-xs text-muted-500">({worker.reviews} reviews)</span>
                </div>
                <Button className="w-full" variant="secondary">View Profile</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
