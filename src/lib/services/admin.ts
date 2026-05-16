'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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
  inactiveCategories: number
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const [users, workers, customers, jobs, bookings, verifications, inactiveCategories] =
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
      supabase
        .from('service_categories')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', false),
    ])

  return {
    totalUsers: users.count ?? 0,
    totalWorkers: workers.count ?? 0,
    totalCustomers: customers.count ?? 0,
    totalJobs: jobs.count ?? 0,
    totalBookings: bookings.count ?? 0,
    pendingVerifications: verifications.count ?? 0,
    inactiveCategories: inactiveCategories.count ?? 0,
  }
}

// ─── Users ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  email: string
  is_admin: boolean
  is_banned: boolean
  banned_until: string | null
  created_at: string
  has_worker_profile: boolean
  has_customer_profile: boolean
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      is_admin,
      is_banned,
      banned_until,
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
    is_banned: u.is_banned,
    banned_until: u.banned_until,
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
  await requireAdmin()
  const supabase = createServiceRoleClient()

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

export async function toggleCategoryActive(categoryId: string, isActive: boolean) {
  await requireAdmin()

  if (!categoryId) {
    return { success: false, error: 'Category ID is required' }
  }

  const supabase = createServiceRoleClient()
  
  const { error } = await supabase
    .from('service_categories')
    .update({ is_active: isActive })
    .eq('id', categoryId)

  if (error) {
    console.error('toggleCategoryActive error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/categories')
  revalidatePath('/categories')
  
  return { success: true }
}

// ─── Jobs ──────────────────────────────────────────────────────────────────────

export interface AdminJob {
  id: string
  title: string
  status: string
  is_suspended: boolean
  suspension_reason: string | null
  budget_range: string | null
  location_text: string | null
  created_at: string
  customer_id: string
  category_name: string | null
}

export async function getAdminJobs(): Promise<AdminJob[]> {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('job_posts')
    .select(`
      id,
      title,
      status,
      is_suspended,
      suspension_reason,
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
    is_suspended: j.is_suspended,
    suspension_reason: j.suspension_reason,
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
  selfie_url: string | null
  admin_notes: string | null
  created_at: string
}

export async function getAdminVerifications(): Promise<AdminVerification[]> {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('verification_requests')
    .select('id, worker_id, status, document_url, selfie_url, admin_notes, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('getAdminVerifications error:', error)
    return []
  }

  // Generate signed URLs for the documents
  const verifications = await Promise.all((data || []).map(async (v) => {
    if (v.document_url && !v.document_url.startsWith('http')) {
      const { data: signed } = await supabase.storage
        .from('verification_documents')
        .createSignedUrl(v.document_url, 3600)
      if (signed) {
        v.document_url = signed.signedUrl
      }
    }
    if (v.selfie_url && !v.selfie_url.startsWith('http')) {
      const { data: signed } = await supabase.storage
        .from('verification_documents')
        .createSignedUrl(v.selfie_url, 3600)
      if (signed) {
        v.selfie_url = signed.signedUrl
      }
    }
    return v
  }))

  // Sort: pending first, then by date descending
  const sortedData = verifications.sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return sortedData
}

export async function reviewVerification(
  verificationId: string,
  decision: 'verified' | 'rejected',
  adminNotes: string
) {
  await requireAdmin()

  if (!verificationId) {
    return { success: false, error: 'Verification ID is required' }
  }

  if (!adminNotes || adminNotes.trim().length === 0) {
    return { success: false, error: 'Admin notes are required for this action' }
  }

  const supabase = createServiceRoleClient()

  // 1. Verify it's still pending
  const { data: existing, error: fetchError } = await supabase
    .from('verification_requests')
    .select('status')
    .eq('id', verificationId)
    .single()

  if (fetchError || !existing) {
    return { success: false, error: 'Verification request not found' }
  }

  if (existing.status !== 'pending') {
    return { success: false, error: 'This request has already been reviewed' }
  }

  // 2. Perform the update
  const { error: updateError } = await supabase
    .from('verification_requests')
    .update({
      status: decision,
      admin_notes: adminNotes.trim(),
    })
    .eq('id', verificationId)

  if (updateError) {
    console.error('reviewVerification update error:', updateError)
    return { success: false, error: updateError.message }
  }

  revalidatePath('/admin/verifications')
  revalidatePath('/admin')
  
  return { success: true }
}

export async function getAdminVerificationDetail(verificationId: string) {
  await requireAdmin()

  if (!verificationId) return null

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('verification_requests')
    .select('*')
    .eq('id', verificationId)
    .single()

  if (error || !data) {
    console.error('getAdminVerificationDetail error:', error)
    return null
  }

  return data
}

export async function banUser(userId: string, durationInDays: number | null, reason: string) {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  let bannedUntil = null
  if (durationInDays) {
    const d = new Date()
    d.setDate(d.getDate() + durationInDays)
    bannedUntil = d.toISOString()
  }

  const { error } = await supabase
    .from('users')
    .update({ is_banned: true, banned_until: bannedUntil, ban_reason: reason })
    .eq('id', userId)

  if (error) {
    console.error('banUser error:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/admin/users')
  return { success: true }
}

export async function unbanUser(userId: string) {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from('users')
    .update({ is_banned: false, banned_until: null, ban_reason: null })
    .eq('id', userId)

  if (error) {
    console.error('unbanUser error:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/admin/users')
  return { success: true }
}

export async function suspendJob(jobId: string, reason: string) {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from('job_posts')
    .update({ is_suspended: true, suspension_reason: reason })
    .eq('id', jobId)

  if (error) {
    console.error('suspendJob error:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/admin/jobs')
  return { success: true }
}

export async function unsuspendJob(jobId: string) {
  await requireAdmin()
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from('job_posts')
    .update({ is_suspended: false, suspension_reason: null })
    .eq('id', jobId)

  if (error) {
    console.error('unsuspendJob error:', error)
    return { success: false, error: error.message }
  }
  revalidatePath('/admin/jobs')
  return { success: true }
}
