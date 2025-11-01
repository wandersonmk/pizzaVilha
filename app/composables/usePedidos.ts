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
  tempo_estimado?: number
  status: 'novo' | 'cozinha' | 'entrega' | 'concluido'
  created_at: string
  updated_at: string
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
  updatedAt: Date
  tempoEstimado?: number
  valorEntrega?: number
}

export const usePedidos = () => {
  // Verificar se está no cliente antes de inicializar composables que dependem do DOM
  if (process.server) {
    throw new Error('usePedidos só pode ser usado no cliente')
  }

  const supabase = useSupabaseClient()
  const { user } = useAuth()
  const { playNotification, stopNotification } = useNotificationSound()

  const pedidos = ref<Pedido[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pedidosDestacados = ref<Set<string>>(new Set()) // IDs dos pedidos recém-chegados

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
    // Parse do campo "pedido" para extrair itens
    const items: PedidoItem[] = []
    const pedidoText = pedidoSupabase.pedido
    
    // Parse suporta quebras de linha OU vírgula seguida de "Nx " (para não quebrar em vírgulas de preço)
    const itemsTexto = pedidoText
      .split(/\n|,\s+(?=\d+x\s)/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
    
    itemsTexto.forEach(itemTexto => {
      // Tenta fazer match com padrão "NxN Item - R$ XX,XX" ou "NxN Item"
      // Regex captura: quantidade, nome (tudo até " - R$"), e preço
      const matchComPreco = itemTexto.match(/^(\d+)x\s+(.+?)\s+-\s+R\$\s+([\d,\.]+)$/)
      
      if (matchComPreco && matchComPreco[1] && matchComPreco[2] && matchComPreco[3]) {
        // Formato completo com preço: "2x Pizza Margherita (Grande) - R$ 52,64"
        const quantidade = parseInt(matchComPreco[1])
        const nome = matchComPreco[2].trim()
        const precoStr = matchComPreco[3].replace(',', '.')
        const precoTotal = parseFloat(precoStr)
        
        items.push({
          nome,
          quantidade,
          preco: precoTotal / quantidade,
          observacao: undefined
        })
      } else {
        // Tenta match sem preço: "2x Pizza Margherita"
        const matchSemPreco = itemTexto.match(/^(\d+)x\s+(.+)$/)
        
        if (matchSemPreco && matchSemPreco[1] && matchSemPreco[2]) {
          const quantidade = parseInt(matchSemPreco[1])
          // Remove qualquer parte que pareça preço do nome (caso tenha sobrado)
          const nome = matchSemPreco[2].trim().replace(/\s+-\s+R\$\s+[\d,\.]+$/, '')
          // Subtrai a taxa de entrega antes de calcular o preço estimado
          const valorSemEntrega = parseFloat(pedidoSupabase.valor_total) - parseFloat(pedidoSupabase.valor_entrega || '0')
          const precoEstimado = valorSemEntrega / itemsTexto.length
          
          items.push({
            nome,
            quantidade,
            preco: precoEstimado / quantidade,
            observacao: undefined
          })
        } else {
          // Sem padrão "Nx" - assumir 1 item
          const nomeLimpo = itemTexto.trim().replace(/\s+-\s+R\$\s+[\d,\.]+$/, '')
          // Subtrai a taxa de entrega antes de calcular o preço estimado
          const valorSemEntrega = parseFloat(pedidoSupabase.valor_total) - parseFloat(pedidoSupabase.valor_entrega || '0')
          items.push({
            nome: nomeLimpo,
            quantidade: 1,
            preco: valorSemEntrega / itemsTexto.length,
            observacao: undefined
          })
        }
      }
    })

    return {
      id: pedidoSupabase.id,
      numero: pedidoSupabase.numero_pedido,
      cliente: pedidoSupabase.nome_cliente,
      telefone: formatTelefone(pedidoSupabase.telefone_cliente),
      endereco: pedidoSupabase.endereco_entrega || undefined,
      items,
      total: parseFloat(pedidoSupabase.valor_total),
      valorEntrega: pedidoSupabase.valor_entrega ? parseFloat(pedidoSupabase.valor_entrega) : undefined,
      formaPagamento: pedidoSupabase.forma_pagamento,
      tipoEntrega: pedidoSupabase.tipo_retirada,
      status: pedidoSupabase.status,
      observacao: pedidoSupabase.observacao || undefined,
      troco: pedidoSupabase.troco ? parseFloat(pedidoSupabase.troco) : undefined,
      dataHora: new Date(pedidoSupabase.created_at),
      updatedAt: new Date(pedidoSupabase.updated_at),
      tempoEstimado: pedidoSupabase.tempo_estimado || 30 // Usa o valor do banco ou 30 minutos como padrão
    }
  }

  // Buscar pedidos do kanban (filtro inteligente baseado em status)
  const fetchPedidos = async () => {
    if (!empresaId) {
      error.value = 'Empresa não encontrada'
      return
    }

    try {
      isLoading.value = true
      error.value = null

      // Buscar todos os pedidos e filtrar no client-side para ter controle total
      const { data, error: supabaseError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      if (data) {
        // Filtrar pedidos: mostrar não concluídos OU concluídos criados há menos de 5h
        const cincoHorasEmMs = 5 * 60 * 60 * 1000 // 5 horas em milissegundos
        const agora = new Date().getTime()
        
        const pedidosFiltrados = data.filter(p => {
          if (p.status !== 'concluido') {
            // Não concluído: sempre mostrar (independente do tempo)
            return true
          } else {
            // Concluído: mostrar apenas se CRIADO há menos de 5h
            const createdAt = new Date(p.created_at).getTime()
            const diferencaMs = agora - createdAt
            const horasAtras = diferencaMs / (60 * 60 * 1000)
            
            console.log(`🔍 Pedido #${p.numero_pedido} concluído criado há ${horasAtras.toFixed(2)}h - ${horasAtras < 5 ? 'MOSTRAR ✅' : 'OCULTAR ❌'}`)
            
            return horasAtras < 5
          }
        })
        
        const novosPedidos = pedidosFiltrados.map(convertSupabasePedido)
        
        // Verificar se há novos pedidos com status "novo"
        const novosCount = novosPedidos.filter(p => p.status === 'novo').length
        const previousNovosCount = pedidos.value.filter(p => p.status === 'novo').length
        const isPrimeiraGarga = pedidos.value.length === 0
        
        // Tocar notificação se houver mais pedidos "novo" do que antes OU se é a primeira carga com pedidos novos
        if ((isPrimeiraGarga && novosCount > 0) || (!isPrimeiraGarga && novosCount > previousNovosCount)) {
          console.log(`🔔 [Notificação] Novo pedido detectado! Antes: ${previousNovosCount}, Agora: ${novosCount}, Primeira carga: ${isPrimeiraGarga}`)
          
          // Identificar os novos pedidos e destacá-los
          const pedidosNovos = novosPedidos.filter(p => p.status === 'novo')
          
          // Na primeira carga, destacar todos os novos. Senão, apenas os que aumentaram
          const quantidadeParaDestacar = isPrimeiraGarga ? novosCount : (novosCount - previousNovosCount)
          const novosIds = pedidosNovos.slice(0, quantidadeParaDestacar).map(p => p.id)
          
          // Adicionar aos destacados
          novosIds.forEach(id => pedidosDestacados.value.add(id))
          
          // Tocar som
          playNotification()
          console.log('💡 [Destaque] Novos pedidos destacados:', novosIds)
          
          // Remover destaque após 10 segundos
          setTimeout(() => {
            novosIds.forEach(id => pedidosDestacados.value.delete(id))
            console.log('✨ [Destaque] Destaque removido dos pedidos:', novosIds)
          }, 10000)
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
  const modalAberto = useState<boolean>('modal_novo_pedido_aberto', () => false)

  const startPolling = (intervalMs: number = 30000) => { // 30 segundos por padrão
    if (pollingInterval) return // Já está rodando

    console.log(`[Polling] Iniciando atualização automática a cada ${intervalMs / 1000}s`)
    
    pollingInterval = setInterval(async () => {
      // Não atualizar se o modal de novo pedido estiver aberto
      if (modalAberto.value) {
        console.log('[Polling] Modal aberto, pulando atualização...')
        return
      }
      
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

  // Buscar todos os pedidos (sem filtro de data) - para relatórios
  const fetchAllPedidos = async () => {
    if (!empresaId) {
      error.value = 'Empresa não encontrada'
      return []
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }

      return data ? data.map(convertSupabasePedido) : []
    } catch (err: any) {
      console.error('Erro ao buscar todos os pedidos:', err)
      return []
    }
  }

  return {
    pedidos: readonly(pedidos),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchPedidos, // Busca apenas pedidos de hoje (para o kanban)
    fetchAllPedidos, // Busca todos os pedidos (para relatórios)
    updatePedidoStatus,
    createPedido,
    getPedidosByStatus,
    getOrderCountByStatus,
    setupRealtimeSubscription,
    startPolling,
    stopPolling,
    stopNotification, // Exportar para parar o som manualmente
    pedidosDestacados: readonly(pedidosDestacados), // IDs dos pedidos destacados
    formatTelefone,
    testSupabaseConnection,
    // Controle do modal
    setModalAberto: (value: boolean) => { modalAberto.value = value }
  }
}