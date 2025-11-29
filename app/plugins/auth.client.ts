import type { SupabaseClient, User, Session } from '@supabase/supabase-js'

export default defineNuxtPlugin(async () => {
  if (process.client) {
    const user = useState<User | null>('auth_user', () => null)
    const session = useState<Session | null>('auth_session', () => null)
    const loading = useState<boolean>('auth_loading', () => true)
    
    try {
      const nuxtApp = useNuxtApp()
      const supabase = nuxtApp.$supabase as SupabaseClient
      
      if (!supabase) {
        loading.value = false
        return
      }
      
      const { data } = await supabase.auth.getSession()
      
      if (data.session) {
        user.value = data.session.user
        session.value = data.session
      }
      
      loading.value = false
      
      // Escutar mudanças
      supabase.auth.onAuthStateChange((event: any, newSession: Session | null) => {
        user.value = newSession?.user ?? null
        session.value = newSession
      })
      
    } catch (error) {
      console.error('[Auth Plugin] Erro ao inicializar:', error)
      user.value = null
      session.value = null
      loading.value = false
    }
  }
})
