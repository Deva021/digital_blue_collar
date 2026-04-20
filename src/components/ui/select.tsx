import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string | boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <select
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border border-muted-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error-500 focus-visible:ring-error-500",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
        {/* Absolute chevron indicator acting as generic dropdown marker */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="h-4 w-4 text-muted-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {typeof error === 'string' && error.length > 0 && (
          <p className="mt-1 text-sm font-medium text-error-600">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
