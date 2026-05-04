'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarCheck,
  ShieldCheck,
  FileText,
  ListTree
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: ListTree },
  { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Verification Queue', href: '/admin/verifications', icon: ShieldCheck },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-neutral-900 border-r border-neutral-800">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <span className="text-xl font-bold tracking-tight text-white">
              DBC Admin
            </span>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      isActive
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-300 hover:bg-neutral-700 hover:text-white',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white',
                        'mr-3 flex-shrink-0 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
