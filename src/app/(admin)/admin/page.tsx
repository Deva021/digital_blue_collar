import { getAdminOverviewStats } from '@/lib/services/admin'
import AdminStatCard from '@/components/admin/AdminStatCard'
import {
  Users,
  HardHat,
  UserCheck,
  Briefcase,
  CalendarCheck,
  ShieldAlert,
} from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard — Digital Blue Collar',
  description: 'Platform overview for administrators.',
}

export default async function AdminDashboardPage() {
  const stats = await getAdminOverviewStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-neutral-500">
          A high-level summary of platform activity. Read-only. Actions coming in Phase 20.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <AdminStatCard
          title="Total Users"
          value={stats.totalUsers}
          description="All registered accounts"
          accent="blue"
          icon={<Users className="w-6 h-6" />}
        />
        <AdminStatCard
          title="Workers"
          value={stats.totalWorkers}
          description="Users with worker profiles"
          accent="emerald"
          icon={<HardHat className="w-6 h-6" />}
        />
        <AdminStatCard
          title="Customers"
          value={stats.totalCustomers}
          description="Users with customer profiles"
          accent="violet"
          icon={<UserCheck className="w-6 h-6" />}
        />
        <AdminStatCard
          title="Total Jobs"
          value={stats.totalJobs}
          description="All job posts on the platform"
          accent="amber"
          icon={<Briefcase className="w-6 h-6" />}
        />
        <AdminStatCard
          title="Total Bookings"
          value={stats.totalBookings}
          description="All booking records"
          accent="blue"
          icon={<CalendarCheck className="w-6 h-6" />}
        />
        <AdminStatCard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          description="Awaiting admin review"
          accent="rose"
          icon={<ShieldAlert className="w-6 h-6" />}
        />
      </div>

      <div className="border border-neutral-200 rounded-xl bg-white p-5">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
          Quick Links
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Manage Users', href: '/admin/users' },
            { label: 'Manage Categories', href: '/admin/categories' },
            { label: 'View Jobs', href: '/admin/jobs' },
            { label: 'View Bookings', href: '/admin/bookings' },
            { label: 'Verification Queue', href: '/admin/verifications' },
            { label: 'Reports', href: '/admin/reports' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
