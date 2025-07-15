import React from 'react'
import { Calendar, Clock, MapPin, FileText, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'

interface ExtractedEvent {
  title: string
  date: string
  time: string
  description: string
  location?: string
}

interface ConfirmationPageProps {
  events: ExtractedEvent[]
  onConfirm: () => void
  onBack: () => void
}

export function ConfirmationPage({ events, onConfirm, onBack }: ConfirmationPageProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 fade-in">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">이벤트 확인</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-xl p-8 card-shadow">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              분석 완료!
            </h2>
            <p className="text-gray-600">
              다음 정보가 추출되었습니다. 내용을 확인하고 구글 캘린더에 등록하세요.
            </p>
          </div>

          {/* 이벤트 목록 */}
          <div className="space-y-6 mb-8">
            {events.map((event, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md smooth-transition"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 기본 정보 */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">{event.time}</span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <span className="font-medium">{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* 설명 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-700">상세 내용</span>
                    </div>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 smooth-transition font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              다시 입력하기
            </button>
            
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 smooth-transition font-medium"
            >
              <Calendar className="w-5 h-5" />
              구글 캘린더에 등록하기
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* 안내 메시지 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>안내:</strong> 등록 후에는 구글 캘린더에서 직접 수정할 수 있습니다.
              정보가 정확하지 않다면 "다시 입력하기"를 눌러 수정해주세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}