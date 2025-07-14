import React, { useState } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getCalendarDays, isToday, isSameMonth } from '../utils/dateUtils'
import { Event } from '../types'

interface CalendarProps {
  events: Event[]
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
}

export const Calendar = React.memo(function Calendar({
  events,
  onDateClick,
  onEventClick,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const calendarDays = getCalendarDays(currentDate)
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_date)
      const eventEnd = new Date(event.end_date)
      return (
        date >= new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate()) &&
        date <= new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate())
      )
    })
  }

  const navigatePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const navigateNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b">
        <button
          onClick={navigatePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg touch-manipulation"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold">{format(currentDate, 'yyyy년 MM월')}</h2>
        <button
          onClick={navigateNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg touch-manipulation"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* 요일 헤더 */}
        {weekDays.map(day => (
          <div
            key={day}
            className="bg-gray-50 p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-700"
          >
            {day}
          </div>
        ))}

        {/* 날짜 셀들 */}
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={index}
              className={`
                bg-white p-1 sm:p-2 min-h-[60px] sm:min-h-[100px] cursor-pointer hover:bg-gray-50 touch-manipulation
                ${!isCurrentMonth ? 'text-gray-400' : ''}
                ${isCurrentDay ? 'bg-blue-50' : ''}
              `}
              onClick={() => onDateClick(day)}
            >
              {/* 날짜 숫자 */}
              <div
                className={`
                text-xs sm:text-sm font-medium mb-1
                ${isCurrentDay ? 'text-blue-600' : ''}
              `}
              >
                {format(day, 'd')}
              </div>

              {/* 이벤트 목록 */}
              <div className="space-y-1">
                {/* 모바일: 최대 1개, 데스크톱: 최대 3개 */}
                {dayEvents.slice(0, window.innerWidth < 640 ? 1 : 3).map(event => (
                  <div
                    key={event.id}
                    className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate cursor-pointer hover:bg-blue-200 touch-manipulation"
                    onClick={e => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                  >
                    {event.title}
                  </div>
                ))}

                {/* 더보기 표시 */}
                {dayEvents.length > (window.innerWidth < 640 ? 1 : 3) && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - (window.innerWidth < 640 ? 1 : 3)}개
                  </div>
                )}

                {/* 모바일에서 이벤트 개수 표시 */}
                {window.innerWidth < 640 && dayEvents.length > 0 && (
                  <div className="flex justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
