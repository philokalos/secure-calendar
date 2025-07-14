import { createClient } from '@supabase/supabase-js'
import { env } from '../utils/envValidation'

export const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

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
