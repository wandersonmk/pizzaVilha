export default defineNuxtRouteMiddleware(async (to, from) => {
  // No servidor, não precisa verificar autenticação detalhada
  if (process.server) {
    return
  }
  
  try {
    console.log('[Auth Middleware] Iniciando verificação...')
    
    // Aguardar o plugin de auth ter executado - tempo reduzido
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const { isAuthenticated, user, isLoading } = useAuth()
    
    console.log('[Auth Middleware] Estado inicial:', { 
      isAuthenticated: isAuthenticated.value, 
      hasUser: !!user.value,
      isLoading: isLoading.value,
      email: user.value?.email
    })
    
    // Se ainda está carregando, aguarda um pouco mais
    if (isLoading.value) {
      console.log('[Auth Middleware] Aguardando carregamento finalizar...')
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log('[Auth Middleware] Estado final:', { 
      isAuthenticated: isAuthenticated.value, 
      hasUser: !!user.value,
      isLoading: isLoading.value,
      email: user.value?.email
    })
    
    // Se ainda não está autenticado, tenta verificar diretamente no Supabase
    if (!isAuthenticated.value || !user.value) {
      console.log('[Auth Middleware] Tentando verificação direta no Supabase...')
      
      try {
        const nuxtApp = useNuxtApp()
        if (nuxtApp.$supabase) {
          const supabase = nuxtApp.$supabase as any
          const { data } = await supabase.auth.getSession()
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
