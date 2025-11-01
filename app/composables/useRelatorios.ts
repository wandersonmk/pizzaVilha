export interface EstatisticasRelatorio {
  totalPedidos: number
  totalValor: number
  ticketMedio: number
  topClientes: TopCliente[]
  analisePagamentos: AnalisePagamento[]
  pedidosPorPeriodo: PedidoPeriodo[]
}

export interface TopCliente {
  nome: string
  pedidos: number
  valor: number
}

export interface AnalisePagamento {
  tipo: string
  label: string
  pedidos: number
  percentual: number
}

export interface PedidoPeriodo {
  data: string
  total: number
  valor: number
}

export function useRelatorios() {
  const estatisticas = useState<EstatisticasRelatorio | null>('relatorios_stats', () => null)
  const pedidosDetalhados = useState<any[]>('relatorios_pedidos', () => [])
  const isLoading = useState<boolean>('relatorios_loading', () => false)
  const error = useState<string | null>('relatorios_error', () => null)

  // Buscar estatísticas dos pedidos
  async function buscarEstatisticas(dataInicio?: Date, dataFim?: Date) {
    if (!process.client) return

    try {
      isLoading.value = true
      error.value = null

      const supabase = useSupabaseClient()
      const { getEmpresaId } = useEmpresa()
      const empresaId = await getEmpresaId()

      if (!empresaId) {
        error.value = 'Empresa não encontrada'
        return
      }

      // Define filtros de data
      let query = supabase
        .from('pedidos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false })

      // Aplicar filtro de data se fornecido
      if (dataInicio) {
        query = query.gte('created_at', dataInicio.toISOString())
      }
      if (dataFim) {
        const fimDia = new Date(dataFim)
        fimDia.setHours(23, 59, 59, 999)
        query = query.lte('created_at', fimDia.toISOString())
      }

      const { data: pedidos, error: pedidosError } = await query

      if (pedidosError) {
        console.error('Erro ao buscar pedidos:', pedidosError)
        error.value = 'Erro ao carregar estatísticas'
        return
      }

      if (!pedidos || pedidos.length === 0) {
        estatisticas.value = {
          totalPedidos: 0,
          totalValor: 0,
          ticketMedio: 0,
          topClientes: [],
          analisePagamentos: [],
          pedidosPorPeriodo: []
        }
        return
      }

      // Calcular estatísticas
      const totalPedidos = pedidos.length
      const totalValor = pedidos.reduce((sum, p) => {
        return sum + parseFloat(p.valor_total || 0) + parseFloat(p.valor_entrega || 0)
      }, 0)
      const ticketMedio = totalPedidos > 0 ? totalValor / totalPedidos : 0

      // Top clientes
      const clientesMap = new Map<string, TopCliente>()
      pedidos.forEach((pedido: any) => {
        const nome = pedido.nome_cliente
        const valor = parseFloat(pedido.valor_total || 0) + parseFloat(pedido.valor_entrega || 0)

        if (clientesMap.has(nome)) {
          const cliente = clientesMap.get(nome)!
          cliente.pedidos++
          cliente.valor += valor
        } else {
          clientesMap.set(nome, {
            nome,
            pedidos: 1,
            valor
          })
        }
      })

      const topClientes = Array.from(clientesMap.values())
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5)

      // Análise de pagamentos
      const pagamentosDinheiro = pedidos.filter((p: any) => p.forma_pagamento === 'dinheiro').length
      const pagamentosCartao = pedidos.filter((p: any) => p.forma_pagamento === 'cartao').length

      const analisePagamentos: AnalisePagamento[] = [
        {
          tipo: 'dinheiro',
          label: 'Dinheiro',
          pedidos: pagamentosDinheiro,
          percentual: totalPedidos > 0 ? Math.round((pagamentosDinheiro / totalPedidos) * 100) : 0
        },
        {
          tipo: 'cartao',
          label: 'Cartão',
          pedidos: pagamentosCartao,
          percentual: totalPedidos > 0 ? Math.round((pagamentosCartao / totalPedidos) * 100) : 0
        }
      ]

      // Pedidos por período (últimos 7 dias)
      const pedidosPorDia = new Map<string, PedidoPeriodo>()
      pedidos.forEach((pedido: any) => {
        const data = new Date(pedido.created_at).toLocaleDateString('pt-BR')
        const valor = parseFloat(pedido.valor_total || 0) + parseFloat(pedido.valor_entrega || 0)

        if (pedidosPorDia.has(data)) {
          const periodo = pedidosPorDia.get(data)!
          periodo.total++
          periodo.valor += valor
        } else {
          pedidosPorDia.set(data, {
            data,
            total: 1,
            valor
          })
        }
      })

      const pedidosPorPeriodo = Array.from(pedidosPorDia.values())
        .sort((a, b) => {
          const [diaA, mesA, anoA] = a.data.split('/').map(Number)
          const [diaB, mesB, anoB] = b.data.split('/').map(Number)
          const dataA = new Date(anoA || 0, (mesA || 1) - 1, diaA || 1)
          const dataB = new Date(anoB || 0, (mesB || 1) - 1, diaB || 1)
          return dataB.getTime() - dataA.getTime()
        })
        .slice(0, 7)

      // Armazenar pedidos detalhados
      pedidosDetalhados.value = pedidos

      estatisticas.value = {
        totalPedidos,
        totalValor,
        ticketMedio,
        topClientes,
        analisePagamentos,
        pedidosPorPeriodo
      }

      console.log(`Estatísticas carregadas: ${totalPedidos} pedidos, R$ ${totalValor.toFixed(2)}`)

    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err)
      error.value = 'Erro ao carregar estatísticas'
    } finally {
      isLoading.value = false
    }
  }

  return {
    estatisticas: readonly(estatisticas),
    pedidosDetalhados: readonly(pedidosDetalhados),
    isLoading: readonly(isLoading),
    error: readonly(error),
    buscarEstatisticas
  }
}
