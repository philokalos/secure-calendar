import { useState, useEffect, useRef, useCallback } from 'react'

// interface SpeechRecognitionResult {
//   transcript: string
//   confidence: number
//   isFinal: boolean
// }

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  finalTranscript: string
  interimTranscript: string
  confidence: number
  error: string | null
  supported: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

// 브라우저 호환성을 위한 타입 확장
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [supported, setSupported] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 브라우저 지원 확인
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      setSupported(true)

      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      // 기본 설정
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'ko-KR' // 한국어 설정
      recognition.maxAlternatives = 1

      // 결과 처리
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ''
        let finalTranscript = ''
        let maxConfidence = 0

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcript = result[0].transcript

          if (result.isFinal) {
            finalTranscript += transcript
            maxConfidence = Math.max(maxConfidence, result[0].confidence)
          } else {
            interimTranscript += transcript
          }
        }

        setInterimTranscript(interimTranscript)

        if (finalTranscript) {
          setFinalTranscript(prev => prev + finalTranscript)
          setTranscript(prev => prev + finalTranscript)
          setConfidence(maxConfidence)
        }

        // 자동 중지 타이머 리셋
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        // 3초간 음성이 없으면 자동 중지
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
          }
        }, 3000)
      }

      // 음성 인식 시작
      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
        console.log('음성 인식 시작')
      }

      // 음성 인식 종료
      recognition.onend = () => {
        setIsListening(false)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        console.log('음성 인식 종료')
      }

      // 오류 처리
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false)
        setError(getErrorMessage(event.error))
        console.error('음성 인식 오류:', event.error)
      }

      // 음성 감지 시작
      recognition.onspeechstart = () => {
        console.log('음성 감지됨')
      }

      // 음성 감지 종료
      recognition.onspeechend = () => {
        console.log('음성 감지 종료')
      }

      // 오디오 시작
      recognition.onaudiostart = () => {
        console.log('오디오 캡처 시작')
      }

      // 오디오 종료
      recognition.onaudioend = () => {
        console.log('오디오 캡처 종료')
      }
    } else {
      setSupported(false)
      setError('이 브라우저는 음성 인식을 지원하지 않습니다.')
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isListening])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return

    try {
      setError(null)
      setInterimTranscript('')
      recognitionRef.current.start()
    } catch (error) {
      setError('음성 인식을 시작할 수 없습니다.')
      console.error('Start listening error:', error)
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return

    try {
      recognitionRef.current.stop()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    } catch (error) {
      console.error('Stop listening error:', error)
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setFinalTranscript('')
    setInterimTranscript('')
    setConfidence(0)
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    finalTranscript,
    interimTranscript,
    confidence,
    error,
    supported,
    startListening,
    stopListening,
    resetTranscript,
  }
}

function getErrorMessage(error: string): string {
  switch (error) {
    case 'no-speech':
      return '음성이 감지되지 않았습니다. 다시 시도해주세요.'
    case 'aborted':
      return '음성 인식이 중단되었습니다.'
    case 'audio-capture':
      return '마이크에 접근할 수 없습니다. 마이크 권한을 확인해주세요.'
    case 'network':
      return '네트워크 오류가 발생했습니다.'
    case 'not-allowed':
      return '마이크 접근 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.'
    case 'service-not-allowed':
      return '음성 인식 서비스가 허용되지 않았습니다.'
    case 'bad-grammar':
      return '음성 인식 문법 오류가 발생했습니다.'
    case 'language-not-supported':
      return '지원되지 않는 언어입니다.'
    default:
      return `음성 인식 오류: ${error}`
  }
}
