import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ 
  className, 
  icon, 
  title, 
  description, 
  action, 
  ...props 
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-muted-200 rounded-lg bg-muted-50", 
        className
      )} 
      {...props}
    >
      {icon && (
        <div className="mb-4 text-muted-500 flex items-center justify-center h-12 w-12 rounded-full bg-muted-100">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-500 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
