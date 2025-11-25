/**
 * Composable para gerenciar sessão e limpar cache após inatividade
 */

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutos em ms
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000 // 2 horas em ms
const CACHE_EXPIRY_TIME = 60 * 60 * 1000 // 1 hora em ms

export const useSessionManager = () => {
  if (!process.client) return { 
    initSessionManager: () => {},
    clearAppState: () => {},
    checkCacheExpiry: () => {},
    validateSession: async () => true
  }

  let inactivityTimer: NodeJS.Timeout | null = null
  let lastActivityTime = Date.now()

  // Limpar estados do Nuxt
  const clearAppState = () => {
    console.log('[SessionManager] Limpando estados da aplicação...')
    
    // Limpar estados do localStorage que possam causar travamento
    const keysToRemove = [
      'pedidos_cache',
      'dashboard_cache',
      'relatorios_cache',
      'clientes_cache',
      'cupons_cache',
      'produtos_cache',
      'last_fetch_time',
      'last_activity_time',
      'session_start_time'
    ]
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key)
      } catch (e) {
        console.warn(`[SessionManager] Erro ao remover ${key}:`, e)
      }
    })

    // Limpar estados do useState do Nuxt
    if (typeof useState !== 'undefined') {
      try {
        // Limpar estado de pedidos
        const pedidosState = useState('pedidos_list')
        if (pedidosState) pedidosState.value = []

        // Limpar estado de loading
        const loadingState = useState('relatorios_loading')
        if (loadingState) loadingState.value = false
        
        // Limpar outros estados
        const dashboardStatsState = useState('dashboard_stats')
        if (dashboardStatsState) dashboardStatsState.value = null
      } catch (e) {
        console.warn('[SessionManager] Erro ao limpar estados:', e)
      }
    }
  }

  // Verificar se a sessão expirou (validação de tempo total)
  const validateSession = async (): Promise<boolean> => {
    const sessionStartTime = localStorage.getItem('session_start_time')
    
    if (sessionStartTime) {
      const timeSinceStart = Date.now() - parseInt(sessionStartTime, 10)
      
      if (timeSinceStart > SESSION_TIMEOUT) {
        console.log('[SessionManager] Sessão expirou após 2 horas, forçando logout...')
        clearAppState()
        
        // Tentar fazer logout no Supabase
        try {
          const nuxtApp = useNuxtApp()
          if (nuxtApp.$supabase) {
            await (nuxtApp.$supabase as any).auth.signOut()
          }
        } catch (e) {
          console.warn('[SessionManager] Erro ao fazer logout:', e)
        }
        
        return false
      }
    } else {
      // Se não tem session_start_time, criar um
      localStorage.setItem('session_start_time', Date.now().toString())
    }
    
    return true
  }

  // Verificar se o cache expirou
  const checkCacheExpiry = () => {
    const lastFetchTime = localStorage.getItem('last_fetch_time')
    if (lastFetchTime) {
      const timeSinceLastFetch = Date.now() - parseInt(lastFetchTime, 10)
      if (timeSinceLastFetch > CACHE_EXPIRY_TIME) {
        console.log('[SessionManager] Cache expirado, limpando...')
        clearAppState()
      }
    }
  }

  // Resetar timer de inatividade
  const resetInactivityTimer = () => {
    lastActivityTime = Date.now()
    localStorage.setItem('last_activity_time', lastActivityTime.toString())

    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }

    inactivityTimer = setTimeout(() => {
      console.log('[SessionManager] Usuário inativo por 30 minutos, limpando cache...')
      clearAppState()
    }, INACTIVITY_TIMEOUT)
  }

  // Verificar se houve inatividade prolongada ao retornar
  const checkInactivity = async () => {
    const lastActivity = localStorage.getItem('last_activity_time')
    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10)
      
      if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
        console.log('[SessionManager] Detectada inatividade prolongada, limpando estados...')
        clearAppState()
        
        // Verificar se a sessão ainda é válida
        const isValid = await validateSession()
        if (!isValid) {
          console.log('[SessionManager] Sessão inválida, redirecionando para login...')
          window.location.href = '/login'
          return
        }
        
        // Forçar reload da página para estado limpo
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    }
  }

  // Inicializar gerenciamento de sessão
  const initSessionManager = () => {
    console.log('[SessionManager] Inicializando gerenciamento de sessão...')

    // Verificar cache expirado ao iniciar
    checkCacheExpiry()

    // Verificar inatividade ao iniciar
    checkInactivity()

    // Eventos que resetam o timer de inatividade
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, { passive: true })
    })

    // Detectar quando o usuário volta para a aba
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('[SessionManager] Usuário voltou para a aba, verificando sessão...')
        checkInactivity()
        checkCacheExpiry()
      }
    })

    // Detectar quando a janela recupera o foco
    window.addEventListener('focus', () => {
      console.log('[SessionManager] Janela recuperou foco, verificando sessão...')
      checkInactivity()
      checkCacheExpiry()
    })

    // Iniciar timer
    resetInactivityTimer()

    // Cleanup ao desmontar
    onBeforeUnmount(() => {
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer)
      })
      if (inactivityTimer) {
        clearTimeout(inactivityTimer)
      }
    })
  }

  return {
    initSessionManager,
    clearAppState,
    checkCacheExpiry,
    validateSession
  }
}
