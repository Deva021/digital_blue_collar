import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="p-6 bg-white rounded-lg shadow-sm border space-y-4">
          <p className="text-muted-foreground">
            You are successfully authenticated.
          </p>
          <div className="bg-neutral-100 p-4 rounded-md">
            <code className="text-sm">{user.email}</code>
          </div>
          
          <form action={async () => {
            'use server'
            const supabase = await createClient()
            await supabase.auth.signOut()
            redirect('/login')
          }}>
            <Button type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
