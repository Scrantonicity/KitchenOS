'use client'

import { Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface OrderItem {
  dish_id: string
  dish_name: string
  unit_type: 'unit' | 'weight'
  price_per_unit: number
  quantity: number
}

interface OrderSummaryProps {
  items: OrderItem[]
  onUpdateQuantity: (dishId: string, quantity: number) => void
  onRemoveItem: (dishId: string) => void
}

export function OrderSummary({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: OrderSummaryProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * item.price_per_unit,
    0
  )

  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground" dir="rtl">
        טרם נוספו פריטים
      </div>
    )
  }

  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-lg font-semibold text-right">סיכום הזמנה</h3>

      {items.map((item) => (
        <div
          key={item.dish_id}
          className="relative border rounded-lg p-4 bg-card"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 h-6 w-6"
            onClick={() => onRemoveItem(item.dish_id)}
            aria-label={`הסר ${item.dish_name}`}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="mb-2 pr-8">
            <p className="font-medium text-right">{item.dish_name}</p>
            <p className="text-sm text-muted-foreground text-right">
              {item.unit_type === 'unit' ? 'יחידה' : 'משקל'}
            </p>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm text-muted-foreground">
              ₪{(item.quantity * item.price_per_unit).toFixed(2)}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={() =>
                onUpdateQuantity(
                  item.dish_id,
                  Math.min(999, item.quantity + 1)
                )
              }
              disabled={item.quantity >= 999}
              aria-label="הגדל כמות"
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Input
              type="number"
              min="1"
              max="999"
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                if (!isNaN(val) && val >= 1 && val <= 999) {
                  onUpdateQuantity(item.dish_id, val)
                }
              }}
              className="h-11 w-16 text-center"
              dir="ltr"
              aria-label="כמות"
            />

            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={() =>
                onUpdateQuantity(
                  item.dish_id,
                  Math.max(1, item.quantity - 1)
                )
              }
              disabled={item.quantity <= 1}
              aria-label="הקטן כמות"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <div className="border-t pt-4 font-semibold space-y-1">
        <p className="text-right">סה"כ פריטים: {totalItems}</p>
        <p className="text-right">סה"כ: ₪{totalPrice.toFixed(2)}</p>
      </div>
    </div>
  )
}
