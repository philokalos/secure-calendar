import { EventFormData } from '../types'
import { env } from './envValidation'

export interface AIExtractionRequest {
  text: string
  context?: string
  extractionType: 'events' | 'schedule' | 'calendar'
}

export interface AIExtractionResponse {
  events: EventFormData[]
  confidence: number
  suggestions?: string[]
}

export class AIService {
  private apiKey: string
  private baseUrl: string = 'https://api.anthropic.com/v1/messages'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async extractEvents(request: AIExtractionRequest): Promise<AIExtractionResponse> {
    try {
      const prompt = this.buildEventExtractionPrompt(request.text, request.context)

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return this.parseAIResponse(data.content[0].text)
    } catch (error) {
      console.error('AI extraction error:', error)
      // Fallback to rule-based extraction
      return this.fallbackExtraction(request.text)
    }
  }

  private buildEventExtractionPrompt(text: string, context?: string): string {
    return `당신은 한국어 텍스트에서 캘린더 이벤트를 추출하는 전문가입니다.

다음 텍스트에서 이벤트 정보를 추출하여 JSON 형식으로 반환해주세요:

텍스트: "${text}"

${context ? `추가 컨텍스트: "${context}"` : ''}

다음 JSON 형식으로 응답해주세요:
{
  "events": [
    {
      "title": "이벤트 제목",
      "description": "이벤트 설명 (선택사항)",
      "start_date": "YYYY-MM-DDTHH:MM",
      "end_date": "YYYY-MM-DDTHH:MM",
      "category": "work|personal|health|education|social",
      "location": "장소 (선택사항)",
      "reminder_minutes": 15
    }
  ],
  "confidence": 0.95,
  "suggestions": ["개선 제안사항들"]
}

규칙:
1. 날짜와 시간을 정확히 파악하세요
2. 불명확한 시간은 일반적인 시간으로 추정하세요 (예: 점심약속 → 12:00-13:00)
3. 종료시간이 없으면 1시간 후로 설정하세요
4. 카테고리는 내용에 따라 적절히 분류하세요
5. 연도가 없으면 현재 연도로 가정하세요
6. 상대적 날짜 표현을 절대 날짜로 변환하세요 (오늘: ${new Date().toISOString().split('T')[0]})

JSON만 반환하고 다른 텍스트는 포함하지 마세요.`
  }

  private parseAIResponse(responseText: string): AIExtractionResponse {
    try {
      // JSON 추출 (코드 블록이나 다른 텍스트 제거)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])

      // 응답 검증 및 정규화
      return {
        events: this.validateAndNormalizeEvents(parsed.events || []),
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      throw new Error('AI 응답을 파싱할 수 없습니다.')
    }
  }

  private validateAndNormalizeEvents(events: unknown[]): EventFormData[] {
    return events
      .filter((event): event is Record<string, unknown> => {
        return (
          typeof event === 'object' &&
          event !== null &&
          'title' in event &&
          'start_date' in event &&
          'end_date' in event &&
          new Date(String(event.start_date)).getTime() < new Date(String(event.end_date)).getTime()
        )
      })
      .map(event => ({
        title: String(event.title).trim(),
        description: event.description ? String(event.description).trim() : '',
        start_date: this.normalizeDateTime(String(event.start_date)),
        end_date: this.normalizeDateTime(String(event.end_date)),
        category: this.validateCategory(String(event.category || '')),
        location: event.location ? String(event.location).trim() : '',
        reminder_minutes: this.validateReminderMinutes(event.reminder_minutes),
      }))
  }

  private normalizeDateTime(dateTime: string): string {
    try {
      const date = new Date(dateTime)
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date')
      }
      return date.toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM
    } catch {
      // 기본값으로 현재 시간 반환
      return new Date().toISOString().slice(0, 16)
    }
  }

  private validateCategory(category: string): string {
    const validCategories = ['work', 'personal', 'health', 'education', 'social']
    return validCategories.includes(category) ? category : ''
  }

  private validateReminderMinutes(minutes: unknown): number {
    const num = Number(minutes)
    return isNaN(num) || num < 0 ? 15 : num
  }

  // 폴백 규칙 기반 추출
  private fallbackExtraction(text: string): AIExtractionResponse {
    const events: EventFormData[] = []
    const lines = text.split('\n').filter(line => line.trim())

    lines.forEach(line => {
      const datePattern = /(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{4})/g
      const timePattern = /(\d{1,2}:\d{2})/g

      const dates = line.match(datePattern)
      const times = line.match(timePattern)

      if (dates && dates.length > 0) {
        let title = line
        let startDate = ''
        let endDate = ''

        const normalizedDate = this.normalizeDate(dates[0])

        if (times && times.length >= 2) {
          startDate = `${normalizedDate}T${times[0]}`
          endDate = `${normalizedDate}T${times[1]}`
          title = line.replace(datePattern, '').replace(timePattern, '').trim()
        } else if (times && times.length === 1) {
          startDate = `${normalizedDate}T${times[0]}`
          const [hour, minute] = times[0].split(':')
          const endHour = String(parseInt(hour) + 1).padStart(2, '0')
          endDate = `${normalizedDate}T${endHour}:${minute}`
          title = line.replace(datePattern, '').replace(timePattern, '').trim()
        } else {
          startDate = `${normalizedDate}T09:00`
          endDate = `${normalizedDate}T10:00`
          title = line.replace(datePattern, '').trim()
        }

        if (title.trim()) {
          events.push({
            title: title.trim(),
            description: '',
            start_date: startDate,
            end_date: endDate,
            category: this.guessCategory(title),
            location: '',
            reminder_minutes: 15,
          })
        }
      }
    })

    return {
      events,
      confidence: 0.6,
      suggestions: ['AI 서비스를 사용할 수 없어 기본 규칙으로 추출했습니다.'],
    }
  }

  private normalizeDate(dateStr: string): string {
    const cleaned = dateStr.replace(/[/-]/g, '-')
    const parts = cleaned.split('-')

    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
      } else {
        return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`
      }
    }

    return new Date().toISOString().split('T')[0]
  }

  private guessCategory(title: string): string {
    const lowerTitle = title.toLowerCase()

    if (lowerTitle.includes('회의') || lowerTitle.includes('미팅') || lowerTitle.includes('업무')) {
      return 'work'
    } else if (
      lowerTitle.includes('운동') ||
      lowerTitle.includes('병원') ||
      lowerTitle.includes('건강')
    ) {
      return 'health'
    } else if (
      lowerTitle.includes('수업') ||
      lowerTitle.includes('강의') ||
      lowerTitle.includes('공부')
    ) {
      return 'education'
    } else if (
      lowerTitle.includes('약속') ||
      lowerTitle.includes('만남') ||
      lowerTitle.includes('파티')
    ) {
      return 'social'
    }

    return 'personal'
  }
}

export const createAIService = (apiKey?: string) => {
  const key = apiKey || env.VITE_CLAUDE_API_KEY
  if (!key) {
    console.warn('Claude API key not provided, using fallback extraction only')
    return null
  }
  return new AIService(key)
}
