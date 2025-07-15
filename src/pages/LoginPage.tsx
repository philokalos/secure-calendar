import React, { useState } from 'react'
import { Calendar as CalendarIcon, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResendButton, setShowResendButton] = useState(false)

  const { signIn, signUp, resendConfirmation } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 클라이언트 측 유효성 검사
    if (!email.trim()) {
      setError('이메일을 입력해주세요.')
      setLoading(false)
      return
    }

    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.')
      setLoading(false)
      return
    }

    if (!isLogin && password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    try {
      const { error } = isLogin ? await signIn(email, password) : await signUp(email, password)

      if (error) {
        // 성공적인 회원가입 메시지인 경우 (이메일 확인 필요)
        if (error.status === 200) {
          setError('')
          alert(error.message)
          setIsLogin(true) // 로그인 모드로 전환
        } else {
          setError(error.message)
          // 이메일 확인 관련 에러 시 재전송 버튼 표시
          if (error.message.includes('이메일 확인') || error.message.includes('Invalid login credentials')) {
            setShowResendButton(true)
          }
        }
      } else if (!isLogin) {
        // 회원가입 성공 시
        setError('')
        alert('회원가입이 완료되었습니다!')
        setIsLogin(true) // 로그인 모드로 전환
      }
    } catch (err) {
      console.error('인증 오류:', err)
      setError('예상치 못한 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setError('이메일을 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const { error } = await resendConfirmation(email)
      if (error) {
        setError(error.message)
      } else {
        alert('확인 이메일을 다시 전송했습니다. 이메일을 확인해주세요.')
        setShowResendButton(false)
      }
    } catch {
      setError('이메일 재전송 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SecureCalendar</h1>
          </div>
          <p className="text-gray-600">
            {isLogin ? '로그인하여 시작하세요' : '새 계정을 만드세요'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                {error}
                {error.includes('이메일 확인') && (
                  <div className="mt-2 text-xs text-gray-600">
                    📧 회원가입 시 받은 이메일의 확인 링크를 클릭해주세요.
                  </div>
                )}
                {showResendButton && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={loading}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline disabled:opacity-50"
                  >
                    확인 이메일 다시 보내기
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                {isLogin ? <Mail className="w-5 h-5" /> : <User className="w-5 h-5" />}
                {isLogin ? '로그인' : '회원가입'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setShowResendButton(false)
            }}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
          </button>
        </div>
      </div>
    </div>
  )
}
