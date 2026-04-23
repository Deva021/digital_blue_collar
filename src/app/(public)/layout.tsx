import React from "react";
import { PublicHeader } from "@/components/layouts/public-header";
import { PublicFooter } from "@/components/layouts/public-footer";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader user={user} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
