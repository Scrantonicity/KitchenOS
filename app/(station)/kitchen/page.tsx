'use client'

import { LandscapeWarning } from '@/components/LandscapeWarning'
import { KanbanBoard } from './components/KanbanBoard'
import { OrderCardSkeleton } from './components/OrderCardSkeleton'
import { useOrders } from '@/lib/hooks/useOrders'

const SKELETON_COLUMNS = [
  { status: 'created', title: 'נוצר', color: 'bg-[hsl(0,0%,95%)]' },
  { status: 'packing', title: 'באריזה', color: 'bg-[hsl(217,91%,95%)]' },
  { status: 'ready', title: 'מוכן', color: 'bg-[hsl(25,95%,95%)]' },
  { status: 'collected', title: 'נאסף', color: 'bg-[hsl(142,76%,95%)]' },
]

export default function KitchenPage() {
  const { data: orders = [], isPending, error } = useOrders()

  if (error) {
    return (
      <>
        <LandscapeWarning />
        <div className="h-full w-full bg-background flex items-center justify-center">
          <div className="text-center p-8" dir="rtl">
            <p className="text-lg text-red-600 mb-4">שגיאת רשת. משיכה למטה לרענון</p>
            <p className="text-sm text-muted-foreground">Network error. Pull down to refresh</p>
          </div>
        </div>
      </>
    )
  }

  if (isPending) {
    return (
      <>
        <LandscapeWarning />
        <div className="h-full w-full bg-background">
          <div className="flex flex-row overflow-x-auto overflow-y-hidden h-full w-full">
            {SKELETON_COLUMNS.map(({ status, title, color }) => (
              <div
                key={status}
                className="flex flex-col w-[clamp(240px,30vw,320px)] h-full"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className={`flex items-center justify-between px-4 py-3 border-b border-border ${color}`} dir="rtl">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <div className="h-5 w-6 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2">
                  <OrderCardSkeleton />
                  <OrderCardSkeleton />
                  <OrderCardSkeleton />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <LandscapeWarning />
      <div className="h-full w-full bg-background">
        <KanbanBoard orders={orders} />
      </div>
    </>
  )
}
