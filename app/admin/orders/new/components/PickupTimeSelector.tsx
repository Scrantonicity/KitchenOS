'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import {
  BUSINESS_HOURS,
  isWithinBusinessHours,
  formatTimeForWarning,
} from '@/lib/utils/business-hours'

interface PickupTimeSelectorProps {
  value?: string
  onChange: (value: string) => void
  error?: string
}

export function PickupTimeSelector({
  value,
  onChange,
  error,
}: PickupTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [selectedTime, setSelectedTime] = useState<string>(
    value ? format(new Date(value), 'HH:mm') : '08:30'
  )
  const [showWarning, setShowWarning] = useState(false)
  const [businessHoursOverride, setBusinessHoursOverride] = useState(false)

  // Generate time options (15-minute intervals)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      timeOptions.push(timeStr)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    setSelectedDate(date)

    // Combine date and time
    const datetime = new Date(date)
    const [hours, minutes] = selectedTime.split(':')
    datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    // Check business hours
    if (!isWithinBusinessHours(datetime) && !businessHoursOverride) {
      setShowWarning(true)
    } else {
      onChange(datetime.toISOString())
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)

    if (!selectedDate) return

    // Combine date and time
    const datetime = new Date(selectedDate)
    const [hours, minutes] = time.split(':')
    datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    // Check business hours
    if (!isWithinBusinessHours(datetime) && !businessHoursOverride) {
      setShowWarning(true)
    } else {
      onChange(datetime.toISOString())
    }
  }

  const handleConfirmOutsideHours = () => {
    setBusinessHoursOverride(true)
    setShowWarning(false)

    if (selectedDate) {
      const datetime = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(':')
      datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      onChange(datetime.toISOString())
    }
  }

  const handleCancelOutsideHours = () => {
    setShowWarning(false)
    // Reset to 8:30 AM
    setSelectedTime('08:30')
  }

  const currentDateTime =
    selectedDate && selectedTime
      ? (() => {
          const dt = new Date(selectedDate)
          const [hours, minutes] = selectedTime.split(':')
          dt.setHours(parseInt(hours), parseInt(minutes), 0, 0)
          return dt
        })()
      : undefined

  return (
    <div className="space-y-2">
      <FormLabel className="text-right">זמן איסוף</FormLabel>

      <div className="flex gap-2" dir="rtl">
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                className={cn(
                  'w-[240px] justify-start text-right font-normal',
                  !selectedDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, 'PPP', { locale: he })
                ) : (
                  <span>בחר תאריך</span>
                )}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
              locale={he}
            />
          </PopoverContent>
        </Popover>

        {/* Time Picker */}
        <Select value={selectedTime} onValueChange={handleTimeSelect}>
          <SelectTrigger className="w-[140px] text-right">
            <SelectValue placeholder="בחר שעה" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <p
          className="text-sm text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-150"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      {/* Business Hours Warning Dialog */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              זמן איסוף מחוץ לשעות הפעילות
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              {currentDateTime &&
                `זמן האיסוף ${formatTimeForWarning(currentDateTime)} הוא מחוץ לשעות הפעילות (${BUSINESS_HOURS.start}-${BUSINESS_HOURS.end}). להמשיך בכל זאת?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel onClick={handleCancelOutsideHours}>
              ביטול
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmOutsideHours}>
              אישור
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
