'use client'

import { Badge } from '@/components/ui/badge'
import { OrderCard } from './OrderCard'
import { cn } from '@/lib/utils'
import type { Order } from '@/types/order'

interface KanbanColumnProps {
  title: string
  status: string
  orders: Order[]
  count: number
  color: string
}

export function KanbanColumn({ title, orders, count, color }: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        "w-[clamp(240px,30vw,320px)]", // Responsive width 240px-320px
        "h-full",
        color // Apply status color to entire column
      )}
      style={{ scrollSnapAlign: 'start' }} // Snap to start of column via inline style
    >
      {/* Column Header */}
      <div
        className={cn(
          "flex items-center justify-between",
          "px-4 py-3",
          "border-b border-border"
        )}
        dir="rtl"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <Badge variant="secondary" className="text-sm">
          {count}
        </Badge>
      </div>

      {/* Scrollable Card Container */}
      <div
        className={cn(
          "flex-1",
          "overflow-y-auto overflow-x-hidden",
          "p-2 space-y-2" // 8px spacing between cards
        )}
      >
        {orders.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground" dir="rtl">
            אין הזמנות
          </div>
        ) : (
          orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  )
}
