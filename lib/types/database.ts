/**
 * Database Type Helpers
 * Convenience types extracted from Supabase generated types
 */

import type { Database } from './supabase'

// Dishes (from Story 1.2)
export type Dish = Database['public']['Tables']['dishes']['Row']
export type DishInsert = Database['public']['Tables']['dishes']['Insert']
export type DishUpdate = Database['public']['Tables']['dishes']['Update']

// Orders (from Story 1.4)
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

// Order Items (from Story 1.4)
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update']

// ENUM types
export type OrderStatus = Database['public']['Enums']['order_status']
export type OrderSource = Database['public']['Enums']['order_source']

// Complex types for API responses
export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    dish: Dish
  })[]
}

export type CreateOrderRequest = {
  customer_name: string
  customer_phone?: string
  pickup_time: string
  source: OrderSource
  notes?: string
  items: {
    dish_id: string
    quantity: number
  }[]
}
