import { describe, it, expect } from 'vitest'
import { orderFormSchema } from '../order-form-schema'

describe('orderFormSchema validation', () => {
  describe('customer_name', () => {
    it('should accept valid names', () => {
      const result = orderFormSchema.safeParse({
        customer_name: 'יוסי כהן',
        customer_phone: '',
        pickup_time: new Date(Date.now() + 86400000).toISOString(),
        notes: '',
      })
      expect(result.success).toBe(true)
    })

    it('should reject names shorter than 2 characters', () => {
      const result = orderFormSchema.safeParse({
        customer_name: 'א',
        customer_phone: '',
        pickup_time: new Date(Date.now() + 86400000).toISOString(),
        notes: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('2 תווים')
      }
    })

    it('should reject names longer than 100 characters', () => {
      const result = orderFormSchema.safeParse({
        customer_name: 'א'.repeat(101),
        customer_phone: '',
        pickup_time: new Date(Date.now() + 86400000).toISOString(),
        notes: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('ארוך מדי')
      }
    })

    it('should trim whitespace from customer name', () => {
      const result = orderFormSchema.safeParse({
        customer_name: '  יוסי כהן  ',
        customer_phone: '',
        pickup_time: new Date(Date.now() + 86400000).toISOString(),
        notes: '',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.customer_name).toBe('יוסי כהן')
      }
    })
  })

  describe('customer_phone', () => {
    it('should accept valid Israeli phone numbers', () => {
      const result = orderFormSchema.safeParse({
        customer_name: 'יוסי כהן',
        customer_phone: '0501234567',
        pickup_time: new Date(Date.now() + 86400000).toISOString(),
        notes: '',
      })
      expect(result.success).toBe(true)
    })

    it('should accept empty phone number (optional field)', () => {
      const result = orderFormSchema.safeParse({
        customer_name: 'יוסי כהן',
        customer_phone: '',
        pickup_time: new Date(Date.now() + 86400000).toISOString(),
        notes: '',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid phone formats', () => {
      const result = orderFormSchema.safeParse({
        customer_name: 'יוסי כהן',
        customer_phone: '123456',
        pickup_time: new Date(Date.now() + 86400000).toISOString(),
        notes: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('פורמט ישראלי')
      }
    })

    it('should reject phone numbers not starting with 05', () => {
      const result = orderFormSchema.safeParse({
        customer_name: 'יוסי כהן',
        customer_phone: '0221234567',
        pickup_time: new Date(Date.now() + 86400000).toISOString(),
        notes: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('pickup_time', () => {
    it('should accept future times', () => {
      const futureTime = new Date(Date.now() + 86400000) // Tomorrow
      const result = orderFormSchema.safeParse({
        customer_name: 'יוסי כהן',
        customer_phone: '',
        pickup_time: futureTime.toISOString(),
        notes: '',
      })
      expect(result.success).toBe(true)
    })

    it('should reject past times', () => {
      const pastTime = new Date(Date.now() - 86400000) // Yesterday
      const result = orderFormSchema.safeParse({
        customer_name: 'יוסי כהן',
        customer_phone: '',
        pickup_time: pastTime.toISOString(),
        notes: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('בעתיד')
      }
    })

    it('should reject invalid datetime format', () => {
      const result = orderFormSchema.safeParse({
        customer_name: 'יוסי כהן',
        customer_phone: '',
        pickup_time: 'not-a-date',
        notes: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('notes', () => {
    it('should accept valid notes', () => {
      const result = orderFormSchema.safeParse({
        customer_name: 'יוסי כהן',
        customer_phone: '',
        pickup_time: new Date(Date.now() + 86400000).toISOString(),
        notes: 'הערות חשובות להזמנה',
      })
      expect(result.success).toBe(true)
    })

    it('should accept empty notes (optional field)', () => {
      const result = orderFormSchema.safeParse({
        customer_name: 'יוסי כהן',
        customer_phone: '',
        pickup_time: new Date(Date.now() + 86400000).toISOString(),
        notes: '',
      })
      expect(result.success).toBe(true)
    })

    it('should reject notes longer than 500 characters', () => {
      const result = orderFormSchema.safeParse({
        customer_name: 'יוסי כהן',
        customer_phone: '',
        pickup_time: new Date(Date.now() + 86400000).toISOString(),
        notes: 'א'.repeat(501),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('500 תווים')
      }
    })
  })
})
