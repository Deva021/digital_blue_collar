import React from "react";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-muted-50 border-b border-muted-200 py-24 lg:py-32">
        <Container className="text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto">
            Connecting <span className="text-primary-600">Skilled Workers</span> With Local Opportunities
          </h1>
          <p className="text-lg md:text-xl text-muted-500 max-w-2xl mx-auto">
            The Digital Blue Collar Marketplace enables trust, formalizes skills, and bridges the gap in the Ethiopian service sector.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/workers" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}>
              Hire a Professional
            </Link>
            <Link href="/jobs" className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:w-auto" })}>
              Find Work
            </Link>
          </div>
        </Container>
      </section>

      {/* Value Props Section */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose Our Marketplace?</h2>
            <p className="mt-4 text-muted-500 max-w-xl mx-auto">We provide the digital infrastructure needed to elevate blue collar services securely.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-8 space-y-4 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Verified Skills</h3>
                <p className="text-muted-500 text-sm">Workers go through verification, ensuring you hire trusted and capable professionals.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-8 space-y-4 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Local & Fast</h3>
                <p className="text-muted-500 text-sm">Find professionals directly in your area without needing extensive networks.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-8 space-y-4 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Secure Agreements</h3>
                <p className="text-muted-500 text-sm">Formalized digital agreements protect both the worker and the customer.</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20 text-white text-center rounded-t-3xl">
        <Container className="space-y-6">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-primary-100 max-w-xl mx-auto">Join thousands of verified workers and customers bringing reliability to the local sector.</p>
          <div className="pt-4">
            <Link href="/signup" className={buttonVariants({ size: "lg", variant: "secondary" })}>
              Create Free Account
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
