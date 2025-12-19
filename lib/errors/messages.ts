/**
 * Hebrew Error Message Translations
 * Maps English error codes from API responses to user-friendly Hebrew messages
 *
 * Pattern: API returns English codes → Client translates to Hebrew
 * This supports future i18n without changing APIs
 */

export const hebrewErrorMessages: Record<string, string> = {
  // API Error Codes (from backend responses)
  'VALIDATION_ERROR': 'שגיאה באימות נתונים. אנא בדוק את הפרטים שהזנת.',
  'DATABASE_ERROR': 'שגיאה בשמירת הנתונים. אנא נסה שוב.',
  'NOT_FOUND': 'הפריט לא נמצא במערכת.',
  'NETWORK_ERROR': 'בעיית תקשורת עם השרת. אנא בדוק את החיבור לאינטרנט.',

  // Form Validation Error Messages
  'name_required': 'שם הפריט הוא שדה חובה',
  'unit_type_required': 'יש לבחור סוג יחידה',
  'price_required': 'מחיר הוא שדה חובה',
  'price_positive': 'המחיר חייב להיות מספר חיובי',
  'price_decimals': 'המחיר יכול לכלול עד 2 ספרות אחרי הנקודה',
}

/**
 * Translates an English error code to Hebrew message
 * @param code - Error code from API or validation
 * @returns Hebrew error message for user display
 */
export function translateError(code: string): string {
  return hebrewErrorMessages[code] || 'שגיאה כללית. אנא נסה שוב.'
}
