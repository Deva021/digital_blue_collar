import React from "react";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { buttonVariants } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-muted-200 bg-white/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary-600 tracking-tight">
                Blue Collar Market
              </span>
            </Link>
            
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-500">
              <Link href="/workers" className="hover:text-foreground hover:underline transition-colors">Find Workers</Link>
              <Link href="/jobs" className="hover:text-foreground hover:underline transition-colors">Find Jobs</Link>
              <Link href="/categories" className="hover:text-foreground hover:underline transition-colors">Categories</Link>
              <Link href="/how-it-works" className="hover:text-foreground hover:underline transition-colors">How it works</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 border-r border-muted-200 pr-4 mr-4">
              <Link href="/login" className="text-sm font-medium text-muted-500 hover:text-foreground transition-colors">
                Log in
              </Link>
            </div>
            <Link href="/signup" className={buttonVariants()}>
              Sign up
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
