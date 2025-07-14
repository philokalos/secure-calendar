import React from 'react'
import { Menu, X, Calendar, User, LogOut, Bell, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface HeaderProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* 좌측: 햄버거 메뉴 + 로고 */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
            aria-label="메뉴 열기/닫기"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">SecureCalendar</h1>
              <p className="text-xs text-gray-500">스마트 캘린더</p>
            </div>
          </div>
        </div>

        {/* 우측: 사용자 메뉴 */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* 알림 버튼 */}
          <button
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            title="알림"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 설정 버튼 (데스크톱에서만 표시) */}
          <button
            className="hidden sm:flex p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            title="설정"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* 사용자 정보 */}
          <div className="flex items-center gap-3">
            {/* 사용자 아바타 */}
            <div className="relative">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>

            {/* 사용자 이름 (데스크톱에서만 표시) */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.email?.split('@')[0] || '사용자'}
              </p>
              <p className="text-xs text-gray-500">온라인</p>
            </div>

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일에서 사용자 정보 표시 */}
      {user && (
        <div className="md:hidden px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full">
              <User className="w-3 h-3 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user.email?.split('@')[0] || '사용자'}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
