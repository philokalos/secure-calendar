# 🚀 Vercel 배포 가이드

## 📋 배포 전 체크리스트

### ✅ 사전 준비사항
- [ ] GitHub 저장소에 코드 푸시 완료
- [ ] Supabase 프로젝트 생성 및 설정
- [ ] 환경변수 값 준비
- [ ] Vercel 계정 생성

---

## 🔧 1단계: Vercel 프로젝트 설정

### A. GitHub 연동 배포 (추천)

1. **Vercel 웹사이트 접속**
   ```
   https://vercel.com
   ```

2. **GitHub 연동**
   - "New Project" 클릭
   - GitHub 저장소 `philokalos/secure-calendar` 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (자동 감지됨)
   - **Output Directory**: `dist` (자동 감지됨)
   - **Install Command**: `npm ci` (자동 감지됨)

### B. Vercel CLI 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 배포
vercel

# 프로덕션 배포
vercel --prod
```

---

## 🔑 2단계: 환경변수 설정

### Vercel Dashboard에서 설정

1. **프로젝트 대시보드 접속**
   - Vercel Dashboard → 프로젝트 선택
   - "Settings" 탭 → "Environment Variables" 메뉴

2. **필수 환경변수 추가**

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `your-supabase-anon-key` | Production, Preview, Development |
| `VITE_CLAUDE_API_KEY` | `your-claude-api-key` | Production, Preview, Development |

### CLI로 환경변수 설정

```bash
# Supabase URL 설정
vercel env add VITE_SUPABASE_URL

# Supabase Anon Key 설정
vercel env add VITE_SUPABASE_ANON_KEY

# Claude API Key 설정 (선택사항)
vercel env add VITE_CLAUDE_API_KEY
```

---

## 🏗️ 3단계: 빌드 설정 확인

### package.json 스크립트 확인
```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

### vercel.json 설정 확인
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci"
}
```

---

## 🚀 4단계: 배포 실행

### 자동 배포 (GitHub 연동)
- GitHub에 푸시하면 자동 배포
- Pull Request 생성 시 Preview 배포
- `main` 브랜치 푸시 시 Production 배포

### 수동 배포 (CLI)
```bash
# Preview 배포
vercel

# Production 배포
vercel --prod

# 특정 브랜치 배포
vercel --prod --target production
```

---

## ✅ 5단계: 배포 후 체크리스트

### 🔍 기능 테스트
- [ ] 웹사이트 로딩 확인
- [ ] 로그인/회원가입 기능
- [ ] 캘린더 뷰 표시
- [ ] 이벤트 생성/수정/삭제
- [ ] AI 텍스트 추출 기능
- [ ] 음성 인식 기능 (HTTPS 필요)
- [ ] 이미지 OCR 기능
- [ ] 모바일 반응형 디자인
- [ ] 알림 시스템 작동

### 🔒 보안 체크
- [ ] HTTPS 적용 확인
- [ ] 환경변수 노출 여부 확인
- [ ] CSP 헤더 적용 확인
- [ ] XSS 보호 설정 확인

### 📊 성능 체크
- [ ] Lighthouse 점수 확인
- [ ] 로딩 속도 테스트
- [ ] 번들 크기 확인
- [ ] CDN 캐싱 설정

---

## 🔧 고급 설정

### A. 커스텀 도메인 설정
1. Vercel Dashboard → Domains
2. 도메인 추가 및 DNS 설정
3. SSL 인증서 자동 적용

### B. Serverless Functions (필요시)
```javascript
// api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Vercel!' })
}
```

### C. 리다이렉트 설정
```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

---

## 🔄 자동 배포 워크플로우

```mermaid
graph LR
    A[코드 작성] --> B[GitHub Push]
    B --> C[Vercel 자동 빌드]
    C --> D[환경변수 주입]
    D --> E[빌드 실행]
    E --> F[배포 완료]
    F --> G[DNS 업데이트]
    G --> H[CDN 캐시 갱신]
```

---

## 📱 배포 URL 예시

- **Production**: `https://secure-calendar.vercel.app`
- **Preview**: `https://secure-calendar-git-branch-philokalos.vercel.app`
- **Custom Domain**: `https://your-domain.com`

---

## 🐛 트러블슈팅

### 빌드 실패 시
```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 문제 해결
npm ci
npm run build
```

### 환경변수 문제
```bash
# 환경변수 확인
vercel env ls

# 환경변수 업데이트
vercel env rm VARIABLE_NAME
vercel env add VARIABLE_NAME
```

### 도메인 접속 불가
- DNS 전파 대기 (최대 48시간)
- Vercel Dashboard에서 도메인 상태 확인
- SSL 인증서 발급 대기

---

## 📞 지원 및 문의

- **Vercel 문서**: https://vercel.com/docs
- **Supabase 문서**: https://supabase.com/docs
- **GitHub Issues**: 프로젝트 저장소에 이슈 등록

---

## 🎉 배포 완료!

모든 설정이 완료되면 SecureCalendar가 Vercel에서 실행됩니다:

✅ **자동 HTTPS 적용**
✅ **글로벌 CDN 배포**  
✅ **무중단 배포**
✅ **자동 스케일링**
✅ **Preview 배포 지원**

배포된 애플리케이션을 통해 AI 기반 캘린더 기능을 전세계 어디서나 이용할 수 있습니다!