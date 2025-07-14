import React from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { PageLoader } from './components/ui/LoadingSpinner'
import { ToastContainer } from './components/ui/ToastContainer'
import { LoginPage } from './pages/LoginPage'
import { CalendarPage } from './pages/CalendarPage'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <PageLoader text="SecureCalendar를 시작하는 중..." />
  }

  return (
    <>
      {user ? <CalendarPage /> : <LoginPage />}
      <ToastContainer />
    </>
  )
}

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 에러 리포팅 (실제 서비스에서는 Sentry 등 사용)
        console.error('Application Error:', error, errorInfo)
      }}
    >
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
