import React from 'react'
import {
  Calendar,
  List,
  Sparkles,
  Settings,
  BarChart3,
  Users,
  Bell,
  HelpCircle,
  ChevronRight,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentView: 'calendar' | 'list'
  onViewChange: (view: 'calendar' | 'list') => void
}

interface NavigationItem {
  id: string
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  href?: string
  active?: boolean
  badge?: string
  children?: NavigationItem[]
}

export function Sidebar({ isOpen, onClose, currentView, onViewChange }: SidebarProps) {
  const navigationItems: NavigationItem[] = [
    {
      id: 'calendar',
      name: '캘린더 보기',
      icon: Calendar,
      active: currentView === 'calendar',
    },
    {
      id: 'list',
      name: '목록 보기',
      icon: List,
      active: currentView === 'list',
    },
    {
      id: 'ai-extract',
      name: 'AI 추출',
      icon: Sparkles,
      badge: 'NEW',
    },
    {
      id: 'analytics',
      name: '분석',
      icon: BarChart3,
      children: [
        { id: 'time-tracking', name: '시간 추적', icon: BarChart3 },
        { id: 'productivity', name: '생산성', icon: BarChart3 },
        { id: 'reports', name: '리포트', icon: BarChart3 },
      ],
    },
    {
      id: 'collaboration',
      name: '협업',
      icon: Users,
      badge: 'SOON',
    },
    {
      id: 'notifications',
      name: '알림',
      icon: Bell,
    },
    {
      id: 'settings',
      name: '설정',
      icon: Settings,
    },
    {
      id: 'help',
      name: '도움말',
      icon: HelpCircle,
    },
  ]

  const handleItemClick = (item: NavigationItem) => {
    if (item.id === 'calendar' || item.id === 'list') {
      onViewChange(item.id as 'calendar' | 'list')
    }

    // 모바일에서는 메뉴 클릭 시 사이드바 닫기
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={onClose} />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* 사이드바 헤더 */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">메뉴</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {navigationItems.map(item => (
              <NavigationItem key={item.id} item={item} onClick={() => handleItemClick(item)} />
            ))}
          </div>

          {/* 구분선 */}
          <div className="my-6 border-t border-gray-200" />

          {/* 퀵 액션 */}
          <div className="px-3 space-y-3">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                퀵 액션
              </h3>
            </div>

            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
              + 새 이벤트
            </button>

            <button className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md">
              🤖 AI 추출
            </button>
          </div>

          {/* 최근 활동 */}
          <div className="px-3 mt-6 space-y-3">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                최근 활동
              </h3>
            </div>

            <div className="space-y-2">
              <div className="px-3 py-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>팀 미팅 추가됨</span>
                </div>
                <div className="mt-1 text-gray-400">5분 전</div>
              </div>

              <div className="px-3 py-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>AI로 3개 이벤트 추출</span>
                </div>
                <div className="mt-1 text-gray-400">1시간 전</div>
              </div>
            </div>
          </div>
        </nav>

        {/* 사이드바 푸터 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900">Pro 기능 체험</p>
              <p className="text-xs text-blue-700 truncate">AI 분석과 고급 기능을 사용해보세요</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

interface NavigationItemProps {
  item: NavigationItem
  onClick: () => void
  level?: number
}

function NavigationItem({ item, onClick, level = 0 }: NavigationItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    } else {
      onClick()
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors
          ${level > 0 ? 'pl-8' : ''}
          ${
            item.active
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        <item.icon className={`w-5 h-5 ${item.active ? 'text-blue-600' : 'text-gray-400'}`} />

        <span className="flex-1 text-left">{item.name}</span>

        {item.badge && (
          <span
            className={`
            px-2 py-1 text-xs font-medium rounded-full
            ${
              item.badge === 'NEW'
                ? 'bg-green-100 text-green-800'
                : item.badge === 'SOON'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
            }
          `}
          >
            {item.badge}
          </span>
        )}

        {hasChildren && (
          <ChevronRight
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        )}
      </button>

      {/* 하위 메뉴 */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map(child => (
            <NavigationItem key={child.id} item={child} onClick={onClick} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
