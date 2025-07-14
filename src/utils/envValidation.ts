interface RequiredEnvVars {
  VITE_SUPABASE_URL: string
  VITE_SUPABASE_ANON_KEY: string
  VITE_CLAUDE_API_KEY?: string
}

interface ValidatedEnv extends RequiredEnvVars {
  isDevelopment: boolean
  isProduction: boolean
}

function validateEnvVar(name: string, value: string | undefined, required = true): string {
  if (!value) {
    if (required) {
      throw new Error(`환경변수 ${name}이 설정되지 않았습니다.`)
    }
    return ''
  }

  if (value.trim() === '') {
    throw new Error(`환경변수 ${name}이 비어있습니다.`)
  }

  return value.trim()
}

function validateSupabaseUrl(url: string): string {
  try {
    const parsedUrl = new URL(url)
    if (!parsedUrl.hostname.includes('supabase.co')) {
      throw new Error('유효하지 않은 Supabase URL입니다.')
    }
    return url
  } catch {
    throw new Error('Supabase URL 형식이 올바르지 않습니다.')
  }
}

function validateSupabaseKey(key: string): string {
  if (key.length < 50) {
    throw new Error('Supabase 키가 너무 짧습니다.')
  }

  if (!key.startsWith('eyJ')) {
    throw new Error('유효하지 않은 Supabase 키 형식입니다.')
  }

  return key
}

export function validateEnvironment(): ValidatedEnv {
  try {
    const supabaseUrl = validateEnvVar('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL)
    const supabaseKey = validateEnvVar(
      'VITE_SUPABASE_ANON_KEY',
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
    const claudeApiKey = validateEnvVar(
      'VITE_CLAUDE_API_KEY',
      import.meta.env.VITE_CLAUDE_API_KEY,
      false
    )

    return {
      VITE_SUPABASE_URL: validateSupabaseUrl(supabaseUrl),
      VITE_SUPABASE_ANON_KEY: validateSupabaseKey(supabaseKey),
      VITE_CLAUDE_API_KEY: claudeApiKey,
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
    }
  } catch (error) {
    console.error('환경변수 검증 실패:', error)
    throw error
  }
}

export const env = validateEnvironment()
