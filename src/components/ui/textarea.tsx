import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-500 hover:border-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error && "border-error-500 focus-visible:ring-error-500/20 focus-visible:border-error-500",
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
Textarea.displayName = "Textarea"

export { Textarea }
