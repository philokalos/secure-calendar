# 🔐 GitHub Secrets 설정 가이드

> GitHub Actions 자동 배포를 위한 환경변수 설정

## 📋 필수 Secrets 목록

GitHub 저장소 Settings → Secrets and variables → Actions에서 다음 환경변수를 설정하세요:

### 🔑 Vercel 인증 정보
| Secret Name | Description | 값 구하는 방법 |
|-------------|-------------|----------------|
| `VERCEL_TOKEN` | Vercel API 토큰 | [Vercel Dashboard → Settings → Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel 조직 ID | 프로젝트 Settings → General → Project ID 섹션 |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 ID | 프로젝트 Settings → General → Project ID 섹션 |

### 🗄️ Supabase 환경변수
| Secret Name | Value |
|-------------|-------|
| `VITE_SUPABASE_URL` | `https://rjttbmqpquhmvbhklnzd.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdHRibXFwcXVobXZiaGtsbnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzgwMjUsImV4cCI6MjA2ODA1NDAyNX0.FOy2_k58ZjTALG_Lt3-x3EQuyh-_3Z_UmlI0QX6Qgcg` |

### 🤖 AI 기능 (선택사항)
| Secret Name | Description |
|-------------|-------------|
| `VITE_CLAUDE_API_KEY` | Claude AI API 키 (AI 기능용) |

---

## 🔧 단계별 설정 방법

### 1️⃣ GitHub Secrets 페이지 접속
1. GitHub 저장소 접속: https://github.com/philokalos/secure-calendar
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Secrets and variables** → **Actions** 선택

### 2️⃣ Vercel 정보 획득

#### VERCEL_TOKEN 생성
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 우측 상단 프로필 → **Settings** 클릭
3. 왼쪽 메뉴에서 **Tokens** 선택
4. **Create Token** 클릭
5. 토큰 이름 입력: `github-actions-deploy`
6. Scope: **Full Account** 선택
7. **Create** 클릭하여 토큰 생성
8. 🚨 **중요**: 토큰을 복사해두세요 (다시 볼 수 없습니다)

#### VERCEL_ORG_ID & VERCEL_PROJECT_ID 획득
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. `secure-calendar` 프로젝트 선택 (없으면 GitHub 저장소 Import)
3. **Settings** 탭 클릭
4. **General** 메뉴에서 Project ID 섹션 확인:
   - **Project ID**: `VERCEL_PROJECT_ID`로 사용
   - **Team ID** (또는 **User ID**): `VERCEL_ORG_ID`로 사용

### 3️⃣ GitHub Secrets 추가

각 Secret을 다음과 같이 추가:

```
Name: VERCEL_TOKEN
Secret: [Step 2에서 생성한 토큰]
```

```
Name: VERCEL_ORG_ID  
Secret: [Vercel 프로젝트에서 확인한 Team/User ID]
```

```
Name: VERCEL_PROJECT_ID
Secret: [Vercel 프로젝트에서 확인한 Project ID]
```

```
Name: VITE_SUPABASE_URL
Secret: https://rjttbmqpquhmvbhklnzd.supabase.co
```

```
Name: VITE_SUPABASE_ANON_KEY
Secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdHRibXFwcXVobXZiaGtsbnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzgwMjUsImV4cCI6MjA2ODA1NDAyNX0.FOy2_k58ZjTALG_Lt3-x3EQuyh-_3Z_UmlI0QX6Qgcg
```

```
Name: VITE_CLAUDE_API_KEY
Secret: [Claude AI API 키] (선택사항)
```

---

## ✅ 설정 완료 확인

### 1. Secrets 목록 확인
GitHub → Settings → Secrets and variables → Actions에서 다음 6개 Secret이 설정되어 있는지 확인:

- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`
- ⚠️ `VITE_CLAUDE_API_KEY` (선택사항)

### 2. 테스트 배포 실행
```bash
# main 브랜치에 푸시하여 자동 배포 테스트
git add .
git commit -m "feat: Add GitHub Actions CI/CD pipeline"
git push origin main
```

### 3. GitHub Actions 확인
1. GitHub 저장소 → **Actions** 탭
2. "🚀 Deploy to Vercel" 워크플로우 실행 확인
3. 모든 단계가 성공적으로 완료되는지 확인

---

## 🚀 자동 배포 흐름

### PR 생성 시
1. 🔨 **빌드 & 테스트** 실행
2. 🔍 **Preview 배포** 생성
3. 📝 **리뷰용 URL** 제공

### main 브랜치 Push 시
1. 🔨 **빌드 & 테스트** 실행
2. 🌟 **Production 배포** 실행
3. 🎉 **배포 URL** 출력
4. 📊 **배포 리포트** 생성

### 배포 실패 시
1. 🚨 **실패 알림** 발송
2. 📝 **상세 실패 리포트** 생성
3. 🔧 **해결 방법** 안내

---

## 🛠️ 문제 해결

### Vercel Token 오류
```
Error: Invalid token
```
**해결방법**: VERCEL_TOKEN을 다시 생성하여 업데이트

### Project ID 오류
```
Error: Project not found
```
**해결방법**: VERCEL_ORG_ID와 VERCEL_PROJECT_ID 재확인

### 환경변수 오류
```
Error: Environment validation failed
```
**해결방법**: Supabase URL과 API 키 형식 확인

### 빌드 실패
```
Error: Build failed
```
**해결방법**: 로컬에서 `npm run build` 테스트 후 수정

---

## 🎯 다음 단계

설정 완료 후:

1. **커밋 & 푸시**로 자동 배포 테스트
2. **PR 생성**으로 Preview 배포 테스트  
3. **배포 URL 확인** 및 기능 테스트
4. **팀원에게 자동 배포 시스템 공유**

🎉 이제 코드 푸시만으로 자동 배포가 실행됩니다!