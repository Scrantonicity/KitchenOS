import { z } from 'zod'

/**
 * Validation schema for dish creation and updates
 *
 * Rules:
 * - name: Hebrew dish name, 1-100 characters
 * - unit_type: Either 'unit' (countable) or 'weight' (sold by kg)
 * - price_per_unit: Positive number with max 2 decimal places
 * - is_active: Optional boolean, defaults to true
 *
 * All error messages in Hebrew for user-facing validation
 */
export const dishSchema = z.object({
  name: z
    .string()
    .min(1, 'שם הפריט הוא שדה חובה')
    .max(100, 'שם הפריט חייב להיות עד 100 תווים'),

  unit_type: z.enum(['unit', 'weight'], {
    message: 'יש לבחור סוג יחידה'
  }),

  price_per_unit: z
    .number({ message: 'מחיר חייב להיות מספר' })
    .positive('המחיר חייב להיות מספר חיובי')
    .multipleOf(0.01, 'המחיר יכול לכלול עד 2 ספרות אחרי הנקודה')
    .max(999999.99, 'המחיר גבוה מדי'),

  is_active: z
    .boolean()
    .default(true)
    .optional()
})

/**
 * Partial schema for PATCH updates (all fields optional)
 * Excludes system-managed timestamp fields to prevent manual manipulation
 */
export const dishUpdateSchema = dishSchema
  .partial()
  .omit({
    // Prevent manual timestamp manipulation - these are managed by database triggers
  })

/**
 * Type inference from schema
 */
export type DishSchemaType = z.infer<typeof dishSchema>
export type DishUpdateSchemaType = z.infer<typeof dishUpdateSchema>
