'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Dish {
  id: string
  name: string
  unit_type: 'unit' | 'weight'
  price_per_unit: number
  is_active: boolean
}

interface MenuItemSelectorProps {
  onSelectItem: (dish: Dish) => void
}

export function MenuItemSelector({ onSelectItem }: MenuItemSelectorProps) {
  const [open, setOpen] = useState(false)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dishes on mount
  useEffect(() => {
    fetch('/api/menu')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch menu items')
        }
        return res.json()
      })
      .then((data) => {
        setDishes(data.filter((d: Dish) => d.is_active))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Button variant="outline" className="w-full justify-between" dir="rtl" disabled>
        טוען תפריט...
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-red-600" dir="rtl">
        שגיאה בטעינת התפריט. אנא נסה שוב.
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          dir="rtl"
        >
          בחר פריט מהתפריט
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command dir="rtl">
          <CommandInput placeholder="חפש פריט..." dir="rtl" />
          <CommandEmpty>לא נמצאו פריטים</CommandEmpty>
          <CommandGroup>
            {dishes.map((dish) => (
              <CommandItem
                key={dish.id}
                value={dish.name}
                onSelect={() => {
                  onSelectItem(dish)
                  setOpen(false)
                }}
                dir="rtl"
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    'opacity-0' // Never show check mark
                  )}
                />
                <span className="flex-1">{dish.name}</span>
                <span className="text-xs text-muted-foreground">
                  {dish.unit_type === 'unit' ? 'יחידה' : 'משקל'} | ₪
                  {dish.price_per_unit.toFixed(2)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
