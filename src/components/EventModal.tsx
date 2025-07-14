import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Event, EventFormData } from '../types'
import { formatDateTime } from '../utils/dateUtils'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event?: Event | null
  selectedDate?: Date | null
  onSave: (eventData: EventFormData) => void
  onDelete?: (eventId: string) => void
}

export function EventModal({
  isOpen,
  onClose,
  event,
  selectedDate,
  onSave,
  onDelete,
}: EventModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    category: '',
    location: '',
    reminder_minutes: 0,
  })

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        start_date: formatDateTime(event.start_date, "yyyy-MM-dd'T'HH:mm"),
        end_date: formatDateTime(event.end_date, "yyyy-MM-dd'T'HH:mm"),
        category: event.category || '',
        location: event.location || '',
        reminder_minutes: event.reminder_minutes || 0,
      })
    } else if (selectedDate) {
      const dateStr = formatDateTime(selectedDate, "yyyy-MM-dd'T'09:00")
      const endDateStr = formatDateTime(selectedDate, "yyyy-MM-dd'T'10:00")
      setFormData({
        title: '',
        description: '',
        start_date: dateStr,
        end_date: endDateStr,
        category: '',
        location: '',
        reminder_minutes: 0,
      })
    }
  }, [event, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{event ? '이벤트 수정' : '새 이벤트'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
              <input
                type="datetime-local"
                required
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
              <input
                type="datetime-local"
                required
                value={formData.end_date}
                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">카테고리 선택</option>
              <option value="work">업무</option>
              <option value="personal">개인</option>
              <option value="health">건강</option>
              <option value="education">교육</option>
              <option value="social">사회</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">알림 (분 전)</label>
            <select
              value={formData.reminder_minutes}
              onChange={e => setFormData({ ...formData, reminder_minutes: Number(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={0}>알림 없음</option>
              <option value={5}>5분 전</option>
              <option value={15}>15분 전</option>
              <option value={30}>30분 전</option>
              <option value={60}>1시간 전</option>
              <option value={1440}>1일 전</option>
            </select>
          </div>

          <div className="flex justify-between pt-4">
            {event && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                삭제
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
              >
                {event ? '수정' : '생성'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
