import React, { useState } from 'react'
import { Search, Calendar, Clock, MapPin, Tag, Edit, Trash2, Plus } from 'lucide-react'
import { Event } from '../types'
import { formatDateTime } from '../utils/dateUtils'

interface EventListProps {
  events: Event[]
  onEventEdit: (event: Event) => void
  onEventDelete: (eventId: string) => void
  onEventCreate: () => void
  searchEvents: (query: string) => Event[]
  getEventsByCategory: (category: string) => Event[]
  loading?: boolean
}

const CATEGORIES = [
  { value: '', label: '전체' },
  { value: 'work', label: '업무' },
  { value: 'personal', label: '개인' },
  { value: 'health', label: '건강' },
  { value: 'education', label: '교육' },
  { value: 'social', label: '사회' },
]

export function EventList({
  events,
  onEventEdit,
  onEventDelete,
  onEventCreate,
  searchEvents,
  getEventsByCategory,
  loading = false,
}: EventListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'start_date' | 'title' | 'category'>('start_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const getFilteredAndSortedEvents = () => {
    let filtered = events

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchEvents(searchQuery)
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = getEventsByCategory(selectedCategory)
    }

    // Apply both filters if both are active
    if (searchQuery.trim() && selectedCategory) {
      filtered = events.filter(event => {
        const matchesSearch =
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = event.category === selectedCategory
        return matchesSearch && matchesCategory
      })
    }

    // Sort events
    return filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'start_date':
          aValue = new Date(a.start_date).getTime()
          bValue = new Date(b.start_date).getTime()
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'category':
          aValue = a.category || ''
          bValue = b.category || ''
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }

  const filteredEvents = getFilteredAndSortedEvents()

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'work':
        return 'bg-blue-100 text-blue-800'
      case 'personal':
        return 'bg-green-100 text-green-800'
      case 'health':
        return 'bg-red-100 text-red-800'
      case 'education':
        return 'bg-purple-100 text-purple-800'
      case 'social':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isEventUpcoming = (event: Event) => {
    return new Date(event.start_date) > new Date()
  }

  const isEventToday = (event: Event) => {
    const today = new Date()
    const eventDate = new Date(event.start_date)
    return today.toDateString() === eventDate.toDateString()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">이벤트 목록</h2>
          <button
            onClick={onEventCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />새 이벤트
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="이벤트 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'start_date' | 'title' | 'category')}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="start_date">날짜순</option>
              <option value="title">제목순</option>
              <option value="category">카테고리순</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">{filteredEvents.length}개의 이벤트</div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">이벤트가 없습니다</p>
            <p className="text-sm">새로운 이벤트를 추가해보세요.</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div
              key={event.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                isEventToday(event) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3
                      className={`text-lg font-medium ${
                        isEventUpcoming(event) ? 'text-gray-900' : 'text-gray-600'
                      }`}
                    >
                      {event.title}
                    </h3>
                    {event.category && (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}
                      >
                        <Tag className="w-3 h-3" />
                        {CATEGORIES.find(c => c.value === event.category)?.label || event.category}
                      </span>
                    )}
                    {isEventToday(event) && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        오늘
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDateTime(event.start_date, 'MM/dd HH:mm')} -{' '}
                        {formatDateTime(event.end_date, 'HH:mm')}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onEventEdit(event)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="이벤트 수정"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEventDelete(event.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="이벤트 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
