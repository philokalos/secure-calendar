import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Calendar } from '../components/Calendar'
import { EventForm } from '../components/EventForm'
import { EventList } from '../components/EventList'
import { AIExtractor } from '../components/AIExtractor'
import { MainLayout } from '../components/layout/MainLayout'
import { PageLoader } from '../components/ui/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { useEvents } from '../hooks/useEvents'
import { Event, EventFormData } from '../types'

type ViewMode = 'calendar' | 'list'

export function CalendarPage() {
  const [isEventFormOpen, setIsEventFormOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showAIExtractor, setShowAIExtractor] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')

  useAuth() // Hook required for auth context
  const { showSuccess, showError, showWarning } = useNotification()
  const {
    events,
    loading,
    error,
    createEvent,
    createEvents,
    updateEvent,
    deleteEvent,
    searchEvents,
    getEventsByCategory,
  } = useEvents()

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setIsEventFormOpen(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setSelectedDate(null)
    setIsEventFormOpen(true)
  }

  const handleEventEdit = (event: Event) => {
    setSelectedEvent(event)
    setSelectedDate(null)
    setIsEventFormOpen(true)
  }

  const handleEventCreate = () => {
    setSelectedEvent(null)
    setSelectedDate(new Date())
    setIsEventFormOpen(true)
  }

  const handleEventSave = async (eventData: EventFormData) => {
    try {
      if (selectedEvent) {
        const result = await updateEvent(selectedEvent.id, eventData)
        showSuccess('이벤트가 수정되었습니다')
        handleFormClose()
        return result
      } else {
        const result = await createEvent(eventData)
        showSuccess('새 이벤트가 생성되었습니다')
        handleFormClose()
        return result
      }
    } catch (error) {
      showError(
        '이벤트 저장에 실패했습니다',
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      )
      throw error
    }
  }

  const handleEventDelete = async (eventId: string) => {
    try {
      const result = await deleteEvent(eventId)
      showSuccess('이벤트가 삭제되었습니다')
      handleFormClose()
      return result
    } catch (error) {
      showError(
        '이벤트 삭제에 실패했습니다',
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      )
      throw error
    }
  }

  const handleFormClose = () => {
    setIsEventFormOpen(false)
    setSelectedEvent(null)
    setSelectedDate(null)
  }

  const handleAIExtract = async (extractedEvents: EventFormData[]) => {
    try {
      if (extractedEvents.length > 0) {
        await createEvents(extractedEvents)
        showSuccess(`AI가 ${extractedEvents.length}개의 이벤트를 추출했습니다`)
        setShowAIExtractor(false)
      } else {
        showWarning('추출된 이벤트가 없습니다', '다른 방식으로 다시 시도해보세요')
      }
    } catch (error) {
      showError(
        'AI 추출 이벤트 저장에 실패했습니다',
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      )
    }
  }

  // const handleSignOut = async () => {
  //   try {
  //     await signOut()
  //     showSuccess('로그아웃되었습니다')
  //   } catch (error) {
  //     showError('로그아웃에 실패했습니다', error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다')
  //   }
  // }

  if (loading) {
    return <PageLoader text="캘린더를 불러오는 중..." />
  }

  return (
    <MainLayout
      currentView={viewMode}
      onViewChange={setViewMode}
      onShowAIExtractor={() => setShowAIExtractor(!showAIExtractor)}
      onCreateEvent={handleEventCreate}
      onShowProfile={() => console.log('Profile clicked')} // TODO: 프로필 페이지 구현
    >
      {/* 에러 표시 */}
      {error && (
        <div className="p-4 lg:p-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-2 sm:p-4 lg:p-8">
        <div
          className={`grid gap-4 lg:gap-8 ${showAIExtractor ? 'grid-cols-1 xl:grid-cols-4' : 'grid-cols-1'}`}
        >
          <div className={showAIExtractor ? 'xl:col-span-3' : 'col-span-1'}>
            {viewMode === 'calendar' ? (
              <Calendar
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
              />
            ) : (
              <EventList
                events={events}
                onEventEdit={handleEventEdit}
                onEventDelete={handleEventDelete}
                onEventCreate={handleEventCreate}
                searchEvents={searchEvents}
                getEventsByCategory={getEventsByCategory}
                loading={loading}
              />
            )}
          </div>

          {showAIExtractor && (
            <div className="xl:col-span-1">
              <AIExtractor onExtract={handleAIExtract} />
            </div>
          )}
        </div>
      </div>

      {/* 이벤트 폼 모달 */}
      <EventForm
        isOpen={isEventFormOpen}
        onClose={handleFormClose}
        event={selectedEvent}
        selectedDate={selectedDate}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
        loading={loading}
      />
    </MainLayout>
  )
}
