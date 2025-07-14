import React from 'react'
import { Calendar, List, Sparkles, Plus, User } from 'lucide-react'

interface MobileBottomNavProps {
  currentView: 'calendar' | 'list'
  onViewChange: (view: 'calendar' | 'list') => void
  onShowAIExtractor: () => void
  onCreateEvent: () => void
  onShowProfile: () => void
}

export function MobileBottomNav({
  currentView,
  onViewChange,
  onShowAIExtractor,
  onCreateEvent,
  onShowProfile,
}: MobileBottomNavProps) {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="grid grid-cols-5 h-16">
        {/* 캘린더 */}
        <button
          onClick={() => onViewChange('calendar')}
          className={`flex flex-col items-center justify-center gap-1 ${
            currentView === 'calendar'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-xs font-medium">캘린더</span>
        </button>

        {/* 목록 */}
        <button
          onClick={() => onViewChange('list')}
          className={`flex flex-col items-center justify-center gap-1 ${
            currentView === 'list'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <List className="w-5 h-5" />
          <span className="text-xs font-medium">목록</span>
        </button>

        {/* 새 이벤트 (중앙) */}
        <button
          onClick={onCreateEvent}
          className="flex flex-col items-center justify-center gap-1 text-white bg-blue-600 hover:bg-blue-700 m-2 rounded-full"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* AI 추출 */}
        <button
          onClick={onShowAIExtractor}
          className="flex flex-col items-center justify-center gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-medium">AI</span>
        </button>

        {/* 프로필 */}
        <button
          onClick={onShowProfile}
          className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <User className="w-5 h-5" />
          <span className="text-xs font-medium">내정보</span>
        </button>
      </div>
    </div>
  )
}
