import React from 'react'
import { Calendar, CheckCircle, XCircle, ExternalLink, RotateCcw, Sparkles } from 'lucide-react'

interface ResultPageProps {
  result: {
    success: boolean
    message: string
    calendarLink?: string
  }
  onBackToInput: () => void
}

export function ResultPage({ result, onBackToInput }: ResultPageProps) {
  const openCalendar = () => {
    if (result.calendarLink) {
      window.open(result.calendarLink, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 fade-in">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">등록 완료</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-xl p-8 card-shadow text-center">
          {result.success ? (
            // 성공 케이스
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🎉 등록 성공!
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                {result.message}
              </p>

              <div className="space-y-4 mb-8">
                {result.calendarLink && (
                  <button
                    onClick={openCalendar}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 smooth-transition font-medium text-lg"
                  >
                    <Calendar className="w-6 h-6" />
                    구글 캘린더 열기
                    <ExternalLink className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="p-6 bg-green-50 border border-green-200 rounded-xl mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-semibold text-green-800 mb-2">성공적으로 완료되었습니다!</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>✅ 이벤트 정보가 구글 캘린더에 추가되었습니다</li>
                      <li>✅ 설정한 시간에 알림을 받을 수 있습니다</li>
                      <li>✅ 구글 캘린더에서 언제든 수정할 수 있습니다</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // 실패 케이스
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                등록 실패
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                {result.message}
              </p>

              <div className="p-6 bg-red-50 border border-red-200 rounded-xl mb-8">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-semibold text-red-800 mb-2">등록 중 문제가 발생했습니다</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• 인터넷 연결을 확인해주세요</li>
                      <li>• 구글 캘린더 권한을 확인해주세요</li>
                      <li>• 잠시 후 다시 시도해주세요</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 새로 시작하기 버튼 */}
          <div className="pt-4">
            <button
              onClick={onBackToInput}
              className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 smooth-transition font-medium"
            >
              <Sparkles className="w-5 h-5" />
              새로운 이벤트 추가하기
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* 추가 안내 */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>💡 팁:</strong> 여러 개의 이벤트를 한 번에 추가하려면 
              텍스트나 이미지에 모든 일정 정보를 포함해서 입력해보세요!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}