'use client'

import { useQuery } from '@tanstack/react-query'
import type { Order } from '@/types/order'

const REFRESH_INTERVAL = parseInt(
  process.env.NEXT_PUBLIC_ORDER_REFRESH_INTERVAL || '5000',
  10
)

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const json = await response.json()
      return json.data // API wraps orders in { data: Order[] }
    },
    refetchInterval: REFRESH_INTERVAL,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true, // Ensure fresh data when component mounts
  })
}
