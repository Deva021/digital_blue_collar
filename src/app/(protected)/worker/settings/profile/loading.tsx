import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
        <div className="h-4 w-96 bg-slate-100 rounded-lg"></div>
      </div>
      
      <Card className="w-full">
        <CardHeader className="space-y-2">
           <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
           <div className="h-4 w-72 bg-slate-100 rounded-md"></div>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="h-16 w-16 bg-slate-100 rounded-full mt-2"></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                 <div className="h-4 w-32 bg-slate-200 rounded"></div>
                 <div className="h-32 w-full bg-slate-100 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                 <div className="h-4 w-24 bg-slate-200 rounded"></div>
                 <div className="h-10 w-full bg-slate-100 rounded-md"></div>
              </div>
              <div className="space-y-2">
                 <div className="h-4 w-24 bg-slate-200 rounded"></div>
                 <div className="h-10 w-full bg-slate-100 rounded-md"></div>
              </div>
           </div>
        </CardContent>
        <CardFooter className="pt-6 border-t border-slate-100">
           <div className="h-10 w-32 bg-slate-200 rounded-md ml-auto"></div>
        </CardFooter>
      </Card>
    </div>
  );
}
