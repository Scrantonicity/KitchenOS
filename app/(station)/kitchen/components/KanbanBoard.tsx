'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { KanbanColumn } from './KanbanColumn'
import type { Order } from '@/types/order'

interface KanbanBoardProps {
  orders: Order[]
}

const STATUS_COLUMNS = [
  { status: 'created' as const, title: 'נוצר', color: 'bg-[hsl(0,0%,95%)]' },
  { status: 'packing' as const, title: 'באריזה', color: 'bg-[hsl(217,91%,95%)]' },
  { status: 'ready' as const, title: 'מוכן', color: 'bg-[hsl(25,95%,95%)]' },
  { status: 'collected' as const, title: 'נאסף', color: 'bg-[hsl(142,76%,95%)]' },
]

export function KanbanBoard({ orders }: KanbanBoardProps) {
  // Memoize filtered and sorted orders to prevent unnecessary re-renders
  const ordersByStatus = useMemo(() => {
    return STATUS_COLUMNS.map(({ status, title, color }) => {
      const filteredOrders = orders
        .filter(order => order.status === status)
        .sort((a, b) => new Date(a.pickup_time).getTime() - new Date(b.pickup_time).getTime())

      return {
        status,
        title,
        color,
        orders: filteredOrders,
        count: filteredOrders.length,
      }
    })
  }, [orders])

  return (
    <div
      className={cn(
        "flex flex-row",
        "overflow-x-auto overflow-y-hidden",
        "h-full w-full",
        "portrait:flex-row", // Ensure horizontal layout in portrait
        "landscape:hidden"   // Hide in landscape (warning overlay shows instead)
      )}
      style={{ scrollSnapType: 'x mandatory' }} // Scroll-snap via inline style for compatibility
    >
      {ordersByStatus.map(({ status, title, color, orders: filteredOrders, count }) => (
        <KanbanColumn
          key={status}
          title={title}
          status={status}
          orders={filteredOrders}
          count={count}
          color={color}
        />
      ))}
    </div>
  )
}
