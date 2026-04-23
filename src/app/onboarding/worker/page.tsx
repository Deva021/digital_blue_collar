import { WorkerOnboardingForm } from "@/components/worker/worker-onboarding-form";

export const metadata = {
  title: "Worker Onboarding - Digital Blue Collar",
  description: "Set up your worker profile.",
};

export default function WorkerOnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome to the Platform
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Before you can start receiving jobs or communicating with customers, we need to know a little bit more about you.
          </p>
        </div>
        
        <WorkerOnboardingForm />
      </div>
    </main>
  );
}
