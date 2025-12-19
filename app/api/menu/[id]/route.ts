import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { dishUpdateSchema } from '@/lib/validation/schemas/dish-schema'
import type { Dish } from '@/lib/types/supabase'

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/menu/[id]
 *
 * Updates an existing dish (partial update)
 *
 * Request body: { name?, unit_type?, price_per_unit?, is_active? }
 *
 * Response:
 * - 200: { data: Dish }
 * - 400: { error: { code: 'VALIDATION_ERROR', details: ZodIssue[] } }
 * - 404: { error: { code: 'NOT_FOUND', message: string } }
 * - 500: { error: { code: string, message: string } }
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await req.json()

    // Validate request body with Zod (partial schema for updates)
    const result = dishUpdateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            details: result.error.issues
          }
        },
        { status: 400 }
      )
    }

    // Check if there's anything to update
    if (Object.keys(result.data).length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No fields to update'
          }
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update dish in database
    const { data, error } = await supabase
      .from('dishes')
      .update(result.data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      // Check if it's a not found error
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            error: {
              code: 'NOT_FOUND',
              message: `Dish with id ${id} not found`
            }
          },
          { status: 404 }
        )
      }

      console.error('Database error updating dish:', error)
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: error.message
          }
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_JSON',
            message: 'Request body must be valid JSON'
          }
        },
        { status: 400 }
      )
    }

    console.error('Unexpected error in PATCH /api/menu/[id]:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/menu/[id]
 *
 * Soft deletes a dish by setting is_active to false
 * (This is not a hard delete from the database)
 *
 * Response:
 * - 200: { message: string, data: Dish }
 * - 404: { error: { code: 'NOT_FOUND', message: string } }
 * - 500: { error: { code: string, message: string } }
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const supabase = await createClient()

    // Soft delete: set is_active to false
    const { data, error } = await supabase
      .from('dishes')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      // Check if it's a not found error
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            error: {
              code: 'NOT_FOUND',
              message: `Dish with id ${id} not found`
            }
          },
          { status: 404 }
        )
      }

      console.error('Database error deleting dish:', error)
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: error.message
          }
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Dish deactivated successfully',
        data
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error in DELETE /api/menu/[id]:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      },
      { status: 500 }
    )
  }
}
