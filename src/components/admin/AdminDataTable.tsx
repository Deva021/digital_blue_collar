interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
}

interface AdminDataTableProps<T extends object> {
  data: T[]
  columns: Column<T>[]
  emptyMessage?: string
  emptyDescription?: string
}

function getCellValue<T extends object>(row: T, key: keyof T | string): React.ReactNode {
  return String((row as Record<string, unknown>)[key as string] ?? '—')
}

export default function AdminDataTable<T extends object>({
  data,
  columns,
  emptyMessage = 'No records found',
  emptyDescription = 'There is no data to display at this time.',
}: AdminDataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-7 h-7 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
            </svg>
          </div>
          <p className="text-base font-semibold text-neutral-700">{emptyMessage}</p>
          <p className="mt-1 text-sm text-neutral-400">{emptyDescription}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-neutral-50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-3 text-sm text-neutral-700 whitespace-nowrap max-w-xs truncate"
                  >
                    {col.render ? col.render(row) : getCellValue(row, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50">
        <p className="text-xs text-neutral-400">
          Showing {data.length} record{data.length !== 1 ? 's' : ''}
          {data.length === 100 ? ' (limited to 100 — pagination coming in Phase 20)' : ''}
        </p>
      </div>
    </div>
  )
}
