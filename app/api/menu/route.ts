import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { dishSchema } from '@/lib/validation/schemas/dish-schema'
import type { Dish } from '@/lib/types/supabase'

/**
 * GET /api/menu
 *
 * Returns all active dishes ordered by name
 *
 * Response:
 * - 200: { data: Dish[] }
 * - 500: { error: { code: string, message: string } }
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Database error fetching dishes:', error)
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
    console.error('Unexpected error in GET /api/menu:', error)
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
 * POST /api/menu
 *
 * Creates a new dish
 *
 * Request body: { name, unit_type, price_per_unit, is_active? }
 *
 * Response:
 * - 201: { data: Dish }
 * - 400: { error: { code: 'VALIDATION_ERROR', details: ZodIssue[] } }
 * - 500: { error: { code: string, message: string } }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body with Zod
    const result = dishSchema.safeParse(body)
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

    const supabase = await createClient()

    // Insert validated data into database
    const { data, error } = await supabase
      .from('dishes')
      .insert(result.data)
      .select()
      .single()

    if (error) {
      console.error('Database error creating dish:', error)
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

    return NextResponse.json({ data }, { status: 201 })
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

    console.error('Unexpected error in POST /api/menu:', error)
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
