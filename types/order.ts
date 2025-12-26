export type OrderStatus = 'created' | 'packing' | 'ready' | 'collected'

export interface Order {
  id: string
  order_number: number
  customer_name: string
  customer_phone: string | null
  pickup_time: string
  status: OrderStatus
  source: 'manual' | 'whatsapp'
  notes: string | null
  created_at: string
  updated_at: string
  order_items: OrderItem[] // API returns snake_case from database
}

export interface OrderItem {
  id: string
  dish_id: string
  quantity: number
  dish: {
    name: string
    unit_type: 'unit' | 'weight'
    price_per_unit: number
  }
}
