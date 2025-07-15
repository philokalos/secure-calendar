import { createClient } from '@supabase/supabase-js'
import { env } from '../utils/envValidation'

// 디버깅용 로그
console.log('Supabase 초기화:', {
  url: env.VITE_SUPABASE_URL,
  keyLength: env.VITE_SUPABASE_ANON_KEY?.length,
  keyPrefix: env.VITE_SUPABASE_ANON_KEY?.substring(0, 10)
})

// URL과 키 검증
if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  console.error('Supabase 환경변수 누락:', {
    hasUrl: !!env.VITE_SUPABASE_URL,
    hasKey: !!env.VITE_SUPABASE_ANON_KEY
  })
  throw new Error('Supabase 환경변수가 설정되지 않았습니다')
}

export const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          user_id: string
          created_at: string
          updated_at: string
          category: string | null
          location: string | null
          reminder_minutes: number | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          user_id: string
          created_at?: string
          updated_at?: string
          category?: string | null
          location?: string | null
          reminder_minutes?: number | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          category?: string | null
          location?: string | null
          reminder_minutes?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
