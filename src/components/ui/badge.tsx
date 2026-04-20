import * as React from "react"
import { cn } from "@/lib/utils/cn"

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

function getBadgeVariantClasses(variant: BadgeVariant): string {
  switch (variant) {
    case "default": return "border-transparent bg-primary-600 text-white"
    case "secondary": return "border-transparent bg-muted-100 text-foreground"
    case "destructive": return "border-transparent bg-error-600 text-white"
    case "success": return "border-transparent bg-success-500 text-white"
    case "warning": return "border-transparent bg-warning-500 text-white"
    case "outline": return "text-foreground border-muted-200"
    default: return ""
  }
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        getBadgeVariantClasses(variant),
        className
      )}
      {...props}
    />
  )
}

export { Badge }
