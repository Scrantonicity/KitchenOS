import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateOrderSchema } from '@/lib/validation/schemas/order-schema'
import { z } from 'zod'

// UUID validation schema (from Story 1.2 learnings)
const uuidSchema = z.string().uuid()

/**
 * GET /api/orders/[id] - Get a single order with items
 *
 * Response: { data: OrderWithItems } | { error: { code, message } }
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate UUID parameter
    const uuidValidation = uuidSchema.safeParse(id)
    if (!uuidValidation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid order ID format',
          },
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          dish:dishes (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            error: {
              code: 'NOT_FOUND',
              message: 'Order not found',
            },
          },
          { status: 404 }
        )
      }

      console.error('Order fetch error:', error)
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch order',
            details: error.message,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: order })
  } catch (error) {
    console.error('Unexpected error in GET /api/orders/[id]:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/orders/[id] - Update an order
 *
 * Request body (partial):
 * {
 *   customer_name?: string
 *   customer_phone?: string
 *   pickup_time?: string
 *   status?: order_status
 *   notes?: string
 * }
 *
 * Response: { data: Order } | { error: { code, message } }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate UUID parameter
    const uuidValidation = uuidSchema.safeParse(id)
    if (!uuidValidation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid order ID format',
          },
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Parse and validate request body
    const body = await req.json()
    const validation = updateOrderSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      )
    }

    // Update order
    const { data: order, error } = await supabase
      .from('orders')
      .update(validation.data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            error: {
              code: 'NOT_FOUND',
              message: 'Order not found',
            },
          },
          { status: 404 }
        )
      }

      console.error('Order update error:', error)
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to update order',
            details: error.message,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: order })
  } catch (error) {
    console.error('Unexpected error in PATCH /api/orders/[id]:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/orders/[id] - Delete an order (hard delete)
 *
 * Response: { success: true } | { error: { code, message } }
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate UUID parameter
    const uuidValidation = uuidSchema.safeParse(id)
    if (!uuidValidation.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid order ID format',
          },
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Delete order (CASCADE will delete order_items automatically)
    const { error } = await supabase.from('orders').delete().eq('id', id)

    if (error) {
      console.error('Order delete error:', error)
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to delete order',
            details: error.message,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/orders/[id]:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    )
  }
}
