import { useState } from 'react'
import { User, Mail, Calendar, Shield, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'

export function ProfilePage() {
  const { user, signOut } = useAuth()
  const { showSuccess, showError } = useNotification()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await signOut()
      if (error) {
        showError('로그아웃 중 오류가 발생했습니다.')
      } else {
        showSuccess('성공적으로 로그아웃되었습니다.')
      }
    } catch {
      showError('로그아웃 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600">프로필을 보려면 먼저 로그인해주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 프로필 헤더 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.user_metadata?.full_name || '사용자'}
              </h1>
              <p className="text-gray-600 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* 계정 정보 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            계정 정보
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">사용자 ID:</span>
              <span className="text-gray-900 font-mono text-sm">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">가입일:</span>
              <span className="text-gray-900">
                {new Date(user.created_at!).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">마지막 로그인:</span>
              <span className="text-gray-900">
                {user.last_sign_in_at 
                  ? new Date(user.last_sign_in_at).toLocaleDateString('ko-KR')
                  : '정보 없음'
                }
              </span>
            </div>
          </div>
        </div>

        {/* 캘린더 통계 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            캘린더 통계
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">총 이벤트</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">이번 달 이벤트</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">완료된 이벤트</div>
            </div>
          </div>
        </div>

        {/* 계정 관리 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">계정 관리</h2>
          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoading ? '로그아웃 중...' : '로그아웃'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}