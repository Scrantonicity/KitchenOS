import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { dishSchema } from '@/lib/validation/schemas/dish-schema'
import type { Dish } from '@/lib/types/supabase'

/**
 * Sanitizes error messages for production
 */
function sanitizeErrorMessage(message: string): string {
  if (process.env.NODE_ENV === 'production') {
    return 'Database operation failed'
  }
  return message
}

/**
 * GET /api/menu
 *
 * Returns all active dishes ordered by name
 * Supports pagination via query params: ?limit=100&offset=0
 *
 * Query params:
 * - limit: Maximum number of records to return (default: 100, max: 1000)
 * - offset: Number of records to skip (default: 0)
 *
 * Response:
 * - 200: { data: Dish[], pagination: { limit, offset, total } }
 * - 400: { error: { code: 'INVALID_PAGINATION', message: string } }
 * - 500: { error: { code: string, message: string } }
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Parse pagination parameters
    const searchParams = req.nextUrl.searchParams
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')

    const limit = limitParam ? parseInt(limitParam, 10) : 100
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0

    // Validate pagination parameters
    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_PAGINATION',
            message: 'Limit must be between 1 and 1000'
          }
        },
        { status: 400 }
      )
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_PAGINATION',
            message: 'Offset must be 0 or greater'
          }
        },
        { status: 400 }
      )
    }

    // Get total count for pagination metadata
    const { count } = await supabase
      .from('dishes')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Fetch paginated data
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .eq('is_active', true)
      .order('name')
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error fetching dishes:', error)
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: sanitizeErrorMessage(error.message)
          }
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        data,
        pagination: {
          limit,
          offset,
          total: count ?? 0
        }
      },
      { status: 200 }
    )
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
      // Check for specific database error codes

      // 23505 = unique violation (duplicate entry)
      if (error.code === '23505') {
        return NextResponse.json(
          {
            error: {
              code: 'DUPLICATE_ENTRY',
              message: 'A dish with this name already exists'
            }
          },
          { status: 400 }
        )
      }

      // 23514 = check constraint violation
      if (error.code === '23514') {
        return NextResponse.json(
          {
            error: {
              code: 'CONSTRAINT_VIOLATION',
              message: 'Invalid data: check constraint failed'
            }
          },
          { status: 400 }
        )
      }

      // Generic database error
      console.error('Database error creating dish:', error)
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: sanitizeErrorMessage(error.message)
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
