export default defineNuxtRouteMiddleware(async (to, from) => {
  // No servidor, não precisa verificar
  if (process.server) {
    return
  }
  
  // Evitar loop - se já está indo para login, deixa passar
  if (to.path === '/login') {
    return
  }
  
  try {
    const nuxtApp = useNuxtApp()
    if (!nuxtApp.$supabase) {
      return navigateTo('/login')
    }
    
    const supabase = nuxtApp.$supabase as any
    const { data } = await supabase.auth.getSession()
    
    // Se não tem sessão, limpar tudo e ir para login
    if (!data.session) {
      console.log('[Auth] Sem sessão - limpando cache')
      localStorage.clear()
      sessionStorage.clear()
      return navigateTo('/login')
    }
    
    // Se tem sessão, inicializar monitor apenas 1x
    if (!sessionStorage.getItem('monitor_init')) {
      const { initSessionManager } = useSessionManager()
      initSessionManager()
      sessionStorage.setItem('monitor_init', '1')
    }
    
  } catch (error) {
    console.error('[Auth] Erro:', error)
    localStorage.clear()
    sessionStorage.clear()
    return navigateTo('/login')
  }
})
