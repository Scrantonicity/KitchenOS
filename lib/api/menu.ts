import type { Dish, DishInsert, DishUpdate } from '@/lib/types/supabase'

/**
 * Client-side API wrapper for menu operations
 * Handles HTTP requests and error transformation
 */

export async function createMenuItem(data: DishInsert): Promise<Dish> {
  const res = await fetch('/api/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw {
      code: json.error?.code || 'NETWORK_ERROR',
      message: json.error?.message,
    }
  }

  return json.data
}

export async function updateMenuItem(id: string, data: DishUpdate): Promise<Dish> {
  const res = await fetch(`/api/menu/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw {
      code: json.error?.code || 'NETWORK_ERROR',
      message: json.error?.message,
    }
  }

  return json.data
}

export async function deactivateMenuItem(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/menu/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const json = await res.json()
    throw {
      code: json.error?.code || 'NETWORK_ERROR',
      message: json.error?.message,
    }
  }

  return { success: true }
}
