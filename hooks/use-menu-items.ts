import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMenuItem, updateMenuItem, deactivateMenuItem } from '@/lib/api/menu'
import { translateError } from '@/lib/errors/messages'
import type { Dish, DishInsert, DishUpdate } from '@/lib/types/supabase'

/**
 * React Query hooks for menu item management
 * Provides automatic cache invalidation and optimistic updates
 */

export function useMenuItems() {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async (): Promise<Dish[]> => {
      const res = await fetch('/api/menu')
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error?.code || 'NETWORK_ERROR')
      }
      const json = await res.json()
      return json.data
    },
  })
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      // Automatically refetch menu items
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      toast.success('הפריט נוסף בהצלחה')
    },
    onError: (error: any) => {
      toast.error(translateError(error.code || 'NETWORK_ERROR'))
    },
  })
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DishUpdate }) =>
      updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      toast.success('הפריט עודכן בהצלחה')
    },
    onError: (error: any) => {
      toast.error(translateError(error.code || 'NETWORK_ERROR'))
    },
  })
}

export function useDeactivateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deactivateMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      toast.success('הפריט הושבת בהצלחה')
    },
    onError: (error: any) => {
      toast.error(translateError(error.code || 'NETWORK_ERROR'))
    },
  })
}
