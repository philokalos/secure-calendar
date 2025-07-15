import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { PageLoader } from './components/ui/LoadingSpinner'
import { LoginPage } from './pages/LoginPage'
import { InputPage } from './pages/InputPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { ResultPage } from './pages/ResultPage'

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

  const handleEventsConfirmed = () => {
    // 구글 캘린더 등록 로직 (추후 구현)
    setRegistrationResult({
      success: true,
      message: '이벤트가 성공적으로 등록되었습니다!',
      calendarLink: 'https://calendar.google.com'
    })
    setCurrentState('result')
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
