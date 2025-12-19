/**
 * Environment variable validation
 * Validates required environment variables at runtime with type safety
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
 * Validates URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validates Supabase key format (basic check)
 */
function isValidSupabaseKey(key: string): boolean {
  // Supabase keys are base64-encoded JWT tokens, should be reasonably long
  return key.length > 100 && !key.includes(' ')
}

/**
 * Validates and returns required environment variables
 * @param required - Array of required env var names
 * @returns Validated environment variables
 * @throws EnvValidationError if required vars are missing or invalid
 */
export function validateEnv(required: (keyof EnvVars)[]): EnvVars {
  const missing: string[] = []
  const invalid: string[] = []

  for (const key of required) {
    const value = process.env[key]

    if (!value) {
      missing.push(key)
      continue
    }

    // Validate URL format
    if (key === 'NEXT_PUBLIC_SUPABASE_URL' && !isValidUrl(value)) {
      invalid.push(`${key} (must be a valid HTTP/HTTPS URL)`)
    }

    // Validate key format
    if ((key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' || key === 'SUPABASE_SERVICE_ROLE_KEY') && !isValidSupabaseKey(value)) {
      invalid.push(`${key} (invalid format)`)
    }
  }

  if (missing.length > 0 || invalid.length > 0) {
    const isDev = process.env.NODE_ENV === 'development'
    const errors: string[] = []

    if (missing.length > 0) {
      errors.push(`Missing: ${missing.join(', ')}`)
    }
    if (invalid.length > 0) {
      errors.push(`Invalid: ${invalid.join(', ')}`)
    }

    const message = `Environment variable validation failed:\n${errors.join('\n')}`

    if (isDev) {
      throw new EnvValidationError(
        `${message}\n\nPlease check your .env.local file and ensure all required variables are set correctly.\nSee .env.example for reference.`
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
