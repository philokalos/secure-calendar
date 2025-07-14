import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'purple' | 'green' | 'red' | 'gray'
  text?: string
  overlay?: boolean
  fullScreen?: boolean
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

const colorClasses = {
  blue: 'border-blue-600 border-t-transparent',
  purple: 'border-purple-600 border-t-transparent',
  green: 'border-green-600 border-t-transparent',
  red: 'border-red-600 border-t-transparent',
  gray: 'border-gray-600 border-t-transparent',
}

export function LoadingSpinner({
  size = 'md',
  color = 'blue',
  text,
  overlay = false,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          border-4 rounded-full animate-spin
          ${sizeClasses[size]}
          ${colorClasses[color]}
        `}
      />
      {text && <p className={`text-gray-600 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">{spinnerContent}</div>
      </div>
    )
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div className="text-center">{spinnerContent}</div>
      </div>
    )
  }

  return <div className="flex items-center justify-center p-4">{spinnerContent}</div>
}

// 페이지 로딩용 컴포넌트
export function PageLoader({ text = '로딩 중...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">SecureCalendar</h3>
        <p className="text-gray-600">{text}</p>

        {/* 로딩 도트 애니메이션 */}
        <div className="flex justify-center items-center gap-1 mt-4">
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}

// 버튼 내부 로딩 스피너
export function ButtonSpinner({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <div
      className={`
        border-2 border-white border-t-transparent rounded-full animate-spin
        ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
      `}
    />
  )
}

// 인라인 로딩 스피너 (텍스트와 함께)
export function InlineSpinner({ text, size = 'sm' }: { text: string; size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin
          ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
        `}
      />
      <span className={`text-gray-600 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>{text}</span>
    </div>
  )
}

// 스켈레톤 로딩 컴포넌트
export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

// 카드 스켈레톤
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  )
}

// 진행률 표시와 함께하는 로더
export function ProgressLoader({ progress, text }: { progress: number; text?: string }) {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

      {text && <h3 className="text-lg font-semibold text-gray-900">{text}</h3>}

      <div className="w-full max-w-xs mx-auto">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}
