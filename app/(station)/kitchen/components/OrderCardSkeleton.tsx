'use client'

import { cn } from '@/lib/utils'

export function OrderCardSkeleton() {
  return (
    <div
      className={cn(
        "flex flex-col",
        "min-h-30", // 120px minimum height
        "p-4",
        "bg-card rounded-lg border",
        "animate-pulse"
      )}
    >
      {/* Order Number Skeleton */}
      <div className="h-8 w-16 bg-muted rounded mb-2" />

      {/* Customer Name Skeleton */}
      <div className="h-5 w-32 bg-muted rounded mb-1" />

      {/* Pickup Time + Item Count Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-4 w-16 bg-muted rounded" />
      </div>
    </div>
  )
}
