'use client'

import { useEffect } from 'react'
import { LandscapeWarning } from '@/components/LandscapeWarning'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Kitchen page error:', error)
  }, [error])

  return (
    <>
      <LandscapeWarning />
      <div className="h-full w-full bg-background flex items-center justify-center">
        <div className="text-center p-8" dir="rtl">
          <p className="text-lg text-red-600 mb-4">שגיאה בטעינת מסך המטבח</p>
          <p className="text-sm text-muted-foreground mb-4">Kitchen display error</p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            נסה שוב / Try again
          </button>
        </div>
      </div>
    </>
  )
}
