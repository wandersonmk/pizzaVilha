interface PedidoItem {
  nome: string
  quantidade: number
  preco: number
  observacao?: string
}

interface PedidoSupabase {
  id: string
  empresa_id: string
  numero_pedido: number
  nome_cliente: string
  telefone_cliente: string
  endereco_entrega?: string
  pedido: string
  observacao?: string
  valor_total: string
  valor_entrega: string
  forma_pagamento: 'dinheiro' | 'cartao'
  tipo_retirada: 'retirada' | 'entrega'
  troco?: string
  status: 'novo' | 'cozinha' | 'entrega' | 'concluido'
  created_at: string
}

interface Pedido {
  id: string
  numero: number
  cliente: string
  telefone: string
  endereco?: string
  items: PedidoItem[]
  total: number
  formaPagamento: 'dinheiro' | 'cartao' | 'pix'
  tipoEntrega: 'retirada' | 'entrega'
  status: 'novo' | 'cozinha' | 'entrega' | 'concluido'
  observacao?: string
  troco?: number
  dataHora: Date
  tempoEstimado?: number
}

export const usePedidos = () => {
  const supabase = useSupabaseClient()
  const { user } = useAuth()
  const { playNotification, stopNotification } = useNotificationSound()

  const pedidos = ref<Pedido[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ID da empresa (por enquanto usando um ID fixo, depois integrar com useEmpresa)
  const empresaId = '75bd85cf-1997-48e2-9367-e554b01a2283'
  
  // Rastrear pedidos anteriores para detectar novos
  let previousPedidosCount = 0

  // Função para formatar telefone para visualização
  const formatTelefone = (telefone: string): string => {
    // Remove todos os caracteres não numéricos
    const numbers = telefone.replace(/\D/g, '')
    
    // Se começar com 55 (código do Brasil), remove
    const cleanNumber = numbers.startsWith('55') ? numbers.substring(2) : numbers
    
    // Formata conforme o padrão brasileiro
    if (cleanNumber.length === 11) {
      // Celular: (11) 91234-5678
      return `(${cleanNumber.substring(0, 2)}) ${cleanNumber.substring(2, 7)}-${cleanNumber.substring(7)}`
    } else if (cleanNumber.length === 10) {
      // Fixo: (11) 1234-5678
      return `(${cleanNumber.substring(0, 2)}) ${cleanNumber.substring(2, 6)}-${cleanNumber.substring(6)}`
    }
    
    // Se não conseguir formatar, retorna o original
    return telefone
  }

  // Função para converter pedido do Supabase para o formato da interface
  const convertSupabasePedido = (pedidoSupabase: PedidoSupabase): Pedido => {
    // Parse do campo "pedido" para extrair itens (formato: "2x Pizza Margherita Grande, 1x Refrigerante 2L")
    const items: PedidoItem[] = []
    const pedidoText = pedidoSupabase.pedido
    
    // Parse simples do texto do pedido
    const itemsTexto = pedidoText.split(',').map(item => item.trim())
    
    itemsTexto.forEach(itemTexto => {
      const match = itemTexto.match(/(\d+)x\s*(.+)/)
      if (match && match[1] && match[2]) {
        const quantidade = parseInt(match[1])
        const nome = match[2].trim()
        
        // Estimar preço baseado no valor total dividido pelos itens
        const precoEstimado = parseFloat(pedidoSupabase.valor_total) / itemsTexto.length
        
        items.push({
          nome,
          quantidade,
          preco: precoEstimado / quantidade,
          observacao: undefined
        })
      }
    })

    return {
      id: pedidoSupabase.id,
      numero: pedidoSupabase.numero_pedido,
      cliente: pedidoSupabase.nome_cliente,
      telefone: formatTelefone(pedidoSupabase.telefone_cliente),
      endereco: pedidoSupabase.endereco_entrega || undefined,
      items,
      total: parseFloat(pedidoSupabase.valor_total) + parseFloat(pedidoSupabase.valor_entrega || '0'),
      formaPagamento: pedidoSupabase.forma_pagamento,
      tipoEntrega: pedidoSupabase.tipo_retirada,
      status: pedidoSupabase.status,
      observacao: pedidoSupabase.observacao || undefined,
      troco: pedidoSupabase.troco ? parseFloat(pedidoSupabase.troco) : undefined,
      dataHora: new Date(pedidoSupabase.created_at),
      tempoEstimado: 30 // Default de 30 minutos
    }
  }

  // Buscar todos os pedidos
  const fetchPedidos = async () => {
    if (!empresaId) {
      error.value = 'Empresa não encontrada'
      return
    }

    try {
      isLoading.value = true
      error.value = null

      const { data, error: supabaseError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        const novosPedidos = data.map(convertSupabasePedido)
        
        // Verificar se há novos pedidos com status "novo"
        const novosCount = novosPedidos.filter(p => p.status === 'novo').length
        const previousNovosCount = pedidos.value.filter(p => p.status === 'novo').length
        
        // Tocar notificação se houver mais pedidos "novo" do que antes (e não é a primeira carga)
        if (pedidos.value.length > 0 && novosCount > previousNovosCount) {
          console.log(`🔔 [Notificação] Novo pedido detectado! Antes: ${previousNovosCount}, Agora: ${novosCount}`)
          playNotification()
        }
        
        pedidos.value = novosPedidos
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar pedidos'
      console.error('Erro ao buscar pedidos:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Teste de conexão com Supabase
  const testSupabaseConnection = async () => {
    console.log('[TEST] Testando conexão com Supabase...')
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('id, nome_cliente, status')
        .limit(1)
      
      if (error) {
        console.error('[TEST] Erro na conexão:', error)
        return false
      }
      
      console.log('[TEST] Conexão OK, dados:', data)
      return true
    } catch (err) {
      console.error('[TEST] Erro de conexão:', err)
      return false
    }
  }

  // Atualizar status do pedido
  const updatePedidoStatus = async (pedidoId: string, novoStatus: string) => {
    console.log(`🔥 [usePedidos] ENTRADA NA FUNÇÃO! updatePedidoStatus: ${pedidoId} -> ${novoStatus}`)
    
    try {
      console.log('📡 [usePedidos] Executando update direto no Supabase...')
      
      // Fazer update direto, sem teste de conexão
      const { data, error: supabaseError } = await supabase
        .from('pedidos')
        .update({ status: novoStatus })
        .eq('id', pedidoId)
        .select()

      if (supabaseError) {
        console.error('❌ [usePedidos] Erro do Supabase:', supabaseError)
        throw supabaseError
      }

      console.log('✅ [usePedidos] SUCESSO! Pedido atualizado no banco:', data)

      // Atualizar localmente
      const pedido = pedidos.value.find(p => p.id === pedidoId)
      if (pedido) {
        const oldStatus = pedido.status
        pedido.status = novoStatus as any
        console.log(`🔄 [usePedidos] Status atualizado localmente: ${oldStatus} -> ${novoStatus}`, pedido)
      } else {
        console.error('⚠️ [usePedidos] Pedido não encontrado na lista local:', pedidoId)
      }

      return true
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar pedido'
      console.error('💥 [usePedidos] ERRO COMPLETO:', err)
      return false
    }
  }

  // Criar novo pedido
  const createPedido = async (novoPedido: Omit<PedidoSupabase, 'id' | 'numero_pedido' | 'created_at'>) => {
    if (!empresaId) {
      error.value = 'Empresa não encontrada'
      return null
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('pedidos')
        .insert([{
          ...novoPedido,
          empresa_id: empresaId
        }])
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        const pedidoConvertido = convertSupabasePedido(data)
        pedidos.value.unshift(pedidoConvertido)
        return pedidoConvertido
      }

      return null
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar pedido'
      console.error('Erro ao criar pedido:', err)
      return null
    }
  }

  // Filtrar pedidos por status
  const getPedidosByStatus = (status: string) => {
    if (status === 'todos') {
      return pedidos.value
    }
    return pedidos.value.filter(pedido => pedido.status === status)
  }

  // Contar pedidos por status
  const getOrderCountByStatus = (status: string) => {
    return getPedidosByStatus(status).length
  }

  // Real-time subscription
  // Polling para simular real-time quando Supabase Realtime não está habilitado
  let pollingInterval: NodeJS.Timeout | null = null

  const startPolling = (intervalMs: number = 30000) => { // 30 segundos por padrão
    if (pollingInterval) return // Já está rodando

    console.log(`[Polling] Iniciando atualização automática a cada ${intervalMs / 1000}s`)
    
    pollingInterval = setInterval(async () => {
      console.log('[Polling] Buscando atualizações...')
      await fetchPedidos()
    }, intervalMs)
  }

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
      console.log('[Polling] Atualização automática parada')
    }
  }

  const setupRealtimeSubscription = () => {
    if (!empresaId) {
      console.log('[Real-time] Empresa ID não encontrado')
      return
    }

    console.log('[Real-time] Tentando configurar Supabase Realtime...')

    const subscription = supabase
      .channel('pedidos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pedidos',
          filter: `empresa_id=eq.${empresaId}`
        },
        (payload) => {
          console.log('✅ [Real-time] Atualização recebida:', payload.eventType, payload)
          
          if (payload.eventType === 'INSERT' && payload.new) {
            const novoPedido = convertSupabasePedido(payload.new as PedidoSupabase)
            pedidos.value.unshift(novoPedido)
            console.log('✅ [Real-time] Novo pedido adicionado:', novoPedido)
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const pedidoAtualizado = convertSupabasePedido(payload.new as PedidoSupabase)
            const index = pedidos.value.findIndex(p => p.id === pedidoAtualizado.id)
            if (index !== -1) {
              pedidos.value[index] = pedidoAtualizado
              console.log('✅ [Real-time] Pedido atualizado:', pedidoAtualizado)
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const index = pedidos.value.findIndex(p => p.id === payload.old.id)
            if (index !== -1) {
              pedidos.value.splice(index, 1)
              console.log('✅ [Real-time] Pedido removido:', payload.old.id)
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('[Real-time] Status da subscription:', status)
        
        // Se não conseguir conectar ao Realtime, usar polling como fallback
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.log('[Real-time] Falha ao conectar, usando polling como alternativa')
          startPolling(30000) // Atualizar a cada 30 segundos
        } else if (status === 'SUBSCRIBED') {
          console.log('[Real-time] Conectado com sucesso!')
          stopPolling() // Parar polling se Realtime funcionar
        }
      })

    // Iniciar polling por padrão após 3 segundos se não houver resposta do Realtime
    setTimeout(() => {
      console.log('[Real-time] Iniciando polling como fallback...')
      startPolling(30000) // 30 segundos
    }, 3000)

    return subscription
  }

  return {
    pedidos: readonly(pedidos),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchPedidos,
    updatePedidoStatus,
    createPedido,
    getPedidosByStatus,
    getOrderCountByStatus,
    setupRealtimeSubscription,
    startPolling,
    stopPolling,
    stopNotification, // Exportar para parar o som manualmente
    formatTelefone,
    testSupabaseConnection
  }
}