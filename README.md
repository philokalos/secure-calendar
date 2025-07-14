# 📅 SecureCalendar

> AI 기반 스마트 캘린더 - React + TypeScript + Supabase + Claude AI

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat&logo=supabase)](https://supabase.com/)

## ✨ 주요 기능

### 🤖 AI 기반 이벤트 추출
- **텍스트 분석**: 자연어로 작성된 일정을 자동 파싱
- **음성 인식**: Web Speech API를 활용한 음성 입력
- **이미지 OCR**: Tesseract.js로 이미지에서 텍스트 추출
- **Claude AI 통합**: 정확한 이벤트 정보 추출 및 분류

### 📱 반응형 인터페이스
- **모바일 우선** 설계
- **터치 제스처** 지원
- **다크모드** 준비
- **접근성(A11y)** 고려

### 🔐 보안 & 인증
- **Supabase Auth** 통합
- **Row Level Security(RLS)** 적용
- **환경변수 검증** 시스템
- **HTTPS 강제** 적용

### 🎨 사용자 경험
- **실시간 동기화**
- **토스트 알림** 시스템
- **로딩 상태** 관리
- **에러 경계** 처리

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/philokalos/secure-calendar.git
cd secure-calendar
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
```bash
cp .env.example .env
```

`.env` 파일 수정:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CLAUDE_API_KEY=your-claude-api-key
```

### 4. 개발 서버 실행
```bash
npm run dev
```

## 🏗️ 기술 스택

### Frontend
- **React 18** - 최신 React 기능 활용
- **TypeScript** - 타입 안전성 보장
- **Vite** - 빠른 개발 환경
- **Tailwind CSS** - 유틸리티 기반 스타일링

### Backend & Database
- **Supabase** - PostgreSQL 기반 BaaS
- **Row Level Security** - 데이터 보안
- **Real-time subscriptions** - 실시간 동기화

### AI & ML
- **Claude 3 Haiku** - 이벤트 추출 및 분석
- **Web Speech API** - 음성 인식
- **Tesseract.js** - OCR 텍스트 추출

### Development Tools
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Vercel** - 배포 및 호스팅

## 📦 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   └── ui/             # UI 컴포넌트
├── contexts/           # React Context
├── hooks/              # 커스텀 훅
├── pages/              # 페이지 컴포넌트
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── lib/                # 라이브러리 설정
```

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 코드 포맷팅
npm run format

# 배포 전 검사
npm run pre-commit
```

## 🚀 Vercel 배포

### 자동 배포 (GitHub 연동)
1. [Vercel](https://vercel.com)에서 GitHub 저장소 연결
2. 환경변수 설정
3. 자동 배포 완료

### 수동 배포 (CLI)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

자세한 배포 가이드: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

## 🔑 환경변수

| 변수명 | 설명 | 필수 여부 |
|--------|------|-----------|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ 필수 |
| `VITE_SUPABASE_ANON_KEY` | Supabase 익명 키 | ✅ 필수 |
| `VITE_CLAUDE_API_KEY` | Claude AI API 키 | ⚠️ 선택사항 |

## 📊 성능 최적화

- **번들 분할**: vendor, UI, AI 모듈별 분리
- **Lazy Loading**: 컴포넌트 지연 로딩
- **React.memo**: 불필요한 리렌더링 방지
- **이미지 최적화**: WebP 형식 지원
- **CDN 캐싱**: 정적 자산 캐시

## 🔒 보안 기능

- **Content Security Policy** 적용
- **XSS 보호** 헤더 설정
- **환경변수 검증** 시스템
- **Supabase RLS** 정책 적용
- **HTTPS 강제** 리다이렉트

## 📱 브라우저 지원

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ 음성 인식: Chrome/Edge 권장

## 🤝 기여하기

1. Fork 저장소
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원 및 문의

- 🐛 **버그 리포트**: [GitHub Issues](https://github.com/philokalos/secure-calendar/issues)
- 💡 **기능 제안**: [GitHub Discussions](https://github.com/philokalos/secure-calendar/discussions)
- 📧 **이메일**: dev@securecalendar.app

## 🙏 감사의 말

- [Supabase](https://supabase.com) - 백엔드 인프라
- [Anthropic](https://anthropic.com) - Claude AI API
- [Vercel](https://vercel.com) - 배포 플랫폼
- [React](https://reactjs.org) - UI 프레임워크

---

**🤖 AI와 함께하는 스마트한 일정 관리를 경험해보세요!**

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!