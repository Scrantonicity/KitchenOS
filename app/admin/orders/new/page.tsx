'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Form, FormField } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { orderFormSchema, type OrderFormData } from '@/lib/validation/schemas/order-form-schema'
import { calculateDefaultPickupTime } from '@/lib/utils/business-hours'
import { OrderFormCustomerDetails } from './components/OrderFormCustomerDetails'
import { PickupTimeSelector } from './components/PickupTimeSelector'
import { MenuItemSelector } from './components/MenuItemSelector'
import { OrderSummary } from './components/OrderSummary'

interface OrderItem {
  dish_id: string
  dish_name: string
  unit_type: 'unit' | 'weight'
  price_per_unit: number
  quantity: number
}

export default function NewOrderPage() {
  const [items, setItems] = useState<OrderItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      pickup_time: calculateDefaultPickupTime().toISOString(),
      notes: '',
    },
  })

  const handleAddItem = (dish: {
    id: string
    name: string
    unit_type: 'unit' | 'weight'
    price_per_unit: number
  }) => {
    setItems((prev) => {
      // Check if item already exists
      const existingIndex = prev.findIndex((item) => item.dish_id === dish.id)
      if (existingIndex >= 0) {
        // Increment quantity
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(999, updated[existingIndex].quantity + 1),
        }
        return updated
      }
      // Add new item with quantity 1
      return [
        ...prev,
        {
          dish_id: dish.id,
          dish_name: dish.name,
          unit_type: dish.unit_type,
          price_per_unit: dish.price_per_unit,
          quantity: 1,
        },
      ]
    })
  }

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.dish_id === dishId ? { ...item, quantity } : item
      )
    )
  }

  const handleRemoveItem = (dishId: string) => {
    setItems((prev) => prev.filter((item) => item.dish_id !== dishId))
  }

  const onSubmit = async (data: OrderFormData) => {
    // Validate at least one item
    if (items.length === 0) {
      toast.error('יש להוסיף לפחות פריט אחד להזמנה')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          pickup_time: data.pickup_time,
          notes: data.notes || null,
          source: 'manual',
          items: items.map((item) => ({
            dish_id: item.dish_id,
            quantity: item.quantity,
          })),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const result = await response.json()

      toast.success('ההזמנה נוצרה בהצלחה', {
        description: `מספר הזמנה: ${result.order_number}`,
      })

      // Reset form and navigate to orders list after 2 seconds
      form.reset()
      setItems([])
      setTimeout(() => {
        router.push('/admin/orders')
      }, 2000)
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('שגיאה ביצירת הזמנה', {
        description: error instanceof Error ? error.message : 'אנא נסה שוב',
      })
    } finally {
      setIsSubmitting(false)
    }
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Form Column */}
            <div className="flex-1 space-y-8">
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

              {/* Menu Items Section */}
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-right mb-4">פריטים</h2>
                <div>
                  <label className="block text-sm font-medium text-right mb-2">
                    הוסף פריט מהתפריט
                  </label>
                  <MenuItemSelector onSelectItem={handleAddItem} />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 lg:hidden">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (confirm('האם אתה בטוח שברצונך לבטל?')) {
                      form.reset()
                      setItems([])
                      router.push('/admin/orders')
                    }
                  }}
                  disabled={isSubmitting}
                >
                  ביטול
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="שמור הזמנה חדשה"
                >
                  {isSubmitting ? 'שומר...' : 'שמור הזמנה'}
                </Button>
              </div>
            </div>

            {/* Sticky Sidebar (Desktop Only) */}
            <div className="lg:w-96">
              <div className="lg:sticky lg:top-6">
                <div className="bg-card border rounded-lg p-6 shadow-sm">
                  <OrderSummary
                    items={items}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                </div>

                {/* Submit Button (Desktop) */}
                <div className="hidden lg:flex justify-end gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (confirm('האם אתה בטוח שברצונך לבטל?')) {
                        form.reset()
                        setItems([])
                        router.push('/admin/orders')
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    ביטול
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="שמור הזמנה חדשה"
                  >
                    {isSubmitting ? 'שומר...' : 'שמור הזמנה'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
