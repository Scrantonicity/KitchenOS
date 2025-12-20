import { z } from 'zod'

/**
 * Validation schema for order creation and updates
 *
 * Rules:
 * - customer_name: Required, 2-100 characters
 * - customer_phone: Optional, Israeli format (05XXXXXXXX)
 * - pickup_time: Required, must be future time
 * - source: Required enum
 * - notes: Optional, max 500 characters
 * - items: Required array, min 1 item
 *
 * Error messages in English per architecture - client translates to Hebrew
 */

// Order item schema (for nested validation)
export const orderItemSchema = z.object({
  dish_id: z.string().uuid('Invalid dish ID'),
  quantity: z.number().int().positive('Quantity must be a positive number'),
})

// Create order schema
export const createOrderSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name is too long'),

  customer_phone: z
    .string()
    .regex(/^05\d{8}$/, 'Phone number must be Israeli format (05XXXXXXXX)')
    .optional()
    .or(z.literal('')),

  pickup_time: z
    .string()
    .datetime('Pickup time must be a valid datetime')
    .refine(
      (dateStr) => new Date(dateStr) > new Date(),
      'Pickup time must be in the future'
    ),

  source: z.enum(['whatsapp', 'manual', 'email', 'phone'], {
    message: 'Invalid order source',
  }),

  notes: z.string().max(500, 'Notes are too long (maximum 500 characters)').optional(),

  items: z
    .array(orderItemSchema)
    .min(1, 'Order must contain at least one item')
    .refine(
      (items) => {
        const dishIds = items.map((item) => item.dish_id)
        return dishIds.length === new Set(dishIds).size
      },
      'Cannot order the same item twice - change quantity instead'
    ),
})

// Update order schema (partial, excluding items array)
export const updateOrderSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name is too long')
    .optional(),

  customer_phone: z
    .string()
    .regex(/^05\d{8}$/, 'Phone number must be Israeli format (05XXXXXXXX)')
    .optional()
    .or(z.literal('')),

  pickup_time: z
    .string()
    .datetime('Pickup time must be a valid datetime')
    .refine(
      (dateStr) => new Date(dateStr) > new Date(),
      'Pickup time must be in the future'
    )
    .optional(),

  status: z
    .enum(['created', 'packing', 'ready', 'collected', 'cancelled', 'no_show'], {
      message: 'Invalid order status',
    })
    .optional(),

  notes: z.string().max(500, 'Notes are too long (maximum 500 characters)').optional(),
})

// Type inference
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
