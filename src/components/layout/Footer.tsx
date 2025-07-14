import React from 'react'
import { Heart, ExternalLink, Github, Mail, Shield } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* 데스크톱 푸터 */}
      <div className="hidden sm:block">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* 왼쪽: 저작권 정보 */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                © {currentYear} SecureCalendar. Made with
                <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                by Claude Code
              </p>

              <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                <Shield className="w-3 h-3" />
                <span>Secure</span>
              </div>
            </div>

            {/* 오른쪽: 링크들 */}
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-4 text-sm">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  개인정보처리방침
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  이용약관
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  도움말
                </a>
              </nav>

              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="mailto:support@securecalendar.com"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="문의하기"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 푸터 */}
      <div className="sm:hidden">
        <div className="px-4 py-3 bg-gray-50">
          {/* 퀵 액션 버튼들 */}
          <div className="flex justify-around mb-3">
            <button className="flex flex-col items-center gap-1 p-2 text-xs text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📅</span>
              </div>
              <span>새 이벤트</span>
            </button>

            <button className="flex flex-col items-center gap-1 p-2 text-xs text-gray-600">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🤖</span>
              </div>
              <span>AI 추출</span>
            </button>

            <button className="flex flex-col items-center gap-1 p-2 text-xs text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">📊</span>
              </div>
              <span>분석</span>
            </button>

            <button className="flex flex-col items-center gap-1 p-2 text-xs text-gray-600">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">⚙️</span>
              </div>
              <span>설정</span>
            </button>
          </div>
        </div>

        {/* 모바일 저작권 정보 */}
        <div className="px-4 py-2 bg-white border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-500">© {currentYear} SecureCalendar</p>
            <div className="flex justify-center items-center gap-4 mt-1">
              <a href="#" className="text-xs text-gray-400">
                정책
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-xs text-gray-400">
                약관
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-xs text-gray-400">
                도움말
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 개발자 정보 (모든 화면) */}
      <div className="px-4 py-2 bg-gray-800 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span>🚀 Powered by</span>
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              Claude Code
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>서비스 정상</span>
            </div>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
