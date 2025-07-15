import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface CustomAuthError {
  message: string
  status?: number
  name?: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ error: AuthError | CustomAuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('로그인 시도:', { email, hasPassword: !!password })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      
      if (error) {
        console.error('로그인 에러:', error)
        
        // Supabase 에러 메시지 한국어화
        let errorMessage = error.message
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다. 이메일 확인을 완료했는지 확인해주세요.'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = '이메일 확인이 완료되지 않았습니다. 이메일을 확인해주세요.'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = '올바른 이메일 형식을 입력해주세요.'
        } else if (error.message.includes('Too many requests')) {
          errorMessage = '너무 많은 로그인 시도입니다. 잠시 후 다시 시도해주세요.'
        }
        
        return { error: { ...error, message: errorMessage } as AuthError }
      }
      
      console.log('로그인 성공:', data)
      return { error: null }
    } catch (err) {
      console.error('로그인 예외 발생:', err)
      return { 
        error: { 
          message: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
          name: 'UnknownError'
        } as AuthError 
      }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      console.log('회원가입 시도:', { email, hasPassword: !!password })
      
      // 비밀번호 길이 검증
      if (password.length < 6) {
        return { 
          error: { 
            message: '비밀번호는 최소 6자 이상이어야 합니다.',
            status: 400,
            name: 'ValidationError'
          } as CustomAuthError 
        }
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return { 
          error: { 
            message: '올바른 이메일 형식을 입력해주세요.',
            status: 400,
            name: 'ValidationError'
          } as CustomAuthError 
        }
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            // 사용자 메타데이터 추가 가능
          }
        }
      })
      
      if (error) {
        console.error('회원가입 에러:', error)
        // Supabase 에러 메시지 한국어화
        let errorMessage = error.message
        if (error.message.includes('User already registered')) {
          errorMessage = '이미 등록된 이메일입니다.'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = '올바른 이메일 형식을 입력해주세요.'
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.'
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = '현재 회원가입이 비활성화되어 있습니다.'
        }
        return { error: { ...error, message: errorMessage } as AuthError }
      }

      if (data.user && !data.user.email_confirmed_at) {
        console.log('이메일 확인 필요')
        return { 
          error: { 
            message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
            status: 200,
            name: 'EmailConfirmationRequired'
          } as CustomAuthError 
        }
      }
      
      console.log('회원가입 성공:', data)
      return { error: null }
    } catch (err) {
      console.error('회원가입 예외 발생:', err)
      return { 
        error: { 
          message: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
          status: 500,
          name: 'UnknownError'
        } as CustomAuthError 
      }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('이메일 재전송 에러:', error)
        let errorMessage = error.message
        if (error.message.includes('For security purposes')) {
          errorMessage = '보안상 이유로 잠시 후 다시 시도해주세요.'
        }
        return { error: { ...error, message: errorMessage } as AuthError }
      }
      
      return { error: null }
    } catch (err) {
      console.error('이메일 재전송 예외:', err)
      return { 
        error: { 
          message: '이메일 재전송 중 오류가 발생했습니다.',
          name: 'ResendError'
        } as AuthError 
      }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resendConfirmation,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
