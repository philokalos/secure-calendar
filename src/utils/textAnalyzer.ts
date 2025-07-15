import { ExtractedEvent } from '../types'

interface DateTimeInfo {
  date: string
  time: string
}

export class TextAnalyzer {
  private today: Date

  constructor() {
    this.today = new Date()
  }

  // 메인 분석 함수
  analyzeText(text: string): ExtractedEvent[] {
    if (!text.trim()) {
      return []
    }

    console.log('분석할 텍스트:', text)

    const events: ExtractedEvent[] = []
    
    // 문장별로 분리하여 분석
    const sentences = this.splitIntoSentences(text)
    
    for (const sentence of sentences) {
      const event = this.extractEventFromSentence(sentence)
      if (event) {
        events.push(event)
      }
    }

    return events.length > 0 ? events : [this.createFallbackEvent(text)]
  }

  // 문장을 분리
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?。！？\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }

  // 단일 문장에서 이벤트 추출
  private extractEventFromSentence(sentence: string): ExtractedEvent | null {
    console.log('문장 분석:', sentence)

    const dateTime = this.extractDateTime(sentence)
    const title = this.extractTitle(sentence)
    const location = this.extractLocation(sentence)

    if (!dateTime) {
      return null
    }

    return {
      title: title || '일정',
      date: dateTime.date,
      time: dateTime.time,
      description: sentence,
      location: location
    }
  }

  // 날짜와 시간 추출
  private extractDateTime(text: string): DateTimeInfo | null {
    const now = new Date()
    const patterns = [
      // 상대적 날짜 패턴
      {
        regex: /내일\s*(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const tomorrow = new Date(now)
          tomorrow.setDate(now.getDate() + 1)
          const hour = parseInt(match[1])
          return {
            date: this.formatDate(tomorrow),
            time: this.formatTime(hour, 0)
          }
        }
      },
      {
        regex: /모레\s*(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const dayAfterTomorrow = new Date(now)
          dayAfterTomorrow.setDate(now.getDate() + 2)
          const hour = parseInt(match[1])
          return {
            date: this.formatDate(dayAfterTomorrow),
            time: this.formatTime(hour, 0)
          }
        }
      },
      {
        regex: /모레\s*오후\s*(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const dayAfterTomorrow = new Date(now)
          dayAfterTomorrow.setDate(now.getDate() + 2)
          const hour = parseInt(match[1]) + (parseInt(match[1]) < 12 ? 12 : 0)
          return {
            date: this.formatDate(dayAfterTomorrow),
            time: this.formatTime(hour, 0)
          }
        }
      },
      {
        regex: /모레\s*오전\s*(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const dayAfterTomorrow = new Date(now)
          dayAfterTomorrow.setDate(now.getDate() + 2)
          const hour = parseInt(match[1])
          return {
            date: this.formatDate(dayAfterTomorrow),
            time: this.formatTime(hour, 0)
          }
        }
      },
      {
        regex: /내일\s*오후\s*(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const tomorrow = new Date(now)
          tomorrow.setDate(now.getDate() + 1)
          const hour = parseInt(match[1]) + (parseInt(match[1]) < 12 ? 12 : 0)
          return {
            date: this.formatDate(tomorrow),
            time: this.formatTime(hour, 0)
          }
        }
      },
      {
        regex: /내일\s*오전\s*(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const tomorrow = new Date(now)
          tomorrow.setDate(now.getDate() + 1)
          const hour = parseInt(match[1])
          return {
            date: this.formatDate(tomorrow),
            time: this.formatTime(hour, 0)
          }
        }
      },
      {
        regex: /내일/g,
        handler: () => {
          const tomorrow = new Date(now)
          tomorrow.setDate(now.getDate() + 1)
          return {
            date: this.formatDate(tomorrow),
            time: '09:00'
          }
        }
      },
      // N일 후 패턴
      {
        regex: /(\d+)일?\s*후\s*(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const daysAfter = parseInt(match[1])
          const hour = parseInt(match[2])
          const futureDate = new Date(now)
          futureDate.setDate(now.getDate() + daysAfter)
          return {
            date: this.formatDate(futureDate),
            time: this.formatTime(hour, 0)
          }
        }
      },
      // 구체적 날짜 패턴
      {
        regex: /(\d{1,2})일\s*오후\s*(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const day = parseInt(match[1])
          const hour = parseInt(match[2]) + (parseInt(match[2]) < 12 ? 12 : 0)
          const targetDate = new Date(now.getFullYear(), now.getMonth(), day)
          
          // 이미 지난 날짜면 다음달로
          if (targetDate < now) {
            targetDate.setMonth(now.getMonth() + 1)
          }
          
          return {
            date: this.formatDate(targetDate),
            time: this.formatTime(hour, 0)
          }
        }
      },
      {
        regex: /(\d{1,2})일\s*(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const day = parseInt(match[1])
          const hour = parseInt(match[2])
          const targetDate = new Date(now.getFullYear(), now.getMonth(), day)
          
          if (targetDate < now) {
            targetDate.setMonth(now.getMonth() + 1)
          }
          
          return {
            date: this.formatDate(targetDate),
            time: this.formatTime(hour, 0)
          }
        }
      },
      // 시간만 있는 패턴
      {
        regex: /오후\s*(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const hour = parseInt(match[1]) + (parseInt(match[1]) < 12 ? 12 : 0)
          return {
            date: this.formatDate(now),
            time: this.formatTime(hour, 0)
          }
        }
      },
      {
        regex: /오전\s*(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const hour = parseInt(match[1])
          return {
            date: this.formatDate(now),
            time: this.formatTime(hour, 0)
          }
        }
      },
      {
        regex: /(\d{1,2})시/g,
        handler: (match: RegExpMatchArray) => {
          const hour = parseInt(match[1])
          return {
            date: this.formatDate(now),
            time: this.formatTime(hour, 0)
          }
        }
      }
    ]

    for (const pattern of patterns) {
      const match = pattern.regex.exec(text)
      if (match) {
        console.log('매칭된 패턴:', pattern.regex, match)
        return pattern.handler(match)
      }
    }

    return null
  }

  // 제목 추출
  private extractTitle(text: string): string {
    // 날짜/시간 관련 단어들을 제거하고 핵심 키워드 추출
    const cleaned = text
      .replace(/내일|오늘|모레|\d+일\s*후/g, '')
      .replace(/\d{1,2}시|\d{1,2}:\d{2}/g, '')
      .replace(/오전|오후/g, '')
      .replace(/에|이|가|을|를|으로|에서/g, '')
      .trim()

    // 주요 이벤트 키워드들
    const eventKeywords = [
      '만남', '미팅', '회의', '모임', '약속', '식사', '점심', '저녁',
      '방송', '라이브', '수업', '강의', '세미나', '프레젠테이션',
      '면접', '상담', '검진', '진료', '운동', '헬스', '요가',
      '영화', '공연', '콘서트', '전시', '여행', '출장'
    ]

    // 키워드 매칭
    for (const keyword of eventKeywords) {
      if (cleaned.includes(keyword)) {
        return keyword
      }
    }

    // 키워드가 없으면 전체 텍스트에서 추출
    const words = cleaned.split(/\s+/).filter(word => 
      word.length > 0 && 
      !['예정', '있습니다', '시작', '진행'].includes(word)
    )

    return words.slice(0, 2).join(' ') || '일정'
  }

  // 장소 추출
  private extractLocation(text: string): string | undefined {
    // 구체적 장소명 패턴
    const locationPatterns = [
      /(.+?)에서/g,
      /(.+?)으로/g,
      /(.+?)\s*에\s*/g
    ]

    for (const pattern of locationPatterns) {
      const match = pattern.exec(text)
      if (match && match[1]) {
        const location = match[1].trim()
        // 날짜/시간 단어가 아닌 경우만 장소로 인식
        if (!location.match(/내일|오늘|모레|\d+일|\d+시|오전|오후/)) {
          return location
        }
      }
    }

    return undefined
  }

  // 폴백 이벤트 생성
  private createFallbackEvent(text: string): ExtractedEvent {
    const tomorrow = new Date(this.today)
    tomorrow.setDate(this.today.getDate() + 1)

    return {
      title: this.extractTitle(text),
      date: this.formatDate(tomorrow),
      time: '09:00',
      description: text,
      location: undefined
    }
  }

  // 날짜 포맷팅 (YYYY-MM-DD)
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  // 시간 포맷팅 (HH:MM)
  private formatTime(hour: number, minute: number = 0): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }
}