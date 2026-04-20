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
            "flex min-h-[80px] w-full rounded-md border border-muted-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
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
Textarea.displayName = "Textarea"

export { Textarea }
