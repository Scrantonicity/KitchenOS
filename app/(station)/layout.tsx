import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Kitchen Orders - KitchenOS',
  description: 'Tablet Kanban board for kitchen order management',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function StationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-screen overflow-hidden portrait:block landscape:hidden">
      {children}
    </div>
  )
}
