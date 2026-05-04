import { FileText } from 'lucide-react'

export const metadata = {
  title: 'Reports — Admin Dashboard',
}

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
        <FileText className="w-10 h-10 text-neutral-400" />
      </div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Reports & Analytics</h1>
      <p className="text-neutral-600 max-w-md mx-auto mb-8">
        This module is currently under development. In Phase 20, you will be able to generate detailed platform activity reports, financial summaries, and user growth analytics.
      </p>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 max-w-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Advanced reporting functionality was excluded from Phase 19 scope to prioritize dashboard foundation and structural visibility.
        </p>
      </div>
    </div>
  )
}
