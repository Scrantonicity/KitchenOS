/**
 * Business hours utilities for KitchenOS
 *
 * Business hours: 8:30 AM - 1:00 PM (from architecture.md)
 * - Packing team: 6:00 AM - 8:30 AM
 * - Customer pickup: 8:30 AM - 1:00 PM
 */

export const BUSINESS_HOURS = {
  start: '08:30',
  end: '13:00',
} as const

/**
 * Check if a given datetime is within business hours (8:30 AM - 1:00 PM)
 * Note: 1:00 PM (13:00) is excluded - business hours end before 1:00 PM
 */
export function isWithinBusinessHours(datetime: Date): boolean {
  const hours = datetime.getHours()
  const minutes = datetime.getMinutes()
  const totalMinutes = hours * 60 + minutes

  // Convert business hours to minutes: 8:30 = 510, 13:00 = 780
  const startMinutes = 8 * 60 + 30 // 510
  const endMinutes = 13 * 60 // 780

  return totalMinutes >= startMinutes && totalMinutes < endMinutes
}

/**
 * Calculate default pickup time based on business hours
 *
 * Rules:
 * - If current time < 8:30 AM same day → default to 8:30 AM same day
 * - If current time >= 8:30 AM same day → default to 8:30 AM next day
 * - Round to next 15-minute interval
 */
export function calculateDefaultPickupTime(): Date {
  const now = new Date()
  const today830 = new Date(now)
  today830.setHours(8, 30, 0, 0)

  // If current time is before 8:30 AM today, use 8:30 AM today
  if (now < today830) {
    return roundToNext15Minutes(today830)
  }

  // Otherwise, use 8:30 AM next day
  const tomorrow830 = new Date(today830)
  tomorrow830.setDate(tomorrow830.getDate() + 1)
  return roundToNext15Minutes(tomorrow830)
}

/**
 * Round a date to the next 15-minute interval
 */
function roundToNext15Minutes(date: Date): Date {
  const result = new Date(date)
  const minutes = result.getMinutes()
  const roundedMinutes = Math.ceil(minutes / 15) * 15

  result.setMinutes(roundedMinutes)
  result.setSeconds(0)
  result.setMilliseconds(0)

  return result
}

/**
 * Format time for business hours warning message
 * Example: "14:00"
 */
export function formatTimeForWarning(datetime: Date): string {
  const hours = datetime.getHours().toString().padStart(2, '0')
  const minutes = datetime.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
