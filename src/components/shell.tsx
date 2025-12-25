import React from 'react';
import { cn } from "@/lib/utils"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

export function Shell({ children, className }: ShellProps) {
  return (
    <div className={cn("min-h-screen flex flex-col relative bg-background", className)}>
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 md:py-12 relative z-10">
        {children}
      </main>
    </div>
  );
}
