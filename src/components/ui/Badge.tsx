import * as React from "react"
import { cn } from "@/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "outline" | "secondary";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-[#0F5C5C] text-white": variant === "default",
          "bg-[#1E8E5A]/10 text-[#1E8E5A]": variant === "success",
          "bg-[#F2A33A]/10 text-[#F2A33A]": variant === "warning",
          "bg-[#1B2A2F]/5 text-[#1B2A2F]": variant === "secondary",
          "border border-[#1B2A2F]/20 text-[#1B2A2F]/70": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}
