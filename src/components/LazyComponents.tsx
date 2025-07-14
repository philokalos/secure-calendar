import React from 'react'
import { PageLoader } from './ui/LoadingSpinner'

// Lazy load heavy components for better performance
export const LazyCalendar = React.lazy(() =>
  import('./Calendar').then(module => ({ default: module.Calendar }))
)

export const LazyEventList = React.lazy(() =>
  import('./EventList').then(module => ({ default: module.EventList }))
)

export const LazyAIExtractor = React.lazy(() =>
  import('./AIExtractor').then(module => ({ default: module.AIExtractor }))
)

export const LazyEventForm = React.lazy(() =>
  import('./EventForm').then(module => ({ default: module.EventForm }))
)

// Wrapper component with loading fallback
export function LazyComponentWrapper({ children }: { children: React.ReactNode }) {
  return <React.Suspense fallback={<PageLoader text="로딩 중..." />}>{children}</React.Suspense>
}
