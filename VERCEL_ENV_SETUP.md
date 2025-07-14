# 🔑 Vercel 환경변수 설정 가이드

## 🚀 빠른 설정 (복사/붙여넣기)

Vercel Dashboard에서 다음 환경변수를 설정하세요:

### 📋 환경변수 목록

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://rjttbmqpquhmvbhklnzd.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdHRibXFwcXVobXZiaGtsbnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzgwMjUsImV4cCI6MjA2ODA1NDAyNX0.FOy2_k58ZjTALG_Lt3-x3EQuyh-_3Z_UmlI0QX6Qgcg` | Production, Preview, Development |
| `VITE_CLAUDE_API_KEY` | `your-claude-api-key` | Production, Preview, Development |

---

## 🖥️ Vercel Dashboard에서 설정하기

1. **Vercel 프로젝트 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **환경변수 설정 페이지로 이동**
   - Settings 탭 클릭
   - Environment Variables 메뉴 선택

3. **환경변수 추가**
   각 환경변수를 하나씩 추가:

   **VITE_SUPABASE_URL**
   ```
   Name: VITE_SUPABASE_URL
   Value: https://rjttbmqpquhmvbhklnzd.supabase.co
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   **VITE_SUPABASE_ANON_KEY**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdHRibXFwcXVobXZiaGtsbnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzgwMjUsImV4cCI6MjA2ODA1NDAyNX0.FOy2_k58ZjTALG_Lt3-x3EQuyh-_3Z_UmlI0QX6Qgcg
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   **VITE_CLAUDE_API_KEY** (선택사항)
   ```
   Name: VITE_CLAUDE_API_KEY
   Value: [Claude AI API 키를 입력하세요]
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

---

## 💻 Vercel CLI로 설정하기

```bash
# Vercel CLI 설치 (아직 안했다면)
npm i -g vercel

# 로그인
vercel login

# 프로젝트 디렉토리에서 실행
cd secure-calendar

# 환경변수 추가
vercel env add VITE_SUPABASE_URL production
# 값 입력: https://rjttbmqpquhmvbhklnzd.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# 값 입력: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdHRibXFwcXVobXZiaGtsbnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzgwMjUsImV4cCI6MjA2ODA1NDAyNX0.FOy2_k58ZjTALG_Lt3-x3EQuyh-_3Z_UmlI0QX6Qgcg

vercel env add VITE_CLAUDE_API_KEY production
# 값 입력: [Claude AI API 키]

# Preview 환경에도 추가
vercel env add VITE_SUPABASE_URL preview
vercel env add VITE_SUPABASE_ANON_KEY preview
vercel env add VITE_CLAUDE_API_KEY preview

# Development 환경에도 추가
vercel env add VITE_SUPABASE_URL development
vercel env add VITE_SUPABASE_ANON_KEY development
vercel env add VITE_CLAUDE_API_KEY development
```

---

## 🔍 환경변수 확인

### CLI로 확인
```bash
# 설정된 환경변수 목록 확인
vercel env ls

# 특정 환경변수 값 확인
vercel env pull .env.vercel
cat .env.vercel
```

### Dashboard에서 확인
- Vercel Dashboard → 프로젝트 → Settings → Environment Variables
- 모든 환경변수가 3개 환경(Production, Preview, Development)에 설정되어 있는지 확인

---

## 🚀 배포 실행

환경변수 설정 완료 후 배포:

### GitHub 연동 배포 (자동)
- GitHub에 코드 푸시 → 자동 배포 시작
- 환경변수가 자동으로 주입됨

### CLI 배포 (수동)
```bash
# Preview 배포
vercel

# Production 배포
vercel --prod
```

---

## ✅ 배포 성공 체크리스트

배포 완료 후 다음 항목들을 확인하세요:

### 🔧 기본 기능
- [ ] 웹사이트 로딩 (https://your-app.vercel.app)
- [ ] Supabase 연결 확인 (로그인 페이지 표시)
- [ ] 회원가입/로그인 기능
- [ ] 캘린더 뷰 표시

### 🤖 AI 기능 (Claude API 키 설정 시)
- [ ] 텍스트 이벤트 추출
- [ ] AI 분석 결과 표시

### 📱 반응형 & 성능
- [ ] 모바일 디자인 확인
- [ ] 로딩 속도 테스트
- [ ] 에러 없이 동작

### 🔒 보안
- [ ] HTTPS 적용 확인
- [ ] 환경변수 노출 없음 확인

---

## 🐛 문제 해결

### 빌드 실패 시
```bash
# 로컬에서 빌드 테스트
npm run build

# 환경변수 문제일 경우
npm run type-check
```

### 환경변수 문제 시
1. Vercel Dashboard에서 환경변수 재확인
2. 모든 환경(Production, Preview, Development)에 설정되어 있는지 확인
3. 재배포 실행: `vercel --prod`

### Supabase 연결 문제 시
1. Supabase 프로젝트가 활성화되어 있는지 확인
2. RLS 정책이 올바르게 설정되어 있는지 확인
3. API 키가 만료되지 않았는지 확인

---

## 🎉 배포 완료!

모든 환경변수가 설정되면 SecureCalendar가 성공적으로 배포됩니다!

**배포 URL 예시:**
- Production: `https://secure-calendar.vercel.app`
- Preview: `https://secure-calendar-git-main-philokalos.vercel.app`

AI 기반 캘린더 앱을 전세계 어디서나 사용할 수 있습니다! 🌍