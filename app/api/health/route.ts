import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Health check endpoint
 * Tests database connectivity by executing a simple query
 *
 * Note: This uses pg_catalog.pg_tables which exists in all PostgreSQL databases
 * and doesn't require any app-specific tables to be created yet.
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Test actual database connection with a query that will always work
    // pg_catalog.pg_tables is a system catalog that exists in all PostgreSQL databases
    const { data, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .limit(1)

    if (error) {
      // Connection or auth failure
      return NextResponse.json({
        status: 'degraded',
        message: 'Supabase connection issue',
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      }, { status: 503 })
    }

    // Successfully connected and queried database
    return NextResponse.json({
      status: 'healthy',
      message: 'KitchenOS API is running',
      supabase: 'connected',
      database: 'accessible',
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    // Unexpected error (env vars missing, network issue, etc.)
    return NextResponse.json({
      status: 'unhealthy',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
