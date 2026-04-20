import React from "react";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata = { title: "Categories" };

const MOCK_CATEGORIES = [
  { id: "1", title: "Agriculture", description: "Farm hands, crop management, and animal care.", count: 124 },
  { id: "2", title: "Construction", description: "Masons, daily laborers, and site prep workers.", count: 85 },
  { id: "3", title: "Home Services", description: "Plumbers, electricians, and cleaning staff.", count: 210 },
  { id: "4", title: "Transportation", description: "Drivers, delivery support, and logistics.", count: 64 },
];

export default function CategoriesPage() {
  return (
    <Container className="py-12 md:py-20">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Browse by Category</h1>
        <p className="text-lg text-muted-500">Find specialized skills mapped directly to local needs.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CATEGORIES.map((category) => (
          <Link key={category.id} href={`/workers?category=${category.id}`} className="group drop-shadow-sm hover:drop-shadow-md transition-all">
            <Card className="h-full border-muted-200 group-hover:border-primary-500 transition-colors">
              <CardHeader>
                <CardTitle className="group-hover:text-primary-600 transition-colors">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-500 mb-4">{category.description}</p>
                <div className="text-sm font-semibold text-foreground">
                  {category.count} Verified Workers
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
