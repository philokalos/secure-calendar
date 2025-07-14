import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, MapPin, Tag, FileText, Bell } from 'lucide-react'
import { Event, EventFormData } from '../types'
import { formatDateTime } from '../utils/dateUtils'

interface EventFormProps {
  isOpen: boolean
  onClose: () => void
  event?: Event | null
  selectedDate?: Date | null
  onSave: (eventData: EventFormData) => Promise<{ data: Event | null; error: string | null }>
  onDelete?: (eventId: string) => Promise<{ error: string | null }>
  loading?: boolean
}

interface FormErrors {
  title?: string
  start_date?: string
  end_date?: string
  general?: string
}

const CATEGORIES = [
  { value: '', label: '카테고리 선택' },
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
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
  { value: 10080, label: '1주일 전' },
]

export function EventForm({
  isOpen,
  onClose,
  event,
  selectedDate,
  onSave,
  onDelete,
  loading: _loading = false,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    category: '',
    location: '',
    reminder_minutes: 15,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        start_date: formatDateTime(event.start_date, "yyyy-MM-dd'T'HH:mm"),
        end_date: formatDateTime(event.end_date, "yyyy-MM-dd'T'HH:mm"),
        category: event.category || '',
        location: event.location || '',
        reminder_minutes: event.reminder_minutes || 15,
      })
    } else if (selectedDate) {
      const startDate = new Date(selectedDate)
      startDate.setHours(9, 0, 0, 0)
      const endDate = new Date(selectedDate)
      endDate.setHours(10, 0, 0, 0)

      setFormData({
        title: '',
        description: '',
        start_date: formatDateTime(startDate, "yyyy-MM-dd'T'HH:mm"),
        end_date: formatDateTime(endDate, "yyyy-MM-dd'T'HH:mm"),
        category: '',
        location: '',
        reminder_minutes: 15,
      })
    }
    setErrors({})
  }, [event, selectedDate, isOpen])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.'
    }

    if (!formData.start_date) {
      newErrors.start_date = '시작 시간을 입력해주세요.'
    }

    if (!formData.end_date) {
      newErrors.end_date = '종료 시간을 입력해주세요.'
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)

      if (endDate <= startDate) {
        newErrors.end_date = '종료 시간은 시작 시간보다 늦어야 합니다.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const { error } = await onSave(formData)

      if (error) {
        setErrors({ general: error })
      } else {
        onClose()
        // Reset form
        setFormData({
          title: '',
          description: '',
          start_date: '',
          end_date: '',
          category: '',
          location: '',
          reminder_minutes: 15,
        })
      }
    } catch {
      setErrors({ general: '예상치 못한 오류가 발생했습니다.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!event || !onDelete) return

    if (!confirm('정말로 이 이벤트를 삭제하시겠습니까?')) {
      return
    }

    setIsDeleting(true)
    setErrors({})

    try {
      const { error } = await onDelete(event.id)

      if (error) {
        setErrors({ general: error })
      } else {
        onClose()
      }
    } catch {
      setErrors({ general: '이벤트 삭제 중 오류가 발생했습니다.' })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleInputChange = (field: keyof EventFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear specific field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {event ? '이벤트 수정' : '새 이벤트 만들기'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={isSubmitting || isDeleting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              제목 *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="이벤트 제목을 입력하세요"
              disabled={isSubmitting || isDeleting}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="이벤트에 대한 추가 정보를 입력하세요"
              disabled={isSubmitting || isDeleting}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                시작 시간 *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.start_date}
                onChange={e => handleInputChange('start_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.start_date ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting || isDeleting}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                종료 시간 *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.end_date}
                onChange={e => handleInputChange('end_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.end_date ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting || isDeleting}
              />
              {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
            </div>
          </div>

          {/* Category and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4" />
                카테고리
              </label>
              <select
                value={formData.category}
                onChange={e => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting || isDeleting}
              >
                {CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                장소
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={e => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="장소를 입력하세요"
                disabled={isSubmitting || isDeleting}
              />
            </div>
          </div>

          {/* Reminder */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Bell className="w-4 h-4" />
              알림
            </label>
            <select
              value={formData.reminder_minutes}
              onChange={e => handleInputChange('reminder_minutes', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting || isDeleting}
            >
              {REMINDER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            {event && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    삭제 중...
                  </>
                ) : (
                  '삭제'
                )}
              </button>
            )}

            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {event ? '수정 중...' : '생성 중...'}
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    {event ? '수정' : '생성'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
