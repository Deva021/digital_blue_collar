import React from "react";
import { Container } from "@/components/layouts/container";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <Container className="py-12 md:py-24 max-w-4xl">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">About The Marketplace</h1>
        
        <div className="prose prose-slate max-w-none text-muted-500 space-y-6">
          <p className="text-lg leading-relaxed">
            The Digital Blue Collar Marketplace was constructed to formalize the informal service sector across Ethiopia. We identified an overwhelming gap between immense local talent and customer trust.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground pt-4">Our Mission</h2>
          <p className="leading-relaxed">
            Our mission is simple: to provide a secure, digital-first foundation that enables workers in agriculture, construction, and home services to build verifiable reputations while giving customers peace of mind.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground pt-4">Why Digital?</h2>
          <p className="leading-relaxed">
            Traditional word-of-mouth is powerful but inherently limited by geographical reach. By moving discovery to a digital platform, we democratize access to labor and opportunities without physical bias.
          </p>
        </div>
      </div>
    </Container>
  );
}
