import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-muted-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error-500 focus-visible:ring-error-500",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {typeof error === 'string' && error.length > 0 && (
          <p className="mt-1 text-sm font-medium text-error-600">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
