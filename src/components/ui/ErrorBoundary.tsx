import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Mail, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // 에러 리포팅
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // 에러 로깅 (실제 서비스에서는 Sentry 등 사용)
    this.logError(error, errorInfo)
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // 콘솔에 상세 에러 정보 출력
    console.group('🚨 Error Boundary Report')
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    console.error('Full Report:', errorReport)
    console.groupEnd()

    // 실제 서비스에서는 여기서 에러 리포팅 서비스로 전송
    // this.sendErrorReport(errorReport)
  }

  private handleRefresh = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 제공된 경우
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* 에러 아이콘 */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              {/* 에러 메시지 */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">앗! 문제가 발생했습니다</h1>
                <p className="text-gray-600 mb-4">
                  예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left mt-4 p-4 bg-gray-100 rounded-md">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                      개발자 정보 (클릭하여 상세 보기)
                    </summary>
                    <div className="text-xs font-mono text-gray-600 whitespace-pre-wrap">
                      <strong>Error:</strong> {this.state.error.message}
                      {this.state.error.stack && (
                        <>
                          <br />
                          <br />
                          <strong>Stack Trace:</strong>
                          <br />
                          {this.state.error.stack}
                        </>
                      )}
                      {this.state.errorInfo?.componentStack && (
                        <>
                          <br />
                          <br />
                          <strong>Component Stack:</strong>
                          <br />
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </div>
                  </details>
                )}
              </div>

              {/* 액션 버튼들 */}
              <div className="space-y-3">
                <button
                  onClick={this.handleRefresh}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  다시 시도
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={this.handleGoHome}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    홈으로
                  </button>

                  <button
                    onClick={this.handleReload}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    새로고침
                  </button>
                </div>

                {/* 문의하기 */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center mb-3">
                    문제가 계속 발생하시나요?
                  </p>
                  <div className="flex gap-2">
                    <a
                      href="mailto:support@securecalendar.com?subject=Error%20Report"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      문의하기
                    </a>
                    <button
                      onClick={() => {
                        // 에러 리포트를 클립보드에 복사
                        const errorReport = JSON.stringify(
                          {
                            message: this.state.error?.message,
                            stack: this.state.error?.stack,
                            timestamp: new Date().toISOString(),
                          },
                          null,
                          2
                        )

                        navigator.clipboard.writeText(errorReport).then(() => {
                          alert('에러 정보가 클립보드에 복사되었습니다.')
                        })
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Bug className="w-4 h-4" />
                      에러 복사
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>SecureCalendar v1.0.0</p>
              <p>문제가 지속되면 브라우저 캐시를 지우고 다시 시도해보세요.</p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC를 별도 파일로 분리해야 함

// 간단한 에러 폴백 컴포넌트
export function SimpleErrorFallback({
  error,
  resetError,
}: {
  error?: Error
  resetError?: () => void
}) {
  return (
    <div className="text-center p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">문제가 발생했습니다</h3>
      <p className="text-gray-600 mb-4">{error?.message || '예상치 못한 오류가 발생했습니다.'}</p>
      {resetError && (
        <button
          onClick={resetError}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}

// 인라인 에러 표시용 컴포넌트
export function InlineError({ error, onRetry }: { error: string | Error; onRetry?: () => void }) {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-red-800 text-sm">{errorMessage}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="text-red-600 hover:text-red-700 text-sm font-medium">
          다시 시도
        </button>
      )}
    </div>
  )
}
