import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth as dateFnsIsSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns'

export function formatDate(date: Date | string, formatStr: string = 'yyyy-MM-dd'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatDateTime(
  date: Date | string,
  formatStr: string = 'yyyy-MM-dd HH:mm'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function getCalendarDays(date: Date): Date[] {
  const start = startOfWeek(startOfMonth(date))
  const end = endOfWeek(endOfMonth(date))

  const days: Date[] = []
  let currentDay = start

  while (currentDay <= end) {
    days.push(currentDay)
    currentDay = addDays(currentDay, 1)
  }

  return days
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date)
  const days: Date[] = []

  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i))
  }

  return days
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function isSameMonth(date: Date, compareDate: Date): boolean {
  return dateFnsIsSameMonth(date, compareDate)
}

export function toISOString(date: Date): string {
  return date.toISOString()
}

export function parseDate(dateString: string): Date {
  return parseISO(dateString)
}
