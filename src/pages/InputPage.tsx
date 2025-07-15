import React, { useState } from 'react'
import { Calendar, Upload, FileText, Image, Sparkles, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { TextAnalyzer } from '../utils/textAnalyzer'

interface ExtractedEvent {
  title: string
  date: string
  time: string
  description: string
  location?: string
}

interface InputPageProps {
  onEventsExtracted: (events: ExtractedEvent[]) => void
}

export function InputPage({ onEventsExtracted }: InputPageProps) {
  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { user, signOut } = useAuth()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    } else {
      alert('이미지 파일만 업로드 가능합니다.')
    }
  }

  const handleExtract = async () => {
    if (!text.trim() && !selectedFile) {
      alert('텍스트를 입력하거나 이미지를 업로드해주세요.')
      return
    }

    setLoading(true)
    
    try {
      let extractedEvents: ExtractedEvent[] = []
      
      if (text.trim()) {
        // 텍스트 분석
        const analyzer = new TextAnalyzer()
        extractedEvents = analyzer.analyzeText(text)
        console.log('추출된 이벤트:', extractedEvents)
      } else if (selectedFile) {
        // 이미지 OCR 처리 (추후 구현)
        await new Promise(resolve => setTimeout(resolve, 2000)) // OCR 시뮬레이션
        extractedEvents = [
          {
            title: '이미지에서 추출된 일정',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 내일
            time: '09:00',
            description: '이미지에서 추출된 이벤트 정보',
            location: undefined
          }
        ]
      }
      
      if (extractedEvents.length === 0) {
        alert('텍스트에서 일정 정보를 찾을 수 없습니다. 더 구체적으로 입력해주세요.')
        return
      }
      
      onEventsExtracted(extractedEvents)
    } catch (error) {
      console.error('이벤트 추출 실패:', error)
      alert('이벤트 추출 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 fade-in">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SimpleCalendar</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.email?.split('@')[0]}님 안녕하세요
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 smooth-transition"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-xl p-8 card-shadow">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              일정 정보를 입력해주세요
            </h2>
            <p className="text-gray-600">
              텍스트로 입력하거나 이미지를 업로드하면 AI가 캘린더 이벤트를 자동으로 추출합니다
            </p>
          </div>

          <div className="space-y-6">
            {/* 텍스트 입력 영역 */}
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-3">
                <FileText className="w-5 h-5" />
                텍스트 입력
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`예시:
• 내일 오후 2시 친구 만남
• 24일 오후 5시 미팅 예정
• 3일후 7시에 라이브방송 시작
• 모레 오전 10시 병원 진료
• 금요일 6시 저녁 약속`}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 smooth-transition resize-none"
              />
            </div>

            {/* 구분선 */}
            <div className="flex items-center">
              <hr className="flex-1 border-gray-300" />
              <span className="px-4 text-gray-500 font-medium">또는</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* 이미지 업로드 영역 */}
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-3">
                <Image className="w-5 h-5" />
                이미지 업로드
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 smooth-transition">
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      제거
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        이미지를 여기에 드래그하거나 클릭하여 업로드
                      </p>
                      <p className="text-sm text-gray-500">PNG, JPG, JPEG 파일만 지원</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer smooth-transition"
                    >
                      파일 선택
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* 추출 버튼 */}
            <div className="pt-4">
              <button
                onClick={handleExtract}
                disabled={loading || (!text.trim() && !selectedFile)}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed smooth-transition font-medium text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    AI가 분석중입니다...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    이벤트 추출하기
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}