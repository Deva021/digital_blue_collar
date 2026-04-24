import React from "react";
import { Badge, type BadgeVariant } from "@/components/ui/badge";

interface CategoryBadgeProps {
  name: string;
  variant?: BadgeVariant;
  className?: string;
}

export function CategoryBadge({ name, variant = "secondary", className }: CategoryBadgeProps) {
  return (
    <Badge variant={variant} className={className}>
      {name}
    </Badge>
  );
}
