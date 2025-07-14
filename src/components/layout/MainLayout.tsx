import React, { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { MobileBottomNav } from './MobileBottomNav'

interface MainLayoutProps {
  children: React.ReactNode
  currentView?: 'calendar' | 'list'
  onViewChange?: (view: 'calendar' | 'list') => void
  onShowAIExtractor?: () => void
  onCreateEvent?: () => void
  onShowProfile?: () => void
}

export function MainLayout({
  children,
  currentView = 'calendar',
  onViewChange = () => {},
  onShowAIExtractor = () => {},
  onCreateEvent = () => {},
  onShowProfile = () => {},
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

      <div className="flex h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem)]">
        {/* 사이드바 (데스크톱) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          currentView={currentView}
          onViewChange={onViewChange}
        />

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* 콘텐츠 래퍼 */}
          <div className="flex-1 overflow-auto pb-16 sm:pb-0">
            <div className="h-full">{children}</div>
          </div>

          {/* 푸터 (데스크톱) */}
          <div className="hidden sm:block">
            <Footer />
          </div>
        </main>
      </div>

      {/* 모바일 하단 네비게이션 */}
      <MobileBottomNav
        currentView={currentView}
        onViewChange={onViewChange}
        onShowAIExtractor={onShowAIExtractor}
        onCreateEvent={onCreateEvent}
        onShowProfile={onShowProfile}
      />
    </div>
  )
}
