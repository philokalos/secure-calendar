export interface Event {
  id: string
  title: string
  description?: string | null
  start_date: string
  end_date: string
  user_id: string
  created_at: string
  updated_at: string
  category?: string | null
  location?: string | null
  reminder_minutes?: number | null
}

export interface User {
  id: string
  email: string
  created_at: string
}

export interface CalendarView {
  type: 'month' | 'week' | 'day'
  date: Date
}

export interface EventFormData {
  title: string
  description?: string
  start_date: string
  end_date: string
  category?: string
  location?: string
  reminder_minutes?: number
}

export interface AIExtractionResult {
  events: Omit<EventFormData, 'id'>[]
  confidence: number
}
