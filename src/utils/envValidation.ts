interface RequiredEnvVars {
  VITE_SUPABASE_URL: string
  VITE_SUPABASE_ANON_KEY: string
  VITE_CLAUDE_API_KEY?: string
}

interface ValidatedEnv extends RequiredEnvVars {
  isDevelopment: boolean
  isProduction: boolean
}


function validateSupabaseUrl(url: string): string {
  try {
    console.log('URL 검증 중:', url)
    const parsedUrl = new URL(url)
    console.log('파싱된 URL:', { hostname: parsedUrl.hostname, protocol: parsedUrl.protocol })
    
    if (!parsedUrl.hostname.includes('supabase.co')) {
      console.error('잘못된 Supabase 호스트:', parsedUrl.hostname)
      throw new Error('유효하지 않은 Supabase URL입니다.')
    }
    return url
  } catch (error) {
    console.error('URL 파싱 실패:', error)
    throw new Error('Supabase URL 형식이 올바르지 않습니다.')
  }
}

function validateSupabaseKey(key: string): string {
  console.log('키 검증 중:', { keyLength: key.length, keyPrefix: key.substring(0, 10) })
  
  if (key.length < 50) {
    console.error('키가 너무 짧음:', key.length)
    throw new Error('Supabase 키가 너무 짧습니다.')
  }

  if (!key.startsWith('eyJ')) {
    console.error('키 형식 오류, 시작:', key.substring(0, 10))
    throw new Error('유효하지 않은 Supabase 키 형식입니다.')
  }

  return key
}

export function validateEnvironment(): ValidatedEnv {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const claudeApiKey = import.meta.env.VITE_CLAUDE_API_KEY || ''

    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD
    })

    // 환경변수가 없는 경우 적절한 에러 메시지 제공
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL 환경변수가 설정되지 않았습니다. .env 파일을 확인해주세요.')
    }

    if (!supabaseKey) {
      throw new Error('VITE_SUPABASE_ANON_KEY 환경변수가 설정되지 않았습니다. .env 파일을 확인해주세요.')
    }

    return {
      VITE_SUPABASE_URL: validateSupabaseUrl(supabaseUrl),
      VITE_SUPABASE_ANON_KEY: validateSupabaseKey(supabaseKey),
      VITE_CLAUDE_API_KEY: claudeApiKey,
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
    }
  } catch (error) {
    console.error('환경변수 검증 실패:', error)
    
    // 개발 환경에서 환경변수가 없으면 기본값 사용 (개발 편의를 위해)
    if (import.meta.env.DEV) {
      console.warn('개발 환경에서 기본값 사용')
      return {
        VITE_SUPABASE_URL: 'https://rjttbmqpquhmvbhklnzd.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdHRibXFwcXVobXZiaGtsbnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzgwMjUsImV4cCI6MjA2ODA1NDAyNX0.FOy2_k58ZjTALG_Lt3-x3EQuyh-_3Z_UmlI0QX6Qgcg',
        VITE_CLAUDE_API_KEY: '',
        isDevelopment: true,
        isProduction: false,
      }
    }
    
    // 프로덕션에서는 에러를 다시 던짐
    throw error
  }
}

export const env = validateEnvironment()
