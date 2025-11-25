import type { Session, User } from '@supabase/supabase-js'
import { translateError } from '~/utils/errorTranslations'

export function useAuth() {
  // Estados reativos globais
  const user = useState<User | null>('auth_user', () => null)
  const session = useState<Session | null>('auth_session', () => null)
  const isLoading = useState<boolean>('auth_loading', () => false)
  const errorMessage = useState<string | null>('auth_error', () => null)

  // Computed property
  const isAuthenticated = computed(() => {
    return !!user.value && !!session.value
  })

  // No servidor, retorna apenas os estados sem lógica de Supabase
  if (process.server) {
    return {
      user: readonly(user),
      session: readonly(session),
      isAuthenticated,
      isLoading: readonly(isLoading),
      errorMessage: readonly(errorMessage),
      signInWithEmailAndPassword: async () => { throw new Error('Server-side auth not available') },
      signUp: async () => { throw new Error('Server-side auth not available') },
      signOut: async () => { throw new Error('Server-side auth not available') },
      initialize: async () => {},
      sendPasswordResetEmail: async () => { throw new Error('Server-side auth not available') }
    }
  }

  // Cliente - inicializar Supabase quando necessário
  let supabase: ReturnType<typeof useSupabaseClient> | null = null
  
  const getSupabase = () => {
    if (!supabase) {
      try {
        supabase = useSupabaseClient()
      } catch (error) {
        console.error('Erro ao inicializar Supabase:', error)
        const errorMsg = translateError('Service unavailable')
        errorMessage.value = errorMsg
        return null
      }
    }
    return supabase
  }

  // Função de inicialização
  // Login
  const signInWithEmailAndPassword = async (email: string, password: string) => {
    const client = getSupabase()
    if (!client) throw new Error('Supabase não disponível')
    
    try {
      isLoading.value = true
      errorMessage.value = null

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('[useAuth] Erro no login:', error)
        const translatedError = translateError(error.message)
        errorMessage.value = translatedError
        throw new Error(translatedError)
      }

      if (data.session && data.user) {
        session.value = data.session
        user.value = data.user
        console.log('[useAuth] Login realizado com sucesso:', data.user.email)
        
        await navigateTo('/', { replace: true })
      }

      return { data, error: null }
    } catch (error: any) {
      console.error('[useAuth] Erro no signIn:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Registro
  const signUp = async (email: string, password: string, nome: string) => {
    const client = getSupabase()
    if (!client) throw new Error('Supabase não disponível')
    
    try {
      isLoading.value = true
      errorMessage.value = null

      console.log('[useAuth] Iniciando signUp para:', email)
      
      const { data: authData, error: authError } = await client.auth.signUp({
        email,
        password,
        options: {
          data: { nome }
        }
      })

      console.log('[useAuth] Resultado do signUp:', { 
        user: !!authData?.user, 
        session: !!authData?.session, 
        error: authError?.message 
      })

      if (authError) {
        console.error('[useAuth] Erro detalhado do signUp:', authError)
        const translatedError = translateError(authError.message)
        errorMessage.value = translatedError
        throw new Error(translatedError)
      }

      if (authData.user && !authData.session) {
        // Usuário criado, mas precisa confirmar email
        return { 
          data: authData, 
          error: null,
          needsEmailConfirmation: true 
        }
      }

      if (authData.session && authData.user) {
        session.value = authData.session
        user.value = authData.user
      }

      return { data: authData, error: null }
    } catch (error: any) {
      console.error('[useAuth] Erro no signUp:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const signOut = async () => {
    const client = getSupabase()
    if (!client) throw new Error('Supabase não disponível')
    
    try {
      isLoading.value = true
      
      const { error } = await client.auth.signOut()
      
      if (error) {
        console.error('[useAuth] Erro no logout:', error)
        const translatedError = translateError(error.message)
        errorMessage.value = translatedError
        throw new Error(translatedError)
      }

      // Limpar estados
      user.value = null
      session.value = null
      
      // Limpar localStorage - incluindo session_start_time
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sb-wynjuzsrydsvkmyhjfhu-auth-token')
        localStorage.removeItem('session_start_time')
        localStorage.removeItem('last_activity_time')
        
        // Limpar cache também
        const { clearAppState } = useSessionManager()
        clearAppState()
      }
      
      console.log('[useAuth] Logout realizado com sucesso')
      await navigateTo('/login', { replace: true })
    } catch (error: any) {
      console.error('[useAuth] Erro no signOut:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Recuperação de senha
  const sendPasswordResetEmail = async (email: string) => {
    const client = getSupabase()
    if (!client) throw new Error('Supabase não disponível')
    
    try {
      isLoading.value = true
      errorMessage.value = null

      // URL de redirecionamento fixa para evitar problemas
      const redirectUrl = 'https://pizza-vilha.vercel.app/redefinir-senha'
      
      console.log('[useAuth] Enviando email com redirect para:', redirectUrl)

      const { data, error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      })
      
      console.log('[useAuth] Resposta do reset:', { data, error })

      if (error) {
        console.error('[useAuth] Erro detalhado:', error)
        
        let errorMsg = error.message
        
        // Tratar erro de rate limit especificamente
        if (error.status === 429 || error.message?.includes('rate') || error.message?.includes('429')) {
          errorMsg = 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.'
        } else {
          errorMsg = translateError(error.message)
        }
        
        errorMessage.value = errorMsg
        throw new Error(errorMsg)
      }

      return { error: null }
    } catch (error: any) {
      console.error('[useAuth] Erro no reset de senha:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    user: readonly(user),
    session: readonly(session),
    isAuthenticated,
    isLoading: readonly(isLoading),
    errorMessage: readonly(errorMessage),
    signInWithEmailAndPassword,
    signUp,
    signOut,
    sendPasswordResetEmail
  }
}