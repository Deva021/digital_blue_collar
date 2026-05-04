'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// ─── Guard helper ──────────────────────────────────────────────────────────────
// Every exported function calls this to ensure the caller is an admin.
async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (error || !data?.is_admin) redirect('/dashboard')

  return supabase
}

// ─── Overview Stats ────────────────────────────────────────────────────────────

export interface AdminOverviewStats {
  totalUsers: number
  totalWorkers: number
  totalCustomers: number
  totalJobs: number
  totalBookings: number
  pendingVerifications: number
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const supabase = await requireAdmin()

  const [users, workers, customers, jobs, bookings, verifications] =
    await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('worker_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('customer_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('job_posts').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase
        .from('verification_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
    ])

  return {
    totalUsers: users.count ?? 0,
    totalWorkers: workers.count ?? 0,
    totalCustomers: customers.count ?? 0,
    totalJobs: jobs.count ?? 0,
    totalBookings: bookings.count ?? 0,
    pendingVerifications: verifications.count ?? 0,
  }
}

// ─── Users ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  email: string
  is_admin: boolean
  created_at: string
  has_worker_profile: boolean
  has_customer_profile: boolean
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      is_admin,
      created_at,
      worker_profiles ( id ),
      customer_profiles ( id )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('getAdminUsers error:', error)
    return []
  }

  return (data ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    is_admin: u.is_admin,
    created_at: u.created_at,
    has_worker_profile: Array.isArray(u.worker_profiles)
      ? u.worker_profiles.length > 0
      : u.worker_profiles != null,
    has_customer_profile: Array.isArray(u.customer_profiles)
      ? u.customer_profiles.length > 0
      : u.customer_profiles != null,
  }))
}

// ─── Categories ────────────────────────────────────────────────────────────────

export interface AdminCategory {
  id: string
  name: string
  description: string | null
  is_active: boolean
  parent_id: string | null
  created_at: string
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('service_categories')
    .select('id, name, description, is_active, parent_id, created_at')
    .order('name', { ascending: true })

  if (error) {
    console.error('getAdminCategories error:', error)
    return []
  }

  return data ?? []
}

// ─── Jobs ──────────────────────────────────────────────────────────────────────

export interface AdminJob {
  id: string
  title: string
  status: string
  budget_range: string | null
  location_text: string | null
  created_at: string
  customer_id: string
  category_name: string | null
}

export async function getAdminJobs(): Promise<AdminJob[]> {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('job_posts')
    .select(`
      id,
      title,
      status,
      budget_range,
      location_text,
      created_at,
      customer_id,
      service_categories ( name )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('getAdminJobs error:', error)
    return []
  }

  return (data ?? []).map((j) => ({
    id: j.id,
    title: j.title,
    status: j.status,
    budget_range: j.budget_range,
    location_text: j.location_text,
    created_at: j.created_at,
    customer_id: j.customer_id,
    category_name: Array.isArray(j.service_categories)
      ? (j.service_categories[0]?.name ?? null)
      : ((j.service_categories as { name: string } | null)?.name ?? null),
  }))
}

// ─── Bookings ──────────────────────────────────────────────────────────────────

export interface AdminBooking {
  id: string
  status: string
  final_price: number | null
  scheduled_at: string
  created_at: string
  customer_id: string
  worker_id: string
}

export async function getAdminBookings(): Promise<AdminBooking[]> {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('bookings')
    .select('id, status, final_price, scheduled_at, created_at, customer_id, worker_id')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('getAdminBookings error:', error)
    return []
  }

  return data ?? []
}

// ─── Verification Requests ─────────────────────────────────────────────────────

export interface AdminVerification {
  id: string
  worker_id: string
  status: string
  document_url: string
  admin_notes: string | null
  created_at: string
}

export async function getAdminVerifications(): Promise<AdminVerification[]> {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('verification_requests')
    .select('id, worker_id, status, document_url, admin_notes, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('getAdminVerifications error:', error)
    return []
  }

  return data ?? []
}
