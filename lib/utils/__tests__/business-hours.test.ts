import { describe, it, expect } from 'vitest'
import {
  BUSINESS_HOURS,
  isWithinBusinessHours,
  calculateDefaultPickupTime,
  formatTimeForWarning,
} from '../business-hours'

describe('business-hours utilities', () => {
  describe('BUSINESS_HOURS constant', () => {
    it('should have correct start and end times', () => {
      expect(BUSINESS_HOURS.start).toBe('08:30')
      expect(BUSINESS_HOURS.end).toBe('13:00')
    })
  })

  describe('isWithinBusinessHours', () => {
    it('should return true for times within business hours', () => {
      // 8:30 AM - start of business hours
      const time830 = new Date('2024-01-01T08:30:00')
      expect(isWithinBusinessHours(time830)).toBe(true)

      // 12:00 PM - middle of business hours
      const time1200 = new Date('2024-01-01T12:00:00')
      expect(isWithinBusinessHours(time1200)).toBe(true)

      // 12:59 PM - just before end
      const time1259 = new Date('2024-01-01T12:59:00')
      expect(isWithinBusinessHours(time1259)).toBe(true)
    })

    it('should return false for times before business hours', () => {
      // 8:29 AM - one minute before start
      const time829 = new Date('2024-01-01T08:29:00')
      expect(isWithinBusinessHours(time829)).toBe(false)

      // 7:00 AM - early morning
      const time7 = new Date('2024-01-01T07:00:00')
      expect(isWithinBusinessHours(time7)).toBe(false)

      // 1:00 AM - very early (edge case for string comparison bug fix)
      const time1am = new Date('2024-01-01T01:00:00')
      expect(isWithinBusinessHours(time1am)).toBe(false)
    })

    it('should return false for times after business hours', () => {
      // 1:00 PM (13:00) - exactly at end (excluded)
      const time13 = new Date('2024-01-01T13:00:00')
      expect(isWithinBusinessHours(time13)).toBe(false)

      // 2:00 PM - afternoon
      const time14 = new Date('2024-01-01T14:00:00')
      expect(isWithinBusinessHours(time14)).toBe(false)

      // 11:00 PM - night
      const time23 = new Date('2024-01-01T23:00:00')
      expect(isWithinBusinessHours(time23)).toBe(false)
    })
  })

  describe('calculateDefaultPickupTime', () => {
    it('should return 8:30 AM same day if before 8:30 AM', () => {
      // Mock current time to 7:00 AM
      const mockNow = new Date('2024-01-15T07:00:00')
      vi.setSystemTime(mockNow)

      const result = calculateDefaultPickupTime()
      expect(result.getHours()).toBe(8)
      expect(result.getMinutes()).toBe(30)
      expect(result.getDate()).toBe(15) // Same day

      vi.useRealTimers()
    })

    it('should return 8:30 AM next day if at or after 8:30 AM', () => {
      // Mock current time to 10:00 AM
      const mockNow = new Date('2024-01-15T10:00:00')
      vi.setSystemTime(mockNow)

      const result = calculateDefaultPickupTime()
      expect(result.getHours()).toBe(8)
      expect(result.getMinutes()).toBe(30)
      expect(result.getDate()).toBe(16) // Next day

      vi.useRealTimers()
    })

    it('should round to next 15-minute interval', () => {
      // Mock current time to 8:23 AM (should round to 8:30 AM today)
      const mockNow = new Date('2024-01-15T08:23:00')
      vi.setSystemTime(mockNow)

      const result = calculateDefaultPickupTime()
      expect(result.getMinutes()).toBe(30) // Rounded to 30

      vi.useRealTimers()
    })
  })

  describe('formatTimeForWarning', () => {
    it('should format time as HH:mm', () => {
      const time = new Date('2024-01-01T14:30:00')
      expect(formatTimeForWarning(time)).toBe('14:30')
    })

    it('should pad single-digit hours and minutes', () => {
      const time = new Date('2024-01-01T09:05:00')
      expect(formatTimeForWarning(time)).toBe('09:05')
    })

    it('should handle midnight correctly', () => {
      const time = new Date('2024-01-01T00:00:00')
      expect(formatTimeForWarning(time)).toBe('00:00')
    })
  })
})
