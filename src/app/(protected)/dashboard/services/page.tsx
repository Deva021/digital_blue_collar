import { getWorkerServices } from "@/lib/services/worker-services";
import { WorkerServiceCard } from "@/components/worker/worker-service-card";
import Link from "next/link";
import { Plus, BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My Services - Dashboard",
};

export default async function ServicesDashboardPage() {
  const services = await getWorkerServices();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Services</h1>
          <p className="text-slate-500 mt-1">Manage the jobs and services you offer to customers.</p>
        </div>
        <Link href="/dashboard/services/new">
          <Button className="flex items-center gap-2">
            <Plus size={18} /> Add New Service
          </Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <BriefcaseBusiness size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No services listed yet</h2>
          <p className="text-slate-500 max-w-md mb-6">
            You haven't added any services yet. Create your first service to start receiving job requests and bookings from customers.
          </p>
          <Link href="/dashboard/services/new">
            <Button>Create your first service</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <WorkerServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
