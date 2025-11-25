export default defineNuxtRouteMiddleware(async (to, from) => {
  // No servidor, não precisa verificar autenticação detalhada
  if (process.server) {
    return
  }
  
  try {
    console.log('[Auth Middleware] Iniciando verificação...')
    
    // Validar sessão por tempo primeiro
    const { validateSession } = useSessionManager()
    const isSessionValid = await validateSession()
    
    if (!isSessionValid) {
      console.log('[Auth Middleware] Sessão expirada por tempo')
      return navigateTo('/login')
    }
    
    // Aguardar o plugin de auth ter executado com timeout para evitar loop infinito
    const waitPromise = new Promise(resolve => setTimeout(resolve, 300))
    await waitPromise
    
    const { isAuthenticated, user, isLoading } = useAuth()
    
    console.log('[Auth Middleware] Estado inicial:', { 
      isAuthenticated: isAuthenticated.value, 
      hasUser: !!user.value,
      isLoading: isLoading.value,
      email: user.value?.email
    })
    
    // Se ainda está carregando, aguarda um pouco mais mas com timeout
    if (isLoading.value) {
      console.log('[Auth Middleware] Aguardando carregamento finalizar...')
      const loadingTimeout = new Promise(resolve => setTimeout(resolve, 800))
      await loadingTimeout
      
      // Se ainda está carregando após timeout, considera como não autenticado
      if (isLoading.value) {
        console.warn('[Auth Middleware] Timeout no carregamento, redirecionando')
        return navigateTo('/login')
      }
    }
    
    console.log('[Auth Middleware] Estado final:', { 
      isAuthenticated: isAuthenticated.value, 
      hasUser: !!user.value,
      isLoading: isLoading.value,
      email: user.value?.email
    })
    
    // Se ainda não está autenticado, tenta verificar diretamente no Supabase com timeout
    if (!isAuthenticated.value || !user.value) {
      console.log('[Auth Middleware] Tentando verificação direta no Supabase...')
      
      try {
        const nuxtApp = useNuxtApp()
        if (nuxtApp.$supabase) {
          const supabase = nuxtApp.$supabase as any
          
          // Adicionar timeout para evitar loop infinito
          const sessionPromise = supabase.auth.getSession()
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000)
          )
          
          const { data } = await Promise.race([sessionPromise, timeoutPromise]).catch(() => ({ data: { session: null } })) as any
          
          if (data.session && data.session.user) {
            console.log('[Auth Middleware] Sessão encontrada diretamente no Supabase:', data.session.user.email)
            // A sessão existe, permitir acesso e deixar o plugin atualizar o estado
            return
          }
        }
      } catch (error) {
        console.error('[Auth Middleware] Erro ao verificar sessão diretamente:', error)
      }
    }
    
    // Se não está autenticado, redireciona para login
    if (!isAuthenticated.value || !user.value) {
      console.log('[Auth Middleware] Usuário não autenticado, redirecionando para login')
      return navigateTo('/login')
    }
    
    console.log('[Auth Middleware] Usuário autenticado, permitindo acesso')
  } catch (error) {
    // Se houver erro na inicialização, redireciona para login
    console.error('[Auth Middleware] Erro:', error)
    return navigateTo('/login')
  }
})
