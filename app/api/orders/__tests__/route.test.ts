/**
 * Tests for /api/orders endpoints
 * Story 1.4: Orders Database Schema and Manual Order Entry API
 */

import { POST, GET } from '../route'
import { NextRequest } from 'next/server'

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

describe('POST /api/orders', () => {
  it('creates order with valid data', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'order-123',
          order_number: 1,
          customer_name: 'ישראל ישראלי',
          pickup_time: '2025-12-25T10:00:00Z',
          status: 'created',
          source: 'manual',
        },
        error: null,
      }),
      eq: jest.fn().mockReturnThis(),
    }

    const { createClient } = require('@/lib/supabase/server')
    createClient.mockResolvedValue(mockSupabase)

    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: 'ישראל ישראלי',
        customer_phone: '0501234567',
        pickup_time: '2025-12-25T10:00:00Z',
        source: 'manual',
        items: [{ dish_id: 'dish-123', quantity: 2 }],
      }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.data).toBeDefined()
    expect(data.data.customer_name).toBe('ישראל ישראלי')
  })

  it('rejects invalid phone format', async () => {
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: 'ישראל ישראלי',
        customer_phone: '123',  // Invalid format
        pickup_time: '2025-12-25T10:00:00Z',
        source: 'manual',
        items: [{ dish_id: 'dish-123', quantity: 2 }],
      }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects past pickup time', async () => {
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: 'ישראל ישראלי',
        pickup_time: '2020-01-01T10:00:00Z',  // Past date
        source: 'manual',
        items: [{ dish_id: 'dish-123', quantity: 2 }],
      }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects order with no items', async () => {
    const req = new NextRequest('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: 'ישראל ישראלי',
        pickup_time: '2025-12-25T10:00:00Z',
        source: 'manual',
        items: [],  // Empty items array
      }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error.code).toBe('VALIDATION_ERROR')
  })
})

describe('GET /api/orders', () => {
  it('returns list of orders', async () => {
    const mockOrders = [
      {
        id: 'order-1',
        order_number: 1,
        customer_name: 'לקוח 1',
        status: 'created',
        order_items: [],
      },
      {
        id: 'order-2',
        order_number: 2,
        customer_name: 'לקוח 2',
        status: 'ready',
        order_items: [],
      },
    ]

    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockResolvedValue({
        data: mockOrders,
        error: null,
      }),
    }

    const { createClient } = require('@/lib/supabase/server')
    createClient.mockResolvedValue(mockSupabase)

    const req = new NextRequest('http://localhost/api/orders')
    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data).toHaveLength(2)
  })

  it('filters orders by status', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockResolvedValue({
        data: [{ id: 'order-1', status: 'ready' }],
        error: null,
      }),
    }

    const { createClient } = require('@/lib/supabase/server')
    createClient.mockResolvedValue(mockSupabase)

    const req = new NextRequest('http://localhost/api/orders?status=ready')
    await GET(req)

    expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'ready')
  })
})
