import React from "react";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-background overflow-hidden relative">
      
      {/* 
        HERO SECTION - Full bleed background leveraging the provided asset natively.
        Using a dark gradient overlay ensures text readability regardless of image contrast, 
        making the UI incredibly premium.
      */}
      <section 
        className="relative w-full h-[calc(100vh-4rem)] min-h-[600px] flex items-center bg-cover bg-center overflow-hidden pb-12"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      >
        {/* Absolute Gradients mapping contrast over the image deeply */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1e3f]/95 via-[#0a1e3f]/80 to-[#0a1e3f]/30 z-0" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-0" />

        <Container className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 drop-shadow-xl">
            Powering the Modern<br />
            <span className="text-primary-400">Blue-Collar Economy</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10 drop-shadow-md">
            Instantly connect with verified professionals or find local jobs across Ethiopia. Real skills, formal contracts, infinite trust.
          </p>

          {/* Premium Glassmorphism Search Component Widget mapped full-width */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-3 w-full w-full max-w-3xl flex flex-col md:flex-row gap-3 relative overflow-hidden">
             
             {/* Decorative shine effect */}
             <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

             <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  className="w-full bg-white/90 border border-transparent text-gray-900 rounded-2xl h-14 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder:text-gray-500 transition-all shadow-inner" 
                  placeholder="What service do you need?" 
                />
              </div>
              
              <div className="relative flex-1 md:max-w-[220px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  className="w-full bg-white/90 border border-transparent text-gray-900 rounded-2xl h-14 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder:text-gray-500 transition-all shadow-inner md:border-l md:border-l-gray-300 md:rounded-l-none md:rounded-r-2xl" 
                  placeholder="City or location" 
                />
              </div>

              <Link 
                href="/workers" 
                className={buttonVariants({ variant: "primary", className: "h-14 px-8 rounded-2xl shadow-lg bg-primary-600 hover:bg-primary-500 border border-primary-500 text-base" })}
              >
                Find Workers
              </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-sm font-medium text-white/80">
            <span className="opacity-70 text-xs uppercase tracking-wider mr-2">Top Categories:</span>
            <Link href="/categories" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full border border-white/10 backdrop-blur-sm">Construction</Link>
            <Link href="/categories" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full border border-white/10 backdrop-blur-sm">Agriculture</Link>
            <Link href="/categories" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full border border-white/10 backdrop-blur-sm">Plumbing</Link>
          </div>
        </Container>
      </section>

      {/* Trust & Scale Row mapped perfectly right over the bleed edge safely capturing white layout bounds */}
      <section className="bg-white pb-20 relative z-20">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 -mt-12">
            {[
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", title: "10,000+ Verified", sub: "Workers ready to hire" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Safe & Secure", sub: "Mandatory skill checks" },
              { icon: "M3 21v-4m22 4v-4m-3.1-2l1.4-1.4m-18 1.4L3.9 13.6M12 3v4m5.7 1.3l1.4-1.4M6.3 8.3L4.9 6.9M12 21a9 9 0 110-18 9 9 0 010 18z", title: "Instant Access", sub: "Based on proximity" },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Digital Payments", sub: "Clear traceable scopes" }
            ].map((prop, i) => (
              <Card key={i} className="bg-white border border-gray-100 shadow-xl shadow-gray-200/40 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={prop.icon} /></svg>
                </div>
                <h4 className="text-gray-900 font-bold mb-1">{prop.title}</h4>
                <p className="text-gray-500 text-sm">{prop.sub}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Workflow Information Section cleanly embedded mapped into the Light Layout Theme */}
      <section className="bg-gray-50 py-24 border-y border-gray-100">
        <Container>
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-primary-600 font-bold tracking-wide uppercase text-sm">Empowering Local Trades</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">How the Marketplace Works</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-10">
              {[
                { step: "01", title: "Search Instantly", desc: "Type in your required service and your local neighborhood area to instantly surface matching professionals." },
                { step: "02", title: "Review Core Skills", desc: "View completely verified portfolios, government ID validations, and aggregated ratings directly generated by actual customers." },
                { step: "03", title: "Hire Securely", desc: "Establish explicit digital contracts ensuring scopes are defined and guaranteed prior to work beginning locally." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="shrink-0 w-14 h-14 rounded-full border-2 border-primary-100 bg-white shadow-sm flex items-center justify-center text-primary-600 font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 relative">
               <div className="absolute -top-6 -right-6 w-24 h-24 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 rounded-full" aria-hidden="true" />
               <div className="space-y-6">
                  <div className="h-12 w-3/4 bg-gray-100 rounded-xl animate-pulse" />
                  <div className="h-24 w-full bg-gray-50 rounded-xl animate-pulse" />
                  <div className="flex gap-4">
                    <div className="h-10 w-24 bg-primary-100 rounded-lg animate-pulse" />
                    <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                  <div className="h-40 w-full bg-gray-50 rounded-xl animate-pulse mt-8 border border-gray-100" />
               </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Lower CTA explicitly driving signups back to the primary action path securely */}
      <section className="bg-primary-600 relative overflow-hidden py-24">
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-primary-900/50 to-transparent pointer-events-none" />
        <Container className="relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Ready to elevate your working standards?
            </h2>
            <p className="text-primary-100 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
              Join thousands of skilled workers defining modern reliability internally. Secure an account today completely independently.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
              <Link 
                href="/signup" 
                className={buttonVariants({ size: "lg", variant: "secondary", className: "w-full sm:w-auto h-14 px-10 border-transparent text-primary-700 bg-white hover:bg-gray-50 font-bold shadow-2xl" })}
              >
                Create Worker Account
              </Link>
            </div>
        </Container>
      </section>

    </div>
  );
}
