import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { PageLoader } from './components/ui/LoadingSpinner'
import { LoginPage } from './pages/LoginPage'
import { InputPage } from './pages/InputPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { ResultPage } from './pages/ResultPage'
import { googleCalendarService } from './utils/googleCalendar'

type AppState = 'input' | 'confirmation' | 'result'

interface ExtractedEvent {
  title: string
  date: string
  time: string
  description: string
  location?: string
}

function AppContent() {
  const { user, loading } = useAuth()
  const [currentState, setCurrentState] = useState<AppState>('input')
  const [extractedEvents, setExtractedEvents] = useState<ExtractedEvent[]>([])
  const [registrationResult, setRegistrationResult] = useState<{
    success: boolean
    message: string
    calendarLink?: string
  } | null>(null)

  if (loading) {
    return <PageLoader text="SimpleCalendar를 시작하는 중..." />
  }

  if (!user) {
    return <LoginPage />
  }

  const handleEventsExtracted = (events: ExtractedEvent[]) => {
    setExtractedEvents(events)
    setCurrentState('confirmation')
  }

  const handleEventsConfirmed = async () => {
    try {
      if (extractedEvents.length === 1) {
        // 단일 이벤트 등록
        const result = await googleCalendarService.createEvent(extractedEvents[0])
        setRegistrationResult(result)
      } else if (extractedEvents.length > 1) {
        // 다중 이벤트 등록
        const result = await googleCalendarService.createEvents(extractedEvents)
        setRegistrationResult({
          success: result.success,
          message: result.message,
          calendarLink: result.success ? 'https://calendar.google.com' : undefined
        })
      }
      setCurrentState('result')
    } catch (error) {
      console.error('이벤트 등록 실패:', error)
      setRegistrationResult({
        success: false,
        message: '이벤트 등록 중 예상치 못한 오류가 발생했습니다.'
      })
      setCurrentState('result')
    }
  }

  const handleBackToInput = () => {
    setCurrentState('input')
    setExtractedEvents([])
    setRegistrationResult(null)
  }

  return (
    <>
      {currentState === 'input' && (
        <InputPage onEventsExtracted={handleEventsExtracted} />
      )}
      {currentState === 'confirmation' && (
        <ConfirmationPage
          events={extractedEvents}
          onConfirm={handleEventsConfirmed}
          onBack={() => setCurrentState('input')}
        />
      )}
      {currentState === 'result' && registrationResult && (
        <ResultPage
          result={registrationResult}
          onBackToInput={handleBackToInput}
        />
      )}
    </>
  )
}

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Application Error:', error, errorInfo)
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
