"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function PublicHeader({ user }: { user?: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-muted-200 bg-white/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center text-white font-bold tracking-tighter">
                BC
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight hidden sm:block">
                Blue Collar Market
              </span>
            </Link>
            
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-500">
              <Link href="/workers" className="hover:text-primary-600 transition-colors">Find Workers</Link>
              <Link href="/jobs" className="hover:text-primary-600 transition-colors">Find Jobs</Link>
              <Link href="/categories" className="hover:text-primary-600 transition-colors">Categories</Link>
              <Link href="/how-it-works" className="hover:text-primary-600 transition-colors">How it works</Link>
            </nav>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <button onClick={handleSignOut} className="text-sm font-bold text-muted-500 hover:text-foreground transition-colors mr-2">
                  Sign out
                </button>
                <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "gap-2" })}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profile
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 border-r border-muted-200 pr-4 mr-4">
                  <Link href="/login" className="text-sm font-bold text-muted-500 hover:text-foreground transition-colors">
                    Log in
                  </Link>
                </div>
                <Link href="/signup" className={buttonVariants()}>
                  Sign up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle & Direct Login/Signup */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <>
                <Link href="/dashboard" className={buttonVariants({ size: "sm", variant: "outline", className: "h-8 px-3 text-xs gap-1" })}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profile
                </Link>
                <button onClick={handleSignOut} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md focus:outline-none" aria-label="Sign out">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-muted-600 hover:text-foreground transition-colors mr-1">
                  Log in
                </Link>
                <Link href="/signup" className={buttonVariants({ size: "sm", variant: "primary", className: "h-8 px-3 text-xs" })}>
                  Sign up
                </Link>
              </>
            )}
            <button 
              className="p-1 text-muted-500 hover:bg-muted-100 rounded-md focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden sticky top-16 border-b border-muted-200 bg-white shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-6 space-y-6">
            <div className="flex flex-col space-y-4">
              <Link onClick={() => setMobileMenuOpen(false)} href="/workers" className="flex items-center p-2 text-base font-semibold text-foreground hover:bg-muted-50 rounded-md">Find Workers</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/jobs" className="flex items-center p-2 text-base font-semibold text-foreground hover:bg-muted-50 rounded-md">Find Jobs</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/categories" className="flex items-center p-2 text-base font-semibold text-foreground hover:bg-muted-50 rounded-md">Categories</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/how-it-works" className="flex items-center p-2 text-base font-semibold text-foreground hover:bg-muted-50 rounded-md">How it works</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/about" className="flex items-center p-2 text-base font-semibold text-foreground hover:bg-muted-50 rounded-md">About Us</Link>
            </div>
            
            <div className="border-t border-muted-200 pt-6">
              {user ? (
                 <div className="flex flex-col gap-3">
                   <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={buttonVariants({ variant: "outline", className: "w-full justify-center gap-2" })}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Profile Dashboard
                  </Link>
                  <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="w-full text-sm font-bold text-red-600 py-3 hover:bg-red-50 rounded-md transition-colors border border-red-100 bg-red-50/50">
                    Sign out securely
                  </button>
                 </div>
              ) : (
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className={buttonVariants({ className: "w-full justify-center" })}>
                  Sign up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
