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
  private initializationPromise: Promise<void> | null = null

  // Google API 초기화 (단일 인스턴스)
  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = this.initializeGapi()
    return this.initializationPromise
  }

  // Google API 초기화
  private async initializeGapi(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Google API 초기화 시작')
      
      // API 키 확인
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      
      if (!apiKey || !clientId) {
        console.error('Google API 키 없음:', { hasApiKey: !!apiKey, hasClientId: !!clientId })
        reject(new Error('Google API 키가 설정되지 않았습니다.'))
        return
      }

      // gapi 로드 확인
      if (typeof window.gapi === 'undefined') {
        console.error('Google API 스크립트가 로드되지 않았습니다.')
        reject(new Error('Google API 스크립트가 로드되지 않았습니다.'))
        return
      }

      // gapi.load로 client:auth2 로드
      window.gapi.load('client:auth2', async () => {
        try {
          console.log('Google API 클라이언트 초기화 중...')
          
          await window.gapi.client.init({
            apiKey: apiKey,
            clientId: clientId,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: 'https://www.googleapis.com/auth/calendar'
          })

          this.isInitialized = true
          const authInstance = window.gapi.auth2.getAuthInstance()
          this.isSignedIn = authInstance.isSignedIn.get()
          
          console.log('Google API 초기화 완료:', { isInitialized: this.isInitialized, isSignedIn: this.isSignedIn })
          resolve()
        } catch (error) {
          console.error('Google API 클라이언트 초기화 실패:', error)
          reject(error)
        }
      })
    })
  }

  // Google 계정 로그인
  async signIn(): Promise<boolean> {
    try {
      console.log('Google 로그인 시작')
      
      // 초기화 확인
      await this.ensureInitialized()
      
      const authInstance = window.gapi.auth2.getAuthInstance()
      if (!authInstance) {
        console.error('Google Auth 인스턴스를 찾을 수 없습니다')
        return false
      }
      
      if (!this.isSignedIn) {
        console.log('Google 로그인 팝업 표시 중...')
        await authInstance.signIn()
      }
      
      this.isSignedIn = authInstance.isSignedIn.get()
      console.log('Google 로그인 완료:', { isSignedIn: this.isSignedIn })
      return this.isSignedIn
    } catch (error) {
      console.error('Google 로그인 실패:', error)
      return false
    }
  }

  // 캘린더 이벤트 등록
  async createEvent(event: CalendarEvent): Promise<{ success: boolean; message: string; eventId?: string; calendarLink?: string }> {
    try {
      console.log('구글 캘린더 이벤트 등록 시작:', event)
      
      // 초기화 확인
      await this.ensureInitialized()
      
      // 로그인 상태 확인 및 로그인
      if (!this.isSignedIn) {
        console.log('Google 로그인 시도 중...')
        const signedIn = await this.signIn()
        if (!signedIn) {
          console.error('Google 로그인 실패')
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

      console.log('캘린더 이벤트 생성 중:', calendarEvent)

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: calendarEvent
      })

      console.log('캘린더 API 응답:', response)

      if (response.status === 200) {
        const eventId = response.result.id
        const calendarLink = `https://calendar.google.com/calendar/event?eid=${eventId}`
        
        console.log('이벤트 생성 성공:', { eventId, calendarLink })
        
        return {
          success: true,
          message: '구글 캘린더에 성공적으로 등록되었습니다!',
          eventId,
          calendarLink
        }
      } else {
        console.error('캘린더 API 응답 오류:', response.status)
        return {
          success: false,
          message: '구글 캘린더 등록에 실패했습니다.'
        }
      }

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