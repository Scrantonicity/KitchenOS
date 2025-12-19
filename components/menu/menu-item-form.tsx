'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateMenuItem, useUpdateMenuItem } from '@/hooks/use-menu-items'
import { dishSchema } from '@/lib/validation/schemas/dish-schema'
import type { Dish } from '@/lib/types/supabase'
import type { z } from 'zod'

type DishFormValues = z.infer<typeof dishSchema>

interface MenuItemFormProps {
  defaultValues?: Dish
  onSuccess?: () => void
}

export function MenuItemForm({ defaultValues, onSuccess }: MenuItemFormProps) {
  const createMutation = useCreateMenuItem()
  const updateMutation = useUpdateMenuItem()
  const isEdit = !!defaultValues

  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: defaultValues || {
      name: '',
      unit_type: 'unit',
      price_per_unit: 0,
      is_active: true,
    },
  })

  const onSubmit = async (data: DishFormValues) => {
    if (isEdit && defaultValues) {
      updateMutation.mutate(
        { id: defaultValues.id, data },
        {
          onSuccess: () => {
            form.reset()
            onSuccess?.()
          },
        }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          form.reset()
          onSuccess?.()
        },
      })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">שם הפריט</FormLabel>
              <FormControl>
                <Input
                  placeholder="למשל: קובנה, חלה..."
                  {...field}
                  autoFocus
                  disabled={isSubmitting}
                  className="text-right"
                />
              </FormControl>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">סוג יחידה</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="בחר סוג יחידה" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unit">יחידה</SelectItem>
                  <SelectItem value="weight">משקל</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price_per_unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">מחיר ליחידה (₪)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="8.00"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? parseFloat(e.target.value) : 0)
                  }
                  disabled={isSubmitting}
                  className="text-right"
                />
              </FormControl>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-start pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'שומר...' : isEdit ? 'עדכן' : 'שמור'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
