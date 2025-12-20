'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useMenuItems, useDeactivateMenuItem } from '@/hooks/use-menu-items'
import { MenuItemForm } from './menu-item-form'
import type { Dish } from '@/lib/types/supabase'

interface MenuTableProps {
  initialData: Dish[]
}

export function MenuTable({ initialData }: MenuTableProps) {
  const { data: menuItems, isLoading } = useMenuItems()
  const deactivateMutation = useDeactivateMenuItem()

  const [itemToDeactivate, setItemToDeactivate] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Dish | null>(null)

  const items = menuItems || initialData

  const handleEdit = (dish: Dish) => {
    setSelectedItem(dish)
    setDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedItem(null)
    setDialogOpen(true)
  }

  const handleDeactivate = (id: string) => {
    deactivateMutation.mutate(id, {
      onSuccess: () => {
        setItemToDeactivate(null)
      },
    })
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedItem(null)
  }

  if (isLoading) {
    return <MenuTableSkeleton />
  }

  return (
    <div dir="rtl">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={handleAddNew}
          size="lg"
          aria-label="הוסף פריט חדש לתפריט"
          className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          הוסף פריט חדש
        </Button>
      </div>

      {/* Menu Items Table */}
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">שם הפריט</TableHead>
            <TableHead className="text-right">סוג יחידה</TableHead>
            <TableHead className="text-right">מחיר</TableHead>
            <TableHead className="text-right">סטטוס</TableHead>
            <TableHead className="text-left">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                אין פריטים בתפריט. הוסף פריט חדש כדי להתחיל.
              </TableCell>
            </TableRow>
          ) : (
            items.map((dish) => (
              <TableRow
                key={dish.id}
                className={!dish.is_active ? 'opacity-50' : ''}
              >
                <TableCell className="text-right">
                  <span className={!dish.is_active ? 'line-through' : ''}>
                    {dish.name}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {dish.unit_type === 'unit' ? 'יחידה' : 'משקל'}
                </TableCell>
                <TableCell className="text-right">
                  ₪{Number(dish.price_per_unit).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {dish.is_active ? 'פעיל' : 'לא פעיל'}
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex gap-2 justify-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(dish)}
                      disabled={!dish.is_active}
                      aria-label={`ערוך ${dish.name}`}
                      className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      ערוך
                    </Button>
                    {dish.is_active && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setItemToDeactivate(dish.id)}
                        aria-label={`השבת ${dish.name}`}
                        className="focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      >
                        השבת
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">
              {selectedItem ? 'ערוך פריט' : 'הוסף פריט חדש'}
            </DialogTitle>
          </DialogHeader>
          <MenuItemForm
            defaultValues={selectedItem || undefined}
            onSuccess={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog
        open={itemToDeactivate !== null}
        onOpenChange={(open) => !open && setItemToDeactivate(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              האם אתה בטוח?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              פריט זה יסומן כלא פעיל ולא יופיע בהזמנות חדשות
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDeactivate && handleDeactivate(itemToDeactivate)}
              disabled={deactivateMutation.isPending}
            >
              {deactivateMutation.isPending ? 'מבטל...' : 'אישור'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function MenuTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-32" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}
