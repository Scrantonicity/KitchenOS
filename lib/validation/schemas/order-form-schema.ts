import { z } from 'zod'

/**
 * Client-side validation schema for order creation form
 *
 * Extends base schema from Story 1.4 with Hebrew error messages
 * Omits 'source' and 'items' fields (Story 1.5b will add)
 *
 * Error messages in Hebrew for client-side validation
 */

export const orderFormSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'שם לקוח חייב להכיל לפחות 2 תווים')
    .max(100, 'שם לקוח ארוך מדי')
    .transform((val) => val.trim()),

  customer_phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || val === '' || /^05\d{8}$/.test(val),
      'מספר טלפון חייב להיות בפורמט ישראלי (05XXXXXXXX)'
    ),

  pickup_time: z
    .string()
    .datetime('זמן איסוף חייב להיות בפורמט תקין')
    .refine((val) => new Date(val) > new Date(), 'זמן איסוף חייב להיות בעתיד'),

  notes: z
    .string()
    .max(500, 'הערות ארוכות מדי (מקסימום 500 תווים)')
    .optional()
    .or(z.literal('')),
})

export type OrderFormData = z.infer<typeof orderFormSchema>
