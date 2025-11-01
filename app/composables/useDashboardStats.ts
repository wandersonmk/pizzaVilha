interface VendasMensais {
  mes: string
  mesNumero: number
  totalPedidos: number
  receita: number
}

interface DashboardStats {
  totalPedidos: number
  pedidosHoje: number
  pedidosSemana: number
  pedidosMes: number
  totalClientes: number
  receitaTotal: number
  ticketMedio: number
  pedidosPorStatus: {
    novo: number
    cozinha: number
    entrega: number
    concluido: number
  }
  vendasMensais: VendasMensais[]
}

export const useDashboardStats = () => {
  const supabase = useSupabaseClient()
  const stats = ref<DashboardStats>({
    totalPedidos: 0,
    pedidosHoje: 0,
    pedidosSemana: 0,
    pedidosMes: 0,
    totalClientes: 0,
    receitaTotal: 0,
    ticketMedio: 0,
    pedidosPorStatus: {
      novo: 0,
      cozinha: 0,
      entrega: 0,
      concluido: 0
    },
    vendasMensais: []
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ID da empresa (mesma lógica do usePedidos)
  const empresaId = '75bd85cf-1997-48e2-9367-e554b01a2283'

  const fetchStats = async () => {
    if (!empresaId) {
      error.value = 'Empresa não encontrada'
      return
    }

    try {
      isLoading.value = true
      error.value = null

      // Buscar estatísticas gerais
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_dashboard_stats', { p_empresa_id: empresaId })
        .single()

      if (statsError) {
        // Se a função RPC não existir, vamos buscar manualmente
        console.warn('RPC não disponível, buscando dados manualmente:', statsError)
        
        // Buscar todos os pedidos para calcular estatísticas
        const { data: pedidos, error: pedidosError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('empresa_id', empresaId)

        if (pedidosError) throw pedidosError

        if (pedidos) {
          const agora = new Date()
          const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
          const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)
          const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)

          // Calcular estatísticas
          stats.value.totalPedidos = pedidos.length
          stats.value.pedidosHoje = pedidos.filter(p => new Date(p.created_at) >= hoje).length
          stats.value.pedidosSemana = pedidos.filter(p => new Date(p.created_at) >= seteDiasAtras).length
          stats.value.pedidosMes = pedidos.filter(p => new Date(p.created_at) >= inicioMes).length
          
          // Clientes únicos
          const clientesUnicos = new Set(pedidos.map(p => p.nome_cliente))
          stats.value.totalClientes = clientesUnicos.size
          
          // Receita total
          stats.value.receitaTotal = pedidos.reduce((sum, p) => sum + parseFloat(p.valor_total || '0'), 0)
          
          // Ticket médio
          stats.value.ticketMedio = stats.value.totalPedidos > 0 
            ? stats.value.receitaTotal / stats.value.totalPedidos 
            : 0
          
          // Pedidos por status
          stats.value.pedidosPorStatus = {
            novo: pedidos.filter(p => p.status === 'novo').length,
            cozinha: pedidos.filter(p => p.status === 'cozinha').length,
            entrega: pedidos.filter(p => p.status === 'entrega').length,
            concluido: pedidos.filter(p => p.status === 'concluido').length
          }

          // Vendas mensais - últimos 6 meses
          const vendasPorMes = new Map<string, { totalPedidos: number; receita: number }>()
          const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
          
          // Agrupar pedidos por mês
          pedidos.forEach(p => {
            const data = new Date(p.created_at)
            const mesNumero = data.getMonth()
            const mesNome = mesesNomes[mesNumero]
            const chave = `${mesNumero}-${mesNome}`
            
            if (!vendasPorMes.has(chave)) {
              vendasPorMes.set(chave, { totalPedidos: 0, receita: 0 })
            }
            
            const venda = vendasPorMes.get(chave)!
            venda.totalPedidos++
            venda.receita += parseFloat(p.valor_total || '0')
          })
          
          // Criar array dos últimos 6 meses
          const vendasMensais: VendasMensais[] = []
          for (let i = 5; i >= 0; i--) {
            const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
            const mesNumero = data.getMonth()
            const mesNome = mesesNomes[mesNumero] || 'Jan'
            const chave = `${mesNumero}-${mesNome}`
            
            const venda = vendasPorMes.get(chave) || { totalPedidos: 0, receita: 0 }
            vendasMensais.push({
              mes: mesNome,
              mesNumero,
              totalPedidos: venda.totalPedidos,
              receita: venda.receita
            })
          }
          
          stats.value.vendasMensais = vendasMensais
        }
      } else if (statsData) {
        // Se a RPC existir, usar os dados retornados
        stats.value = statsData as DashboardStats
      }

    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar estatísticas'
      console.error('Erro ao buscar estatísticas:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats: readonly(stats),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchStats
  }
}
