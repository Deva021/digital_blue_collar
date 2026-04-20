import * as React from "react"
import { cn } from "@/lib/utils/cn"

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive"
export type ButtonSize = "default" | "sm" | "lg" | "icon"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

function getVariantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "primary": return "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800"
    case "secondary": return "bg-muted-100 text-foreground hover:bg-muted-200 active:bg-muted-300"
    case "outline": return "border border-muted-200 bg-white hover:bg-muted-50 text-foreground"
    case "ghost": return "hover:bg-muted-50 hover:text-foreground text-foreground"
    case "destructive": return "bg-error-600 text-white hover:bg-error-700 active:bg-error-800"
    default: return ""
  }
}

function getSizeClasses(size: ButtonSize): string {
  switch (size) {
    case "default": return "h-10 px-4 py-2"
    case "sm": return "h-9 rounded-md px-3 text-xs"
    case "lg": return "h-11 rounded-md px-8"
    case "icon": return "h-10 w-10"
    default: return ""
  }
}

export function buttonVariants({ variant = "primary", size = "default", className }: { variant?: ButtonVariant, size?: ButtonSize, className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    getVariantClasses(variant),
    getSizeClasses(size),
    className
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
