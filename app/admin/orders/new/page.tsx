'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Form, FormField } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { orderFormSchema, type OrderFormData } from '@/lib/validation/schemas/order-form-schema'
import { calculateDefaultPickupTime } from '@/lib/utils/business-hours'
import { OrderFormCustomerDetails } from './components/OrderFormCustomerDetails'
import { PickupTimeSelector } from './components/PickupTimeSelector'

export default function NewOrderPage() {
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      pickup_time: calculateDefaultPickupTime().toISOString(),
      notes: '',
    },
  })

  const onSubmit = (data: OrderFormData) => {
    // TODO Story 1.5b: Call POST /api/orders with menu items
    console.log('Form submitted:', data)
  }

  return (
    <div dir="rtl" lang="he" className="container mx-auto max-w-[1200px] p-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link
          href="/admin"
          className="hover:text-foreground transition-colors"
        >
          ניהול
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/admin/orders"
          className="hover:text-foreground transition-colors"
        >
          הזמנות
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">הזמנה חדשה</span>
      </nav>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-right">הזמנה חדשה</h1>
        <p className="text-muted-foreground text-right mt-2">
          יצירת הזמנה ידנית עבור הזמנות טלפון ואימייל
        </p>
      </div>

      {/* Order Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Customer Details Section */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <OrderFormCustomerDetails form={form} />
          </div>

          {/* Pickup Time Section */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <FormField
              control={form.control}
              name="pickup_time"
              render={({ field, fieldState }) => (
                <PickupTimeSelector
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          {/* Menu Items Section - Placeholder for Story 1.5b */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-right mb-4">פריטים</h2>
            <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
              <p className="text-sm">בחירת פריטי תפריט תתווסף בסיפור 1.5b</p>
            </div>
          </div>

          {/* Submit Button - Placeholder for Story 1.5b */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (confirm('האם אתה בטוח שברצונך לבטל?')) {
                  form.reset()
                }
              }}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              disabled
              className="opacity-50 cursor-not-allowed"
              aria-label="שמור הזמנה - יתווסף בסיפור 1.5b"
            >
              שמור הזמנה (1.5b)
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
