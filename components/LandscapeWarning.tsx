'use client'

import { RotateCw } from 'lucide-react'

export function LandscapeWarning() {
  return (
    <div className="hidden landscape:flex fixed inset-0 z-[9999] bg-black/80 items-center justify-center">
      <div className="text-center text-white p-8" dir="rtl">
        <RotateCw className="w-24 h-24 mx-auto mb-6 animate-pulse" />
        <p className="text-2xl font-semibold">
          נא לסובב למצב אנכי לחוויה מיטבית
        </p>
        <p className="text-lg mt-2 text-white/70">
          Please rotate to portrait mode for optimal experience
        </p>
      </div>
    </div>
  )
}
