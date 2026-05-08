import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface CheckboxCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

const CheckboxCard = React.forwardRef<HTMLInputElement, CheckboxCardProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative flex cursor-pointer items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-colors focus-within:ring-4 focus-within:ring-primary-500/20 focus-within:border-primary-500",
          props.checked || props.defaultChecked ? "border-primary-500 bg-primary-50/50" : "",
          props.disabled ? "cursor-not-allowed opacity-50 hover:border-slate-200" : "",
          className
        )}
      >
        <div className="flex h-5 items-center mt-0.5">
          <input
            type="checkbox"
            ref={ref}
            className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
            {...props}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-900">{label}</span>
          {description && (
            <span className="text-xs text-slate-500 mt-1">{description}</span>
          )}
        </div>
      </label>
    )
  }
)

CheckboxCard.displayName = "CheckboxCard"

export { CheckboxCard }
