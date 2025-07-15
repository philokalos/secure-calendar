// 간소화된 이벤트 타입 정의
export interface ExtractedEvent {
  title: string
  date: string
  time: string
  description: string
  location?: string
}

export interface CalendarRegistrationResult {
  success: boolean
  message: string
  calendarLink?: string
  eventId?: string
}
