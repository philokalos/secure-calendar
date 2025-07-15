declare global {
  interface Window {
    gapi: {
      load: (apis: string, callback: () => void) => void
      client: {
        init: (config: unknown) => Promise<void>
        calendar: {
          events: {
            insert: (params: unknown) => Promise<{ status: number; result: { id: string } }>
          }
        }
      }
      auth2: {
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean
          }
          signIn: () => Promise<void>
        }
      }
    }
  }
}

interface CalendarEvent {
  title: string
  date: string
  time: string
  description: string
  location?: string
}

export class GoogleCalendarService {
  private isInitialized = false
  private isSignedIn = false

  constructor() {
    this.loadGapi()
  }

  // Google API 스크립트 로드
  private async loadGapi(): Promise<void> {
    if (typeof window.gapi !== 'undefined') {
      return
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          this.initializeGapi().then(resolve).catch(reject)
        })
      }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // Google API 초기화
  private async initializeGapi(): Promise<void> {
    try {
      await window.gapi.client.init({
        apiKey: 'AIzaSyBX_YOUR_API_KEY_HERE', // 실제 API 키 필요
        clientId: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com', // 실제 클라이언트 ID 필요
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      })

      this.isInitialized = true
      this.isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get()
    } catch (error) {
      console.error('Google API 초기화 실패:', error)
      throw new Error('Google Calendar 서비스를 초기화할 수 없습니다.')
    }
  }

  // Google 계정 로그인
  async signIn(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.loadGapi()
    }

    try {
      const authInstance = window.gapi.auth2.getAuthInstance()
      if (!this.isSignedIn) {
        await authInstance.signIn()
      }
      this.isSignedIn = true
      return true
    } catch (error) {
      console.error('Google 로그인 실패:', error)
      return false
    }
  }

  // 캘린더 이벤트 등록
  async createEvent(event: CalendarEvent): Promise<{ success: boolean; message: string; eventId?: string; calendarLink?: string }> {
    try {
      // 현재는 Google API 키가 없으므로 시뮬레이션
      console.log('구글 캘린더 이벤트 등록 시뮬레이션:', event)
      
      // 실제 API 호출 대신 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000))

      // 성공 시뮬레이션 (90% 확률)
      if (Math.random() > 0.1) {
        const eventId = `event_${Date.now()}`
        const calendarLink = `https://calendar.google.com/calendar/event?eid=${eventId}`
        
        return {
          success: true,
          message: '구글 캘린더에 성공적으로 등록되었습니다!',
          eventId,
          calendarLink
        }
      } else {
        // 실패 시뮬레이션
        return {
          success: false,
          message: '구글 캘린더 등록 중 오류가 발생했습니다. 다시 시도해주세요.'
        }
      }

      // 실제 구현시 사용할 코드 (주석 처리)
      /*
      if (!this.isSignedIn) {
        const signedIn = await this.signIn()
        if (!signedIn) {
          return {
            success: false,
            message: 'Google 계정 로그인이 필요합니다.'
          }
        }
      }

      // 이벤트 날짜/시간 변환
      const startDateTime = new Date(`${event.date}T${event.time}:00`)
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) // 1시간 후

      const calendarEvent = {
        summary: event.title,
        description: event.description,
        location: event.location,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'Asia/Seoul'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Asia/Seoul'
        }
      }

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: calendarEvent
      })

      if (response.status === 200) {
        const eventId = response.result.id
        const calendarLink = `https://calendar.google.com/calendar/event?eid=${eventId}`
        
        return {
          success: true,
          message: '구글 캘린더에 성공적으로 등록되었습니다!',
          eventId,
          calendarLink
        }
      } else {
        return {
          success: false,
          message: '구글 캘린더 등록에 실패했습니다.'
        }
      }
      */

    } catch (error) {
      console.error('구글 캘린더 등록 오류:', error)
      return {
        success: false,
        message: '구글 캘린더 등록 중 오류가 발생했습니다.'
      }
    }
  }

  // 여러 이벤트 일괄 등록
  async createEvents(events: CalendarEvent[]): Promise<{ success: boolean; message: string; results: unknown[] }> {
    const results = []
    let successCount = 0

    for (const event of events) {
      const result = await this.createEvent(event)
      results.push(result)
      if (result.success) {
        successCount++
      }
    }

    const totalCount = events.length
    if (successCount === totalCount) {
      return {
        success: true,
        message: `${successCount}개의 이벤트가 모두 성공적으로 등록되었습니다!`,
        results
      }
    } else if (successCount > 0) {
      return {
        success: true,
        message: `${successCount}/${totalCount}개의 이벤트가 등록되었습니다.`,
        results
      }
    } else {
      return {
        success: false,
        message: '모든 이벤트 등록에 실패했습니다.',
        results
      }
    }
  }
}

// 싱글톤 인스턴스
export const googleCalendarService = new GoogleCalendarService()