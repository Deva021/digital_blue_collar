interface AdminStatCardProps {
  title: string
  value: number | string
  description?: string
  icon: React.ReactNode
  accent?: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet'
  className?: string
}

const accentMap: Record<NonNullable<AdminStatCardProps['accent']>, { bg: string; text: string; ring: string }> = {
  blue:    { bg: 'bg-blue-50',   text: 'text-blue-600',   ring: 'ring-blue-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  amber:   { bg: 'bg-amber-50',  text: 'text-amber-600',  ring: 'ring-amber-100' },
  rose:    { bg: 'bg-rose-50',   text: 'text-rose-600',   ring: 'ring-rose-100' },
  violet:  { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-100' },
}

export default function AdminStatCard({
  title,
  value,
  description,
  icon,
  accent = 'blue',
  className = '',
}: AdminStatCardProps) {
  const { bg, text, ring } = accentMap[accent]

  return (
    <div className={`relative bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${className}`}>
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 opacity-5 rounded-full bg-current" style={{ color: 'currentColor' }} />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-500 truncate">{title}</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900 tabular-nums">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-neutral-400">{description}</p>
          )}
        </div>
        <div className={`flex-shrink-0 ml-4 flex items-center justify-center w-12 h-12 rounded-lg ring-1 ${bg} ${text} ${ring}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
