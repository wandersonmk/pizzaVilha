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

  const pedidos = ref<Pedido[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ID da empresa (por enquanto usando um ID fixo, depois integrar com useEmpresa)
  const empresaId = '75bd85cf-1997-48e2-9367-e554b01a2283'

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
        pedidos.value = data.map(convertSupabasePedido)
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar pedidos'
      console.error('Erro ao buscar pedidos:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Atualizar status do pedido
  const updatePedidoStatus = async (pedidoId: string, novoStatus: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('pedidos')
        .update({ status: novoStatus })
        .eq('id', pedidoId)

      if (supabaseError) {
        throw supabaseError
      }

      // Atualizar localmente
      const pedido = pedidos.value.find(p => p.id === pedidoId)
      if (pedido) {
        pedido.status = novoStatus as any
      }

      return true
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar pedido'
      console.error('Erro ao atualizar status do pedido:', err)
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
  const setupRealtimeSubscription = () => {
    if (!empresaId) return

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
          console.log('Pedidos real-time update:', payload)
          
          if (payload.eventType === 'INSERT' && payload.new) {
            const novoPedido = convertSupabasePedido(payload.new as PedidoSupabase)
            pedidos.value.unshift(novoPedido)
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const pedidoAtualizado = convertSupabasePedido(payload.new as PedidoSupabase)
            const index = pedidos.value.findIndex(p => p.id === pedidoAtualizado.id)
            if (index !== -1) {
              pedidos.value[index] = pedidoAtualizado
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const index = pedidos.value.findIndex(p => p.id === payload.old.id)
            if (index !== -1) {
              pedidos.value.splice(index, 1)
            }
          }
        }
      )
      .subscribe()

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
    formatTelefone
  }
}