import * as React from "react"
import { cn } from "@/lib/utils/cn"

export type ToastVariant = "default" | "success" | "error" | "warning"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  title: string;
  description?: string;
  onClose?: () => void;
}

export function Toast({ className, variant = "default", title, description, onClose, ...props }: ToastProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full flex-col space-y-1 overflow-hidden rounded-md border p-4 pr-10 shadow-lg transition-all md:max-w-[420px]",
        variant === "default" && "border-muted-200 bg-white text-foreground",
        variant === "success" && "border-success-500 bg-success-50 text-success-600",
        variant === "error" && "border-error-500 bg-error-50 text-error-600",
        variant === "warning" && "border-warning-500 bg-warning-50 text-warning-600",
        className
      )}
      {...props}
    >
      <div className="text-sm font-semibold">{title}</div>
      {description && <div className="text-sm opacity-90">{description}</div>}
      
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
