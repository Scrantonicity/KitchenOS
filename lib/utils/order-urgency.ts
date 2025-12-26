/**
 * Determines if an order's pickup time is within 30 minutes from now
 * @param pickupTime ISO datetime string
 * @returns true if pickup is within 30 minutes and in the future
 */
export function isOrderUrgent(pickupTime: string): boolean {
  const now = new Date()
  const pickup = new Date(pickupTime)
  const diffMinutes = (pickup.getTime() - now.getTime()) / 1000 / 60

  // Within 30 minutes and in the future
  return diffMinutes <= 30 && diffMinutes > 0
}
