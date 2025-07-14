import React, { useState } from 'react'
import { Check, X, Edit, Clock, MapPin, Tag, Bell, AlertCircle } from 'lucide-react'
import { EventFormData } from '../types'
import { formatDateTime } from '../utils/dateUtils'

interface EventPreviewProps {
  events: EventFormData[]
  confidence: number
  suggestions?: string[]
  onEventsChange: (events: EventFormData[]) => void
  onSaveAll: () => void
  onCancel: () => void
  loading?: boolean
}

interface EventEditState {
  index: number
  event: EventFormData
}

const CATEGORIES = [
  { value: '', label: '카테고리 없음' },
  { value: 'work', label: '업무' },
  { value: 'personal', label: '개인' },
  { value: 'health', label: '건강' },
  { value: 'education', label: '교육' },
  { value: 'social', label: '사회' },
]

const REMINDER_OPTIONS = [
  { value: 0, label: '알림 없음' },
  { value: 5, label: '5분 전' },
  { value: 15, label: '15분 전' },
  { value: 30, label: '30분 전' },
  { value: 60, label: '1시간 전' },
  { value: 1440, label: '1일 전' },
]

export function EventPreview({
  events,
  confidence,
  suggestions,
  onEventsChange,
  onSaveAll,
  onCancel,
  loading = false,
}: EventPreviewProps) {
  const [editingEvent, setEditingEvent] = useState<EventEditState | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<Set<number>>(
    new Set(events.map((_, index) => index))
  )

  const handleEventToggle = (index: number) => {
    const newSelected = new Set(selectedEvents)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedEvents(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedEvents.size === events.length) {
      setSelectedEvents(new Set())
    } else {
      setSelectedEvents(new Set(events.map((_, index) => index)))
    }
  }

  const handleEventEdit = (index: number) => {
    setEditingEvent({
      index,
      event: { ...events[index] },
    })
  }

  const handleEventSave = () => {
    if (!editingEvent) return

    const newEvents = [...events]
    newEvents[editingEvent.index] = editingEvent.event
    onEventsChange(newEvents)
    setEditingEvent(null)
  }

  const handleEventCancel = () => {
    setEditingEvent(null)
  }

  const handleEventDelete = (index: number) => {
    const newEvents = events.filter((_, i) => i !== index)
    onEventsChange(newEvents)

    // 선택된 이벤트 목록 업데이트
    const newSelected = new Set<number>()
    selectedEvents.forEach(selectedIndex => {
      if (selectedIndex < index) {
        newSelected.add(selectedIndex)
      } else if (selectedIndex > index) {
        newSelected.add(selectedIndex - 1)
      }
    })
    setSelectedEvents(newSelected)
  }

  const handleSaveSelected = () => {
    const selectedEventsList = events.filter((_, index) => selectedEvents.has(index))
    onEventsChange(selectedEventsList)
    onSaveAll()
  }

  const getCategoryColor = (category: string | undefined) => {
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">이벤트를 찾을 수 없습니다</h3>
          <p className="text-gray-500 mb-4">
            입력한 텍스트에서 이벤트 정보를 추출할 수 없었습니다.
          </p>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              추출된 이벤트 ({events.length}개)
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">신뢰도:</span>
              <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                {Math.round(confidence * 100)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleSelectAll} className="text-sm text-blue-600 hover:text-blue-700">
              {selectedEvents.size === events.length ? '전체 해제' : '전체 선택'}
            </button>
            <span className="text-sm text-gray-400">
              {selectedEvents.size}/{events.length} 선택됨
            </span>
          </div>
        </div>

        {suggestions && suggestions.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">💡 개선 제안</h4>
            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {events.map((event, index) => (
          <div
            key={index}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
              selectedEvents.has(index) ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedEvents.has(index)}
                onChange={() => handleEventToggle(index)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />

              <div className="flex-1 min-w-0">
                {editingEvent?.index === index ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingEvent.event.title}
                      onChange={e =>
                        setEditingEvent({
                          ...editingEvent,
                          event: { ...editingEvent.event, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="이벤트 제목"
                    />

                    <textarea
                      value={editingEvent.event.description}
                      onChange={e =>
                        setEditingEvent({
                          ...editingEvent,
                          event: { ...editingEvent.event, description: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="설명"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="datetime-local"
                        value={editingEvent.event.start_date}
                        onChange={e =>
                          setEditingEvent({
                            ...editingEvent,
                            event: { ...editingEvent.event, start_date: e.target.value },
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />

                      <input
                        type="datetime-local"
                        value={editingEvent.event.end_date}
                        onChange={e =>
                          setEditingEvent({
                            ...editingEvent,
                            event: { ...editingEvent.event, end_date: e.target.value },
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={editingEvent.event.category}
                        onChange={e =>
                          setEditingEvent({
                            ...editingEvent,
                            event: { ...editingEvent.event, category: e.target.value },
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={editingEvent.event.location}
                        onChange={e =>
                          setEditingEvent({
                            ...editingEvent,
                            event: { ...editingEvent.event, location: e.target.value },
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="장소"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleEventCancel}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleEventSave}
                        className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      {event.category && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}
                        >
                          <Tag className="w-3 h-3" />
                          {CATEGORIES.find(c => c.value === event.category)?.label}
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-gray-600 text-sm mb-2">{event.description}</p>
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

                      {event.reminder_minutes !== undefined && event.reminder_minutes > 0 && (
                        <div className="flex items-center gap-1">
                          <Bell className="w-4 h-4" />
                          <span>
                            {REMINDER_OPTIONS.find(r => r.value === event.reminder_minutes)?.label}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {editingEvent?.index !== index && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEventEdit(index)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="수정"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEventDelete(index)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="삭제"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50"
          >
            취소
          </button>

          <div className="flex gap-2">
            <span className="text-sm text-gray-500 self-center">
              {selectedEvents.size}개 이벤트를 저장합니다
            </span>
            <button
              onClick={handleSaveSelected}
              disabled={loading || selectedEvents.size === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  선택한 이벤트 저장
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
