# 🔑 Google Calendar API 설정 가이드

SimpleCalendar에서 실제 구글 캘린더 등록을 사용하려면 Google Calendar API 설정이 필요합니다.

## 📋 설정 단계

### 1단계: Google Cloud Console 프로젝트 생성

1. **Google Cloud Console 접속**
   ```
   https://console.cloud.google.com/
   ```

2. **새 프로젝트 생성**
   - "프로젝트 선택" → "새 프로젝트"
   - 프로젝트 이름: `simple-calendar` (또는 원하는 이름)
   - 생성 클릭

### 2단계: Google Calendar API 활성화

1. **API 및 서비스 → 라이브러리**
2. **"Google Calendar API" 검색**
3. **"사용 설정" 클릭**

### 3단계: 사용자 인증 정보 만들기

#### API 키 생성
1. **API 및 서비스 → 사용자 인증 정보**
2. **"사용자 인증 정보 만들기" → "API 키"**
3. **API 키 복사** (나중에 사용)

#### OAuth 2.0 클라이언트 ID 생성
1. **"사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"**
2. **애플리케이션 유형**: "웹 애플리케이션"
3. **이름**: `SimpleCalendar Web Client`
4. **승인된 JavaScript 원본**:
   ```
   http://localhost:3001
   https://your-app-domain.vercel.app
   ```
5. **승인된 리디렉션 URI**:
   ```
   http://localhost:3001
   https://your-app-domain.vercel.app
   ```
6. **생성** 클릭
7. **클라이언트 ID 복사** (나중에 사용)

### 4단계: OAuth 동의 화면 설정

1. **OAuth 동의 화면** 메뉴
2. **사용자 유형**: "외부" 선택
3. **앱 정보**:
   - 앱 이름: `SimpleCalendar`
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처 정보: 본인 이메일
4. **범위 추가**:
   ```
   https://www.googleapis.com/auth/calendar
   ```

## 🔧 환경변수 설정

### 로컬 개발환경

`.env` 파일에 다음 추가:

```env
# Google Calendar API Configuration
VITE_GOOGLE_API_KEY=your-actual-api-key-here
VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
```

### Vercel 배포환경

1. **Vercel Dashboard** → 프로젝트 → **Settings** → **Environment Variables**

2. **환경변수 추가**:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_GOOGLE_API_KEY` | `your-actual-api-key` | Production, Preview, Development |
| `VITE_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` | Production, Preview, Development |

## 🚀 사용 방법

### 실제 API 사용 (Google API 키 설정 후)

`src/utils/googleCalendar.ts` 파일에서 다음 부분의 주석을 해제:

```typescript
// 실제 구현시 사용할 코드 (주석 처리)
/*
실제 API 호출 코드...
*/
```

그리고 시뮬레이션 코드를 제거:

```typescript
// 현재는 Google API 키가 없으므로 시뮬레이션
console.log('구글 캘린더 이벤트 등록 시뮬레이션:', event)
// 이 부분을 제거하고 실제 API 코드로 교체
```

### 개발/테스트 환경

현재는 시뮬레이션 모드로 작동하며:
- 90% 확률로 성공 시뮬레이션
- 2초 로딩 시뮬레이션
- 가짜 이벤트 ID 및 캘린더 링크 생성

## 📱 테스트 방법

1. **환경변수 설정 완료 후**
2. **애플리케이션 실행**: `npm run dev`
3. **로그인 → 텍스트 입력 → 이벤트 추출 → 확인 → 등록**
4. **실제 구글 캘린더**에서 이벤트 확인

## 🔒 보안 주의사항

- API 키는 절대 공개 저장소에 커밋하지 마세요
- 프로덕션에서는 API 키에 적절한 제한 사항을 설정하세요
- OAuth 클라이언트 ID는 특정 도메인으로 제한하세요

## 🐛 문제 해결

### "API 키가 유효하지 않습니다"
- Google Cloud Console에서 API 키 확인
- Calendar API가 활성화되어 있는지 확인

### "OAuth 오류"
- 승인된 JavaScript 원본에 도메인이 추가되어 있는지 확인
- 클라이언트 ID가 올바른지 확인

### "권한 없음"
- OAuth 동의 화면에서 Calendar 범위가 추가되어 있는지 확인
- 사용자가 캘린더 권한을 승인했는지 확인

## 📞 지원

설정 중 문제가 있으면 다음을 참조하세요:
- [Google Calendar API 문서](https://developers.google.com/calendar/api)
- [OAuth 2.0 설정 가이드](https://developers.google.com/identity/protocols/oauth2)