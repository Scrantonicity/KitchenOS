import { z } from 'zod'

/**
 * Validation schema for dish creation and updates
 *
 * Rules:
 * - name: Hebrew dish name, 1-100 characters
 * - unit_type: Either 'unit' (countable) or 'weight' (sold by kg)
 * - price_per_unit: Positive number with max 2 decimal places
 * - is_active: Optional boolean, defaults to true
 */
export const dishSchema = z.object({
  name: z
    .string()
    .min(1, 'Dish name is required')
    .max(100, 'Dish name must be at most 100 characters'),

  unit_type: z.enum(['unit', 'weight'], {
    errorMap: () => ({ message: 'Unit type must be either "unit" or "weight"' })
  }),

  price_per_unit: z
    .number()
    .positive('Price must be positive')
    .multipleOf(0.01, 'Price can have at most 2 decimal places')
    .max(999999.99, 'Price is too large'),

  is_active: z
    .boolean()
    .default(true)
    .optional()
})

/**
 * Partial schema for PATCH updates (all fields optional)
 */
export const dishUpdateSchema = dishSchema.partial()

/**
 * Type inference from schema
 */
export type DishSchemaType = z.infer<typeof dishSchema>
export type DishUpdateSchemaType = z.infer<typeof dishUpdateSchema>
