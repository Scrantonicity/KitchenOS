'use client'

import { UseFormReturn } from 'react-hook-form'
import { Check, AlertCircle } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { OrderFormData } from '@/lib/validation/schemas/order-form-schema'

interface OrderFormCustomerDetailsProps {
  form: UseFormReturn<OrderFormData>
}

export function OrderFormCustomerDetails({
  form,
}: OrderFormCustomerDetailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-right mb-4">פרטי לקוח</h2>

      {/* Customer Name Field */}
      <FormField
        control={form.control}
        name="customer_name"
        render={({ field, fieldState }) => {
          const isValid = !fieldState.error && field.value && field.value.trim().length >= 2
          const isRequired = true

          return (
            <FormItem>
              <FormLabel className="text-right">שם לקוח</FormLabel>
              <div className="space-y-1">
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="הזן שם לקוח..."
                      {...field}
                      autoFocus
                      dir="rtl"
                      className={cn(
                        'w-full text-right',
                        isValid && isRequired && 'pr-10'
                      )}
                      aria-required="true"
                      aria-invalid={!!fieldState.error}
                    />
                  </FormControl>
                  {isValid && isRequired && (
                    <Check className="absolute left-3 top-3 h-4 w-4 text-green-600 animate-in fade-in duration-150" />
                  )}
                </div>
                {fieldState.error && (
                  <p
                    className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-150"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            </FormItem>
          )
        }}
      />

      {/* Customer Phone Field */}
      <FormField
        control={form.control}
        name="customer_phone"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="text-right">טלפון (אופציונלי)</FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Input
                  type="tel"
                  placeholder="05XXXXXXXX (אופציונלי)"
                  {...field}
                  dir="ltr"
                  className="w-full text-left"
                  aria-required="false"
                  aria-invalid={!!fieldState.error}
                />
              </FormControl>
              {fieldState.error && (
                <p
                  className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-150"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="h-4 w-4" />
                  {fieldState.error.message}
                </p>
              )}
            </div>
          </FormItem>
        )}
      />

      {/* Notes Field */}
      <FormField
        control={form.control}
        name="notes"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="text-right">הערות</FormLabel>
            <div className="space-y-1">
              <FormControl>
                <Textarea
                  placeholder="הערות להזמנה..."
                  {...field}
                  dir="rtl"
                  className="w-full text-right resize-none"
                  rows={3}
                  maxLength={500}
                  aria-required="false"
                  aria-invalid={!!fieldState.error}
                />
              </FormControl>
              {fieldState.error && (
                <p
                  className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-150"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="h-4 w-4" />
                  {fieldState.error.message}
                </p>
              )}
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
