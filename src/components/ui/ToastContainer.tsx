import React from 'react'
import { Toast } from './Toast'
import { useNotification } from '../../contexts/NotificationContext'

export function ToastContainer() {
  const { notifications, removeNotification } = useNotification()

  if (notifications.length === 0) {
    return null
  }

  return (
    <>
      {/* 데스크톱 컨테이너 */}
      <div
        className="fixed top-4 right-4 z-50 hidden sm:flex flex-col space-y-2 max-w-sm w-full"
        role="region"
        aria-label="알림"
        aria-live="polite"
      >
        {notifications.map(notification => (
          <Toast key={notification.id} {...notification} onClose={removeNotification} />
        ))}
      </div>

      {/* 모바일 컨테이너 */}
      <div
        className="fixed top-4 left-4 right-4 z-50 flex sm:hidden flex-col space-y-2"
        role="region"
        aria-label="알림"
        aria-live="polite"
      >
        {notifications.map(notification => (
          <Toast key={notification.id} {...notification} onClose={removeNotification} />
        ))}
      </div>
    </>
  )
}
