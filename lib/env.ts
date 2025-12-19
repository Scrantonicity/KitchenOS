/**
 * Environment variable validation
 * Validates required environment variables at runtime
 * Throws descriptive errors in development, fails gracefully in production
 */

type EnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY?: string // Optional - only needed for admin operations
}

class EnvValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvValidationError'
  }
}

/**
 * Validates and returns required environment variables
 * @param required - Array of required env var names
 * @returns Validated environment variables
 * @throws EnvValidationError if required vars are missing
 */
export function validateEnv(required: (keyof EnvVars)[]): EnvVars {
  const missing: string[] = []

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    const isDev = process.env.NODE_ENV === 'development'
    const message = `Missing required environment variables: ${missing.join(', ')}`

    if (isDev) {
      throw new EnvValidationError(
        `${message}\n\nPlease check your .env.local file and ensure all required variables are set.\nSee .env.example for reference.`
      )
    } else {
      throw new EnvValidationError(message)
    }
  }

  return process.env as unknown as EnvVars
}

/**
 * Get validated Supabase public environment variables
 */
export function getSupabaseEnv() {
  return validateEnv(['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'])
}

/**
 * Get validated Supabase admin environment variables
 */
export function getSupabaseAdminEnv() {
  return validateEnv([
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ])
}
