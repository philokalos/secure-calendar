import React, { createContext, useContext, useState, useCallback } from 'react'
import { ToastType } from '../components/ui/Toast'

export interface Notification {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearAll: () => void
  showSuccess: (title: string, message?: string, duration?: number) => string
  showError: (title: string, message?: string, duration?: number) => string
  showWarning: (title: string, message?: string, duration?: number) => string
  showInfo: (title: string, message?: string, duration?: number) => string
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

let notificationCounter = 0

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${++notificationCounter}`
    const newNotification = { ...notification, id }

    setNotifications(prev => [newNotification, ...prev])
    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification({ type: 'success', title, message, duration })
    },
    [addNotification]
  )

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification({ type: 'error', title, message, duration })
    },
    [addNotification]
  )

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification({ type: 'warning', title, message, duration })
    },
    [addNotification]
  )

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addNotification({ type: 'info', title, message, duration })
    },
    [addNotification]
  )

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
