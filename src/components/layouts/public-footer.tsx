import React from "react";
import Link from "next/link";
import { Container } from "@/components/layouts/container";

export function PublicFooter() {
  return (
    <footer className="border-t border-muted-200 bg-white">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold text-primary-600 tracking-tight">Blue Collar Market</h3>
            <p className="mt-4 text-sm text-muted-500 max-w-xs">
              Connecting trusted workers with local customers across Ethiopia for real-world tasks and services.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-muted-500">
              <li><Link href="/jobs" className="hover:text-primary-600 transition-colors">Browse Jobs</Link></li>
              <li><Link href="/workers" className="hover:text-primary-600 transition-colors">Find Workers</Link></li>
              <li><Link href="/categories" className="hover:text-primary-600 transition-colors">Categories</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary-600 transition-colors">How it works</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-500">
              <li><Link href="/about" className="hover:text-primary-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary-600 transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-primary-600 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-500">
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Trust & Safety</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-muted-200 flex flex-col md:flex-row items-center justify-between text-sm text-muted-500">
          <p>&copy; {new Date().getFullYear()} Blue Collar Marketplace for Ethiopia. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
