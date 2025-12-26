'use client'

import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { isOrderUrgent } from '@/lib/utils/order-urgency'
import type { Order } from '@/types/order'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const isUrgent = isOrderUrgent(order.pickup_time)
  const pickupTimeFormatted = format(new Date(order.pickup_time), 'HH:mm', { locale: he })
  const itemCount = order.order_items?.length ?? 0 // API returns order_items (snake_case)

  return (
    <div
      className={cn(
        "flex flex-col",
        "min-h-[120px]", // Exceeds 44px touch target
        "p-4",
        "bg-card rounded-lg border",
        "cursor-pointer transition-all duration-150",
        "active:scale-95 active:shadow-sm",
        "hover:shadow-md hover:border-primary/50",
        isUrgent && "border-2 border-amber-500 bg-amber-50" // Urgency highlight
      )}
      dir="rtl"
    >
      {/* Order Number */}
      <div className="text-2xl font-bold mb-2">
        #{order.order_number}
      </div>

      {/* Customer Name */}
      <div className="text-lg mb-1">
        {order.customer_name}
      </div>

      {/* Pickup Time + Item Count */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>זמן איסוף: {pickupTimeFormatted}</span>
        <span>{itemCount} פריטים</span>
      </div>
    </div>
  )
}
