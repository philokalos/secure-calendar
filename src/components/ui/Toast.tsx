import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500',
    titleColor: 'text-green-800',
    messageColor: 'text-green-700',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800',
    messageColor: 'text-red-700',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-800',
    messageColor: 'text-yellow-700',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800',
    messageColor: 'text-blue-700',
  },
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const config = toastConfig[type]
  const Icon = config.icon

  const handleClose = React.useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(id)
    }, 300) // 애니메이션 완료 후 제거
  }, [id, onClose])

  useEffect(() => {
    setIsVisible(true)

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
        max-w-sm w-full ${config.bgColor} border ${config.borderColor} rounded-lg shadow-lg pointer-events-auto
      `}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>

            <div className="ml-3 w-0 flex-1">
              <p className={`text-sm font-medium ${config.titleColor}`}>{title}</p>
              {message && <p className={`mt-1 text-sm ${config.messageColor}`}>{message}</p>}
            </div>

            <div className="ml-4 flex-shrink-0 flex">
              <button
                className={`
                  rounded-md inline-flex ${config.iconColor} hover:${config.bgColor} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${config.bgColor} focus:ring-${config.iconColor}
                `}
                onClick={handleClose}
              >
                <span className="sr-only">닫기</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 진행 바 */}
        {duration > 0 && (
          <div className={`h-1 ${config.bgColor} overflow-hidden`}>
            <div
              className={`h-full bg-current ${config.iconColor} animate-progress`}
              style={{
                animation: `progress ${duration}ms linear`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
