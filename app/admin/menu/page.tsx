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
    return (
      <div dir="rtl" lang="he" className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-right mb-6 text-red-600">
          שגיאה בטעינת התפריט
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-right">
          <p className="text-red-800 mb-2">
            לא ניתן לטעון את פריטי התפריט מהמסד נתונים.
          </p>
          <p className="text-red-600 text-sm">
            אנא בדוק את החיבור למסד הנתונים או נסה לרענן את הדף.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" lang="he" className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-right mb-6">ניהול תפריט</h1>
      <MenuTable initialData={initialData || []} />
    </div>
  )
}
