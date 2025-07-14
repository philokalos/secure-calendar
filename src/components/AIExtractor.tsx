import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Mic, MicOff, Image, Camera, FileText, X, AlertCircle } from 'lucide-react'
import { EventFormData } from '../types'
import { EventPreview } from './EventPreview'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { getOCRService, OCRService } from '../utils/ocrService'
import { createAIService, AIService } from '../utils/aiService'

interface AIExtractorProps {
  onExtract: (events: EventFormData[]) => void
}

type InputMode = 'text' | 'voice' | 'image'
type ProcessingStep = 'input' | 'processing' | 'preview'

export function AIExtractor({ onExtract }: AIExtractorProps) {
  const [inputMode, setInputMode] = useState<InputMode>('text')
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('input')
  const [text, setText] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedEvents, setExtractedEvents] = useState<EventFormData[]>([])
  const [confidence, setConfidence] = useState(0)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const ocrServiceRef = useRef<OCRService | null>(null)
  const aiServiceRef = useRef<AIService | null>(null)

  const {
    isListening,
    transcript,
    finalTranscript,
    interimTranscript,
    error: speechError,
    supported: speechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition()

  useEffect(() => {
    // AI 서비스 초기화
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
    aiServiceRef.current = createAIService(apiKey)

    // OCR 서비스 초기화
    ocrServiceRef.current = getOCRService()

    return () => {
      // 정리
      if (ocrServiceRef.current) {
        ocrServiceRef.current.terminate()
      }
    }
  }, [])

  useEffect(() => {
    // 음성 인식 결과를 텍스트에 추가
    if (finalTranscript) {
      setText(prev => prev + (prev ? '\n' : '') + finalTranscript)
      resetTranscript()
    }
  }, [finalTranscript, resetTranscript])

  const extractEvents = async () => {
    if (!text.trim()) return

    setIsExtracting(true)
    setError(null)
    setCurrentStep('processing')
    setProcessingProgress(0)

    try {
      // AI 서비스 사용 시도
      if (aiServiceRef.current) {
        setProcessingProgress(30)
        const result = await aiServiceRef.current.extractEvents({
          text: text.trim(),
          extractionType: 'events',
          context: '한국어 캘린더 이벤트 추출',
        })

        setProcessingProgress(80)
        setExtractedEvents(result.events)
        setConfidence(result.confidence)
        setSuggestions(result.suggestions || [])
      } else {
        // 폴백 규칙 기반 추출
        setProcessingProgress(50)
        const events = parseEventsFromText(text)
        setExtractedEvents(events)
        setConfidence(0.6)
        setSuggestions(['AI 서비스를 사용할 수 없어 기본 규칙으로 추출했습니다.'])
      }

      setProcessingProgress(100)
      setCurrentStep('preview')
    } catch (error) {
      console.error('이벤트 추출 실패:', error)
      setError(error instanceof Error ? error.message : '이벤트 추출 중 오류가 발생했습니다.')
      setCurrentStep('input')
    } finally {
      setIsExtracting(false)
      setProcessingProgress(0)
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsExtracting(true)
      setError(null)
      setCurrentStep('processing')
      setProcessingProgress(0)

      // 파일 검증
      await OCRService.validateImageFile(file)

      if (!ocrServiceRef.current) {
        throw new Error('OCR 서비스를 초기화할 수 없습니다.')
      }

      setProcessingProgress(20)

      // 이미지 전처리
      const preprocessedImage = await ocrServiceRef.current.preprocessImage(file)
      setProcessingProgress(40)

      // OCR 실행
      const ocrResult = await ocrServiceRef.current.recognizeFromDataURL(
        preprocessedImage,
        progress => setProcessingProgress(40 + progress * 40)
      )

      setProcessingProgress(80)

      if (ocrResult.text.trim()) {
        setText(prev => prev + (prev ? '\n' : '') + ocrResult.text)
        setProcessingProgress(100)
        setCurrentStep('input')

        // 자동으로 AI 추출 실행
        setTimeout(() => {
          setText(ocrResult.text)
          extractEvents()
        }, 500)
      } else {
        throw new Error('이미지에서 텍스트를 인식할 수 없습니다.')
      }
    } catch (error) {
      console.error('이미지 처리 실패:', error)
      setError(error instanceof Error ? error.message : '이미지 처리 중 오류가 발생했습니다.')
      setCurrentStep('input')
    } finally {
      setIsExtracting(false)
      setProcessingProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handlePreviewSave = async () => {
    setIsExtracting(true)
    try {
      onExtract(extractedEvents)
      handleReset()
    } finally {
      setIsExtracting(false)
    }
  }

  const handlePreviewCancel = () => {
    setCurrentStep('input')
    setExtractedEvents([])
    setConfidence(0)
    setSuggestions([])
  }

  const handleReset = () => {
    setText('')
    setCurrentStep('input')
    setExtractedEvents([])
    setConfidence(0)
    setSuggestions([])
    setError(null)
    resetTranscript()
  }

  const parseEventsFromText = (text: string): EventFormData[] => {
    const events: EventFormData[] = []
    const lines = text.split('\n').filter(line => line.trim())

    lines.forEach(line => {
      // 날짜와 시간 패턴 찾기
      const datePattern = /(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{4})/g
      const timePattern = /(\d{1,2}:\d{2})/g

      const dates = line.match(datePattern)
      const times = line.match(timePattern)

      if (dates && dates.length > 0) {
        let title = line
        let startDate = ''
        let endDate = ''

        // 날짜 정규화
        const normalizedDate = normalizeDate(dates[0])

        if (times && times.length >= 2) {
          // 시작시간과 종료시간이 있는 경우
          startDate = `${normalizedDate}T${times[0]}`
          endDate = `${normalizedDate}T${times[1]}`
          title = line.replace(datePattern, '').replace(timePattern, '').trim()
        } else if (times && times.length === 1) {
          // 시작시간만 있는 경우 (1시간 기본 설정)
          startDate = `${normalizedDate}T${times[0]}`
          const [hour, minute] = times[0].split(':')
          const endHour = String(parseInt(hour) + 1).padStart(2, '0')
          endDate = `${normalizedDate}T${endHour}:${minute}`
          title = line.replace(datePattern, '').replace(timePattern, '').trim()
        } else {
          // 시간이 없는 경우 (종일 이벤트)
          startDate = `${normalizedDate}T09:00`
          endDate = `${normalizedDate}T10:00`
          title = line.replace(datePattern, '').trim()
        }

        // 제목이 비어있지 않은 경우에만 추가
        if (title.trim()) {
          events.push({
            title: title.trim(),
            description: '',
            start_date: startDate,
            end_date: endDate,
            category: '',
            location: '',
            reminder_minutes: 15,
          })
        }
      }
    })

    return events
  }

  const normalizeDate = (dateStr: string): string => {
    // 다양한 날짜 형식을 yyyy-MM-dd로 변환
    const cleaned = dateStr.replace(/[/-]/g, '-')
    const parts = cleaned.split('-')

    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // yyyy-MM-dd 또는 yyyy-M-d
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
      } else {
        // MM-dd-yyyy 또는 M-d-yyyy
        return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`
      }
    }

    // 기본값으로 오늘 날짜 반환
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // 처리 중 화면
  if (currentStep === 'processing') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {inputMode === 'image' ? '이미지 처리 중...' : 'AI 이벤트 추출 중...'}
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
          <p className="text-gray-500 text-sm">
            {processingProgress < 30 && '텍스트 분석 중...'}
            {processingProgress >= 30 && processingProgress < 80 && 'AI 처리 중...'}
            {processingProgress >= 80 && '결과 생성 중...'}
          </p>
        </div>
      </div>
    )
  }

  // 미리보기 화면
  if (currentStep === 'preview') {
    return (
      <EventPreview
        events={extractedEvents}
        confidence={confidence}
        suggestions={suggestions}
        onEventsChange={setExtractedEvents}
        onSaveAll={handlePreviewSave}
        onCancel={handlePreviewCancel}
        loading={isExtracting}
      />
    )
  }

  // 입력 화면
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">AI 이벤트 추출</h3>
          </div>
          {text && (
            <button
              onClick={handleReset}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="초기화"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 입력 모드 선택 */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setInputMode('text')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              inputMode === 'text'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            텍스트
          </button>

          <button
            onClick={() => setInputMode('voice')}
            disabled={!speechSupported}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              inputMode === 'voice'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            음성
          </button>

          <button
            onClick={() => setInputMode('image')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              inputMode === 'image'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Image className="w-4 h-4" />
            이미지
          </button>
        </div>

        {/* 에러 메시지 */}
        {(error || speechError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
              <p className="text-red-600 text-sm">{error || speechError}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* 텍스트 입력 */}
        {inputMode === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                텍스트에서 이벤트 추출하기
              </label>
              <textarea
                value={text + (interimTranscript ? ' ' + interimTranscript : '')}
                onChange={e => setText(e.target.value)}
                placeholder="예: 2024-01-15 14:00-15:00 팀 미팅&#10;1월 20일 19:00 저녁 약속&#10;2024/01/25 종일 휴가"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                rows={6}
                disabled={isExtracting}
              />
              {interimTranscript && (
                <p className="text-xs text-gray-500 mt-1">음성 인식 중: "{interimTranscript}"</p>
              )}
            </div>

            <div className="text-xs text-gray-500">
              <p className="mb-1">지원되는 형식:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>날짜: 2024-01-15, 01/15/2024, 1월 15일</li>
                <li>시간: 14:00, 14:00-15:00</li>
                <li>예: "2024-01-15 14:00-15:00 팀 미팅"</li>
              </ul>
            </div>
          </div>
        )}

        {/* 음성 입력 */}
        {inputMode === 'voice' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <button
                onClick={handleVoiceToggle}
                disabled={!speechSupported || isExtracting}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-purple-600 hover:bg-purple-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isListening ? <MicOff /> : <Mic />}
              </button>
              <p className="mt-4 text-gray-600">
                {!speechSupported
                  ? '이 브라우저는 음성 인식을 지원하지 않습니다.'
                  : isListening
                    ? '음성을 인식하고 있습니다...'
                    : '마이크 버튼을 클릭하여 음성 입력을 시작하세요.'}
              </p>
              {transcript && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md text-left">
                  <p className="text-sm text-gray-700">{transcript}</p>
                  {interimTranscript && (
                    <p className="text-sm text-gray-500 italic">{interimTranscript}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 이미지 입력 */}
        {inputMode === 'image' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지에서 텍스트 추출하기
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50"
              >
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">이미지를 클릭하여 업로드하세요</p>
                <p className="text-xs text-gray-500">JPEG, PNG, GIF, WebP (최대 10MB)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isExtracting}
              />
            </div>

            <div className="text-xs text-gray-500">
              <p className="mb-1">💡 팁:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>선명하고 텍스트가 잘 보이는 이미지를 사용하세요</li>
                <li>스크린샷, 스캔 문서, 손글씨 메모 등을 지원합니다</li>
                <li>이미지에서 텍스트를 추출한 후 자동으로 AI 분석이 시작됩니다</li>
              </ul>
            </div>
          </div>
        )}

        {/* 추출 버튼 */}
        {(text.trim() || transcript.trim()) && inputMode !== 'image' && (
          <div className="mt-6">
            <button
              onClick={extractEvents}
              disabled={isExtracting || (!text.trim() && !transcript.trim())}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExtracting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  추출 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI로 이벤트 추출하기
                </>
              )}
            </button>
          </div>
        )}

        {/* 음성 인식 컨트롤 */}
        {inputMode === 'voice' && speechSupported && transcript && (
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => {
                setText(transcript)
                setInputMode('text')
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              텍스트로 편집
            </button>
            <button
              onClick={extractEvents}
              disabled={isExtracting || !transcript.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              바로 추출
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
