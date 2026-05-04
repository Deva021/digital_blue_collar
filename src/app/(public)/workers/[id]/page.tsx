import { getPublicWorkerById } from "@/lib/services/search";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, MapPin, Calendar, Star, ShieldCheck } from "lucide-react";

interface WorkerProfilePageProps {
  params: {
    id: string;
  };
}

export default async function PublicWorkerProfilePage({ params }: WorkerProfilePageProps) {
  const { id } = await params;
  const worker = await getPublicWorkerById(id);

  if (!worker) {
    notFound();
  }

  const services = worker.worker_services || [];
  const categories = worker.worker_categories || [];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
      <Link
        href="/workers"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Search
      </Link>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {worker.full_name || 'Unnamed Worker'}
              </h1>
              {worker.verification_status === 'verified' && <VerifiedBadge />}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-500" />
                {worker.location_text || 'No location specified'}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                {worker.availability_status === 'available' ? (
                  <span className="text-emerald-700 font-medium">Available Now</span>
                ) : (
                  <span className="text-slate-500 capitalize">{worker.availability_status}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-medium text-slate-900">New (No reviews yet)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">About the Worker</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {worker.bio || "No biography provided."}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Service Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.length > 0 ? (
                categories.map((wc: any) => (
                  <Badge key={wc.category_id} variant="outline" className="bg-slate-50 border-slate-200">
                    {wc.service_categories?.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-slate-500 italic">No categories listed.</span>
              )}
            </div>
          </div>
        </div>

        <aside className="w-full md:w-80 space-y-6">
          <Card className="border-blue-100 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="text-lg">Book this Worker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Ready to get started? Book a direct service or request a quote.
              </p>
              <Link href={`/dashboard/bookings/new?worker_id=${worker.id}`} className="block">
                <Button className="w-full h-12 shadow-sm text-base">
                  Hire {worker.full_name?.split(' ')[0] || 'Worker'}
                </Button>
              </Link>
              <p className="text-[10px] text-center text-slate-400">
                Contact information is shared after booking confirmation for your security.
              </p>
            </CardContent>
          </Card>

          {worker.verification_status === 'verified' && (
            <Card className="border-emerald-100 bg-emerald-50/30">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg h-fit">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-emerald-900 text-sm">Verified Professional</h4>
                    <p className="text-xs text-emerald-700">
                      This worker has completed identity verification and background checks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      <div className="space-y-6 pt-8 border-t border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900">Offered Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.length > 0 ? (
            services.map((service: any) => (
              <Card key={service.id} className="hover:border-blue-200 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-bold">{service.service_categories?.name}</CardTitle>
                    {service.base_price && (
                      <span className="text-sm font-bold text-blue-600">
                        ETB {service.base_price}
                        {service.is_negotiable && <span className="text-[10px] text-slate-400 font-normal ml-1">(Negotiable)</span>}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 line-clamp-2">{service.description || "No service description."}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic">No specific services listed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
