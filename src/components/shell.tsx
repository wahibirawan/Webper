import React from 'react';
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

export function Shell({
  as: Component = "div",
  className,
  children,
  ...props
}: ShellProps) {
  return (
    <Component
      className={cn(
        "grid items-center gap-8 pb-8 pt-6 md:py-8 container max-w-5xl mx-auto px-4 relative min-h-screen",
        className
      )}
      {...props}
    >
      {/* Retro Grid Background */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[#E8DCCA] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {children}
    </Component>
  )
}
