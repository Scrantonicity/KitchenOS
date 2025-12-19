import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MenuTable } from '@/components/menu/menu-table'

export const metadata: Metadata = {
  title: 'ניהול תפריט | KitchenOS',
  description: 'ניהול פריטי תפריט',
}

export default async function MenuPage() {
  const supabase = await createClient()

  // Fetch initial menu items from database (Server Component)
  const { data: initialData, error } = await supabase
    .from('dishes')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching menu items:', error)
  }

  return (
    <div dir="rtl" lang="he" className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-right mb-6">ניהול תפריט</h1>
      <MenuTable initialData={initialData || []} />
    </div>
  )
}
